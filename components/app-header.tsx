import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function getInitial(username: string | null) {
  const trimmed = (username ?? "").trim();
  if (!trimmed) return "?";
  return trimmed[0].toUpperCase();
}

export function AppHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync("username");
        if (!cancelled) setUsername(stored);
      } catch {
        if (!cancelled) setUsername(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 10) }]}>
      <View style={styles.inner}>
        <Text style={styles.title}>{title}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push("/profile")}
          style={({ pressed }) => [styles.avatarButton, pressed && styles.avatarPressed]}
        >
          <Text style={styles.avatarText}>{getInitial(username)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  inner: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0EA5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPressed: {
    opacity: 0.85,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
