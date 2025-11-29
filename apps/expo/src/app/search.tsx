import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { RouterInputs, RouterOutputs } from "~/utils/api";
import { CategoryFilter } from "~/components/search/CategoryFilter";
import { SearchGrid } from "~/components/search/SearchGrid";
import { SearchHeader } from "~/components/search/SearchHeader";
import { trpc } from "~/utils/api";

export default function SearchScreen() {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  const categoryInput =
    selectedCategory && selectedCategory !== "all"
      ? (selectedCategory.toUpperCase() as RouterInputs["listing"]["list"]["category"])
      : undefined;

  const {
    data: listingsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    trpc.listing.list.infiniteQueryOptions(
      {
        limit: 30,
        search: debouncedSearchQuery || undefined,
        category: categoryInput,
      },
      {
        getNextPageParam: (lastPage: RouterOutputs["listing"]["list"]) =>
          lastPage.nextCursor,
      },
    ),
  );

  const flatListings = listingsData?.pages.flatMap((page) => page.items) ?? [];

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <SearchHeader onSearchChange={setDebouncedSearchQuery} />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <SearchGrid
          listings={flatListings}
          isLoading={isLoading}
          isFetchingMore={isFetchingNextPage}
          onEndReached={handleEndReached}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
