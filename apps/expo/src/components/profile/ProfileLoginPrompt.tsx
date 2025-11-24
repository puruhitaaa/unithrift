import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Chrome } from "lucide-react-native";

interface ProfileLoginPromptProps {
  onGoogleLogin: () => Promise<void>;
}

export function ProfileLoginPrompt({ onGoogleLogin }: ProfileLoginPromptProps) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-4">
      {/* Header */}
      <View className="mb-6 items-center">
        <Text className="mb-2 text-center text-2xl font-bold text-gray-800">
          Welcome to CampusSwap
        </Text>
        <Text className="text-center text-sm text-gray-600">
          Sign in to access your profile and start buying/selling on campus
        </Text>
      </View>

      {/* Illustration */}
      <View className="mb-6 w-full items-center">
        <Image
          source={{
            uri: "https://rebrand.ly/s8x2f2y",
          }}
          style={{
            width: 192,
            height: 128,
            borderRadius: 12,
            marginBottom: 16,
          }}
          contentFit="cover"
          transition={200}
        />
      </View>

      {/* Login Card */}
      <View className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-sm">
        <Text className="mb-1 text-center text-lg font-bold text-gray-800">
          Join Our Community
        </Text>
        <Text className="mb-4 text-center text-sm text-gray-600">
          Sign in with your Google account to get started
        </Text>

        {/* Google Login Button */}
        <TouchableOpacity
          onPress={onGoogleLogin}
          className="mb-4 flex-row items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm"
        >
          <Chrome color="#4285F4" size={20} />
          <Text className="ml-2 text-sm font-medium text-gray-800">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Benefits Section */}
        <View className="mt-4">
          <Text className="mb-2 text-center text-sm font-semibold text-gray-800">
            Why Join CampusSwap?
          </Text>

          <View className="gap-y-2">
            <BenefitItem text="Buy and sell items within your university community" />
            <BenefitItem text="Save money on textbooks, electronics, and more" />
            <BenefitItem text="Connect with fellow students on your campus" />
          </View>
        </View>
      </View>

      {/* Terms and Privacy */}
      <View className="mt-4 px-2">
        <Text className="text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

interface BenefitItemProps {
  text: string;
}

function BenefitItem({ text }: BenefitItemProps) {
  return (
    <View className="flex-row items-start">
      <View className="mt-1 rounded-full bg-green-100 p-1">
        <View className="h-1.5 w-1.5 rounded-full bg-green-500"></View>
      </View>
      <Text className="ml-2 flex-1 text-xs text-gray-600">{text}</Text>
    </View>
  );
}
