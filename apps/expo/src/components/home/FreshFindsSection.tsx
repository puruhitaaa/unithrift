import { Text, TouchableOpacity, View } from "react-native";
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
        <View className="flex-row flex-wrap gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ListingSkeleton key={index} />
          ))}
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-4">
          {freshFinds?.items.map((listing) => (
            <FreshFindCard key={listing.id} item={listing} />
          ))}
        </View>
      )}
    </View>
  );
}
