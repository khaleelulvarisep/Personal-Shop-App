import { View, Text, Pressable, StyleSheet, ScrollView, Animated } from "react-native";
import { router } from "expo-router";
import { useTabSwipe } from "@/hooks/use-tab-swipe";
import { useEffect, useState } from "react";

export default function NearbyOrders() {

  const tabSwipe = useTabSwipe({ left: "/(tabs)/earnings", right: "/(tabs)" });
  type Order = {
  id: number
  urgency: string
  budget: number
  distance: string
  items_text: string
}
const [Orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {

      const response = await fetch("http://192.168.220.115:8000/api/orders/orders/");
      const data = await response.json();

      setOrders(data);

    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  return (
    <Animated.View style={[styles.page, tabSwipe.animatedStyle]} {...tabSwipe.panHandlers}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nearby Orders</Text>
        <Text style={styles.subtitle}>
          Pick your next delivery based on value and distance.
        </Text>

        {Orders.map((order) => (
          <View key={order.id} style={styles.card}>

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
                <Text style={styles.metricLabel}>Items</Text>
                <Text style={styles.metricValue}>{order.items_text}</Text>
              </View>
            </View>

            <Pressable
              style={styles.button}
              onPress={() => router.push(`/order-details?id=${order.id}`)}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </Pressable>

          </View>
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
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
  button: {
    backgroundColor: "#0EA5E9",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});