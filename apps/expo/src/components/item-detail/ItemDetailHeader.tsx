import { Text, TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";

interface ItemDetailHeaderProps {
  onBack: () => void;
}

export function ItemDetailHeader({ onBack }: ItemDetailHeaderProps) {
  return (
    <View className="flex-row items-center justify-between bg-white p-4 shadow-sm">
      <TouchableOpacity
        onPress={onBack}
        className="rounded-full bg-gray-100 p-2"
      >
        <ChevronLeft size={24} color="#333" />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-gray-800">Item Details</Text>
    </View>
  );
}
