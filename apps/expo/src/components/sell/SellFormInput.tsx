import type { TextInputProps } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface SellFormInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function SellFormInput({
  label,
  value,
  onChangeText,
  error,
  helperText,
  required = false,
  ...textInputProps
}: SellFormInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>

      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          textInputProps.multiline ? styles.inputMultiline : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        {...textInputProps}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  required: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
    marginLeft: 4,
  },
  helperText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1F2937",
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorText: {
    fontSize: 13,
    color: "#DC2626",
    marginTop: 6,
  },
});
