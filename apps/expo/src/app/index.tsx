import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { RouterInputs, RouterOutputs } from "../utils/api";
import { FreshFindCard } from "../components/home/FreshFindCard";
import {
  ListingSkeleton,
  TopPickSkeleton,
} from "../components/home/ListingSkeleton";
import { PopularOnCampusCard } from "../components/home/PopularOnCampusCard";
import { TopSellerCard } from "../components/home/TopSellerCard";
import { Header } from "../components/ui/Header";
import { trpc } from "../utils/api";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: universities } = useQuery(
    trpc.university.list.queryOptions({}),
  );

  const categoryInput = selectedCategory
    ? (selectedCategory.toUpperCase() as RouterInputs["listing"]["getFreshFinds"]["category"])
    : undefined;

  const { data: freshFinds, isLoading: freshFindLoading } = useQuery(
    trpc.listing.getFreshFinds.queryOptions({
      category: categoryInput,
      universityId: selectedUniversityId,
    }),
  );

  const { data: topPicks, isLoading: topPicksLoading } = useQuery(
    trpc.listing.getTopPicks.queryOptions({
      category: categoryInput,
      universityId: selectedUniversityId,
    }),
  );

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
        search: debouncedSearchQuery,
        category: categoryInput,
        universityId: selectedUniversityId,
      },
      {
        getNextPageParam: (lastPage: RouterOutputs["listing"]["list"]) =>
          lastPage.nextCursor,
        enabled: !!debouncedSearchQuery,
      },
    ),
  );

  const flatSearchResults =
    searchResults?.pages.flatMap((page) => page.items) ?? [];

  const isDebouncing = searchQuery !== debouncedSearchQuery;

  return (
    <View className="flex-1 bg-gray-50">
      <Header
        showSearch={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        universities={universities?.items}
        selectedUniversityId={selectedUniversityId}
        setSelectedUniversityId={setSelectedUniversityId}
      />

      {searchQuery ? (
        <View className="flex-1 p-4">
          {isSearchLoading || isDebouncing ? (
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
          ) : (
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
          )}
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          {/* Carousel for Top Performing Sellers */}
          <View className="mb-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                Top Picks
              </Text>
              {topPicks && topPicks.total > topPicks.items.length && (
                <Text className="font-medium text-[#8B0A1A]">See All</Text>
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

          {/* Fresh Finds Section */}
          <View className="mb-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                Fresh Finds
              </Text>
              {freshFinds && freshFinds.total > freshFinds.items.length && (
                <Text className="font-medium text-[#8B0A1A]">See All</Text>
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

          {/* Popular on Campus Section */}
          <View className="mb-8">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Popular on Campus
            </Text>
            <PopularOnCampusCard />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
