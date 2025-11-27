import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMutation } from "@tanstack/react-query";

import type { RouterInputs } from "../utils/api";
import { authClient } from "~/utils/auth";
import { uploadToCloudinary } from "~/utils/cloudinary";
import {
  SellCategoryPicker,
  SellConditionPicker,
  SellFormInput,
  SellImagePicker,
  SellPriceInput,
} from "../components/sell";
import { CATEGORIES } from "../data/mock";
import { queryClient, trpc } from "../utils/api";

type Condition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";

// Map UI category IDs to database enum values
const CATEGORY_MAP: Record<
  string,
  RouterInputs["listing"]["create"]["category"]
> = {
  "1": "CLOTHING",
  "2": "BOOKS",
  "3": "ELECTRONICS",
  "4": "FURNITURE",
  "5": "STATIONERY",
  "6": "OTHER",
};

export default function SellScreen() {
  const { data: session } = authClient.useSession();

  // Form state
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(
    null,
  );

  // Upload state
  const [isUploading, setIsUploading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    images?: string;
    title?: string;
    price?: string;
  }>({});

  // tRPC mutations
  const createListing = useMutation(
    trpc.listing.create.mutationOptions({
      onSuccess: (data) => {
        setIsUploading(false);
        Alert.alert("Success!", "Your item has been listed successfully.", [
          {
            text: "View Listing",
            onPress: () => {
              router.push(`/item-detail/${data.id}`);
            },
          },
          {
            text: "Create Another",
            onPress: resetForm,
          },
        ]);

        // Invalidate relevant queries to refresh data
        void queryClient.invalidateQueries(trpc.listing.list.queryFilter());
        void queryClient.invalidateQueries(
          trpc.listing.getFreshFinds.queryFilter(),
        );
      },
      onError: (error) => {
        setIsUploading(false);
        Alert.alert(
          "Error",
          error.message || "Failed to create listing. Please try again.",
        );
      },
    }),
  );

  const handleAddImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to add images.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5 - images.length,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);
        setImages((prev) => [...prev, ...newImages]);
        setErrors((prev) => ({ ...prev, images: undefined }));
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to select images. Please try again.");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (images.length === 0) {
      newErrors.images = "Please add at least one photo";
    }

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!price) {
      newErrors.price = "Price is required";
    } else if (parseFloat(price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setImages([]);
    setTitle("");
    setDescription("");
    setPrice("");
    setSelectedCategoryId(null);
    setSelectedCondition(null);
    setErrors({});
  };

  const handleSubmit = async () => {
    // Check authentication
    if (!session) {
      Alert.alert("Sign In Required", "Please sign in to create a listing.", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign In",
          onPress: () => router.push("/profile"),
        },
      ]);
      return;
    }

    // Validate form
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (!selectedCategoryId || !selectedCondition) {
      Alert.alert("Validation Error", "Please select a category and condition");
      return;
    }

    // Check if user has a university
    if (!session.user.universityId) {
      Alert.alert(
        "University Required",
        "Please set your university in your profile before creating a listing.",
      );
      return;
    }

    try {
      setIsUploading(true);

      // Upload all images to Cloudinary
      const uploadedMedia = await Promise.all(
        images.map(async (imageUri, index) => {
          const uploaded = await uploadToCloudinary(imageUri, "image");
          return {
            url: uploaded.secureUrl,
            publicId: uploaded.publicId,
            type: "IMAGE" as const,
            order: index,
          };
        }),
      );

      // Map category to database enum
      const categoryEnum = CATEGORY_MAP[selectedCategoryId];
      if (!categoryEnum) {
        throw new Error("Invalid category selected");
      }

      // Convert price to cents (integer)
      const priceInCents = Math.round(parseFloat(price) * 100);

      // Create listing
      await createListing.mutateAsync({
        title: title.trim(),
        description: description.trim() || title.trim(), // Use title as fallback
        price: priceInCents,
        category: categoryEnum,
        condition: selectedCondition,
        universityId: session.user.universityId,
        media: uploadedMedia,
      });
    } catch (error) {
      setIsUploading(false);
      console.error("Error creating listing:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to create listing. Please try again.",
      );
    }
  };

  const isFormValid =
    images.length > 0 &&
    title.trim().length >= 3 &&
    price &&
    parseFloat(price) > 0 &&
    selectedCategoryId &&
    selectedCondition;

  const isSubmitting = isUploading || createListing.isPending;

  return (
    <>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Sell an Item",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView>
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Create Listing</Text>
                <Text style={styles.headerSubtitle}>
                  Share your preloved items with the community
                </Text>
              </View>

              {/* Image Picker */}
              <SellImagePicker
                images={images}
                onAddImage={handleAddImage}
                onRemoveImage={handleRemoveImage}
                maxImages={5}
              />
              {errors.images && (
                <Text style={styles.sectionError}>{errors.images}</Text>
              )}

              {/* Title */}
              <SellFormInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Vintage Denim Jacket"
                error={errors.title}
                required
                maxLength={100}
                editable={!isSubmitting}
              />

              {/* Description */}
              <SellFormInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your item's features, size, brand, etc."
                helperText="Include relevant details that buyers would want to know"
                multiline
                numberOfLines={4}
                editable={!isSubmitting}
              />

              {/* Price */}
              <SellPriceInput
                value={price}
                onChangeText={setPrice}
                error={errors.price}
              />

              {/* Category */}
              <SellCategoryPicker
                categories={CATEGORIES}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />

              {/* Condition */}
              <SellConditionPicker
                selectedCondition={selectedCondition}
                onSelectCondition={setSelectedCondition}
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!isFormValid || isSubmitting) && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>List Item</Text>
                )}
              </TouchableOpacity>

              {/* Upload status */}
              {isUploading && (
                <Text style={styles.uploadingText}>
                  Uploading images... ({images.length} photo
                  {images.length !== 1 ? "s" : ""})
                </Text>
              )}

              {/* Helper text */}
              <Text style={styles.footerText}>
                By listing this item, you agree to our terms and conditions
              </Text>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  sectionError: {
    fontSize: 13,
    color: "#DC2626",
    marginTop: -16,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#8B0A1A",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#8B0A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  uploadingText: {
    fontSize: 13,
    color: "#8B0A1A",
    textAlign: "center",
    marginTop: -8,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
  },
});
