import { Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import type { RouterOutputs } from "~/utils/api";

type FreshFindItem = RouterOutputs["listing"]["getFreshFinds"]["items"][number];

interface FreshFindCardProps {
  item: FreshFindItem;
}

export function FreshFindCard({ item }: FreshFindCardProps) {
  const router = useRouter();
  const imageUrl = item.media[0]?.url ?? "https://rebrand.ly/opp6kzm";
  const sellerAvatar =
    item.seller.image ??
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D"; // Fallback avatar

  const handlePress = () => {
    router.push({
      pathname: "/item/[id]" as never,
      params: { id: item.id },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      className="basis-[48%]"
    >
      <View className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <View className="relative">
          <Image
            source={{ uri: imageUrl }}
            className="h-32 w-full"
            resizeMode="cover"
          />
        </View>

        <View className="p-3">
          <Text
            className="truncate font-semibold text-gray-900"
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Text className="font-bold text-[#8B0A1A]">
              {item.price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </Text>
            <Text className="ml-2 text-xs text-gray-500">
              • {item.condition}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center">
            <Image
              source={{ uri: sellerAvatar }}
              className="h-6 w-6 rounded-full"
            />
            <Text
              className="ml-2 truncate text-xs text-gray-500"
              numberOfLines={1}
            >
              {item.seller.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
