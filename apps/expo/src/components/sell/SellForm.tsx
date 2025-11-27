import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import type { RouterInputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { uploadToCloudinary } from "~/utils/cloudinary";

interface MediaAsset {
  uri: string;
  type: "image" | "video";
  fileName?: string;
}

interface SellFormProps {
  selectedMedia: MediaAsset[];
  onBack: () => void;
  onClose: () => void;
}

type ListingCategory = RouterInputs["listing"]["createPublic"]["category"];
type ListingCondition = RouterInputs["listing"]["createPublic"]["condition"];

const CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: "CLOTHING", label: "Clothing" },
  { value: "BOOKS", label: "Books" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "FURNITURE", label: "Furniture" },
  { value: "STATIONERY", label: "Stationery" },
  { value: "OTHER", label: "Other" },
];

const CONDITIONS: { value: ListingCondition; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
];

export function SellForm({ selectedMedia, onBack, onClose }: SellFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ListingCategory | null>(null);
  const [selectedCondition, setSelectedCondition] =
    useState<ListingCondition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: universities } = trpc.university.list.useQuery();
  const createListingMutation = trpc.listing.createPublic.useMutation();

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }
    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!selectedCondition) {
      Alert.alert("Error", "Please select a condition");
      return;
    }
    if (!universities || universities.length === 0) {
      Alert.alert("Error", "No universities available");
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload media to Cloudinary
      const uploadedMedia = await Promise.all(
        selectedMedia.map(async (media, index) => {
          const result = await uploadToCloudinary(media.uri, media.type);
          return {
            url: result.secureUrl,
            publicId: result.publicId,
            type:
              media.type === "video" ? ("VIDEO" as const) : ("IMAGE" as const),
            order: index,
          };
        }),
      );

      // Create listing
      const newListing = await createListingMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: selectedCategory,
        condition: selectedCondition,
        universityId: universities[0].id, // Use first university for now
        media: uploadedMedia,
      });

      // Close modal
      onClose();

      // Navigate to the created listing
      router.push(`/item/${newListing.id}`);

      Alert.alert("Success", "Your item has been listed!");
    } catch (error) {
      console.error("Error creating listing:", error);
      Alert.alert("Error", "Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 bg-white px-4 py-3">
        <TouchableOpacity
          onPress={onBack}
          className="mr-3"
          disabled={isSubmitting}
        >
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-gray-900">
          List Your Item
        </Text>
      </View>

      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          {/* Media Preview */}
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-900">
              Selected Media ({selectedMedia.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {selectedMedia.map((media, index) => (
                  <Image
                    key={index}
                    source={{ uri: media.uri }}
                    style={{ width: 80, height: 80, borderRadius: 8 }}
                    contentFit="cover"
                    transition={200}
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Item Title */}
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-900">
              Item Title <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="rounded-xl border border-gray-300 bg-white px-4 py-3"
              placeholder="What are you selling?"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              editable={!isSubmitting}
            />
          </View>

          {/* Price */}
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-900">
              Price (Rp) <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="rounded-xl border border-gray-300 bg-white px-4 py-3"
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              editable={!isSubmitting}
            />
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-900">
              Category <Text className="text-red-500">*</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    className={`rounded-full border px-4 py-2 ${
                      selectedCategory === category.value
                        ? "border-[#8B0A1A] bg-[#8B0A1A]"
                        : "border-gray-300 bg-white"
                    }`}
                    onPress={() => setSelectedCategory(category.value)}
                    disabled={isSubmitting}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedCategory === category.value
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Condition */}
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-900">
              Condition <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {CONDITIONS.map((condition) => (
                <TouchableOpacity
                  key={condition.value}
                  className={`min-w-[45%] flex-1 rounded-xl border py-3 ${
                    selectedCondition === condition.value
                      ? "border-[#8B0A1A] bg-[#8B0A1A]"
                      : "border-gray-300 bg-white"
                  }`}
                  onPress={() => setSelectedCondition(condition.value)}
                  disabled={isSubmitting}
                >
                  <Text
                    className={`text-center text-sm font-medium ${
                      selectedCondition === condition.value
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {condition.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="mb-2 font-semibold text-gray-900">
              Description <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="min-h-[120px] rounded-xl border border-gray-300 bg-white px-4 py-3"
              placeholder="Describe your item..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              editable={!isSubmitting}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`mb-3 items-center rounded-xl py-4 ${
              isSubmitting ? "bg-gray-400" : "bg-[#8B0A1A]"
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-white">List Item</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onBack}
            disabled={isSubmitting}
            className="mb-4 items-center py-2"
          >
            <Text className="text-gray-600">Back to Media Selection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
