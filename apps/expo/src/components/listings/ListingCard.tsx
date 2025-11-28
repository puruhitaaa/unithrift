import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import type { RouterOutputs } from "~/utils/api";

type ListingItem = RouterOutputs["listing"]["list"]["items"][number];

interface ListingCardProps {
  item: ListingItem;
}

export function ListingCard({ item }: ListingCardProps) {
  const router = useRouter();
  const imageUrl = item.media[0]?.url ?? "https://rebrand.ly/s8x2f2y";
  const sellerAvatar = item.seller.image ?? "https://rebrand.ly/s8x2f2y";

  const handlePress = () => {
    router.push({
      pathname: "/item/[id]",
      params: { id: item.id },
    });
  };

  return (
    <View className="basis-[48%] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
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
              • {item.condition}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center">
            <Image
              source={{ uri: sellerAvatar }}
              style={{ width: 24, height: 24, borderRadius: 12 }}
              contentFit="cover"
              transition={200}
            />
            <Text
              className="ml-2 truncate text-xs text-gray-500"
              numberOfLines={1}
            >
              {item.seller.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
