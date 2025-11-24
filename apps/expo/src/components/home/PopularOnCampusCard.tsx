import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

export function PopularOnCampusCard() {
  return (
    <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <View className="flex-row">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1743485753941-5d515a62628d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fExvY2FsJTIwbWFya2V0JTIwc3RyZWV0JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
          }}
          style={{ width: 80, height: 80, borderRadius: 8 }}
          contentFit="cover"
          transition={200}
        />
        <View className="ml-4 flex-1">
          <Text className="font-bold text-gray-900">Campus Flea Market</Text>
          <Text className="mt-1 text-sm text-gray-600">
            Every Saturday • Student Union
          </Text>
          <Text className="mt-2 text-xs text-gray-500">
            Join hundreds of students selling preloved items
          </Text>
        </View>
      </View>

      <TouchableOpacity className="mt-3 items-center rounded-lg bg-[#8B0A1A] py-2">
        <Text className="font-medium text-white">Learn More</Text>
      </TouchableOpacity>
    </View>
  );
}
