import { View, Text, StyleSheet, Animated } from "react-native";
import { useTabSwipe } from "@/hooks/use-tab-swipe";

export default function Earnings() {
  const tabSwipe = useTabSwipe({ right: "/(tabs)/nearby-orders" });

  return (
    <Animated.View style={[styles.container, tabSwipe.animatedStyle]} {...tabSwipe.panHandlers}>
      <Text style={styles.title}>Earnings</Text>
      <Text style={styles.subtitle}>Your delivery performance this week.</Text>

      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>Total Earnings</Text>
        <Text style={styles.mainValue}>{"\u20B9"}4,500</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text style={styles.smallLabel}>Deliveries</Text>
          <Text style={styles.smallValue}>25</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.smallLabel}>This Week</Text>
          <Text style={styles.smallValue}>{"\u20B9"}1,200</Text>
        </View>
      </View>

      <View style={styles.goalCard}>
        <Text style={styles.smallLabel}>Weekly Goal</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.goalText}>75% complete</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 28,
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
  mainCard: {
    backgroundColor: "#0F172A",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },
  mainLabel: {
    color: "#CBD5E1",
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
  },
  mainValue: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
  },
  smallLabel: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  smallValue: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "700",
  },
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    width: "75%",
    height: "100%",
    backgroundColor: "#0EA5E9",
    borderRadius: 999,
  },
  goalText: {
    marginTop: 8,
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },
});
