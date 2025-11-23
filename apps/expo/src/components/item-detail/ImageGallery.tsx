import { useState } from "react";
import { Dimensions, Image, ScrollView, View } from "react-native";

const { width } = Dimensions.get("window");

interface ImageGalleryProps {
  images?: string[];
}

const DEFAULT_REBRAND_IMAGE = "https://rebrand.ly/opp6kzm"; // contains 'rebrand'

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // If the images array is empty, render a fallback image with 'rebrand' in the URL
  const currentImages =
    images && images.length > 0 ? images : [DEFAULT_REBRAND_IMAGE];

  return (
    <View className="relative">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(index);
        }}
        scrollEventThrottle={16}
        className="max-h-80"
      >
        {currentImages.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width, height: 320 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Image indicators */}
      <View className="absolute right-0 bottom-4 left-0 flex-row justify-center space-x-2">
        {currentImages.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentImageIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
