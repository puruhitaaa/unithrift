import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Condition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";

interface ConditionOption {
  value: Condition;
  label: string;
  description: string;
}

interface SellConditionPickerProps {
  selectedCondition: Condition | null;
  onSelectCondition: (condition: Condition) => void;
}

const CONDITIONS: ConditionOption[] = [
  {
    value: "NEW",
    label: "New",
    description: "Never used, with tags",
  },
  {
    value: "LIKE_NEW",
    label: "Like New",
    description: "Excellent condition",
  },
  {
    value: "GOOD",
    label: "Good",
    description: "Minor signs of wear",
  },
  {
    value: "FAIR",
    label: "Fair",
    description: "Visible signs of use",
  },
];

export function SellConditionPicker({
  selectedCondition,
  onSelectCondition,
}: SellConditionPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Condition</Text>
      <Text style={styles.helperText}>
        Be honest about the item's condition
      </Text>

      <View style={styles.grid}>
        {CONDITIONS.map((condition) => {
          const isSelected = condition.value === selectedCondition;

          return (
            <TouchableOpacity
              key={condition.value}
              style={[
                styles.conditionCard,
                isSelected && styles.conditionCardActive,
              ]}
              onPress={() => onSelectCondition(condition.value)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.radio, isSelected && styles.radioActive]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <Text
                  style={[
                    styles.conditionLabel,
                    isSelected && styles.conditionLabelActive,
                  ]}
                >
                  {condition.label}
                </Text>
              </View>
              <Text
                style={[
                  styles.conditionDescription,
                  isSelected && styles.conditionDescriptionActive,
                ]}
              >
                {condition.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  conditionCard: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
  },
  conditionCardActive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#8B0A1A",
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: "#8B0A1A",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#8B0A1A",
  },
  conditionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  conditionLabelActive: {
    color: "#8B0A1A",
  },
  conditionDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  conditionDescriptionActive: {
    color: "#991B1B",
  },
});
