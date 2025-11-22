import { View } from "react-native";

export function ListingSkeleton() {
  return (
    <View className="basis-[48%] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <View className="h-32 w-full animate-pulse bg-gray-200" />
      <View className="p-3">
        <View className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <View className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <View className="mt-2 flex-row items-center">
          <View className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
          <View className="ml-2 h-3 w-1/3 animate-pulse rounded bg-gray-200" />
        </View>
      </View>
    </View>
  );
}

export function TopPickSkeleton() {
  return (
    <View className="w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <View className="h-40 w-full animate-pulse bg-gray-200" />
      <View className="p-3">
        <View className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <View className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <View className="mt-2 flex-row items-center">
          <View className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
          <View className="ml-2 h-3 w-1/3 animate-pulse rounded bg-gray-200" />
        </View>
      </View>
    </View>
  );
}
