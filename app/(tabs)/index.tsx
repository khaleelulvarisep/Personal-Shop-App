import { View, Text, StyleSheet, Animated } from "react-native";
import { useTabSwipe } from "@/hooks/use-tab-swipe";

export default function Home() {
  const tabSwipe = useTabSwipe({ left: "/(tabs)/nearby-orders" });

  return (
    <Animated.View style={[styles.container, tabSwipe.animatedStyle]} {...tabSwipe.panHandlers}>
      <Text style={styles.eyebrow}>TODAY</Text>
      <Text style={styles.title}>Delivery Dashboard</Text>
      <Text style={styles.subtitle}>Track your orders and performance at a glance.</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.card, styles.primaryCard]}>
          <Text style={styles.cardLabel}>Active Orders</Text>
          <Text style={styles.primaryValue}>2</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Completed</Text>
          <Text style={styles.cardValue}>15</Text>
        </View>
      </View>

      <View style={styles.highlightCard}>
        <Text style={styles.cardLabel}>Earnings Today</Text>
        <Text style={styles.moneyValue}>{"\u20B9"}500</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    backgroundColor: "#F8FAFC",
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: "#64748B",
    fontWeight: "700",
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F172A",
  },
  subtitle: {
    color: "#475569",
    marginTop: 8,
    marginBottom: 22,
    fontSize: 15,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  primaryCard: {
    backgroundColor: "#ECFEFF",
    borderColor: "#A5F3FC",
  },
  cardLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 28,
    color: "#0F172A",
    fontWeight: "700",
  },
  primaryValue: {
    fontSize: 34,
    color: "#0E7490",
    fontWeight: "800",
  },
  highlightCard: {
    marginTop: 12,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 18,
  },
  moneyValue: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: "800",
    color: "#F8FAFC",
  },
});
