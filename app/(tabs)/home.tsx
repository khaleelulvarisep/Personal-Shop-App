import { View, Text, StyleSheet, Animated } from "react-native";
import { useTabSwipe } from "@/hooks/use-tab-swipe";
import { Colors } from "@/constants/theme";

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
    backgroundColor: Colors.light.background,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: Colors.light.mutedText,
    fontWeight: "700",
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  subtitle: {
    color: Colors.light.mutedText,
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
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  primaryCard: {
    backgroundColor: Colors.light.surfaceAlt,
    borderColor: Colors.light.border,
  },
  cardLabel: {
    fontSize: 13,
    color: Colors.light.mutedText,
    marginBottom: 10,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 28,
    color: Colors.light.text,
    fontWeight: "700",
  },
  primaryValue: {
    fontSize: 34,
    color: Colors.light.strongBg,
    fontWeight: "800",
  },
  highlightCard: {
    marginTop: 12,
    backgroundColor: Colors.light.strongBg,
    borderRadius: 16,
    padding: 18,
  },
  moneyValue: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: "800",
    color: Colors.light.strongText,
  },
});
