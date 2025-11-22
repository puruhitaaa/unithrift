import { Text, View } from "react-native";
import { MapPin } from "lucide-react-native";

interface LocationInfoProps {
  location: string;
  postedDate: string;
}

export function LocationInfo({ location, postedDate }: LocationInfoProps) {
  return (
    <View className="mt-2 bg-white p-4">
      <View className="mb-2 flex-row items-center">
        <MapPin size={20} color="#666" />
        <Text className="ml-2 text-gray-700">{location}</Text>
      </View>
      <Text className="text-sm text-gray-500">Posted {postedDate}</Text>
    </View>
  );
}
