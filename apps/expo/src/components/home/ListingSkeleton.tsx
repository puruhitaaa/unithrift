import { Dimensions, Platform, StyleSheet, View } from "react-native";

const COLORS = {
  white: "#FFFFFF",
  border: "#E5E7EB",
  skeleton: "#E5E7EB",
} as const;

const { width } = Dimensions.get("window");
const ITEM_SPACING = 4;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (width - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export function ListingSkeleton() {
  return (
    <View style={styles.skeletonCard}>
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
  );
}

export function TopPickSkeleton() {
  return (
    <View style={styles.topPickCard}>
      <View style={styles.topPickImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonPrice} />
        <View style={styles.skeletonSellerRow}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonName} />
        </View>
      </View>
    </View>
  );
}

export function SearchGridSkeleton() {
  return (
    <View style={styles.searchSkeletonCard}>
      <View style={styles.searchSkeletonImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonCard: {
    flex: 1,
    minWidth: "45%",
    maxWidth: "48%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
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
  topPickCard: {
    width: 256,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  topPickImage: {
    width: "100%",
    height: 160,
    backgroundColor: COLORS.skeleton,
  },
  searchSkeletonCard: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: ITEM_SPACING / 2,
    borderRadius: 8,
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
  searchSkeletonImage: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.skeleton,
  },
});
