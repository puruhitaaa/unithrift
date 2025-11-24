import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";

import { CATEGORIES } from "../../data/mock";

interface MediaAsset {
  uri: string;
  type: "image" | "video";
  fileName?: string;
}

interface SellFormProps {
  selectedMedia: MediaAsset[];
  onBack: () => void;
  onSubmit: () => void;
}

export function SellForm({ selectedMedia, onBack, onSubmit }: SellFormProps) {
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 bg-white p-4">
        <TouchableOpacity onPress={onBack} className="mr-3">
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-gray-900">
          List Your Item
        </Text>
      </View>

      <ScrollView className="flex-1 bg-gray-50 p-6">
        {/* Media Preview */}
        <View className="mb-6">
          <Text className="mb-2 font-semibold text-gray-900">
            Selected Media
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {selectedMedia.map((media, index) => (
                <Image
                  key={index}
                  source={{ uri: media.uri }}
                  className="h-20 w-20 rounded-lg"
                  resizeMode="cover"
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Item Title */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-gray-900">Item Title</Text>
          <TextInput
            className="rounded-xl border border-gray-200 bg-white px-4 py-3"
            placeholder="What are you selling?"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Price */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-gray-900">Price (Rp)</Text>
          <TextInput
            className="rounded-xl border border-gray-200 bg-white px-4 py-3"
            placeholder="0"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        {/* Category */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-gray-900">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2"
                >
                  <Text className="text-sm text-gray-700">
                    {category.icon} {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Condition */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-gray-900">Condition</Text>
          <View className="flex-row gap-2">
            {["NEW", "LIKE_NEW", "GOOD", "FAIR"].map((condition) => (
              <TouchableOpacity
                key={condition}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3"
              >
                <Text className="text-center text-sm text-gray-700">
                  {condition.replace("_", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="mb-2 font-semibold text-gray-900">Description</Text>
          <TextInput
            className="min-h-[120px] rounded-xl border border-gray-200 bg-white px-4 py-3"
            placeholder="Describe your item..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={onSubmit}
          className="mb-4 items-center rounded-xl bg-[#8B0A1A] py-4"
        >
          <Text className="font-semibold text-white">List Item</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBack} className="mb-8 items-center py-2">
          <Text className="text-gray-600">Go Back to Media Selection</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
