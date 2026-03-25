import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { authFetch } from "@/lib/api-client";
import { Colors } from "@/constants/theme";

type AcceptedOrder = {
  id: number;
  items_text?: string;
  budget?: number;
  status?: string;
  urgency?: string;
  distance?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizeOrders(payload: unknown): AcceptedOrder[] {
  if (Array.isArray(payload)) return payload as AcceptedOrder[];
  if (isRecord(payload) && Array.isArray(payload.results)) return payload.results as AcceptedOrder[];
  return [];
}

export default function AcceptedOrders() {
  const [orders, setOrders] = useState<AcceptedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await SecureStore.getItemAsync("user_id");
      const parsed = stored != null ? Number(stored) : NaN;
      if (!cancelled) setUserId(Number.isFinite(parsed) ? parsed : null);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchOrders = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "refresh") setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      const response = await authFetch("/api/orders/driver/orders/");

      if (response.status === 401) {
        setOrders([]);
        setError("Session expired. Please login again.");
        router.replace("/(auth)/login");
        return;
      }

      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text().catch(() => null);

      if (!response.ok) {
        const message =
          (typeof payload === "string" && payload.trim() ? payload : null) ??
          `Failed to load orders. (${response.status})`;
        setOrders([]);
        setError(message);
        return;
      }

      setOrders(normalizeOrders(payload));
    } catch (err) {
      console.log("Error loading orders:", err);
      setError("Network error while loading orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders("initial");
  }, [fetchOrders]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Accepted Orders</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={orders}
        refreshing={refreshing}
        onRefresh={() => fetchOrders("refresh")}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No accepted orders yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text>Items: {item.items_text ?? "-"}</Text>
            <Text>
              Budget: {"\u20B9"}
              {item.budget ?? "-"}
            </Text>
            <Text>Status: {item.status ?? "-"}</Text>

            <View style={styles.actionsRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: "/order-details",
                    params: {
                      id: String(item.id),
                      ...(item.budget != null ? { budget: String(item.budget) } : {}),
                      ...(item.urgency ? { urgency: item.urgency } : {}),
                      ...(item.distance != null ? { distance: String(item.distance) } : {}),
                      ...(item.items_text ? { items_text: item.items_text } : {}),
                    },
                  })
                }
                style={[styles.button, styles.primaryButton]}
              >
                <Text style={styles.buttonText}>View Order</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={userId == null}
                onPress={() => {
                  if (userId == null) {
                    alert("Missing user id. Please logout and login again.");
                    return;
                  }

                  router.push({
                    pathname: "/chat",
                    params: { orderId: String(item.id), userId: String(userId) },
                  });
                }}
                style={({ pressed }) => [
                  styles.button,
                  styles.secondaryButton,
                  userId == null && styles.disabledButton,
                  pressed && userId != null && styles.pressedButton,
                ]}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Chat</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.light.text,
  },
  error: {
    color: "#B91C1C",
    marginBottom: 12,
  },
  empty: {
    color: Colors.light.mutedText,
    marginTop: 12,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: Colors.light.surface,
  },
  orderId: {
    fontWeight: "700",
    marginBottom: 6,
    color: Colors.light.text,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
  },
  secondaryButton: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  secondaryButtonText: {
    color: Colors.light.text,
  },
  pressedButton: {
    opacity: 0.9,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
