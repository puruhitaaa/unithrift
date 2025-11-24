import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { FreshFindsSection } from "../components/home/FreshFindsSection";
import { PopularOnCampusCard } from "../components/home/PopularOnCampusCard";
import { SearchResultsSection } from "../components/home/SearchResultsSection";
import { TopPicksSection } from "../components/home/TopPicksSection";
import { SmartHeader } from "../components/ui/SmartHeader";

export default function HomeScreen() {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedUniversityId, setSelectedUniversityId] = useState<
    string | undefined
  >();

  return (
    <View className="flex-1 bg-gray-50">
      <SmartHeader
        showSearch={true}
        showCategories={true}
        onSearchChange={setDebouncedSearchQuery}
        onCategoryChange={setSelectedCategory}
        onUniversityChange={setSelectedUniversityId}
      />

      {debouncedSearchQuery ? (
        <View className="flex-1 p-4">
          <SearchResultsSection
            searchQuery={debouncedSearchQuery}
            category={selectedCategory}
            universityId={selectedUniversityId}
          />
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          <TopPicksSection
            category={selectedCategory}
            universityId={selectedUniversityId}
          />

          <FreshFindsSection
            category={selectedCategory}
            universityId={selectedUniversityId}
          />

          {/* Popular on Campus Section */}
          <View className="mb-8">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Popular on Campus
            </Text>
            <PopularOnCampusCard />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
