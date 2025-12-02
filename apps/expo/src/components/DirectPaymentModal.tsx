import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
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
      <View className="flex-1 items-center justify-center bg-black/50 p-4">
        <View className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Header with Close Button */}
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
            <View className="flex-1" />
            <Pressable
              onPress={onClose}
              className="rounded-full bg-gray-100 p-2"
            >
              <X size={20} color="#374151" />
            </Pressable>
          </View>

          <ScrollView className="max-h-[80vh]">
            {/* Success Icon */}
            <View className="items-center py-6">
              <View className="rounded-full bg-green-100 p-4">
                <CheckCircle size={64} color="#16A34A" />
              </View>
            </View>

            {/* Congratulations Message */}
            <View className="px-6 pb-4">
              <Text className="text-center text-2xl font-bold text-gray-900">
                Congratulations!
              </Text>
              <Text className="mt-2 text-center text-base text-gray-600">
                Your direct payment request has been submitted successfully.
              </Text>
            </View>

            {/* Instructions */}
            <View className="bg-green-50 px-6 py-4">
              <Text className="text-center text-base font-semibold text-green-900">
                Please contact the seller to complete the payment
              </Text>
            </View>

            {/* Safety Warning */}
            <View className="mx-6 mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <View className="mb-2 flex-row items-center">
                <AlertTriangle size={20} color="#D97706" />
                <Text className="ml-2 text-base font-semibold text-amber-900">
                  Safety Tips
                </Text>
              </View>
              <View className="space-y-1">
                <Text className="text-sm text-amber-800">
                  • Always inspect the product before making payment
                </Text>
                <Text className="text-sm text-amber-800">
                  • Meet in a safe, public location
                </Text>
                <Text className="text-sm text-amber-800">
                  • Beware of scams and suspicious requests
                </Text>
                <Text className="text-sm text-amber-800">
                  • Never share sensitive personal information
                </Text>
                <Text className="text-sm text-amber-800">
                  • Report suspicious activity to university security
                </Text>
              </View>
            </View>

            {/* Seller Contact Information */}
            <View className="mt-6 px-6">
              <Text className="mb-3 text-lg font-bold text-gray-900">
                Contact {seller.name}
              </Text>

              {hasAnyContact ? (
                <View className="space-y-2">
                  {seller.whatsapp && (
                    <Pressable
                      onPress={() => openWhatsApp(seller.whatsapp!)}
                      className="flex-row items-center rounded-lg border border-green-200 bg-green-50 p-4"
                    >
                      <View className="rounded-full bg-green-500 p-2">
                        <Phone size={20} color="white" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-sm font-medium text-gray-600">
                          WhatsApp
                        </Text>
                        <Text className="text-base font-semibold text-gray-900">
                          {seller.whatsapp}
                        </Text>
                      </View>
                    </Pressable>
                  )}

                  {seller.instagram && (
                    <Pressable
                      onPress={() => openInstagram(seller.instagram!)}
                      className="flex-row items-center rounded-lg border border-pink-200 bg-pink-50 p-4"
                    >
                      <View className="rounded-full bg-pink-500 p-2">
                        <Instagram size={20} color="white" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-sm font-medium text-gray-600">
                          Instagram
                        </Text>
                        <Text className="text-base font-semibold text-gray-900">
                          @{seller.instagram.replace("@", "")}
                        </Text>
                      </View>
                    </Pressable>
                  )}

                  {seller.line && (
                    <Pressable
                      onPress={() => openLine(seller.line!)}
                      className="flex-row items-center rounded-lg border border-green-200 bg-green-50 p-4"
                    >
                      <View className="rounded-full bg-green-600 p-2">
                        <MessageCircle size={20} color="white" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-sm font-medium text-gray-600">
                          LINE
                        </Text>
                        <Text className="text-base font-semibold text-gray-900">
                          {seller.line}
                        </Text>
                      </View>
                    </Pressable>
                  )}

                  {seller.telegram && (
                    <Pressable
                      onPress={() => openTelegram(seller.telegram!)}
                      className="flex-row items-center rounded-lg border border-blue-200 bg-blue-50 p-4"
                    >
                      <View className="rounded-full bg-blue-500 p-2">
                        <Send size={20} color="white" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-sm font-medium text-gray-600">
                          Telegram
                        </Text>
                        <Text className="text-base font-semibold text-gray-900">
                          @{seller.telegram.replace("@", "")}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </View>
              ) : (
                <View className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <Text className="text-center text-sm text-gray-600">
                    The seller hasn't added contact information yet.
                  </Text>
                  <Text className="mt-1 text-center text-sm text-gray-600">
                    Please try contacting them through the app or check back
                    later.
                  </Text>
                </View>
              )}
            </View>

            {/* Close Button */}
            <View className="p-6">
              <Pressable
                onPress={onClose}
                className="rounded-xl bg-[#8B0A1A] py-4"
              >
                <Text className="text-center text-base font-bold text-white">
                  Got It
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
