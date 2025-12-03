import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ItemDetailHeader } from "./ItemDetailHeader";

const COLORS = {
  white: "#FFFFFF",
  background: "#F9FAFB",
  skeleton: "#E5E7EB",
  skeletonLight: "#D1D5DB",
} as const;

export function ItemDetailSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Skeleton */}
        <ItemDetailHeader onBack={() => undefined} />

        {/* Image Gallery Skeleton */}
        <View style={styles.imageGallery}>
          <View style={styles.mainImage} />
          <View style={styles.indicatorContainer}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={styles.indicator} />
            ))}
          </View>
        </View>

        {/* Item Info Skeleton */}
        <View style={styles.itemInfo}>
          {/* Title */}
          <View style={styles.titleSkeleton} />

          {/* Price and Condition */}
          <View style={styles.priceConditionRow}>
            <View style={styles.priceSkeleton} />
            <View style={styles.conditionSkeleton} />
          </View>

          {/* Category and University */}
          <View style={styles.categoryUniversityRow}>
            <View style={styles.infoColumn}>
              <View style={styles.labelSkeleton} />
              <View style={styles.valueSkeleton} />
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.labelSkeleton2} />
              <View style={styles.valueSkeleton2} />
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionLabelSkeleton} />
          <View style={styles.descriptionLine1} />
          <View style={styles.descriptionLine2} />
          <View style={styles.descriptionLine3} />
        </View>

        {/* Seller Info Skeleton */}
        <View style={styles.sellerInfo}>
          <View style={styles.sellerTitleSkeleton} />
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar} />
            <View style={styles.sellerDetails}>
              <View style={styles.sellerNameSkeleton} />
              <View style={styles.sellerUniversitySkeleton} />
            </View>
          </View>
        </View>

        {/* Contact Button Skeleton */}
        <View style={styles.buttonContainer}>
          <View style={styles.buttonSkeleton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageGallery: {
    backgroundColor: COLORS.white,
  },
  mainImage: {
    height: 320,
    width: "100%",
    backgroundColor: COLORS.skeleton,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    padding: 16,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: COLORS.skeletonLight,
  },
  itemInfo: {
    backgroundColor: COLORS.white,
    padding: 24,
  },
  titleSkeleton: {
    height: 28,
    width: "75%",
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
    marginBottom: 8,
  },
  priceConditionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  priceSkeleton: {
    height: 32,
    width: 96,
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
  },
  conditionSkeleton: {
    height: 24,
    width: 80,
    backgroundColor: COLORS.skeleton,
    borderRadius: 12,
  },
  categoryUniversityRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  infoColumn: {
    flex: 1,
  },
  labelSkeleton: {
    height: 16,
    width: 64,
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
    marginBottom: 4,
  },
  valueSkeleton: {
    height: 20,
    width: 96,
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
  },
  labelSkeleton2: {
    height: 16,
    width: 80,
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
    marginBottom: 4,
  },
  valueSkeleton2: {
    height: 20,
    width: 128,
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
  },
  descriptionLabelSkeleton: {
    height: 16,
    width: 80,
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
    marginBottom: 8,
  },
  descriptionLine1: {
    height: 16,
    width: "100%",
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
    marginBottom: 8,
  },
  descriptionLine2: {
    height: 16,
    width: "100%",
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
    marginBottom: 8,
  },
  descriptionLine3: {
    height: 16,
    width: "66%",
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
  },
  sellerInfo: {
    backgroundColor: COLORS.white,
    padding: 24,
    marginTop: 8,
  },
  sellerTitleSkeleton: {
    height: 20,
    width: 96,
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
    marginBottom: 16,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerAvatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: COLORS.skeleton,
  },
  sellerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  sellerNameSkeleton: {
    height: 20,
    width: 128,
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
    marginBottom: 8,
  },
  sellerUniversitySkeleton: {
    height: 16,
    width: 160,
    backgroundColor: COLORS.skeleton,
    borderRadius: 4,
  },
  buttonContainer: {
    padding: 24,
  },
  buttonSkeleton: {
    height: 56,
    width: "100%",
    backgroundColor: COLORS.skeleton,
    borderRadius: 12,
  },
});
