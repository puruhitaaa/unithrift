import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import type { RouterOutputs } from "~/utils/api";

type ListingItem = RouterOutputs["listing"]["list"]["items"][number];

interface SearchGridProps {
  listings: ListingItem[];
  isLoading: boolean;
  isFetchingMore: boolean;
  onEndReached?: () => void;
}

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

  const renderItem = ({ item }: { item: ListingItem }) => {
    const imageUrl = item.media[0]?.url ?? "https://rebrand.ly/s8x2f2y";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleItemPress(item.id)}
        style={{
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          margin: ITEM_SPACING / 2,
        }}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={200}
        />
        {/* Price overlay - Instagram style */}
        <View className="absolute right-0 bottom-0 left-0 bg-black/40 px-2 py-1">
          <Text className="text-xs font-semibold text-white" numberOfLines={1}>
            {item.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoadingSkeleton = () => (
    <View className="flex-1 flex-row flex-wrap">
      {Array.from({ length: 9 }).map((_, index) => (
        <View
          key={index}
          style={{
            width: ITEM_SIZE,
            height: ITEM_SIZE,
            margin: ITEM_SPACING / 2,
          }}
          className="bg-gray-200"
        />
      ))}
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-lg font-semibold text-gray-900">
        No items found
      </Text>
      <Text className="mt-2 text-center text-sm text-gray-500">
        Try adjusting your search or explore trending items
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator color="#8B0A1A" />
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
      contentContainerStyle={{
        padding: ITEM_SPACING / 2,
      }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
    />
  );
}
