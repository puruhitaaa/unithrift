import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Info, Package } from "lucide-react-native";

import type { RouterOutputs } from "~/utils/api";
import { DirectPaymentModal } from "../DirectPaymentModal";

type Transaction =
  RouterOutputs["transaction"]["listPurchases"]["items"][number];

interface TransactionListProps {
  transactions: Transaction[];
  type: "purchases" | "sales";
  onEndReached?: () => void;
  isFetchingMore?: boolean;
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
  status: {
    paid: { bg: "#DCFCE7", text: "#166534" },
    pending: { bg: "#FEF3C7", text: "#92400E" },
    shipped: { bg: "#DBEAFE", text: "#1E40AF" },
    completed: { bg: "#F3E8FF", text: "#6B21A8" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B" },
    default: { bg: "#F3F4F6", text: "#374151" },
  },
} as const;

export function TransactionList({
  transactions,
  type,
  onEndReached,
  isFetchingMore,
}: TransactionListProps) {
  const router = useRouter();
  const [selectedSeller, setSelectedSeller] = useState<{
    name: string;
    whatsapp?: string | null;
    instagram?: string | null;
    line?: string | null;
    telegram?: string | null;
  } | null>(null);

  const getStatusColors = (status: string) => {
    switch (status) {
      case "PAID":
        return COLORS.status.paid;
      case "PENDING":
        return COLORS.status.pending;
      case "SHIPPED":
        return COLORS.status.shipped;
      case "COMPLETED":
        return COLORS.status.completed;
      case "CANCELLED":
        return COLORS.status.cancelled;
      default:
        return COLORS.status.default;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Package size={56} color={COLORS.text.tertiary} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>No {type} yet</Text>
      <Text style={styles.emptyDescription}>
        {type === "purchases"
          ? "Start exploring items to purchase"
          : "List your first item to start selling"}
      </Text>
    </View>
  );

  const renderTransaction = ({ item: transaction }: { item: Transaction }) => {
    const listing = transaction.listing;
    const firstImage = listing.media[0]?.url;
    const statusColors = getStatusColors(transaction.status);
    const isDirect = transaction.paymentMethod === "DIRECT";
    const isMidtrans = transaction.paymentMethod === "MIDTRANS";

    const handleSellerInfo = () => {
      const seller = transaction.seller;
      if (seller) {
        setSelectedSeller({
          name: seller.name as string,
          whatsapp: (seller.whatsapp as string | null | undefined) ?? null,
          instagram: (seller.instagram as string | null | undefined) ?? null,
          line: (seller.line as string | null | undefined) ?? null,
          telegram: (seller.telegram as string | null | undefined) ?? null,
        });
      }
    };

    const handleContinuePayment = () => {
      if (
        transaction.payment?.midtransToken &&
        transaction.payment?.midtransRedirectUrl
      ) {
        router.push({
          pathname: "/payment",
          params: {
            transactionId: transaction.id,
            snapToken: transaction.payment.midtransToken,
            redirectUrl: transaction.payment.midtransRedirectUrl ?? "",
          },
        });
      }
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          router.push(`/item/${listing.id}`);
        }}
        activeOpacity={0.7}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          {firstImage ? (
            <Image
              source={{ uri: firstImage }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Package size={32} color={COLORS.text.tertiary} />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title} numberOfLines={1}>
            {listing.title}
          </Text>

          {/* Buyer info for sales */}
          {type === "sales" && transaction.buyer && (
            <Text style={styles.buyerInfo} numberOfLines={1}>
              Buyer: {transaction.buyer.name}
            </Text>
          )}

          {/* Price and Status Row */}
          <View style={styles.priceStatusRow}>
            <Text style={styles.price}>{formatPrice(transaction.amount)}</Text>

            <View
              style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}
            >
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {transaction.status}
              </Text>
            </View>
          </View>

          {/* Payment Action Buttons - Only show for purchases */}
          {type === "purchases" && transaction.status === "PENDING" && (
            <View style={styles.actionButtonContainer}>
              {isDirect && transaction.seller && (
                <Pressable
                  style={styles.actionButton}
                  onPress={handleSellerInfo}
                >
                  <Info size={16} color={COLORS.primary} />
                  <Text style={styles.actionButtonText}>Seller Info</Text>
                </Pressable>
              )}

              {isMidtrans &&
                transaction.payment?.midtransToken &&
                transaction.payment?.midtransRedirectUrl && (
                  <Pressable
                    style={styles.actionButton}
                    onPress={handleContinuePayment}
                  >
                    <Info size={16} color={COLORS.primary} />
                    <Text style={styles.actionButtonText}>
                      Continue Payment
                    </Text>
                  </Pressable>
                )}
            </View>
          )}

          {/* Date */}
          <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  if (transactions.length === 0) {
    return renderEmptyState();
  }

  return (
    <>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={renderFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />

      {/* Direct Payment Modal */}
      {selectedSeller && (
        <DirectPaymentModal
          visible={!!selectedSeller}
          onClose={() => setSelectedSeller(null)}
          seller={selectedSeller}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  separator: {
    height: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
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
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.background,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  buyerInfo: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  priceStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 12,
    color: COLORS.text.tertiary,
  },
  actionButtonContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
