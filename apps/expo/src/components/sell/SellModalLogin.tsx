import { Text, TouchableOpacity, View } from "react-native";
import { Chrome } from "lucide-react-native";

interface SellModalLoginProps {
  onGoogleLogin: () => Promise<void>;
}

export function SellModalLogin({ onGoogleLogin }: SellModalLoginProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="w-full max-w-sm items-center">
        <Text className="mb-2 text-center text-2xl font-bold text-gray-900">
          Sign In to Sell
        </Text>
        <Text className="mb-8 text-center text-gray-600">
          You need to be signed in to list items for sale
        </Text>

        <TouchableOpacity
          onPress={onGoogleLogin}
          className="w-full flex-row items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-4 shadow-sm"
        >
          <Chrome color="#4285F4" size={24} />
          <Text className="ml-3 text-base font-semibold text-gray-800">
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
