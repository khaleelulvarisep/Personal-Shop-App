import { View, Text, StyleSheet, Animated } from "react-native";
import { useTabSwipe } from "@/hooks/use-tab-swipe";
import { Colors } from "@/constants/theme";

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
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingTop: 28,
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
  mainCard: {
    backgroundColor: Colors.light.strongBg,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },
  mainLabel: {
    color: Colors.light.strongText,
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
  },
  mainValue: {
    color: Colors.light.strongText,
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
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    padding: 14,
  },
  smallLabel: {
    color: Colors.light.mutedText,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  smallValue: {
    color: Colors.light.text,
    fontSize: 24,
    fontWeight: "700",
  },
  goalCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 14,
  },
  progressTrack: {
    height: 10,
    backgroundColor: Colors.light.border,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    width: "75%",
    height: "100%",
    backgroundColor: Colors.light.tint,
    borderRadius: 999,
  },
  goalText: {
    marginTop: 8,
    color: Colors.light.mutedText,
    fontSize: 13,
    fontWeight: "600",
  },
});
