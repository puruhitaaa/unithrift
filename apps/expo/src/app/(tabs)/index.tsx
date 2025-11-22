import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { FreshFindCard } from "../../components/home/FreshFindCard";
import { PopularOnCampusCard } from "../../components/home/PopularOnCampusCard";
import { TopSellerCard } from "../../components/home/TopSellerCard";
import { Header } from "../../components/ui/Header";
import { FRESH_FINDS, TOP_SELLERS } from "../../data/mock";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("1");

  return (
    <View className="flex-1 bg-gray-50">
      <Header
        showSearch={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ScrollView className="flex-1 px-4 py-4">
        {/* Carousel for Top Performing Sellers */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">
              Top Picks
            </Text>
            <Text className="font-medium text-[#8B0A1A]">See All</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            className="max-h-48"
          >
            <View className="flex-row gap-4">
              {TOP_SELLERS.map((item) => (
                <TopSellerCard key={item.id} item={item} />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Fresh Finds Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">
              Fresh Finds
            </Text>
            <Text className="font-medium text-[#8B0A1A]">See All</Text>
          </View>

          <View className="flex-row flex-wrap gap-4">
            {FRESH_FINDS.slice(0, 4).map((listing) => (
              <FreshFindCard key={listing.id} item={listing} />
            ))}
          </View>
        </View>

        {/* Popular on Campus Section */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
            Popular on Campus
          </Text>
          <PopularOnCampusCard />
        </View>
      </ScrollView>
    </View>
  );
}
