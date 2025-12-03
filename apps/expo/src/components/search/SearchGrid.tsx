import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";

import type { RouterOutputs } from "~/utils/api";
import { SearchGridSkeleton } from "../home/ListingSkeleton";

type ListingItem = RouterOutputs["listing"]["list"]["items"][number];

interface SearchGridProps {
  listings: ListingItem[];
  isLoading: boolean;
  isFetchingMore: boolean;
  onEndReached?: () => void;
}

const COLORS = {
  primary: "#8B0A1A",
  white: "#FFFFFF",
  background: "#F9FAFB",
  overlay: "rgba(0, 0, 0, 0.5)",
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
  },
  skeleton: "#E5E7EB",
  emptyBg: "#F3F4F6",
} as const;

const { width } = Dimensions.get("window");
const ITEM_SPACING = 4;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (width - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export function SearchGrid({
  listings,
  isLoading,
  isFetchingMore,
  onEndReached,
}: SearchGridProps) {
  const router = useRouter();

  const handleItemPress = (itemId: string) => {
    router.push({
      pathname: "/item/[id]",
      params: { id: itemId },
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderItem = ({ item }: { item: ListingItem }) => {
    const imageUrl = item.media[0]?.url ?? "https://rebrand.ly/s8x2f2y";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleItemPress(item.id)}
        style={styles.gridItem}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            placeholderContentFit="cover"
          />
        </View>

        {/* Price Overlay */}
        <View style={styles.priceOverlay}>
          <View style={styles.priceTag}>
            <Text style={styles.priceText} numberOfLines={1}>
              {formatPrice(item.price)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 12 }).map((_, index) => (
        <SearchGridSkeleton key={`skeleton-${index}`} />
      ))}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Search size={48} color={COLORS.text.tertiary} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>No items found</Text>
      <Text style={styles.emptyDescription}>
        Try adjusting your search or filters{"\n"}to find what you're looking
        for
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  if (isLoading) {
    return renderLoadingSkeleton();
  }

  return (
    <FlatList
      data={listings}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={[
        styles.listContent,
        listings.length === 0 && styles.emptyListContent,
      ]}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={Platform.OS === "android"}
      maxToRenderPerBatch={12}
      updateCellsBatchingPeriod={50}
      initialNumToRender={18}
      windowSize={7}
      getItemLayout={(_, index) => ({
        length: ITEM_SIZE,
        offset: ITEM_SIZE * Math.floor(index / NUM_COLUMNS),
        index,
      })}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: ITEM_SPACING / 2,
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: ITEM_SPACING / 2,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.skeleton,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  priceOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  priceTag: {
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  priceText: {
    fontSize: 12,
    fontWeight: 500,
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  skeletonContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: ITEM_SPACING / 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.emptyBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },
});
