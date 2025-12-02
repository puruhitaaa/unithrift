import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AlertTriangle,
  CheckCircle,
  Instagram,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react-native";

interface SellerContact {
  name: string;
  whatsapp?: string | null;
  instagram?: string | null;
  line?: string | null;
  telegram?: string | null;
}

interface DirectPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  seller: SellerContact;
}

export function DirectPaymentModal({
  visible,
  onClose,
  seller,
}: DirectPaymentModalProps) {
  const openWhatsApp = (number: string) => {
    // Remove any non-numeric characters except +
    const cleanNumber = number.replace(/[^\d+]/g, "");
    void Linking.openURL(`https://wa.me/${cleanNumber}`);
  };

  const openInstagram = (username: string) => {
    // Remove @ if present
    const cleanUsername = username.replace("@", "");
    void Linking.openURL(`https://instagram.com/${cleanUsername}`);
  };

  const openLine = (lineId: string) => {
    void Linking.openURL(`https://line.me/ti/p/${lineId}`);
  };

  const openTelegram = (username: string) => {
    // Remove @ if present
    const cleanUsername = username.replace("@", "");
    void Linking.openURL(`https://t.me/${cleanUsername}`);
  };

  const hasAnyContact =
    seller.whatsapp ?? seller.instagram ?? seller.line ?? seller.telegram;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header with Close Button */}
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#374151" />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Success Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <CheckCircle size={64} color="#16A34A" />
              </View>
            </View>

            {/* Congratulations Message */}
            <View style={styles.messageContainer}>
              <Text style={styles.title}>Congratulations!</Text>
              <Text style={styles.subtitle}>
                Your direct payment request has been submitted successfully.
              </Text>
            </View>

            {/* Instructions */}
            <View style={styles.instructionsBanner}>
              <Text style={styles.instructionsText}>
                Please contact the seller to complete the payment
              </Text>
            </View>

            {/* Safety Warning */}
            <View style={styles.warningContainer}>
              <View style={styles.warningHeader}>
                <AlertTriangle size={20} color="#D97706" />
                <Text style={styles.warningTitle}>Safety Tips</Text>
              </View>
              <View style={styles.warningList}>
                <Text style={styles.warningItem}>
                  • Always inspect the product before making payment
                </Text>
                <Text style={styles.warningItem}>
                  • Meet in a safe, public location
                </Text>
                <Text style={styles.warningItem}>
                  • Beware of scams and suspicious requests
                </Text>
                <Text style={styles.warningItem}>
                  • Never share sensitive personal information
                </Text>
                <Text style={styles.warningItem}>
                  • Report suspicious activity to university security
                </Text>
              </View>
            </View>

            {/* Seller Contact Information */}
            <View style={styles.contactSection}>
              <Text style={styles.contactTitle}>Contact {seller.name}</Text>

              {hasAnyContact ? (
                <View style={styles.contactList}>
                  {seller.whatsapp && (
                    <Pressable
                      onPress={() =>
                        seller.whatsapp && openWhatsApp(seller.whatsapp)
                      }
                      style={styles.contactButtonWhatsApp}
                    >
                      <View style={styles.contactIconWhatsApp}>
                        <Phone size={20} color="white" />
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>WhatsApp</Text>
                        <Text style={styles.contactValue}>
                          {seller.whatsapp}
                        </Text>
                      </View>
                    </Pressable>
                  )}

                  {seller.instagram && (
                    <Pressable
                      onPress={() =>
                        seller.instagram && openInstagram(seller.instagram)
                      }
                      style={styles.contactButtonInstagram}
                    >
                      <View style={styles.contactIconInstagram}>
                        <Instagram size={20} color="white" />
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Instagram</Text>
                        <Text style={styles.contactValue}>
                          @{seller.instagram.replace("@", "")}
                        </Text>
                      </View>
                    </Pressable>
                  )}

                  {seller.line && (
                    <Pressable
                      onPress={() => seller.line && openLine(seller.line)}
                      style={styles.contactButtonLine}
                    >
                      <View style={styles.contactIconLine}>
                        <MessageCircle size={20} color="white" />
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>LINE</Text>
                        <Text style={styles.contactValue}>{seller.line}</Text>
                      </View>
                    </Pressable>
                  )}

                  {seller.telegram && (
                    <Pressable
                      onPress={() =>
                        seller.telegram && openTelegram(seller.telegram)
                      }
                      style={styles.contactButtonTelegram}
                    >
                      <View style={styles.contactIconTelegram}>
                        <Send size={20} color="white" />
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Telegram</Text>
                        <Text style={styles.contactValue}>
                          @{seller.telegram.replace("@", "")}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </View>
              ) : (
                <View style={styles.noContactContainer}>
                  <Text style={styles.noContactText}>
                    The seller hasn't added contact information yet.
                  </Text>
                  <Text style={styles.noContactSubtext}>
                    Please try contacting them through the app or check back
                    later.
                  </Text>
                </View>
              )}
            </View>

            {/* Close Button */}
            <View style={styles.footer}>
              <Pressable onPress={onClose} style={styles.gotItButton}>
                <Text style={styles.gotItButtonText}>Got It</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 448,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 9999,
    padding: 8,
  },
  scrollView: {
    maxHeight: "80%",
  },
  iconContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  iconBackground: {
    backgroundColor: "#DCFCE7",
    borderRadius: 9999,
    padding: 16,
  },
  messageContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#4B5563",
  },
  instructionsBanner: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  instructionsText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#14532D",
  },
  warningContainer: {
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
    backgroundColor: "#FFFBEB",
    padding: 16,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  warningTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#78350F",
  },
  warningList: {
    gap: 4,
  },
  warningItem: {
    fontSize: 14,
    color: "#92400E",
    marginBottom: 4,
  },
  contactSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  contactTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  contactList: {
    gap: 8,
  },
  contactButtonWhatsApp: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    backgroundColor: "#DCFCE7",
    padding: 16,
    marginBottom: 8,
  },
  contactButtonInstagram: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FBCFE8",
    backgroundColor: "#FCE7F3",
    padding: 16,
    marginBottom: 8,
  },
  contactButtonLine: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    backgroundColor: "#DCFCE7",
    padding: 16,
    marginBottom: 8,
  },
  contactButtonTelegram: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    backgroundColor: "#DBEAFE",
    padding: 16,
    marginBottom: 8,
  },
  contactIconWhatsApp: {
    backgroundColor: "#22C55E",
    borderRadius: 9999,
    padding: 8,
  },
  contactIconInstagram: {
    backgroundColor: "#EC4899",
    borderRadius: 9999,
    padding: 8,
  },
  contactIconLine: {
    backgroundColor: "#16A34A",
    borderRadius: 9999,
    padding: 8,
  },
  contactIconTelegram: {
    backgroundColor: "#3B82F6",
    borderRadius: 9999,
    padding: 8,
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  noContactContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  noContactText: {
    textAlign: "center",
    fontSize: 14,
    color: "#4B5563",
  },
  noContactSubtext: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 14,
    color: "#4B5563",
  },
  footer: {
    padding: 24,
  },
  gotItButton: {
    borderRadius: 12,
    backgroundColor: "#8B0A1A",
    paddingVertical: 16,
  },
  gotItButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
});
