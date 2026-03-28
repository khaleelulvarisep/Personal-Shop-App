import * as SecureStore from "expo-secure-store";
import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "@/constants/api";
import { authFetch } from "@/lib/api-client";
import { startTracking } from "../services/location";
import { Colors } from "@/constants/theme";


type OrderItem = {
  name: string;
  qty?: string;
};

type OrderStatus = "pending" | "accepted" | "shopping" | "on_the_way" | "delivered";

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "shopping", label: "Shopping" },
  { value: "on_the_way", label: "On The Way" },
  { value: "delivered", label: "Delivered" },
];

function statusLabel(status?: string) {
  const match = ORDER_STATUS_OPTIONS.find((opt) => opt.value === status);
  return match?.label ?? (status ? status.replace(/_/g, " ") : "--");
}

type OrderDetailsResponse = {
  id: number;
  delivery_partner?:number;
  budget?: number;
  urgency?: string;
  distance?: number;
  items?: OrderItem[];
  items_text?: string;
  status?: string;
};

export default function OrderDetails() {
  const { id, budget, urgency, distance, items_text } = useLocalSearchParams<{
    id?: string | string[];
    budget?: string | string[];
    urgency?: string | string[];
    distance?: string | string[];
    items_text?: string | string[];
  }>();
  const [userId, setUserId] = useState<number | null>(null);

  const orderId = useMemo(() => {
    const rawId = Array.isArray(id) ? id[0] : id;
    const parsed = Number(rawId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id]);

  const prefillOrder = useMemo((): OrderDetailsResponse | null => {
    if (!orderId) return null;

    const rawBudget = Array.isArray(budget) ? budget[0] : budget;
    const rawUrgency = Array.isArray(urgency) ? urgency[0] : urgency;
    const rawDistance = Array.isArray(distance) ? distance[0] : distance;
    const rawItemsText = Array.isArray(items_text) ? items_text[0] : items_text;

    const parsedBudget = rawBudget != null ? Number(rawBudget) : undefined;
    const parsedDistance = rawDistance != null ? Number(rawDistance) : undefined;

    return {
      id: orderId,
      budget: Number.isFinite(parsedBudget) ? parsedBudget : undefined,
      urgency: rawUrgency ?? undefined,
      distance: Number.isFinite(parsedDistance) ? parsedDistance : undefined,
      items_text: rawItemsText ?? undefined,
    };
  }, [orderId, budget, urgency, distance, items_text]);

  const [order, setOrder] = useState<OrderDetailsResponse | null>(prefillOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const fetchOrderDetails = async (targetOrderId: number) => {
    setLoading(true);
    setError(null);

    try {
      const candidates = [
        `${API_BASE_URL}/api/orders/order/${targetOrderId}/`,
      ];

      let lastStatus: number | null = null;
      let lastText: string | null = null;

      for (const url of candidates) {
        const res = await authFetch(url);
        lastStatus = res.status;

        if (res.status === 401) {
          alert("Session expired. Please login again.");
          router.replace("/(auth)/login");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          lastText = await res.text().catch(() => null);
          continue;
        }

        const data = await res.json();
        const normalized = (Array.isArray(data) ? data[0] : data) as OrderDetailsResponse | null;

        setOrder((current) => {
          const fallback = current ?? prefillOrder ?? (orderId ? { id: orderId } : null);
          if (!normalized) return fallback;
          if (!fallback) return normalized;

          // Keep computed fields passed from the list (e.g. distance) when the backend doesn't provide them.
          return {
            ...fallback,
            ...normalized,
            distance: normalized.distance ?? fallback.distance,
          };
        });
        setLoading(false);
        return;
      }

      setError(
        `Could not load order #${targetOrderId}. Last response: ${lastStatus}${lastText ? ` (${lastText})` : ""}`
      );
      setLoading(false);
    } catch {
      setError("Network error while loading order details.");
      setLoading(false);
    }
  };

  const updateOrderStatus = async (targetOrderId: number, nextStatus: OrderStatus): Promise<boolean> => {
    if (updatingStatus) return false;
    setUpdatingStatus(true);

    const body = JSON.stringify({ status: nextStatus });

    try {
      const attempts: { url: string; init: RequestInit }[] = [
        {
          url: `/api/orders/order/${targetOrderId}/`,
          init: { method: "PATCH", headers: { "Content-Type": "application/json" }, body },
        },
        {
          url: `/api/orders/update-status/${targetOrderId}/`,
          init: { method: "POST", headers: { "Content-Type": "application/json" }, body },
        },
        {
          url: `/api/orders/order/${targetOrderId}/status/`,
          init: { method: "POST", headers: { "Content-Type": "application/json" }, body },
        },
      ];

      let lastStatus: number | null = null;
      let lastText: string | null = null;

      for (const attempt of attempts) {
        const res = await authFetch(attempt.url, attempt.init);
        lastStatus = res.status;

        const contentType = res.headers.get("content-type") ?? "";
        const payload = contentType.includes("application/json")
          ? await res.json().catch(() => null)
          : await res.text().catch(() => null);

        if (res.status === 401) {
          alert("Session expired. Please login again.");
          router.replace("/(auth)/login");
          return false;
        }

        if (!res.ok) {
          lastText =
            (typeof payload === "string" && payload.trim() ? payload : null) ??
            (payload && typeof payload === "object" && "detail" in payload && typeof payload.detail === "string"
              ? payload.detail
              : null) ??
            null;
          continue;
        }

        if (payload && typeof payload === "object") {
          setOrder((current) => (current ? { ...current, ...(payload as Partial<OrderDetailsResponse>) } : current));
        } else {
          setOrder((current) => (current ? { ...current, status: nextStatus } : current));
        }

        alert(`Status updated to ${statusLabel(nextStatus)}.`);
        return true;
      }

      alert(
        `Could not update status. Last response: ${lastStatus ?? "?"}${lastText ? ` (${lastText})` : ""}`
      );
      return false;
    } catch {
      alert("Network error while updating status.");
      return false;
    } finally {
      setUpdatingStatus(false);
    }
  };

  const sendOtpToCustomer = async (targetOrderId: number): Promise<boolean> => {
    if (sendingOtp) return false;
    setSendingOtp(true);

    try {
      const attempts: { url: string; init: RequestInit }[] = [
        { url: `/api/orders/order/${targetOrderId}/send-otp/`, init: { method: "POST" } },
        { url: `/api/orders/send-otp/${targetOrderId}/`, init: { method: "POST" } },
        { url: `/api/orders/send_otp/${targetOrderId}/`, init: { method: "POST" } },
      ];

      let lastStatus: number | null = null;
      let lastText: string | null = null;

      for (const attempt of attempts) {
        const res = await authFetch(attempt.url, attempt.init);
        lastStatus = res.status;

        const contentType = res.headers.get("content-type") ?? "";
        const payload = contentType.includes("application/json")
          ? await res.json().catch(() => null)
          : await res.text().catch(() => null);

        if (res.status === 401) {
          alert("Session expired. Please login again.");
          router.replace("/(auth)/login");
          return false;
        }

        if (!res.ok) {
          lastText =
            (typeof payload === "string" && payload.trim() ? payload : null) ??
            (payload && typeof payload === "object" && "detail" in payload && typeof payload.detail === "string"
              ? payload.detail
              : null) ??
            null;
          continue;
        }

        const message =
          (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
            ? payload.message
            : null) ?? "OTP sent to customer.";

        alert(message);
        return true;
      }

      alert(`Could not send OTP. Last response: ${lastStatus ?? "?"}${lastText ? ` (${lastText})` : ""}`);
      return false;
    } catch {
      alert("Network error while sending OTP.");
      return false;
    } finally {
      setSendingOtp(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadUserId = async () => {
      const stored = await SecureStore.getItemAsync("user_id");
      const parsed = stored != null ? Number(stored) : NaN;
      if (!cancelled) setUserId(Number.isFinite(parsed) ? parsed : null);
    };

    loadUserId();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setError("Missing or invalid order id.");
      return;
    }

    setOrder(prefillOrder);
    fetchOrderDetails(orderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, prefillOrder]);
  



  const acceptOrder = async (targetOrderId: number): Promise<boolean> => {
    if (accepting) return false;
    setAccepting(true);

    try {
      const response = await authFetch(`/api/orders/accept/${targetOrderId}/`, {
        method: "POST",
      });

      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text().catch(() => null);

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        router.replace("/(auth)/login");
        return false;
      }

      if (!response.ok) {
        const message =
          (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
            ? payload.message
            : null) ??
          (typeof payload === "string" && payload.trim() ? payload : null) ??
          `Failed to accept order. (${response.status})`;
        alert(message);
        return false;
      }

      const message =
        (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
          ? payload.message
          : null) ?? "Order accepted.";

      alert(message);
      return true;
    } catch {
      alert("Network error while accepting the order.");
      return false;
    } finally {
      setAccepting(false);
    }
  };



  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Order Details</Text>
        <Text style={styles.subtitle}>Check list, budget, and delivery notes before starting.</Text>

        {loading && (
          <View style={styles.statusRow}>
            <ActivityIndicator />
            <Text style={styles.statusText}>Loading order...</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Could not load details</Text>
            <Text style={styles.errorText}>{error}</Text>
            {orderId && (
              <Pressable style={styles.retryButton} onPress={() => fetchOrderDetails(orderId)}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            )}
          </View>
        )}

        {order && (
          <>
            <View style={styles.summaryRow}>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Order</Text>
                <Text style={styles.pillValue}>#{order.id}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Budget</Text>
                <Text style={styles.pillValue}>
                  {"\u20B9"}
                  {order.budget}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Urgency</Text>
                <Text style={styles.pillValue}>{order.urgency ?? "--"}</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>Distance</Text>
                <Text style={styles.pillValue}>
                  {typeof order.distance === "number" ? `${order.distance} km` : "--"}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Items</Text>

              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <View key={`${item.name}-${idx}`} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>{item.qty ?? ""}</Text>
                  </View>
                ))
              ) : order.items_text ? (
                <Text style={styles.itemsText}>{order.items_text}</Text>
              ) : (
                <Text style={styles.itemsTextMuted}>No items provided.</Text>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Delivery Status</Text>
              <Text style={styles.statusCurrentText}>Current: {statusLabel(order.status)}</Text>

              <View style={styles.statusButtonsWrap}>
                {ORDER_STATUS_OPTIONS.map((opt) => {
                  const selected = opt.value === order.status;
                  return (
                    <Pressable
                      key={opt.value}
                      accessibilityRole="button"
                      disabled={loading || updatingStatus || selected}
                      onPress={() => updateOrderStatus(order.id, opt.value)}
                      style={({ pressed }) => [
                        styles.statusButton,
                        selected && styles.statusButtonSelected,
                        (loading || updatingStatus) && styles.statusButtonDisabled,
                        pressed && !(loading || updatingStatus || selected) && styles.statusButtonPressed,
                      ]}
                    >
                      <Text style={[styles.statusButtonText, selected && styles.statusButtonTextSelected]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {order.status === "on_the_way" && (
                <Pressable
                  accessibilityRole="button"
                  disabled={sendingOtp || loading}
                  onPress={() => sendOtpToCustomer(order.id)}
                  style={({ pressed }) => [
                    styles.otpButton,
                    (sendingOtp || loading) && styles.otpButtonDisabled,
                    pressed && !(sendingOtp || loading) && styles.otpButtonPressed,
                  ]}
                >
                  {sendingOtp ? (
                    <ActivityIndicator color={Colors.light.strongText} />
                  ) : (
                    <Text style={styles.otpButtonText}>Send OTP</Text>
                  )}
                </Pressable>
              )}
            </View>

        
          </>
        )}
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          disabled={!order || loading || accepting}
          style={({ pressed }) => [
            styles.primaryButton,
            (!order || loading || accepting) && styles.primaryButtonDisabled,
            pressed && !(!order || loading || accepting) && styles.primaryButtonPressed,
          ]}
          onPress={async () => {
            if (!order) return;

            const accepted = await acceptOrder(order.id);
            if (!accepted) return;

            if (userId == null) {
              alert("Could not start tracking: missing user id.");
              router.replace("/(tabs)/nearby-orders");
              return;
            }

            void startTracking(userId);
            router.replace("/(tabs)/nearby-orders");
          }}
//           onPress={async () => {
//   if (!order) return;

//   const driverId = 16; // temp test

//   startTracking(driverId);

//   await acceptOrder(order.id);
// }}
        >
          {accepting ? (
            <ActivityIndicator color={Colors.light.strongText} />
          ) : (
            <Text style={styles.primaryButtonText}>Accept Order</Text>
          )}
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace("/(tabs)/nearby-orders")}
        >
          <Text style={styles.secondaryButtonText}>Skip Order</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.light.text,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: Colors.light.mutedText,
    fontSize: 15,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  pill: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 12,
  },
  pillLabel: {
    color: Colors.light.mutedText,
    fontSize: 12,
    marginBottom: 4,
  },
  pillValue: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  statusText: {
    color: Colors.light.mutedText,
    fontSize: 14,
    fontWeight: "600",
  },
  errorCard: {
    backgroundColor: "#FFF1F2",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECDD3",
    padding: 16,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#9F1239",
    marginBottom: 6,
  },
  errorText: {
    color: "#9F1239",
    fontSize: 13,
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#9F1239",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  itemName: {
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: "600",
  },
  itemQty: {
    color: Colors.light.mutedText,
    fontSize: 14,
  },
  itemsText: {
    color: Colors.light.text,
    fontSize: 14,
    lineHeight: 20,
  },
  itemsTextMuted: {
    color: Colors.light.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  statusCurrentText: {
    color: Colors.light.mutedText,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
  },
  statusButtonsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
  },
  statusButtonSelected: {
    borderColor: Colors.light.tint,
    backgroundColor: Colors.light.tint,
  },
  statusButtonPressed: {
    opacity: 0.9,
  },
  statusButtonDisabled: {
    opacity: 0.6,
  },
  statusButtonText: {
    color: Colors.light.text,
    fontWeight: "700",
    fontSize: 12,
  },
  statusButtonTextSelected: {
    color: Colors.light.strongText,
  },
  otpButton: {
    marginTop: 14,
    backgroundColor: Colors.light.strongBg,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
  },
  otpButtonPressed: {
    opacity: 0.9,
  },
  otpButtonDisabled: {
    opacity: 0.6,
  },
  otpButtonText: {
    color: Colors.light.strongText,
    fontSize: 15,
    fontWeight: "800",
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 14,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: Colors.light.strongText,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: Colors.light.surface,
  },
  secondaryButtonText: {
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: "600",
  },
});
