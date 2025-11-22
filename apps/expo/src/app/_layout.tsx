// import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "~/utils/api";

import "../styles.css";

import { BottomNav } from "~/components/BottomNav";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  // const colorScheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="sell" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="profile" />
      </Stack>
      <BottomNav />
      <StatusBar />
    </QueryClientProvider>
  );
}
