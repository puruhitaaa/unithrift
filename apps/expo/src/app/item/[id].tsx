import { useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "~/utils/api";
import { DirectPaymentModal } from "~/components/DirectPaymentModal";
import {
  ContactButton,
  ImageGallery,
  ItemDetailHeader,
  ItemDetailSkeleton,
  ItemInfo,
  SellerInfo,
} from "~/components/item-detail";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export type ItemDetailData = RouterOutputs["listing"]["byId"];

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useGlobalSearchParams<{ id: string }>();

  const {
    data: itemData,
    isLoading,
    error,
  } = useQuery(
    trpc.listing.byId.queryOptions(
      {
        id,
      },
      { enabled: !!id },
    ),
  );

  const { data: session } = authClient.useSession();

  const [showDirectPaymentModal, setShowDirectPaymentModal] = useState(false);

  // Check if user already has pending transaction for this listing
  const { data: pendingCheck } = useQuery(
    trpc.transaction.checkPendingTransaction.queryOptions(
      {
        listingId: id,
      },
      {
        enabled: !!id && !!session, // Only check if user is logged in and we have an id
      },
    ),
  );

  // const initPayment = trpc.payment.initiatePayment.useMutation();
  const initPayment = useMutation(
    trpc.payment.initiatePayment.mutationOptions({
      onSuccess: (data) => {
        // Only navigate to payment page for gateway payment
        if (!data.isDirect && data.snapToken && data.redirectUrl) {
          router.push({
            pathname: "/payment",
            params: {
              transactionId: data.transactionId,
              snapToken: data.snapToken,
              redirectUrl: data.redirectUrl,
            },
          });
        } else {
          // For direct payment, show the modal with seller contact info
          setShowDirectPaymentModal(true);
        }
      },
      onError: (error) => {
        Alert.alert(
          "Payment Error",
          error.message || "Failed to initiate payment",
        );
      },
    }),
  );

  const handlePurchase = () => {
    // If the user is not authenticated, redirect them to the login screen
    // and preserve a redirectTo param so they can come back to the item page
    if (!session) {
      // Pass the redirectTo as route param so login can redirect back after successful sign-in
      router.push({
        pathname: "/login",
        params: { redirectTo: `/item?id=${id}` },
      });
      return;
    }

    if (!id) return;

    // Show payment method selection dialog
    Alert.alert(
      "Select Payment Method",
      "Choose how you would like to complete your payment:",
      [
        {
          text: "Direct Payment",
          onPress: () => {
            void handleDirectPayment();
          },
        },
        {
          text: "Payment Gateway",
          onPress: () => {
            void handleGatewayPayment();
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true },
    );
  };

  const handleDirectPayment = async () => {
    if (!id) return;

    try {
      // For direct payment, we'll use the same flow but mark it as direct
      await initPayment.mutateAsync({
        listingId: id,
        paymentMethod: "DIRECT",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initiate payment";
      Alert.alert("Payment Error", errorMessage);
    }
  };

  const handleGatewayPayment = async () => {
    if (!id) return;

    try {
      // Initiate payment with Midtrans gateway
      await initPayment.mutateAsync({
        listingId: id,
        paymentMethod: "MIDTRANS",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initiate payment";
      Alert.alert("Payment Error", errorMessage);
    }
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <ItemDetailSkeleton />
      </>
    );
  }

  if (error || !itemData) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
          <Text className="text-lg font-semibold text-gray-900">
            Item not found
          </Text>
          <Text className="mt-2 text-gray-600">
            {error?.message ?? "The item you're looking for doesn't exist."}
          </Text>
        </SafeAreaView>
      </>
    );
  }

  // Map the media to image URLs
  const images = itemData.media.map((m) => m.url);

  // Check if the current user is the owner of the item
  const isOwner = session?.user.id === itemData.seller.id;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView showsVerticalScrollIndicator={false}>
          <ItemDetailHeader onBack={() => void router.back()} />
          <ImageGallery images={images} />

          <ItemInfo
            item={{
              title: itemData.title,
              price: itemData.price,
              condition: itemData.condition,
              category: itemData.category,
              university: itemData.university
                ? itemData.university.name
                : "Admin",
              description: itemData.description,
            }}
          />

          <SellerInfo
            seller={{
              name: itemData.seller.name,
              avatar:
                itemData.seller.image ??
                "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60",
              university: itemData.university
                ? itemData.university.name
                : "Admin",
            }}
          />

          {/* Only show purchase button if user is not the owner */}
          {!isOwner && (
            <ContactButton
              onPress={handlePurchase}
              disabled={pendingCheck?.hasPending ?? false}
              loading={initPayment.isPending}
            />
          )}
        </ScrollView>

        {/* Direct Payment Modal */}
        <DirectPaymentModal
          visible={showDirectPaymentModal}
          onClose={() => {
            setShowDirectPaymentModal(false);
            void router.back();
          }}
          seller={{
            name: itemData.seller.name,
            whatsapp: itemData.seller.whatsapp,
            instagram: itemData.seller.instagram,
            line: itemData.seller.line,
            telegram: itemData.seller.telegram,
          }}
        />
      </SafeAreaView>
    </>
  );
}
