import type { ViewToken } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";

import { trpc } from "~/utils/api";
import { DiscoverFeedItem } from "./DiscoverFeedItem";

// Define outside to be stable
const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

export function DiscoverFeed() {
  const [containerHeight, setContainerHeight] = useState(
    Dimensions.get("window").height,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  // Track focus state for pausing videos on route change
  useFocusEffect(
    useCallback(() => {
      // Screen is focused
      setIsFocused(true);

      return () => {
        // Screen is unfocused - pause all media
        setIsFocused(false);
      };
    }, []),
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.listing.list.infiniteQueryOptions(
      {
        limit: 5,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  // Stable ref for items to avoid onViewableItemsChanged recreating
  const itemsRef = useRef(items);
  // Update ref in effect to avoid updating during render
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0]?.item) {
        const item = viewableItems[0].item as (typeof itemsRef.current)[0];
        setActiveId(item.id);
      }
    },
    [], // Stable callback - uses ref for items
  );

  // Optimized getItemLayout for known item heights (paging enabled)
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: containerHeight,
      offset: containerHeight * index,
      index,
    }),
    [containerHeight],
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof items)[0] }) => {
      return (
        <DiscoverFeedItem
          listing={item}
          isActive={item.id === activeId && isFocused}
          isFocused={isFocused}
          height={containerHeight}
        />
      );
    },
    [activeId, containerHeight, isFocused],
  );

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        }}
        onEndReachedThreshold={1}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onRefresh={refetch}
        refreshing={isRefetching}
        windowSize={3}
        removeClippedSubviews={true}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        getItemLayout={getItemLayout}
        extraData={`${activeId}-${isFocused}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
