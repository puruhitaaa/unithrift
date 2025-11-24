import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ItemDetailHeader } from "./ItemDetailHeader";

export function ItemDetailSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Skeleton */}
        <ItemDetailHeader onBack={() => undefined} />

        {/* Image Gallery Skeleton */}
        <View className="bg-white">
          <View className="h-80 w-full animate-pulse bg-gray-200" />
          <View className="flex-row justify-center gap-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <View
                key={i}
                className="h-2 w-2 animate-pulse rounded-full bg-gray-300"
              />
            ))}
          </View>
        </View>

        {/* Item Info Skeleton */}
        <View className="bg-white p-6">
          {/* Title */}
          <View className="mb-2 h-7 w-3/4 animate-pulse rounded bg-gray-200" />

          {/* Price and Condition */}
          <View className="mb-4 flex-row items-center gap-3">
            <View className="h-8 w-24 animate-pulse rounded bg-gray-200" />
            <View className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
          </View>

          {/* Category and University */}
          <View className="mb-4 flex-row gap-4">
            <View className="flex-1">
              <View className="mb-1 h-4 w-16 animate-pulse rounded bg-gray-200" />
              <View className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            </View>
            <View className="flex-1">
              <View className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-200" />
              <View className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            </View>
          </View>

          {/* Description */}
          <View className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
          <View className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200" />
          <View className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200" />
          <View className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </View>

        {/* Seller Info Skeleton */}
        <View className="mt-2 bg-white p-6">
          <View className="mb-4 h-5 w-24 animate-pulse rounded bg-gray-200" />
          <View className="flex-row items-center">
            <View className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
            <View className="ml-3 flex-1">
              <View className="mb-2 h-5 w-32 animate-pulse rounded bg-gray-200" />
              <View className="h-4 w-40 animate-pulse rounded bg-gray-200" />
            </View>
          </View>
        </View>

        {/* Contact Button Skeleton */}
        <View className="p-6">
          <View className="h-14 w-full animate-pulse rounded-xl bg-gray-200" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
