import { ActivityIndicator, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "~/utils/api";
import {
  ContactButton,
  ImageGallery,
  ItemDetailHeader,
  ItemInfo,
  SellerInfo,
} from "~/components/item-detail";
import { trpc } from "~/utils/api";

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
      id: id!,
    }),
  );

  const handleContactSeller = () => {
    // TODO: Implement chat or messaging interface
    console.log("Contacting seller for item:", id);
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
          <ActivityIndicator size="large" color="#8B0A1A" />
          <Text className="mt-4 text-gray-600">Loading item details...</Text>
        </SafeAreaView>
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
          <ItemDetailHeader onBack={() => router.back()} />
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

          <ContactButton onPress={handleContactSeller} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
