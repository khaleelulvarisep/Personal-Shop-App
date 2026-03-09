import { View, Text, Pressable, StyleSheet } from "react-native";

const items = [
  { name: "Rice", qty: "2 kg" },
  { name: "Milk", qty: "3 packs" },
  { name: "Eggs", qty: "12 pcs" },
];

export default function OrderDetails() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <Text style={styles.subtitle}>Check list, budget, and delivery notes before starting.</Text>

      <View style={styles.summaryRow}>
        <View style={styles.pill}>
          <Text style={styles.pillLabel}>Order</Text>
          <Text style={styles.pillValue}>#101</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillLabel}>Budget</Text>
          <Text style={styles.pillValue}>{"\u20B9"}500</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Items</Text>
        {items.map((item) => (
          <View key={item.name} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>{item.qty}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => {}}>
          <Text style={styles.primaryButtonText}>Start Shopping</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => {}}>
          <Text style={styles.secondaryButtonText}>Skip Order</Text>
        </Pressable>
      </View>
    </View>
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
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  pill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
  },
  pillLabel: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 4,
  },
  pillValue: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  itemName: {
    color: "#1E293B",
    fontSize: 15,
    fontWeight: "600",
  },
  itemQty: {
    color: "#64748B",
    fontSize: 14,
  },
  actions: {
    marginTop: "auto",
    paddingBottom: 30,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#0EA5E9",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
  },
});
