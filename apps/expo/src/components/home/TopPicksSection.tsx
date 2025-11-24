import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { RouterInputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { TopPickSkeleton } from "./ListingSkeleton";
import { TopSellerCard } from "./TopSellerCard";

interface TopPicksSectionProps {
  category?: string;
  universityId?: string;
}

export function TopPicksSection({
  category,
  universityId,
}: TopPicksSectionProps) {
  const router = useRouter();

  const categoryInput = category
    ? (category.toUpperCase() as RouterInputs["listing"]["getTopPicks"]["category"])
    : undefined;

  const { data: topPicks, isLoading: topPicksLoading } = useQuery(
    trpc.listing.getTopPicks.queryOptions({
      category: categoryInput,
      universityId,
    }),
  );

  return (
    <View className="mb-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">Top Picks</Text>
        {topPicks && topPicks.total > topPicks.items.length && (
          <TouchableOpacity onPress={() => router.push("/listings")}>
            <Text className="font-medium text-[#8B0A1A]">See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {topPicksLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="max-h-48"
        >
          <View className="flex-row gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <TopPickSkeleton key={index} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          className="max-h-48"
        >
          <View className="flex-row gap-4">
            {topPicks?.items.map((item) => (
              <TopSellerCard key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
