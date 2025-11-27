import { StyleSheet, Text, TextInput, View } from "react-native";

interface SellPriceInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export function SellPriceInput({
  value,
  onChangeText,
  error,
}: SellPriceInputProps) {
  const handleChangeText = (text: string) => {
    // Only allow numbers and decimal point
    const cleaned = text.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return;
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    onChangeText(cleaned);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Price <Text style={styles.required}>*</Text>
      </Text>
      <Text style={styles.helperText}>Set a fair price for your item</Text>

      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        <Text style={styles.currency}>$</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          placeholder="0.00"
          placeholderTextColor="#9CA3AF"
          keyboardType="decimal-pad"
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.suggestedPrice}>
        Suggested: ${value ? (parseFloat(value) * 0.8).toFixed(2) : "0.00"} - $
        {value ? (parseFloat(value) * 1.2).toFixed(2) : "0.00"}
      </Text>
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
  required: {
    color: "#DC2626",
  },
  helperText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapperError: {
    borderColor: "#DC2626",
  },
  currency: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    padding: 0,
  },
  errorText: {
    fontSize: 13,
    color: "#DC2626",
    marginTop: 6,
  },
  suggestedPrice: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
  },
});
