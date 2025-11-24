import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import type { RouterOutputs } from "~/utils/api";

type TopPickItem = RouterOutputs["listing"]["getTopPicks"]["items"][number];

interface TopSellerCardProps {
  item: TopPickItem;
}

export function TopSellerCard({ item }: TopSellerCardProps) {
  const router = useRouter();
  const imageUrl = item.media[0]?.url ?? "https://rebrand.ly/s8x2f2y";

  const handlePress = () => {
    router.push({
      pathname: "/item/[id]",
      params: { id: item.id },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      className="w-64"
    >
      <View className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <View className="relative">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: 128 }}
            contentFit="cover"
            transition={200}
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
              • {item.seller.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
