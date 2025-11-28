import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { RouterInputs, RouterOutputs } from "../utils/api";
import { EmptyState } from "../components/listings/EmptyState";
import { ListingCard } from "../components/listings/ListingCard";
import { SmartHeader } from "../components/ui/SmartHeader";
import { trpc } from "../utils/api";

export default function ListingsScreen() {
  const { sellerId } = useLocalSearchParams<{ sellerId: string }>();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedUniversityId, setSelectedUniversityId] = useState<
    string | undefined
  >();

  const categoryInput =
    selectedCategory && selectedCategory !== "all"
      ? (selectedCategory.toUpperCase() as RouterInputs["listing"]["list"]["category"])
      : undefined;

  // Fetch listings with infinite scroll
  const {
    data: listingsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    trpc.listing.list.infiniteQueryOptions(
      {
        limit: 20,
        search: debouncedSearchQuery || undefined,
        category: categoryInput,
        universityId: selectedUniversityId,
        sellerId,
      },
      {
        getNextPageParam: (lastPage: RouterOutputs["listing"]["list"]) =>
          lastPage.nextCursor,
      },
    ),
  );

  const flatListings = listingsData?.pages.flatMap((page) => page.items);

  return (
    <View className="flex-1 bg-gray-50">
      <SmartHeader
        showSearch={true}
        showCategories={true}
        onSearchChange={setDebouncedSearchQuery}
        onCategoryChange={setSelectedCategory}
        onUniversityChange={setSelectedUniversityId}
        showBackButton={true}
        onBack={() => void router.back()}
        title={sellerId ? "My Listings" : "Unithrift"}
        showUniversitySelector={!sellerId}
      />

      {/* Listings Grid */}
      <ScrollView
        className="flex-1 px-4 py-4"
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20;

          if (isCloseToBottom && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        }}
        scrollEventThrottle={400}
      >
        {isLoading ? (
          <View className="flex-row flex-wrap gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <View
                key={index}
                className="basis-[48%] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
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
          <>
            <View className="flex-row flex-wrap gap-4">
              {flatListings.map((listing) => (
                <ListingCard key={listing.id} item={listing} />
              ))}
            </View>

            {isFetchingNextPage && (
              <ActivityIndicator className="py-4" color="#8B0A1A" />
            )}

            {flatListings.length === 0 && !isLoading && (
              <EmptyState
                title="No listings found"
                description="Try adjusting your search or filter"
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
