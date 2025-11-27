import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { CATEGORIES } from "~/data/mock";

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange?: (categoryId: string | undefined) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <View className="bg-white px-4 py-3 shadow-sm">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-12"
      >
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`rounded-full px-4 py-2 ${
              !selectedCategory ? "bg-[#8B0A1A]" : "bg-gray-100"
            }`}
            onPress={() => onCategoryChange?.(undefined)}
          >
            <Text
              className={`font-medium ${
                !selectedCategory ? "text-white" : "text-gray-700"
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={`rounded-full px-4 py-2 ${
                selectedCategory === category.id
                  ? "bg-[#8B0A1A]"
                  : "bg-gray-100"
              }`}
              onPress={() => onCategoryChange?.(category.id)}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === category.id
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {category.icon} {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
