import { View, Text, Pressable, StyleSheet, ScrollView, Animated } from "react-native";
import { router } from "expo-router";
import { useTabSwipe } from "@/hooks/use-tab-swipe";
import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { API_BASE_URL } from "@/constants/api";
import { Colors } from "@/constants/theme";

type Order = {
  id: number
  urgency: string
  budget: number
  distance: number
  items_text: string
}

export default function NearbyOrders() {

  const tabSwipe = useTabSwipe({ left: "/(tabs)/earnings", right: "/(tabs)/home" });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Get delivery partner location
  const getLocation = useCallback(async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Location permission required");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
  }, []);

  // Fetch nearby orders
  const fetchOrders = useCallback(async () => {

    try {

      const location = await getLocation();

      if (!location) return;

      const response = await fetch(
        `${API_BASE_URL}/api/orders/nearby-orders/?lat=${location.latitude}&lng=${location.longitude}`
      );

      const data = await response.json();

      setOrders(data);
      setLoading(false);

    } catch (error) {

      console.log("Error fetching orders:", error);

    }
  }, [getLocation]);

  // Load orders
  useEffect(() => {

    fetchOrders();

    // return () => clearInterval(interval);

  }, [fetchOrders]);

  return (
    <Animated.View style={[styles.page, tabSwipe.animatedStyle]} {...tabSwipe.panHandlers}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.headerRow}>
          <Text style={styles.title}>Nearby Orders</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/accepted-orders")}
            style={({ pressed }) => [styles.myOrdersButton, pressed && styles.myOrdersButtonPressed]}
          >
            <Text style={styles.myOrdersButtonText}>My Orders</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>
          Pick your next delivery based on value and distance.
        </Text>

        {loading && <Text>Loading nearby orders...</Text>}

        {!loading && orders.length === 0 && (
          <Text>No nearby orders available</Text>
        )}

        {orders.map((order) => (
          <Pressable
            key={order.id}
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: "/order-details",
                params: {
                  id: String(order.id),
                  budget: String(order.budget),
                  urgency: order.urgency,
                  distance: String(order.distance),
                  items_text: order.items_text,
                },
              })
            }
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >

            <View style={styles.cardTop}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.priority}>{order.urgency}</Text>
            </View>

            <View style={styles.metrics}>

              <View>
                <Text style={styles.metricLabel}>Budget</Text>
                <Text style={styles.metricValue}>{"\u20B9"}{order.budget}</Text>
              </View>

              <View>
                <Text style={styles.metricLabel}>Distance</Text>
                <Text style={styles.metricValue}>{order.distance} km</Text>
              </View>

            </View>

          </Pressable>
        ))}

      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    padding: 20,
    backgroundColor: Colors.light.background,
    minHeight: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.light.text,
    flexShrink: 1,
  },
  myOrdersButton: {
    backgroundColor: Colors.light.strongBg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  myOrdersButtonPressed: {
    opacity: 0.85,
  },
  myOrdersButtonText: {
    color: Colors.light.strongText,
    fontWeight: "700",
    fontSize: 12,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: Colors.light.mutedText,
    fontSize: 15,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  priority: {
    backgroundColor: Colors.light.surfaceAlt,
    color: Colors.light.strongBg,
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  metricLabel: {
    color: Colors.light.mutedText,
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: "700",
  },
});
