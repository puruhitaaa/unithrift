import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react-native";

import type { RouterOutputs } from "~/utils/api";
import { queryClient, trpc } from "~/utils/api";

type ListingItem = RouterOutputs["listing"]["list"]["items"][number];

interface EditListingModalProps {
  visible: boolean;
  listing: ListingItem | null;
  onClose: () => void;
}

const COLORS = {
  primary: "#8B0A1A",
  white: "#FFFFFF",
  black: "#000000",
  background: "#F9FAFB",
  border: "#E5E7EB",
  overlay: "rgba(0, 0, 0, 0.5)",
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
  },
  success: "#10B981",
  error: "#EF4444",
} as const;

const CONDITIONS = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"] as const;
const CATEGORIES = [
  "CLOTHING",
  "BOOKS",
  "ELECTRONICS",
  "FURNITURE",
  "STATIONERY",
  "OTHER",
] as const;

export function EditListingModal({
  visible,
  listing,
  onClose,
}: EditListingModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] =
    useState<(typeof CONDITIONS)[number]>("GOOD");
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>("OTHER");

  // Update form state when listing changes
  useEffect(() => {
    if (listing) {
      setTitle(listing.title);
      setDescription(listing.description);
      setPrice(listing.price.toString());
      setCondition(listing.condition);
      setCategory(listing.category);
    }
  }, [listing]);

  // Update mutation
  const updateListing = useMutation(
    trpc.listing.update.mutationOptions({
      onSuccess: () => {
        Alert.alert("Success", "Listing updated successfully!");
        void queryClient.invalidateQueries({
          queryKey: [["listing"]],
        });
        onClose();
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to update listing");
      },
    }),
  );

  // Delete mutation
  const deleteListing = useMutation(
    trpc.listing.delete.mutationOptions({
      onSuccess: () => {
        Alert.alert("Success", "Listing deleted successfully!");
        void queryClient.invalidateQueries({
          queryKey: [["listing"]],
        });
        onClose();
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to delete listing");
      },
    }),
  );

  const handleSave = () => {
    if (!listing) return;

    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    updateListing.mutate({
      id: listing.id,
      title: title.trim(),
      description: description.trim(),
      price: priceNum,
      condition,
      category,
    });
  };

  const handleDelete = () => {
    if (!listing) return;

    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteListing.mutate({ id: listing.id });
          },
        },
      ],
    );
  };

  if (!listing) return null;

  const isLoading = updateListing.isPending || deleteListing.isPending;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Listing</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              disabled={isLoading}
            >
              <X size={24} color={COLORS.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter listing title"
                placeholderTextColor={COLORS.text.tertiary}
                editable={!isLoading}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your item..."
                placeholderTextColor={COLORS.text.tertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!isLoading}
              />
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price (IDR) *</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                placeholderTextColor={COLORS.text.tertiary}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>

            {/* Condition */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Condition *</Text>
              <View style={styles.pillContainer}>
                {CONDITIONS.map((cond) => (
                  <TouchableOpacity
                    key={cond}
                    style={[
                      styles.pill,
                      condition === cond && styles.pillActive,
                    ]}
                    onPress={() => setCondition(cond)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        condition === cond && styles.pillTextActive,
                      ]}
                    >
                      {cond.replace("_", " ")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.pillContainer}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.pill, category === cat && styles.pillActive]}
                    onPress={() => setCategory(cat)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        category === cat && styles.pillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={isLoading}
            >
              {deleteListing.isPending ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={[styles.buttonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {updateListing.isPending ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "85%",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text.primary,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text.secondary,
  },
  pillTextActive: {
    color: COLORS.white,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  deleteButtonText: {
    color: COLORS.white,
  },
});
