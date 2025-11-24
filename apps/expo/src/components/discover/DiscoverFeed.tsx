import type { ViewToken } from "react-native";
import { useCallback, useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
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

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0]?.item) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const item = viewableItems[0].item as (typeof items)[0];
        setActiveId(item.id);
      }
    },
    [items],
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof items)[0] }) => {
      return (
        <DiscoverFeedItem
          listing={item}
          isActive={item.id === activeId}
          height={containerHeight}
        />
      );
    },
    [activeId, containerHeight],
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
