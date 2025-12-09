import type { WebViewNavigation } from "react-native-webview";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { queryClient, trpc } from "~/utils/api";

// Validate UUID format
const isValidUUID = (str: string | undefined): str is string => {
  if (!str) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export default function PaymentScreen() {
  const router = useRouter();
  const params = useGlobalSearchParams<{
    transactionId: string;
    snapToken: string;
    redirectUrl: string;
  }>();

  // Extract params with proper typing
  const transactionId = params.transactionId;
  const snapToken = params.snapToken;
  const redirectUrl = params.redirectUrl;

  const [isLoading, setIsLoading] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Derive paramsReady from the params
  const paramsReady = useMemo(
    () => !!(snapToken && redirectUrl && isValidUUID(transactionId)),
    [snapToken, redirectUrl, transactionId],
  );

  // Only query when we have a valid transactionId
  const validTransactionId = isValidUUID(transactionId) ? transactionId : "";

  const { data: paymentStatus, refetch } = useQuery(
    trpc.payment.checkPaymentStatus.queryOptions(
      {
        transactionId: validTransactionId,
      },
      {
        // Only enable when we have valid transactionId AND payment completed
        enabled: isValidUUID(transactionId) && paymentCompleted,
        refetchInterval: paymentCompleted ? 2000 : false, // Poll every 2 seconds after payment
      },
    ),
  );

  // Poll for payment success/failure from the backend
  useEffect(() => {
    if (paymentStatus?.status === "SUCCESS") {
      Alert.alert(
        "Payment Successful!",
        "Your payment has been confirmed. The seller will be notified.",
        [
          {
            text: "OK",
            onPress: () => {
              // Invalidate relevant queries
              void queryClient.invalidateQueries(
                trpc.listing.list.queryFilter(),
              );
              void queryClient.invalidateQueries(
                trpc.transaction.listPurchases.queryFilter(),
              );
              router.replace("/");
            },
          },
        ],
      );
    } else if (
      paymentStatus?.status === "FAILED" ||
      paymentStatus?.status === "EXPIRED"
    ) {
      Alert.alert(
        "Payment Failed",
        "Your payment could not be processed. Please try again.",
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ],
      );
    }
  }, [paymentStatus?.status, router]);

  // Handle WebView navigation state changes to detect completion
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;

    // Check if navigation indicates payment completion
    if (url.includes("finish") || url.includes("success")) {
      setPaymentCompleted(true);
      void refetch();
    } else if (url.includes("error") || url.includes("failure")) {
      Alert.alert(
        "Payment Failed",
        "There was an error processing your payment.",
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ],
      );
    }
  };

  // Show loading while params are being populated from router
  if (!paramsReady) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Payment",
            headerShown: true,
          }}
        />
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#8B0A1A" />
          <Text className="mt-4 text-gray-600">Preparing payment...</Text>
        </SafeAreaView>
      </>
    );
  }

  // After params are ready, check if they're valid
  if (!redirectUrl) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Payment",
            headerShown: true,
          }}
        />
        <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
          <Text className="text-lg font-semibold text-gray-900">
            Invalid Payment Session
          </Text>
          <Text className="mt-2 text-gray-600">
            Missing redirect URL. Please try again.
          </Text>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Payment",
          headerShown: true,
        }}
      />
      <SafeAreaView style={{ flex: 1 }} className="bg-white">
        {isLoading && (
          <View className="absolute inset-0 z-10 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#8B0A1A" />
            <Text className="mt-4 text-gray-600">Loading payment page...</Text>
          </View>
        )}
        <WebView
          source={{ uri: redirectUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadEnd={() => setIsLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView error:", nativeEvent);
            // Don't hide loading on error, let the user see the error alert from navigation state or sticky loading
            // But we should probably disable loading to show *something* or an error view
            setIsLoading(false);
          }}
          originWhitelist={["*"]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={{ flex: 1 }}
          allowsBackForwardNavigationGestures
        />
      </SafeAreaView>
    </>
  );
}
