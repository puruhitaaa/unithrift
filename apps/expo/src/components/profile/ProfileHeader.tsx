import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { MapPin } from "lucide-react-native";

interface ProfileHeaderProps {
  userName: string;
  userEmail: string;
  userImage: string;
  universityName?: string;
}

export function ProfileHeader({
  userName,
  userEmail,
  userImage,
  universityName,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: userImage }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.imageBorder} />
      </View>

      {/* User Info */}
      <Text style={styles.userName}>{userName}</Text>
      <Text style={styles.userEmail}>{userEmail}</Text>

      {/* University */}
      {universityName && (
        <View style={styles.universityContainer}>
          <MapPin size={16} color="#8B0A1A" />
          <Text style={styles.universityText}>{universityName}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageBorder: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: "#FEE2E2",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  universityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  universityText: {
    fontSize: 13,
    color: "#8B0A1A",
    marginLeft: 6,
    fontWeight: "500",
  },
});
