import { StyleSheet, Text, View } from "react-native";

import { ProfileMenuItem } from "./ProfileMenuItem";

interface ProfileMenuSectionProps {
  title?: string;
  items: Array<{
    icon: React.ComponentType<{ size: number; color: string }>;
    label: string;
    onPress: () => void;
    isDestructive?: boolean;
  }>;
}

export function ProfileMenuSection({ title, items }: ProfileMenuSectionProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <View style={styles.menuCard}>
        {items.map((item, index) => (
          <View key={item.label}>
            <ProfileMenuItem
              icon={item.icon}
              label={item.label}
              onPress={item.onPress}
              isDestructive={item.isDestructive}
            />
            {index < items.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 72,
  },
});
