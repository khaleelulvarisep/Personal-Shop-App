let socket: WebSocket | null = null;

export const connectSocket = (orderId: number) => {

  socket = new WebSocket(`ws://192.168.220.115:8000/ws/order/${orderId}/`);

  socket.onopen = () => {
    console.log("Connected to server");
  };

  socket.onerror = (e) => {
    console.log("Socket error", e);
  };
};

export const sendLocation = (lat: number, lng: number) => {

  if (socket && socket.readyState === WebSocket.OPEN) {

    socket.send(
      JSON.stringify({
        latitude: lat,
        longitude: lng
      })
    );

  }

};

export const closeSocket = () => {
  socket?.close();
};