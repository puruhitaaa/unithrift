import { Image, Text, TouchableOpacity, View } from "react-native";
import { Heart } from "lucide-react-native";

import type { ListingUI } from "../../types/ui";

interface TopSellerCardProps {
  item: ListingUI;
}

export function TopSellerCard({ item }: TopSellerCardProps) {
  return (
    <View className="w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <View className="relative">
        <Image
          source={{ uri: item.image }}
          className="h-32 w-full"
          resizeMode="cover"
        />
        <TouchableOpacity className="absolute top-2 right-2 rounded-full bg-white p-1.5">
          <Heart size={16} color="#666666" />
        </TouchableOpacity>
        <View className="absolute bottom-2 left-2 flex-row items-center rounded-full bg-black/50 px-2 py-1">
          <Heart size={12} color="white" fill="white" />
          <Text className="ml-1 text-xs text-white">{item.likes}</Text>
        </View>
      </View>

      <View className="p-3">
        <Text
          className="truncate font-semibold text-gray-900"
          numberOfLines={1}
        >
          {item.title}
        </Text>

        <View className="mt-1 flex-row items-center">
          <Text className="font-bold text-[#8B0A1A]">${item.price}</Text>
          <Text className="ml-2 text-xs text-gray-500">
            • {item.university}
          </Text>
        </View>
      </View>
    </View>
  );
}
