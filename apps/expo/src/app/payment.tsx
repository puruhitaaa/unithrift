import type { WebViewNavigation } from "react-native-webview";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { queryClient, trpc } from "~/utils/api";

export default function PaymentScreen() {
  const router = useRouter();
  const { transactionId, snapToken, redirectUrl } = useGlobalSearchParams<{
    transactionId: string;
    snapToken: string;
    redirectUrl: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const { data: paymentStatus, refetch } = useQuery(
    trpc.payment.checkPaymentStatus.queryOptions(
      {
        transactionId,
      },
      {
        enabled: !!transactionId && paymentCompleted,
        refetchInterval: paymentCompleted ? 2000 : false, // Poll every 2 seconds after payment
      },
    ),
  );

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

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;

    // Check if navigation indicates payment completion
    // Midtrans redirects to finish URL after payment
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

  if (!snapToken || !redirectUrl) {
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
            Please try initiating the payment again.
          </Text>
        </SafeAreaView>
      </>
    );
  }

  // Build the payment HTML with Midtrans Snap
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script type="text/javascript"
                src="https://app.midtrans.com/snap/snap.js"
                data-client-key="${process.env.EXPO_PUBLIC_MIDTRANS_CLIENT_KEY}"></script>
        <style>
          body {
            font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto;
            margin: 0;
            padding: 20px;
            background-color: #f9fafb;
          }
          #loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
          }
        </style>
      </head>
      <body>
        <div id="loading">
          <p>Loading payment...</p>
        </div>
        <script type="text/javascript">
          window.snap.pay('${snapToken}', {
            onSuccess: function(result) {
              window.location.href = 'about:blank?status=success';
            },
            onPending: function(result) {
              window.location.href = 'about:blank?status=pending';
            },
            onError: function(result) {
              window.location.href = 'about:blank?status=error';
            },
            onClose: function() {
              window.location.href = 'about:blank?status=closed';
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Payment",
          headerShown: true,
        }}
      />
      <SafeAreaView className="flex-1 bg-white">
        {isLoading && (
          <View className="absolute inset-0 z-10 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#8B0A1A" />
            <Text className="mt-4 text-gray-600">Loading payment...</Text>
          </View>
        )}
        <WebView
          source={{ html: htmlContent }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadEnd={() => setIsLoading(false)}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    </>
  );
}
