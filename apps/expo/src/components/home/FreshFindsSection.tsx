import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { RouterInputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { FreshFindCard } from "./FreshFindCard";
import { ListingSkeleton } from "./ListingSkeleton";

interface FreshFindsSectionProps {
  category?: string;
  universityId?: string;
}

export function FreshFindsSection({
  category,
  universityId,
}: FreshFindsSectionProps) {
  const router = useRouter();

  const categoryInput = category
    ? (category.toUpperCase() as RouterInputs["listing"]["getFreshFinds"]["category"])
    : undefined;

  const { data: freshFinds, isLoading: freshFindLoading } = useQuery(
    trpc.listing.getFreshFinds.queryOptions({
      category: categoryInput,
      universityId,
    }),
  );

  return (
    <View className="mb-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">Fresh Finds</Text>
        {freshFinds && freshFinds.total > freshFinds.items.length && (
          <TouchableOpacity onPress={() => router.push("/listings")}>
            <Text className="font-medium text-[#8B0A1A]">See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {freshFindLoading ? (
        <FlatList
          data={Array.from({ length: 4 })}
          keyExtractor={(_, index) => `fresh-skeleton-${index}`}
          renderItem={() => <ListingSkeleton />}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 12,
          }}
          scrollEnabled={false}
        />
      ) : (
        <FlatList
          data={freshFinds?.items ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FreshFindCard item={item} />}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 12,
          }}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text className="text-gray-500">
              No fresh finds available right now
            </Text>
          }
        />
      )}
    </View>
  );
}
