import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";

import { authClient } from "~/utils/auth";

export default function LoginScreen() {
  const router = useRouter();
  const searchParams = useGlobalSearchParams<{ redirectTo: string }>();

  const redirectTo = searchParams.redirectTo;
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      if (redirectTo) router.replace(redirectTo);
      else router.replace("/");
    }
  }, [router, redirectTo, session]);

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/login", // Will be converted to unithrift://login by expo plugin
      });

      // After sign-in, redirect to provided url or root
      if (redirectTo) {
        router.replace(redirectTo);
      } else {
        router.replace("/");
      }
    } catch (err) {
      // Minimal error handling for the mobile client
      console.error("Login failed", err);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 p-4">
        <View className="w-full max-w-md">
          <Text className="mb-2 text-center text-lg font-semibold text-gray-900">
            Login to continue
          </Text>
          <TouchableOpacity
            onPress={handleGoogleLogin}
            className="mt-4 flex-row items-center justify-center rounded-md bg-[#8B0A1A] py-4"
          >
            <Text className="text-white">Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
