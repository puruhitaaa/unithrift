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
  black: "#000000",
  background: "#FFFFFF",
  overlay: "rgba(0, 0, 0, 0.4)",
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
  },
  skeleton: "#E5E7EB",
} as const;

const { width } = Dimensions.get("window");
const ITEM_SPACING = 2;
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
        activeOpacity={0.85}
        onPress={() => handleItemPress(item.id)}
        style={styles.gridItem}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        {/* Price Overlay */}
        <View style={styles.priceOverlay}>
          <Text style={styles.priceText} numberOfLines={1}>
            {formatPrice(item.price)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 9 }).map((_, index) => (
        <View key={`skeleton-${index}`} style={styles.skeletonItem} />
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
        Try adjusting your search or explore {"\n"}
        trending items
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
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
      contentContainerStyle={styles.listContent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={Platform.OS === "android"}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={15}
      windowSize={10}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: ITEM_SPACING / 2,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: ITEM_SPACING / 2,
    backgroundColor: COLORS.skeleton,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  priceOverlay: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  priceText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.white,
    letterSpacing: -0.2,
  },
  skeletonContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: ITEM_SPACING / 2,
  },
  skeletonItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: ITEM_SPACING / 2,
    backgroundColor: COLORS.skeleton,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
