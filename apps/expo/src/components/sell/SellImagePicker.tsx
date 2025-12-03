import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { File, X } from "lucide-react-native";

interface SellImagePickerProps {
  images: string[];
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

export function SellImagePicker({
  images,
  onAddImage,
  onRemoveImage,
  maxImages = 5,
}: SellImagePickerProps) {
  const canAddMore = images.length < maxImages;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Media</Text>
      <Text style={styles.helperText}>
        Add up to {maxImages} photos or videos (First will be the cover)
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemoveImage(index)}
              activeOpacity={0.8}
            >
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
            {index === 0 && (
              <View style={styles.coverBadge}>
                <Text style={styles.coverText}>Cover</Text>
              </View>
            )}
          </View>
        ))}

        {canAddMore && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddImage}
            activeOpacity={0.7}
          >
            <File size={32} color="#8B0A1A" />
            <Text style={styles.addText}>Add Media</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  helperText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  scrollView: {
    marginHorizontal: -4,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  imageContainer: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  coverBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "#8B0A1A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  coverText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  addButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8B0A1A",
  },
});
