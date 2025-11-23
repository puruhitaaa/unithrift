import { Text, TouchableOpacity, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";

interface ContactButtonProps {
  onPress: () => void;
}

export function ContactButton({ onPress }: ContactButtonProps) {
  return (
    <View className="border-t border-gray-200 bg-white p-4">
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-center rounded-xl bg-[#8B0A1A] py-4"
      >
        <ShoppingCart size={20} color="white" />
        <Text className="ml-2 text-lg font-bold text-white">Purchase Item</Text>
      </TouchableOpacity>
    </View>
  );
}
