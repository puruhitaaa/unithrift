import { Text, View } from "react-native";
import { Image } from "expo-image";

export interface SellerInfoProps {
  seller: {
    name: string;
    avatar: string;
    university: string;
  };
}

export function SellerInfo({ seller }: SellerInfoProps) {
  return (
    <View className="mt-2 bg-white p-4">
      <Text className="mb-3 text-lg font-bold text-gray-900">
        Seller Information
      </Text>

      <View className="flex-row items-center">
        <Image
          source={{ uri: seller.avatar }}
          style={{ width: 64, height: 64, borderRadius: 32 }}
          contentFit="cover"
          transition={200}
        />

        <View className="ml-4 flex-1">
          <Text className="text-lg font-bold text-gray-900">{seller.name}</Text>
          <Text className="mt-1 text-gray-600">{seller.university}</Text>
        </View>
      </View>
    </View>
  );
}
