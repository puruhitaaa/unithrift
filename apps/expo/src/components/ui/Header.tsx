import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Filter, MapPin, Search, User } from "lucide-react-native";

import { CATEGORIES } from "../../data/mock";

interface HeaderProps {
  showSearch?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (id: string) => void;
}

export function Header({
  showSearch = false,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: HeaderProps) {
  return (
    <View className="bg-white px-4 pt-12 pb-4 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Unithrift</Text>
          <View className="mt-1 flex-row items-center">
            <MapPin size={16} color="#8B0A1A" />
            <Text className="ml-1 text-gray-600">Stanford University</Text>
          </View>
        </View>
        <TouchableOpacity className="rounded-full bg-gray-100 p-2">
          <User size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar - Only show if requested */}
      {showSearch && (
        <View className="mb-4 flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
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
      )}

      {/* Categories - Only show if requested */}
      {showSearch && selectedCategory && setSelectedCategory && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="max-h-16"
        >
          <View className="flex-row gap-2">
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
                  {category.icon} {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
