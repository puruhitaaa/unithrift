import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image as ImageIcon, Video, X } from "lucide-react-native";

interface MediaAsset {
  uri: string;
  type: "image" | "video";
  fileName?: string;
}

interface SellMediaSelectorProps {
  selectedMedia: MediaAsset[];
  onMediaSelected: (media: MediaAsset[]) => void;
  onContinue: () => void;
}

export function SellMediaSelector({
  selectedMedia,
  onMediaSelected,
  onContinue,
}: SellMediaSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false);

  const pickMedia = async () => {
    try {
      setIsSelecting(true);

      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant media library permissions to select images and videos.",
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.High,
      });

      if (!result.canceled && result.assets) {
        const newMedia: MediaAsset[] = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
          fileName: asset.fileName,
        }));

        onMediaSelected([...selectedMedia, ...newMedia]);
      }
    } catch (error) {
      console.error("Error picking media:", error);
      Alert.alert("Error", "Failed to select media. Please try again.");
    } finally {
      setIsSelecting(false);
    }
  };

  const removeMedia = (index: number) => {
    const updated = selectedMedia.filter((_, i) => i !== index);
    onMediaSelected(updated);
  };

  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="mb-2 text-2xl font-bold text-gray-900">
          Add Photos & Videos
        </Text>
        <Text className="text-gray-600">
          Select photos or videos of your item (you can select multiple)
        </Text>
      </View>

      {/* Selected Media Preview */}
      {selectedMedia.length > 0 && (
        <ScrollView className="mb-6 max-h-64">
          <View className="flex-row flex-wrap gap-3">
            {selectedMedia.map((media, index) => (
              <View key={index} className="relative">
                <Image
                  source={{ uri: media.uri }}
                  className="h-24 w-24 rounded-lg"
                  resizeMode="cover"
                />
                {media.type === "video" && (
                  <View className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5">
                    <Video size={12} color="white" />
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => removeMedia(index)}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1"
                >
                  <X size={14} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Add Media Button */}
      <TouchableOpacity
        onPress={pickMedia}
        disabled={isSelecting}
        className="mb-4 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12"
      >
        <ImageIcon size={48} color="#8B0A1A" />
        <Text className="mt-3 font-semibold text-gray-900">
          {isSelecting ? "Selecting..." : "Tap to select media"}
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          Images and videos supported
        </Text>
      </TouchableOpacity>

      {/* Continue Button */}
      {selectedMedia.length > 0 && (
        <TouchableOpacity
          onPress={onContinue}
          className="items-center rounded-xl bg-[#8B0A1A] py-4"
        >
          <Text className="font-semibold text-white">
            Continue ({selectedMedia.length} selected)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
