import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  User,
} from "lucide-react-native";

import { Header } from "../../components/ui/Header";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <Header />
      <View className="flex-1 p-4">
        <View className="mt-4 items-center">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
            }}
            className="mb-4 h-24 w-24 rounded-full"
          />
          <Text className="text-2xl font-bold text-gray-900">Alex Morgan</Text>
          <View className="mt-1 flex-row items-center">
            <MapPin size={16} color="#8B0A1A" />
            <Text className="ml-1 text-gray-600">Stanford University</Text>
          </View>

          <View className="mt-8 mb-6 w-full flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">24</Text>
              <Text className="text-gray-600">Listings</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">18</Text>
              <Text className="text-gray-600">Sold</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">42</Text>
              <Text className="text-gray-600">Favorites</Text>
            </View>
          </View>

          <View className="w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <TouchableOpacity className="flex-row items-center border-b border-gray-100 py-3">
              <User size={20} color="#8B0A1A" />
              <Text className="ml-3 flex-1 text-gray-900">Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center border-b border-gray-100 py-3">
              <Bookmark size={20} color="#8B0A1A" />
              <Text className="ml-3 flex-1 text-gray-900">My Listings</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center border-b border-gray-100 py-3">
              <MessageCircle size={20} color="#8B0A1A" />
              <Text className="ml-3 flex-1 text-gray-900">Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center py-3">
              <Heart size={20} color="#8B0A1A" />
              <Text className="ml-3 flex-1 text-gray-900">Saved Items</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
