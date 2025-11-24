import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "~/utils/api";
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
    trpc.listing.byId.queryOptions({
      id,
    }),
  );

  const { data: session } = authClient.useSession();

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

    // TODO: Implement checkout flow; for now, navigate to a checkout route
    router.push({ pathname: "/checkout", params: { id: id } });
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
              university: itemData.university.name,
              description: itemData.description,
            }}
          />

          <SellerInfo
            seller={{
              name: itemData.seller.name,
              avatar:
                itemData.seller.image ??
                "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60",
              university: itemData.university.name,
            }}
          />

          <ContactButton onPress={handlePurchase} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
