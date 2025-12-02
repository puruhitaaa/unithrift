import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";

interface ContactButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ContactButton({
  onPress,
  disabled,
  loading,
}: ContactButtonProps) {
  const isDisabled = disabled ?? loading;

  return (
    <View className="border-t border-gray-200 bg-white p-4">
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        className={`flex-row items-center justify-center rounded-xl py-4 ${
          isDisabled ? "bg-gray-400 opacity-60" : "bg-[#8B0A1A]"
        }`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <ShoppingCart size={20} color="white" />
        )}
        <Text className="ml-2 text-lg font-bold text-white">
          {isDisabled
            ? loading
              ? "Processing..."
              : "Already Purchased"
            : "Purchase Item"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
