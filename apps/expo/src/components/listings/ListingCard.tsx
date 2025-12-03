import type { GestureResponderEvent } from "react-native";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Edit3 } from "lucide-react-native";

import type { RouterOutputs } from "~/utils/api";

type ListingItem = RouterOutputs["listing"]["list"]["items"][number];

interface ListingCardProps {
  item: ListingItem;
  showEditButton?: boolean;
  onEdit?: () => void;
}

const COLORS = {
  primary: "#8B0A1A",
  white: "#FFFFFF",
  background: "#F9FAFB",
  border: "#E5E7EB",
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
  },
} as const;

export function ListingCard({
  item,
  showEditButton,
  onEdit,
}: ListingCardProps) {
  const router = useRouter();
  const imageUrl = item.media[0]?.url ?? "https://rebrand.ly/s8x2f2y";
  const sellerAvatar = item.seller.image ?? "https://rebrand.ly/s8x2f2y";

  const handlePress = () => {
    router.push({
      pathname: "/item/[id]",
      params: { id: item.id },
    });
  };

  const handleEditPress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />

          {/* Edit Button Overlay */}
          {showEditButton && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}
              activeOpacity={0.8}
            >
              <Edit3 size={16} color={COLORS.white} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {item.price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </Text>
            <Text style={styles.condition}>• {item.condition}</Text>
          </View>

          <View style={styles.sellerRow}>
            <Image
              source={{ uri: sellerAvatar }}
              style={styles.sellerAvatar}
              contentFit="cover"
              transition={200}
            />
            <Text style={styles.sellerName} numberOfLines={1}>
              {item.seller.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 128,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  condition: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginLeft: 8,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  sellerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  sellerName: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginLeft: 8,
    flex: 1,
  },
});
