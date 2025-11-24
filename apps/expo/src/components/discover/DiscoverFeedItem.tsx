import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Share2, ShoppingBag } from "lucide-react-native";

import type { RouterOutputs } from "~/utils/api";

type Listing = RouterOutputs["listing"]["list"]["items"][number];

interface DiscoverFeedItemProps {
  listing: Listing;
  isActive: boolean;
  height: number;
}

export function DiscoverFeedItem({
  listing,
  isActive,
  height,
}: DiscoverFeedItemProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState({});

  const media = listing.media[0];
  const isVideo = media?.type === "VIDEO";

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        void videoRef.current.playAsync();
      } else {
        void videoRef.current.pauseAsync();
        void videoRef.current.setPositionAsync(0);
      }
    }
  }, [isActive]);

  const handlePress = () => {
    router.push(`/item/${listing.id}`);
  };

  return (
    <View style={[styles.container, { height }]}>
      {/* Media Background */}
      <View style={styles.mediaContainer}>
        {media ? (
          isVideo ? (
            <Video
              ref={videoRef}
              style={styles.media}
              source={{ uri: media.url }}
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay={isActive}
              onPlaybackStatusUpdate={setStatus}
            />
          ) : (
            <Image
              source={{ uri: media.url }}
              style={styles.media}
              contentFit="cover"
              transition={200}
            />
          )
        ) : (
          <View style={[styles.media, { backgroundColor: "#1a1a1a" }]} />
        )}
      </View>

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <Text style={styles.headerText}>Discover</Text>
      </View>

      {/* Right Action Bar */}
      <View style={styles.rightActions}>
        {/* <TouchableOpacity style={styles.actionButton}>
          <Heart size={28} color="white" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={28} color="white" />
          <Text style={styles.actionText}>Chat</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={28} color="white" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
          <ShoppingBag size={28} color="white" />
          <Text style={styles.actionText}>Buy</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Info Section */}
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.price}>
            {listing.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </Text>

          <View style={styles.sellerInfo}>
            {listing.seller.image && (
              <Image
                source={{ uri: listing.seller.image }}
                style={styles.avatar}
              />
            )}
            <Text style={styles.sellerName}>{listing.seller.name}</Text>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {listing.description}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    backgroundColor: "black",
    position: "relative",
  },
  mediaContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  media: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  header: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  rightActions: {
    position: "absolute",
    right: 10,
    bottom: 100,
    alignItems: "center",
    gap: 20,
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  infoContainer: {
    position: "absolute",
    left: 10,
    bottom: 20,
    right: 80, // Leave space for right actions
    justifyContent: "flex-end",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  price: {
    color: "#4ade80", // Greenish for price
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "#333",
  },
  sellerName: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  description: {
    color: "#e5e5e5",
    fontSize: 14,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
