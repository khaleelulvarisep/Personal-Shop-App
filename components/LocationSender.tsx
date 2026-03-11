import { useEffect } from "react";
import * as Location from "expo-location";
import { connectSocket, sendLocation, closeSocket } from "../services/socket";
type Props = {
  orderId: number;
};
export default function LocationSender({orderId}:Props) {

  useEffect(() => {

    connectSocket(orderId);

    startTracking();

    return () => closeSocket();

  }, []);

  const startTracking = async () => {

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Permission denied");
      return;
    }

    setInterval(async () => {

      const location = await Location.getCurrentPositionAsync({});

      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      console.log("Sending:", lat, lng);

      sendLocation(lat, lng);

    }, 3000);

  };

  return null;
}