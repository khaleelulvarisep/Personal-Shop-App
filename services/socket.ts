

// let socket: WebSocket | null = null;
// let currentOrderId: number | null = null;

// export const connectSocket = (orderId: number) => {

//   currentOrderId = orderId;

//   // socket = new WebSocket(`ws://192.168.220.115:8001/ws/order/${orderId}/`);
//   socket = new WebSocket(`ws://192.168.0.190:8001/ws/order/${orderId}/`);

//   socket.onopen = () => {
//     console.log("✅ WebSocket connected");
//   };

//   socket.onmessage = (event) => {
//     console.log("📩 Message from server:", event.data);
//   };

//   socket.onerror = (error) => {
//     console.log("❌ WebSocket error:", error);
//   };

//   socket.onclose = () => {
//     console.log("⚠️ WebSocket disconnected");

//     // Auto reconnect after 3 seconds
//     setTimeout(() => {
//       if (currentOrderId) {
//         console.log("🔄 Reconnecting...");
//         connectSocket(currentOrderId);
//       }
//     }, 3000);
//   };
// };


// export const sendLocation = (lat: number, lng: number) => {

//   if (!socket) {
//     console.log("⚠️ Socket not initialized");
//     return;
//   }

//   if (socket.readyState !== WebSocket.OPEN) {
//     console.log("⚠️ Socket not connected yet");
//     return;
//   }

//   const locationData = {
//     latitude: lat,
//     longitude: lng
//   };

//   console.log("📍 Sending location:", locationData);

//   socket.send(JSON.stringify(locationData));
// };


// export const closeSocket = () => {

//   if (socket) {
//     console.log("🔌 Closing WebSocket");
//     socket.close();
//     socket = null;
//   }

// };






let socket: WebSocket | null = null;
let currentDriverId: number | null = null;

export const connectSocket = (driverId: number) => {

  currentDriverId = driverId;

  socket = new WebSocket(`ws://192.168.220.115:8001/ws/driver/${driverId}/`);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("📩 Message from server:", event.data);
  };

  socket.onerror = (error) => {
    console.log("❌ WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("⚠️ WebSocket disconnected");

    // auto reconnect
    setTimeout(() => {

      if (currentDriverId) {

        console.log("🔄 Reconnecting WebSocket...");
        connectSocket(currentDriverId);

      }

    }, 3000);
  };
};


export const sendLocation = (lat: number, lng: number) => {

  if (!socket) {
    console.log("⚠️ Socket not initialized");
    return;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    console.log("⚠️ Socket not connected yet");
    return;
  }

  const locationData = {
    latitude: lat,
    longitude: lng
  };

  console.log("📍 Sending location:", locationData);

  socket.send(JSON.stringify(locationData));
};


export const closeSocket = () => {

  if (socket) {

    console.log("🔌 Closing WebSocket");

    socket.close();
    socket = null;
    currentDriverId = null;

  }

};