import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Filter, Search, X } from "lucide-react-native";

interface SearchHeaderProps {
  onSearchChange?: (query: string) => void;
  onFilterPress?: () => void;
}

export function SearchHeader({
  onSearchChange,
  onFilterPress,
}: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    if (onSearchChange) {
      const timer = setTimeout(() => {
        onSearchChange(searchQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, onSearchChange]);

  return (
    <View className="bg-white px-4 pt-12 pb-4 shadow-sm">
      {/* Title */}
      <View className="mb-4">
        <Text className="text-2xl font-bold text-gray-900">Search</Text>
        <Text className="mt-1 text-sm text-gray-500">
          Discover preloved treasures
        </Text>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
        <Search size={20} color="#666666" />
        <TextInput
          className="mx-2 flex-1 text-gray-800"
          placeholder="Search for items..."
          placeholderTextColor="#666666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <X size={20} color="#666666" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onFilterPress}>
            <Filter size={20} color="#666666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
