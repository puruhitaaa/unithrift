import { View } from "react-native";

import { authClient } from "~/utils/auth";
import { ProfileContent } from "../components/profile/ProfileContent";
import { ProfileLoginPrompt } from "../components/profile/ProfileLoginPrompt";

export default function ProfileScreen() {
  const { data: session } = authClient.useSession();

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  // Show login prompt if no session
  if (!session) {
    return <ProfileLoginPrompt onGoogleLogin={handleGoogleLogin} />;
  }

  // Show profile content when authenticated
  return (
    <View className="flex-1 bg-gray-50">
      <ProfileContent
        userName={session.user.name ?? "Unknown User"}
        userImage={
          session.user.image ??
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D"
        }
        universityName="Stanford University"
        stats={{
          listings: 24,
          sold: 18,
        }}
        onEditProfile={() => console.log("Edit Profile")}
        onMyListings={() => console.log("My Listings")}
        onMessages={() => console.log("Messages")}
        onSavedItems={() => console.log("Saved Items")}
      />
    </View>
  );
}
