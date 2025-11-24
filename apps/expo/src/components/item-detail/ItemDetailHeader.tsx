import { Text, TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";

interface ItemDetailHeaderProps {
  onBack: () => void;
}

export function ItemDetailHeader({ onBack }: ItemDetailHeaderProps) {
  return (
    <View className="flex-row items-center bg-white p-4 shadow-sm">
      <TouchableOpacity
        onPress={onBack}
        className="rounded-full bg-gray-100 p-2"
      >
        <ChevronLeft size={24} color="#333" />
      </TouchableOpacity>
      <Text className="ml-3 text-xl font-bold text-gray-900">Item Details</Text>
    </View>
  );
}
