import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Stack, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clearTokens } from "@/lib/auth-tokens";
import { Colors } from "@/constants/theme";

function getInitial(username: string | null) {
  const trimmed = (username ?? "").trim();
  if (!trimmed) return "?";
  return trimmed[0].toUpperCase();
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await SecureStore.getItemAsync("username");
      if (!cancelled) setUsername(stored);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = useMemo(() => {
    const trimmed = (username ?? "").trim();
    return trimmed || "Unknown user";
  }, [username]);

  const logout = async () => {
    await clearTokens();
    await SecureStore.deleteItemAsync("username");
    router.replace("/(auth)/login");
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial(username)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.meta}>Delivery Partner</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>User Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Username</Text>
          <Text style={styles.detailValue}>{displayName}</Text>
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
  },
  backButton: {
    width: 60,
    paddingVertical: 8,
  },
  backText: {
    color: Colors.light.tint,
    fontWeight: "800",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.light.text,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.light.strongText,
    fontSize: 22,
    fontWeight: "900",
  },
  name: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.light.text,
  },
  meta: {
    marginTop: 2,
    color: Colors.light.mutedText,
    fontSize: 13,
    fontWeight: "600",
  },
  detailsCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: Colors.light.text,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailLabel: {
    color: Colors.light.mutedText,
    fontSize: 13,
    fontWeight: "700",
  },
  detailValue: {
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: "800",
  },
  logoutButton: {
    marginTop: "auto",
    marginBottom: 24,
    backgroundColor: Colors.light.strongBg,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    color: Colors.light.strongText,
    fontSize: 15,
    fontWeight: "900",
  },
});
