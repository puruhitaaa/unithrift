import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  User,
} from "lucide-react-native";

interface ProfileContentProps {
  userName: string;
  userImage: string;
  universityName?: string;
  stats: {
    listings: number;
    sold: number;
  };
  onEditProfile?: () => void;
  onMyListings?: () => void;
  onMessages?: () => void;
  onSavedItems?: () => void;
}

export function ProfileContent({
  userName,
  userImage,
  universityName = "Stanford University",
  stats,
  onEditProfile,
  onMyListings,
  onMessages,
  onSavedItems,
}: ProfileContentProps) {
  return (
    <View className="flex-1 p-4">
      <View className="mt-4 items-center">
        <Image
          source={{ uri: userImage }}
          style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 16 }}
          contentFit="cover"
          transition={200}
        />
        <Text className="text-2xl font-bold text-gray-900">{userName}</Text>
        <View className="mt-1 flex-row items-center">
          <MapPin size={16} color="#8B0A1A" />
          <Text className="ml-1 text-gray-600">{universityName}</Text>
        </View>

        <View className="mt-8 mb-6 w-full flex-row justify-around">
          <StatItem value={stats.listings} label="Listings" />
          <StatItem value={stats.sold} label="Sold" />
        </View>

        <View className="w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <MenuItem
            icon={User}
            label="Edit Profile"
            onPress={onEditProfile}
            showBorder
          />
          <MenuItem
            icon={Bookmark}
            label="My Listings"
            onPress={onMyListings}
            showBorder
          />
          <MenuItem
            icon={MessageCircle}
            label="Messages"
            onPress={onMessages}
            showBorder
          />
          <MenuItem icon={Heart} label="Saved Items" onPress={onSavedItems} />
        </View>
      </View>
    </View>
  );
}

interface StatItemProps {
  value: number;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <View className="items-center">
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      <Text className="text-gray-600">{label}</Text>
    </View>
  );
}

interface MenuItemProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  onPress?: () => void;
  showBorder?: boolean;
}

function MenuItem({ icon: Icon, label, onPress, showBorder }: MenuItemProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center py-3 ${showBorder ? "border-b border-gray-100" : ""}`}
      onPress={onPress}
    >
      <Icon size={20} color="#8B0A1A" />
      <Text className="ml-3 flex-1 text-gray-900">{label}</Text>
    </TouchableOpacity>
  );
}
