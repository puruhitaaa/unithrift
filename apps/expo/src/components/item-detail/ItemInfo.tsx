import { Text, View } from "react-native";

import type { ItemDetail } from "~/types/item-detail";

interface ItemInfoProps {
  item: Pick<
    ItemDetail,
    "title" | "price" | "condition" | "category" | "university" | "description"
  >;
}

export function ItemInfo({ item }: ItemInfoProps) {
  // Capitalize first letter for display
  const formatText = (text: string): string =>
    text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <View className="bg-white p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900">{item.title}</Text>
          <Text className="mt-1 text-2xl font-bold text-[#8B0A1A]">
            {item.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </Text>
        </View>
        <View className="rounded-full bg-[#FFC107] px-3 py-1">
          <Text className="text-sm font-semibold text-gray-900">
            {formatText(String(item.condition))}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row">
        <View className="mr-2 rounded-full bg-gray-100 px-3 py-1">
          <Text className="text-sm text-gray-700">
            {formatText(String(item.category))}
          </Text>
        </View>
        <View className="rounded-full bg-gray-100 px-3 py-1">
          <Text className="text-sm text-gray-700">{item.university}</Text>
        </View>
      </View>

      <Text className="mt-4 leading-6 text-gray-700">{item.description}</Text>
    </View>
  );
}
