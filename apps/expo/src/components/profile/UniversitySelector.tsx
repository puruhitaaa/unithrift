import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search, X } from "lucide-react-native";

import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";

type University = RouterOutputs["university"]["list"]["items"][number];

interface UniversitySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (universityId: string) => void;
}

export function UniversitySelector({
  visible,
  onClose,
  onSelect,
}: UniversitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch universities
  const universitiesQuery = useQuery(
    trpc.university.list.queryOptions({
      limit: 100,
      search: searchQuery || undefined,
    }),
  );

  const handleSelectUniversity = (university: University) => {
    Alert.alert(
      "Confirm University Selection",
      `Are you sure you want to join ${university.name}?\n\nThis cannot be changed later unless you contact support to prevent abuse.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            onSelect(university.id);
            onClose();
          },
        },
      ],
    );
  };

  const renderUniversityItem = ({ item }: { item: University }) => (
    <TouchableOpacity
      style={styles.universityItem}
      onPress={() => handleSelectUniversity(item)}
      activeOpacity={0.7}
    >
      <View style={styles.universityInfo}>
        <View style={styles.iconContainer}>
          <MapPin size={20} color="#8B0A1A" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.universityName}>{item.name}</Text>
          {item.abbr && <Text style={styles.universityAbbr}>{item.abbr}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Your University</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Warning */}
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            ⚠️ You can only select your university once. Changes require
            contacting support to prevent abuse.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search universities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* University List */}
        {universitiesQuery.isLoading ? (
          <View style={styles.centerContainer}>
            <Text style={styles.loadingText}>Loading universities...</Text>
          </View>
        ) : universitiesQuery.isError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>
              Failed to load universities. Please try again.
            </Text>
          </View>
        ) : (
          <FlatList
            data={universitiesQuery.data?.items ?? []}
            renderItem={renderUniversityItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  warning: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  warningText: {
    fontSize: 13,
    color: "#92400E",
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  universityItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  universityInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  universityAbbr: {
    fontSize: 13,
    color: "#6B7280",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
  },
});
