import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  showArrow?: boolean;
  iconColor?: string;
  isDestructive?: boolean;
}

export function ProfileMenuItem({
  icon: Icon,
  label,
  onPress,
  showArrow = true,
  iconColor = "#8B0A1A",
  isDestructive = false,
}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon
          size={22}
          color={isDestructive ? "#DC2626" : iconColor}
          strokeWidth={2}
        />
      </View>

      <Text
        style={[styles.label, isDestructive && styles.labelDestructive]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {showArrow && <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  labelDestructive: {
    color: "#DC2626",
  },
});
