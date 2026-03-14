// import * as Location from "expo-location";
// import { connectSocket, sendLocation } from "../services/socket";

// export const startTracking = async (driverId: number) => {

//   connectSocket(driverId);

//   const { status } = await Location.requestForegroundPermissionsAsync();

//   if (status !== "granted") {
//     console.log("Location permission denied");
//     return;
//   }

//   // Get starting location once
//   const start = await Location.getCurrentPositionAsync({});

//   let lat = start.coords.latitude;
//   let lng = start.coords.longitude;

//   const interval = setInterval(() => {

//     // simulate movement
//     lat = lat + 0.0003;
//     lng = lng + 0.0003;

//     console.log("📍 Sending fake location:", lat, lng);

//     sendLocation(lat, lng);

//   }, 3000);

//   return interval;
// };

import * as Location from "expo-location";
import { connectSocket, sendLocation } from "../services/socket";

export const startTracking = async (driverId: number) => {

  connectSocket(driverId);

  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    console.log("Location permission denied");
    return;
  }

  const interval = setInterval(async () => {

    const location = await Location.getCurrentPositionAsync({});

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    console.log("Sending location:", lat, lng);

    sendLocation(lat, lng);

  }, 3000);

  return interval;
};