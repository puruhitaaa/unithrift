import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import {
  Bookmark,
  Filter,
  Heart,
  Home,
  Search,
  ShoppingCart,
} from "lucide-react-native";

import { Header } from "../../components/ui/Header";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <View className="flex-1 p-4">
        <View className="mt-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <Text className="mb-2 text-center text-2xl font-bold text-gray-900">
            Find What You Need
          </Text>
          <Text className="mb-6 text-center text-gray-600">
            Search through thousands of preloved items
          </Text>

          <View className="mb-6 flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
            <Search size={20} color="#666666" />
            <TextInput
              className="mx-2 flex-1 text-gray-800"
              placeholder="Search for items..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity>
              <Filter size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          <View className="mb-6 flex-row justify-between">
            <View className="items-center">
              <View className="mb-2 rounded-full bg-[#8B0A1A] p-3">
                <ShoppingCart size={24} color="white" />
              </View>
              <Text className="text-gray-700">Electronics</Text>
            </View>
            <View className="items-center">
              <View className="mb-2 rounded-full bg-[#8B0A1A] p-3">
                <Bookmark size={24} color="white" />
              </View>
              <Text className="text-gray-700">Books</Text>
            </View>
            <View className="items-center">
              <View className="mb-2 rounded-full bg-[#8B0A1A] p-3">
                <Heart size={24} color="white" />
              </View>
              <Text className="text-gray-700">Clothing</Text>
            </View>
            <View className="items-center">
              <View className="mb-2 rounded-full bg-[#8B0A1A] p-3">
                <Home size={24} color="white" />
              </View>
              <Text className="text-gray-700">Furniture</Text>
            </View>
          </View>

          <TouchableOpacity className="items-center rounded-lg bg-[#8B0A1A] py-3">
            <Text className="font-medium text-white">Search Items</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
