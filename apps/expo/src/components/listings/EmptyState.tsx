import { Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="text-lg text-gray-500">{title}</Text>
      <Text className="mt-2 text-gray-400">{description}</Text>
    </View>
  );
}
