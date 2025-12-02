// import { useColorScheme } from "react-native";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "~/utils/api";

import "../styles.css";

import { BottomNav } from "~/components/BottomNav";

export default function RootLayout() {
  const pathname = usePathname();

  const shouldShowBottomNav =
    !pathname.startsWith("/item/") &&
    pathname !== "/listings" &&
    pathname !== "/transactions";

  return (
    <QueryClientProvider client={queryClient}>
      {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="discover" />
        <Stack.Screen name="sell" />
        <Stack.Screen name="profile" />
      </Stack>
      {shouldShowBottomNav && <BottomNav />}
      <StatusBar />
    </QueryClientProvider>
  );
}
