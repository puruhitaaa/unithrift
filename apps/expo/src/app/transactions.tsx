import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "~/utils/api";
import { TransactionList } from "~/components/profile";
import { trpc } from "~/utils/api";

const COLORS = {
  primary: "#8B0A1A",
  white: "#FFFFFF",
  background: "#F9FAFB",
  border: "#E5E7EB",
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
  },
} as const;

export default function TransactionsScreen() {
  const [activeTab, setActiveTab] = useState<"purchases" | "sales">(
    "purchases",
  );

  // Purchases infinite query
  const {
    data: purchasesData,
    fetchNextPage: fetchNextPurchases,
    hasNextPage: hasNextPurchases,
    isFetchingNextPage: isFetchingNextPurchases,
    isLoading: isPurchasesLoading,
  } = useInfiniteQuery({
    ...trpc.transaction.listPurchases.infiniteQueryOptions(
      {
        limit: 20,
      },
      {
        getNextPageParam: (
          lastPage: RouterOutputs["transaction"]["listPurchases"],
        ) => lastPage.nextCursor,
      },
    ),
    enabled: activeTab === "purchases",
  });

  // Sales infinite query
  const {
    data: salesData,
    fetchNextPage: fetchNextSales,
    hasNextPage: hasNextSales,
    isFetchingNextPage: isFetchingNextSales,
    isLoading: isSalesLoading,
  } = useInfiniteQuery({
    ...trpc.transaction.listSales.infiniteQueryOptions(
      {
        limit: 20,
      },
      {
        getNextPageParam: (
          lastPage: RouterOutputs["transaction"]["listSales"],
        ) => lastPage.nextCursor,
      },
    ),
    enabled: activeTab === "sales",
  });

  const isLoading =
    activeTab === "purchases" ? isPurchasesLoading : isSalesLoading;
  const isFetchingMore =
    activeTab === "purchases" ? isFetchingNextPurchases : isFetchingNextSales;
  const hasNextPage =
    activeTab === "purchases" ? hasNextPurchases : hasNextSales;

  const transactions =
    activeTab === "purchases"
      ? (purchasesData?.pages.flatMap((page) => page.items) ?? [])
      : (salesData?.pages.flatMap((page) => page.items) ?? []);

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingMore) {
      if (activeTab === "purchases") {
        void fetchNextPurchases();
      } else {
        void fetchNextSales();
      }
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "My Transactions",
          headerShown: true,
        }}
      />

      <View style={styles.container}>
        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("purchases")}
            style={[styles.tab, activeTab === "purchases" && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "purchases" && styles.activeTabText,
              ]}
            >
              Purchases
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("sales")}
            style={[styles.tab, activeTab === "sales" && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "sales" && styles.activeTabText,
              ]}
            >
              Sales
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transaction List */}
        <View style={styles.contentContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : (
            <TransactionList
              transactions={transactions}
              type={activeTab}
              onEndReached={handleEndReached}
              isFetchingMore={isFetchingMore}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    alignItems: "center",
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 8,
  },
});
