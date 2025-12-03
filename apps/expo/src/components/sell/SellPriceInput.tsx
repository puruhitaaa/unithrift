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
    // Only allow numbers (no decimals for IDR)
    const cleaned = text.replace(/[^0-9]/g, "");
    onChangeText(cleaned);
  };

  // Format number with thousands separator
  const formatPrice = (value: string) => {
    if (!value) return "";
    return parseInt(value).toLocaleString("id-ID");
  };

  // Calculate suggested price range (±20%)
  const getSuggestedRange = () => {
    if (!value || parseInt(value) === 0) {
      return "Rp 0 - Rp 0";
    }
    const numValue = parseInt(value);
    const lower = Math.round(numValue * 0.8);
    const upper = Math.round(numValue * 1.2);
    return `Rp ${lower.toLocaleString("id-ID")} -Rp ${upper.toLocaleString("id-ID")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Price <Text style={styles.required}>*</Text>
      </Text>
      <Text style={styles.helperText}>Set a fair price for your item</Text>

      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        <Text style={styles.currency}>Rp</Text>
        <TextInput
          style={styles.input}
          value={formatPrice(value)}
          onChangeText={handleChangeText}
          placeholder="0"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.suggestedPrice}>
        Suggested: {getSuggestedRange()}
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
