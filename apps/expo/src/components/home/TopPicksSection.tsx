import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { RouterInputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { TopPickSkeleton } from "./ListingSkeleton";
import { TopSellerCard } from "./TopSellerCard";

interface TopPicksSectionProps {
  category?: string;
  universityId?: string;
}

const COLORS = {
  primary: "#8B0A1A",
  text: {
    primary: "#111827",
  },
} as const;

export function TopPicksSection({
  category,
  universityId,
}: TopPicksSectionProps) {
  const router = useRouter();

  const categoryInput = category
    ? (category.toUpperCase() as RouterInputs["listing"]["getTopPicks"]["category"])
    : undefined;

  const { data: topPicks, isLoading: topPicksLoading } = useQuery(
    trpc.listing.getTopPicks.queryOptions({
      category: categoryInput,
      universityId,
    }),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Top Picks</Text>
        {topPicks && topPicks.total > topPicks.items.length && (
          <TouchableOpacity onPress={() => router.push("/listings")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {topPicksLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.skeletonWrapper}>
              <TopPickSkeleton />
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={216} // 200 (card width) + 16 (gap)
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {topPicks?.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.cardWrapper,
                index === topPicks.items.length - 1 && styles.lastCard,
              ]}
            >
              <TopSellerCard item={item} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  scrollView: {
    maxHeight: 280,
  },
  scrollContent: {
    paddingRight: 16,
  },
  cardWrapper: {
    marginRight: 16,
  },
  lastCard: {
    marginRight: 0,
  },
  skeletonWrapper: {
    marginRight: 16,
  },
});
