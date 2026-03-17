

import { View, Text, Pressable, StyleSheet, ScrollView, Animated } from "react-native";
import { router } from "expo-router";
import { useTabSwipe } from "@/hooks/use-tab-swipe";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { API_BASE_URL } from "@/constants/api";

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
  const getLocation = async () => {

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
  };

  // Fetch nearby orders
  const fetchOrders = async () => {

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
  };

  // Load orders
  useEffect(() => {

    fetchOrders();

    // const interval = setInterval(() => {
      fetchOrders();
    // }, 5000); // auto refresh every 5 seconds

    // return () => clearInterval(interval);

  }, []);

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
    backgroundColor: "#F8FAFC",
  },
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC",
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
    color: "#0F172A",
    flexShrink: 1,
  },
  myOrdersButton: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  myOrdersButtonPressed: {
    opacity: 0.85,
  },
  myOrdersButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: "#475569",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    color: "#0F172A",
  },
  priority: {
    backgroundColor: "#ECFEFF",
    color: "#0E7490",
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
    color: "#64748B",
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
  },
});
