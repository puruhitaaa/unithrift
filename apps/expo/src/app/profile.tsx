import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMutation } from "@tanstack/react-query";
import {
  // Heart,
  HelpCircle,
  LogOut,
  // MessageCircle,
  Package,
  Settings,
  Shield,
  ShoppingBag,
} from "lucide-react-native";

import {
  ProfileHeader,
  ProfileLoginPrompt,
  ProfileMenuSection,
  ProfileStats,
  UniversitySelector,
} from "~/components/profile";
import { queryClient, trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function ProfileScreen() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  // const [showUniversitySelector, setShowUniversitySelector] = useState(false);

  const { data: profile } = trpc.user.getProfile.queryOptions(undefined, {
    enabled: !!session,
  });

  // const postQuery = useQuery(trpc.post.all.queryOptions());
  // const { data } = useQuery(trpc.post.byId.queryOptions({ id }));

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });
    } catch (err) {
      console.error("Login failed", err);
      Alert.alert("Error", "Failed to sign in. Please try again.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await authClient.signOut();
          } catch (err) {
            console.error("Logout failed", err);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  // Mutation for assigning university
  const assignUniversity = useMutation(
    trpc.university.assignUniversity.mutationOptions({
      onSuccess: () => {
        Alert.alert("Success!", "You have been assigned to the university.");
        // Invalidate session to refresh user data
        void queryClient.invalidateQueries({ queryKey: [["session"]] });
      },
      onError: (error) => {
        Alert.alert(
          "Error",
          error.message || "Failed to assign university. Please try again.",
        );
      },
    }),
  );

  const handleUniversitySelect = (universityId: string) => {
    assignUniversity.mutate({ universityId });
  };

  // Show login prompt if no session
  if (!session) {
    return (
      <>
        <StatusBar style="dark" />
        <ProfileLoginPrompt onGoogleLogin={handleGoogleLogin} />
      </>
    );
  }

  // Check if user needs to select university
  const needsUniversitySelection =
    !session.user.universityId && session.user.role !== "admin";

  // Show university selector if needed
  if (needsUniversitySelection) {
    return (
      <>
        <StatusBar style="dark" />
        <Stack.Screen
          options={{
            title: "Profile",
            headerShown: false,
          }}
        />
        <UniversitySelector
          visible={true}
          onClose={() => {
            // Cannot close until university is selected
            Alert.alert(
              "University Required",
              "Please select your university to continue using the app.",
            );
          }}
          onSelect={handleUniversitySelect}
        />
      </>
    );
  }

  // Show profile content when authenticated and has university
  return (
    <>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />

      {/* <SafeAreaView style={styles.safeArea}> */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeader
          userName={session.user.name}
          userEmail={session.user.email}
          userImage={
            session.user.image ??
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60"
          }
          universityName={
            session.user.role === "admin"
              ? undefined
              : (profile?.university?.name ?? "No University Assigned")
          }
        />

        {/* Stats */}
        <ProfileStats
          stats={{
            listings: profile?.stats.listings ?? 0,
            sold: profile?.stats.sold ?? 0,
            rating: profile?.stats.rating ?? 0,
          }}
        />

        {/* Account Menu */}
        <ProfileMenuSection
          title="Account"
          items={[
            {
              icon: Settings,
              label: "Account Settings",
              onPress: () => router.push("/account-settings"),
            },
            {
              icon: Package,
              label: "My Listings",
              onPress: () =>
                router.push({
                  pathname: "/listings",
                  params: { sellerId: session.user.id },
                }),
            },
            {
              icon: ShoppingBag,
              label: "My Transactions",
              onPress: () => router.push("/transactions"),
            },
            // {
            //   icon: MessageCircle,
            //   label: "Messages",
            //   onPress: () => console.log("Messages"),
            // },
            // {
            //   icon: Heart,
            //   label: "Saved Items",
            //   onPress: () => console.log("Saved Items"),
            // },
          ]}
        />

        {/* Support Menu */}
        <ProfileMenuSection
          title="Support"
          items={[
            {
              icon: HelpCircle,
              label: "Help Center",
              onPress: () => console.log("Help Center"),
            },
            {
              icon: Shield,
              label: "Privacy & Safety",
              onPress: () => console.log("Privacy & Safety"),
            },
          ]}
        />

        {/* Logout Menu */}
        <ProfileMenuSection
          items={[
            {
              icon: LogOut,
              label: "Sign Out",
              onPress: handleLogout,
              isDestructive: true,
            },
          ]}
        />
      </ScrollView>
      {/* </SafeAreaView> */}
    </>
  );
}

const styles = StyleSheet.create({
  // safeArea: {
  //   flex: 1,
  //   backgroundColor: "#F9FAFB",
  // },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
