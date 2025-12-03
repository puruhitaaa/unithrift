import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { RouterInputs, RouterOutputs } from "../utils/api";
import { EditListingModal } from "../components/listings/EditListingModal";
import { EmptyState } from "../components/listings/EmptyState";
import { ListingCard } from "../components/listings/ListingCard";
import { SmartHeader } from "../components/ui/SmartHeader";
import { trpc } from "../utils/api";
import { authClient } from "../utils/auth";

type ListingItem = RouterOutputs["listing"]["list"]["items"][number];

const COLORS = {
  primary: "#8B0A1A",
  background: "#F9FAFB",
  border: "#E5E7EB",
  skeleton: "#E5E7EB",
  white: "#FFFFFF",
} as const;

export default function ListingsScreen() {
  const { sellerId } = useLocalSearchParams<{ sellerId: string }>();
  const { data: session } = authClient.useSession();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedUniversityId, setSelectedUniversityId] = useState<
    string | undefined
  >();
  const [editingListing, setEditingListing] = useState<ListingItem | null>(
    null,
  );

  const categoryInput =
    selectedCategory && selectedCategory !== "all"
      ? (selectedCategory.toUpperCase() as RouterInputs["listing"]["list"]["category"])
      : undefined;

  // Check if this is "My Listings" page
  const isMyListings = !!sellerId && sellerId === session?.user?.id;

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

  const handleEditListing = (listing: ListingItem) => {
    setEditingListing(listing);
  };

  const handleCloseModal = () => {
    setEditingListing(null);
  };

  return (
    <View style={styles.container}>
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
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
          <View style={styles.gridContainer}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={index} style={styles.skeletonCard}>
                <View style={styles.skeletonImage} />
                <View style={styles.skeletonContent}>
                  <View style={styles.skeletonTitle} />
                  <View style={styles.skeletonPrice} />
                  <View style={styles.skeletonSellerRow}>
                    <View style={styles.skeletonAvatar} />
                    <View style={styles.skeletonName} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <>
            <View style={styles.gridContainer}>
              {flatListings?.map((listing) => (
                <ListingCard
                  key={listing.id}
                  item={listing}
                  showEditButton={isMyListings}
                  onEdit={() => handleEditListing(listing)}
                />
              ))}
            </View>

            {isFetchingNextPage && (
              <View style={styles.loadingMore}>
                <ActivityIndicator color={COLORS.primary} />
              </View>
            )}

            {flatListings?.length === 0 && !isLoading && (
              <EmptyState
                title="No listings found"
                description="Try adjusting your search or filter"
              />
            )}
          </>
        )}
      </ScrollView>

      {/* Edit Listing Modal */}
      <EditListingModal
        visible={!!editingListing}
        listing={editingListing}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  skeletonCard: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  skeletonImage: {
    width: "100%",
    height: 128,
    backgroundColor: COLORS.skeleton,
  },
  skeletonContent: {
    padding: 12,
  },
  skeletonTitle: {
    height: 16,
    width: "75%",
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
  },
  skeletonPrice: {
    height: 16,
    width: "50%",
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
    marginTop: 8,
  },
  skeletonSellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  skeletonAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.skeleton,
  },
  skeletonName: {
    height: 12,
    width: "33%",
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
    marginLeft: 8,
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
