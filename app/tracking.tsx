import { View, Text } from "react-native";
import LocationSender from "../components/LocationSender";

export default function TrackingScreen() {

  const orderId = 53; // dynamic

  return (
    <View>

      <Text>Sending Live Location...</Text>

      <LocationSender orderId={orderId} />

    </View>
  );
}