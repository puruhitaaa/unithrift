import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Instagram, MessageCircle, Phone, Send, X } from "lucide-react-native";

import { queryClient, trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

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

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const { data: profile, isLoading } = useQuery(
    trpc.user.getProfile.queryOptions(undefined, {
      enabled: !!session,
    }),
  );

  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [line, setLine] = useState("");
  const [telegram, setTelegram] = useState("");

  const isInitialized = useRef(false);

  // Initialize form fields when profile loads (only once)
  useEffect(() => {
    if (profile && !isInitialized.current) {
      setWhatsapp(profile.whatsapp ?? "");
      setInstagram(profile.instagram ?? "");
      setLine(profile.line ?? "");
      setTelegram(profile.telegram ?? "");
      isInitialized.current = true;
    }
  }, [profile]);

  const updateContactMutation = useMutation(
    trpc.user.updateContactInfo.mutationOptions({
      onSuccess: () => {
        Alert.alert("Success!", "Your contact information has been updated.");
        void queryClient.invalidateQueries(trpc.user.getProfile.queryFilter());
        router.back();
      },
      onError: (error: Error) => {
        Alert.alert(
          "Error",
          error.message ?? "Failed to update contact information",
        );
      },
    }),
  );

  const handleSave = () => {
    updateContactMutation.mutate({
      whatsapp: whatsapp.trim(),
      instagram: instagram.trim(),
      line: line.trim(),
      telegram: telegram.trim(),
    });
  };

  const hasChanges = () => {
    if (!profile) return false;
    return (
      whatsapp !== (profile.whatsapp ?? "") ||
      instagram !== (profile.instagram ?? "") ||
      line !== (profile.line ?? "") ||
      telegram !== (profile.telegram ?? "")
    );
  };

  if (isLoading) {
    return (
      <>
        <StatusBar style="dark" />
        <Stack.Screen
          options={{
            title: "Account Settings",
            headerShown: true,
          }}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Account Settings",
          headerShown: true,
        }}
      />

      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Contact Information</Text>
            <Text style={styles.headerSubtitle}>
              Update your social media contacts for direct payment buyers to
              reach you.
            </Text>
          </View>

          {/* WhatsApp */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Phone size={20} color={COLORS.text.secondary} />
              <Text style={styles.labelText}>WhatsApp Number</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="+62 812 3456 7890"
              placeholderTextColor={COLORS.text.tertiary}
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType="phone-pad"
            />
            <Text style={styles.helpText}>
              Include country code (e.g., +62 for Indonesia)
            </Text>
          </View>

          {/* Instagram */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Instagram size={20} color={COLORS.text.secondary} />
              <Text style={styles.labelText}>Instagram Username</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="@yourusername"
              placeholderTextColor={COLORS.text.tertiary}
              value={instagram}
              onChangeText={setInstagram}
              autoCapitalize="none"
            />
            <Text style={styles.helpText}>Your Instagram handle</Text>
          </View>

          {/* LINE */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <MessageCircle size={20} color={COLORS.text.secondary} />
              <Text style={styles.labelText}>LINE ID</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="yourlineid"
              placeholderTextColor={COLORS.text.tertiary}
              value={line}
              onChangeText={setLine}
              autoCapitalize="none"
            />
            <Text style={styles.helpText}>Your LINE ID</Text>
          </View>

          {/* Telegram */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Send size={20} color={COLORS.text.secondary} />
              <Text style={styles.labelText}>Telegram Username</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="@yourusername"
              placeholderTextColor={COLORS.text.tertiary}
              value={telegram}
              onChangeText={setTelegram}
              autoCapitalize="none"
            />
            <Text style={styles.helpText}>Your Telegram handle</Text>
          </View>

          {/* Clear All Button */}
          <Pressable
            style={styles.clearButton}
            onPress={() => {
              setWhatsapp("");
              setInstagram("");
              setLine("");
              setTelegram("");
            }}
          >
            <X size={16} color={COLORS.text.secondary} />
            <Text style={styles.clearButtonText}>Clear All Fields</Text>
          </Pressable>

          {/* Save Button */}
          <Pressable
            style={[
              styles.saveButton,
              (!hasChanges() || updateContactMutation.isPending) &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!hasChanges() || updateContactMutation.isPending}
          >
            {updateContactMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </Pressable>

          {/* Info Note */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 These contacts will be shown to buyers when they select direct
              payment for your items. Make sure they are accurate!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text.primary,
    backgroundColor: COLORS.white,
  },
  helpText: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    marginTop: 6,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.text.tertiary,
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  infoBox: {
    backgroundColor: "#FEF3C7",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  infoText: {
    fontSize: 13,
    color: "#92400E",
    lineHeight: 18,
  },
});
