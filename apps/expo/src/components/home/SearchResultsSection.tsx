import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { RouterInputs, RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { FreshFindCard } from "./FreshFindCard";

interface SearchResultsSectionProps {
  searchQuery: string;
  category?: string;
  universityId?: string;
}

export function SearchResultsSection({
  searchQuery,
  category,
  universityId,
}: SearchResultsSectionProps) {
  const categoryInput = category
    ? (category.toUpperCase() as RouterInputs["listing"]["list"]["category"])
    : undefined;

  const {
    data: searchResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isSearchLoading,
  } = useInfiniteQuery(
    trpc.listing.list.infiniteQueryOptions(
      {
        limit: 6,
        search: searchQuery,
        category: categoryInput,
        universityId,
      },
      {
        getNextPageParam: (lastPage: RouterOutputs["listing"]["list"]) =>
          lastPage.nextCursor,
        enabled: !!searchQuery,
      },
    ),
  );

  const flatSearchResults =
    searchResults?.pages.flatMap((page) => page.items) ?? [];

  if (isSearchLoading) {
    return (
      <View className="flex-row flex-wrap justify-between">
        {Array.from({ length: 6 }).map((_, index) => (
          <View
            key={index}
            className="mb-4 basis-[48%] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <View className="h-32 w-full animate-pulse bg-gray-200" />
            <View className="p-3">
              <View className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <View className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              <View className="mt-2 flex-row items-center">
                <View className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
                <View className="ml-2 h-3 w-1/3 animate-pulse rounded bg-gray-200" />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={flatSearchResults}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="mb-4 basis-[48%]">
          <FreshFindCard item={item} />
        </View>
      )}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator className="py-4" color="#8B0A1A" />
        ) : null
      }
      ListEmptyComponent={
        <Text className="mt-10 text-center text-gray-500">
          No items found matching "{searchQuery}"
        </Text>
      }
    />
  );
}
