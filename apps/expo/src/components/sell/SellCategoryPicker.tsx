import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface SellCategoryPickerProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function SellCategoryPicker({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: SellCategoryPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <Text style={styles.helperText}>What type of item is this?</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = category.id === selectedCategoryId;

          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                isSelected && styles.categoryButtonActive,
              ]}
              onPress={() => onSelectCategory(category.id)}
              activeOpacity={0.7}
            >
              {category.icon && (
                <Text style={styles.categoryIcon}>{category.icon}</Text>
              )}
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryButtonActive: {
    backgroundColor: "#8B0A1A",
    borderColor: "#8B0A1A",
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
});
