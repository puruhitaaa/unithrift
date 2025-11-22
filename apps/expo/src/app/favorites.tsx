import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Heart } from "lucide-react-native";

import { Header } from "../components/ui/Header";
import { FRESH_FINDS } from "../data/mock";

export default function FavoritesScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <ScrollView className="flex-1 p-4">
        <Text className="mt-4 mb-6 text-2xl font-bold text-gray-900">
          Your Favorites
        </Text>

        {FRESH_FINDS.slice(0, 2).map((listing) => (
          <View
            key={listing.id}
            className="mb-4 flex-row rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <Image
              source={{ uri: listing.image }}
              className="h-20 w-20 rounded-lg"
              resizeMode="cover"
            />
            <View className="ml-4 flex-1">
              <Text className="font-bold text-gray-900">{listing.title}</Text>
              <Text className="mt-1 font-bold text-[#8B0A1A]">
                ${listing.price}
              </Text>
              <View className="mt-2 flex-row items-center">
                <Image
                  source={{ uri: listing.sellerAvatar }}
                  className="h-6 w-6 rounded-full"
                />
                <Text className="ml-2 text-sm text-gray-600">
                  {listing.university}
                </Text>
              </View>
            </View>
            <TouchableOpacity className="self-start">
              <Heart size={20} color="#8B0A1A" fill="#8B0A1A" />
            </TouchableOpacity>
          </View>
        ))}

        <View className="mt-4 items-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <Heart size={48} color="#8B0A1A" />
          <Text className="mt-4 text-center text-gray-700">
            You haven't favorited any items yet. Start exploring to find items
            you love!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
