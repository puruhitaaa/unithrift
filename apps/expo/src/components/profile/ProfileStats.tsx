import { StyleSheet, Text, View } from "react-native";

interface ProfileStatsProps {
  stats: {
    listings: number;
    sold: number;
    rating: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <View style={styles.container}>
      <StatItem value={stats.listings} label="Active Listings" />
      <View style={styles.divider} />
      <StatItem value={stats.sold} label="Items Sold" />
      <View style={styles.divider} />
      <StatItem value={stats.rating.toFixed(1)} label="Rating" suffix="★" />
    </View>
  );
}

interface StatItemProps {
  value: number | string;
  label: string;
  suffix?: string;
}

function StatItem({ value, label, suffix }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    color: "#8B0A1A",
  },
  suffix: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F59E0B",
    marginLeft: 4,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
});
