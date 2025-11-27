import type { Href } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";
import { Home, Play, PlusCircle, Search, User } from "lucide-react-native";

interface TabItem {
  name: string;
  label: string;
  icon: LucideIcon;
  path: Href<string>;
}

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";

  const tabs: TabItem[] = [
    { name: "index", label: "Home", icon: Home, path: "/" },
    { name: "search", label: "Search", icon: Search, path: "/search" },
    { name: "discover", label: "Discover", icon: Play, path: "/discover" },
    { name: "sell", label: "Sell", icon: PlusCircle, path: "/sell" },
    { name: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const handleTabPress = (tab: TabItem) => {
    router.push(tab.path);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#09090B" : "#FFFFFF",
          borderTopColor: isDark ? "#27272A" : "#E5E7EB",
          paddingBottom: insets.bottom + 10,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive =
          tab.path === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.path as string);

        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => handleTabPress(tab)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Icon size={24} color={isActive ? "#8B0A1A" : "#666666"} />
            <Text
              style={[
                styles.label,
                { color: isActive ? "#8B0A1A" : "#666666" },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 10,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
  },
});
