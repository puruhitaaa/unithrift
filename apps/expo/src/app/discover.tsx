import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { DiscoverFeed } from "~/components/discover/DiscoverFeed";

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <DiscoverFeed />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
