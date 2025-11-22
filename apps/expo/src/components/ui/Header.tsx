import { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronDown, Filter, MapPin, Search, X } from "lucide-react-native";

import type { RouterOutputs } from "~/utils/api";
import { CATEGORIES } from "../../data/mock";

type University = RouterOutputs["university"]["list"]["items"][number];

interface HeaderProps {
  showSearch?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (id: string | undefined) => void;
  universities?: University[];
  selectedUniversityId?: string;
  setSelectedUniversityId?: (id: string) => void;
}

export function Header({
  showSearch = false,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  universities = [],
  selectedUniversityId,
  setSelectedUniversityId,
}: HeaderProps) {
  const [isUniModalVisible, setIsUniModalVisible] = useState(false);

  const selectedUniversity = universities.find(
    (u) => u.id === selectedUniversityId,
  );

  return (
    <View className="bg-white px-4 pt-12 pb-4 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Unithrift</Text>
          <View className="mt-1 flex-row items-center">
            <MapPin size={16} color="#8B0A1A" />
            <TouchableOpacity
              className="ml-1 flex-row items-center"
              onPress={() => setIsUniModalVisible(true)}
            >
              <Text className="mr-1 text-gray-600">
                {selectedUniversity?.name ?? "Select University"}
              </Text>
              <ChevronDown size={16} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>
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
      {showSearch && setSelectedCategory && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="max-h-16"
        >
          <View className="flex-row gap-2">
            <TouchableOpacity
              className={`rounded-full px-4 py-2 ${
                !selectedCategory ? "bg-[#8B0A1A]" : "bg-gray-100"
              }`}
              onPress={() => setSelectedCategory(undefined)}
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

      {/* University Selection Modal */}
      <Modal
        visible={isUniModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsUniModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-3/4 rounded-t-3xl bg-white p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">
                Select University
              </Text>
              <TouchableOpacity onPress={() => setIsUniModalVisible(false)}>
                <X size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={[
                { id: "all", name: "All Universities", abbr: "All" },
                ...universities,
              ]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`mb-2 rounded-xl p-4 ${
                    selectedUniversityId === item.id ||
                    (item.id === "all" && !selectedUniversityId)
                      ? "bg-[#8B0A1A]/10"
                      : "bg-gray-50"
                  }`}
                  onPress={() => {
                    if (item.id === "all") {
                      setSelectedUniversityId?.("");
                    } else {
                      setSelectedUniversityId?.(item.id);
                    }
                    setIsUniModalVisible(false);
                  }}
                >
                  <Text
                    className={`font-semibold ${
                      selectedUniversityId === item.id ||
                      (item.id === "all" && !selectedUniversityId)
                        ? "text-[#8B0A1A]"
                        : "text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-sm text-gray-500">{item.abbr}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
