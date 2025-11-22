import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { PlusCircle } from "lucide-react-native";

import { Header } from "../../components/ui/Header";
import { CATEGORIES } from "../../data/mock";

export default function SellScreen() {
  const [selectedCategory, setSelectedCategory] = useState("1");

  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <View className="flex-1 p-4">
        <View className="mt-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <Text className="mb-2 text-center text-2xl font-bold text-gray-900">
            Sell Your Items
          </Text>
          <Text className="mb-6 text-center text-gray-600">
            List your preloved items and earn money
          </Text>

          <View className="mb-6 h-48 items-center justify-center rounded-xl bg-gray-100">
            <PlusCircle size={48} color="#8B0A1A" />
            <Text className="mt-2 text-gray-700">Add Photos</Text>
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-medium text-gray-700">Item Title</Text>
            <TextInput
              className="rounded-lg bg-gray-100 px-4 py-3"
              placeholder="What are you selling?"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 font-medium text-gray-700">Price ($)</Text>
            <TextInput
              className="rounded-lg bg-gray-100 px-4 py-3"
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-6">
            <Text className="mb-2 font-medium text-gray-700">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`rounded-full px-4 py-2 ${
                    selectedCategory === category.id
                      ? "bg-[#8B0A1A]"
                      : "bg-gray-100"
                  }`}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text
                    className={`font-medium ${
                      selectedCategory === category.id
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity className="items-center rounded-lg bg-[#8B0A1A] py-3">
            <Text className="font-medium text-white">List Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
