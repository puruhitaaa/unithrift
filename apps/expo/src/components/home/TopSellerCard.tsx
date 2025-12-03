import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import type { RouterOutputs } from "~/utils/api";

type TopPickItem = RouterOutputs["listing"]["getTopPicks"]["items"][number];

interface TopSellerCardProps {
  item: TopPickItem;
}

const COLORS = {
  primary: "#8B0A1A",
  white: "#FFFFFF",
  border: "#E5E7EB",
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
  },
} as const;

export function TopSellerCard({ item }: TopSellerCardProps) {
  const router = useRouter();
  const imageUrl = item.media[0]?.url ?? "https://rebrand.ly/s8x2f2y";

  const handlePress = () => {
    router.push({
      pathname: "/item/[id]",
      params: { id: item.id },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.priceSellerRow}>
            <Text style={styles.price}>
              {item.price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </Text>
          </View>

          <View style={styles.sellerRow}>
            <Text style={styles.sellerName} numberOfLines={1}>
              {item.seller.name}
            </Text>
            {item.university && (
              <>
                <View style={styles.dot} />
                <Text style={styles.universityName} numberOfLines={1}>
                  {item.university.abbr}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 200,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
    backgroundColor: COLORS.border,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
    lineHeight: 20,
    minHeight: 40,
  },
  priceSellerRow: {
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerName: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: "500",
    flex: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.text.tertiary,
    marginHorizontal: 6,
  },
  universityName: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
});
