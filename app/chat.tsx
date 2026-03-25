// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Stack, useLocalSearchParams, router } from "expo-router";
// import { API_BASE_URL } from "@/constants/api";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform
// } from "react-native";

// type Message = {
//   message: string;
//   user_id: number;
// };

// function getWsBaseUrl(apiBaseUrl: string) {
//   try {
//     const url = new URL(apiBaseUrl);
//     const protocol = url.protocol === "https:" ? "wss:" : "ws:";
//     return `${protocol}//${url.host}`;
//   } catch {
//     const trimmed = apiBaseUrl.replace(/\/+$/, "");
//     const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
//     return `ws://${withoutProtocol}`;
//   }
// }

// const fetchMessages = async () => {
//   try {
//     const res = await fetch(`${API_BASE_URL}/api/orders/chat/${orderId}/`);

//     const data = await res.json();

//     console.log("OLD MESSAGES:", data);

//     setMessages(data); // 🔥 important

//   } catch (error) {
//     console.log("❌ Error fetching messages:", error);
//   }
// };

// export default function ChatScreen() {
//   const { orderId: orderIdParam, userId: userIdParam } = useLocalSearchParams<{
//     orderId?: string | string[];
//     userId?: string | string[];
//   }>();

//   const orderId = useMemo(() => {
//     const raw = Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam;
//     const parsed = Number(raw);
//     return Number.isFinite(parsed) ? parsed : null;
//   }, [orderIdParam]);

//   const userId = useMemo(() => {
//     const raw = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
//     const parsed = Number(raw);
//     return Number.isFinite(parsed) ? parsed : null;
//   }, [userIdParam]);

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>("");

//   const socketRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//   if (!orderId) return;

//   // ✅ 1. Load old messages
//   fetchMessages();

//   // ✅ 2. Then connect websocket
//   const wsBaseUrl = getWsBaseUrl(API_BASE_URL);
//   const ws = new WebSocket(`${wsBaseUrl}/ws/chat/${orderId}/`);
//   socketRef.current = ws;

//   ws.onopen = () => {
//     console.log("Connected to chat socket");
//   };

//   ws.onmessage = (event: WebSocketMessageEvent) => {
//     const data: Message = JSON.parse(event.data);

//     setMessages((prev) => [...prev, data]); // append new message
//   };

//   ws.onerror = (error) => {
//     console.log("WebSocket error:", error);
//   };

//   ws.onclose = () => {
//     console.log("WebSocket closed");
//   };

//   return () => {
//     ws.close();
//   };
// }, [orderId]);

//   const sendMessage = () => {
//     if (!input.trim() || !socketRef.current) return;

//     socketRef.current.send(
//       JSON.stringify({
//         message: input,
//         user_id: userId
//       })
//     );

//     setInput("");
//   };

//   const renderItem = ({ item }: { item: Message }) => (
//     <View
//       style={[
//         styles.message,
//         userId != null && item.user_id === userId ? styles.myMsg : styles.otherMsg,
//       ]}
//     >
//       <Text>{item.message}</Text>
//     </View>
//   );

//   if (orderId == null || userId == null) {
//     return (
//       <View style={styles.container}>
//         <Stack.Screen options={{ title: "Chat" }} />
//         <View style={styles.missingWrap}>
//           <Text style={styles.missingTitle}>Missing chat details</Text>
//           <Text style={styles.missingText}>Go back and open chat from an accepted order.</Text>
//           <TouchableOpacity onPress={() => router.back()} style={styles.missingButton}>
//             <Text style={styles.missingButtonText}>Go Back</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <Stack.Screen options={{ title: `Chat • Order #${orderId}` }} />

//       <FlatList
//   data={messages}
//   renderItem={renderItem}
//   keyExtractor={(_, index) => index.toString()}
//   contentContainerStyle={{ paddingBottom: 10 }}
//   onContentSizeChange={() => {
//     // auto scroll
//   }}
// />

//       <View style={styles.inputContainer}>
//         <TextInput
//           value={input}
//           onChangeText={setInput}
//           placeholder="Type a message..."
//           style={styles.input}
//         />

//         <TouchableOpacity onPress={sendMessage}>
//           <Text style={styles.send}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#fff",
//   },

//   message: {
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 10,
//     maxWidth: "70%",
//   },

//   myMsg: {
//     alignSelf: "flex-end",
//     backgroundColor: "#DCF8C6",
//   },

//   otherMsg: {
//     alignSelf: "flex-start",
//     backgroundColor: "#EEE",
//   },

//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderTopWidth: 1,
//     borderColor: "#ddd",
//     paddingTop: 5,
//   },

//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 10,
//   },

//   send: {
//     marginLeft: 10,
//     color: "blue",
//     fontWeight: "bold",
//   },

//   missingWrap: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   missingTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 8,
//   },
//   missingText: {
//     color: "#555",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   missingButton: {
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: "#111827",
//   },
//   missingButtonText: {
//     color: "#fff",
//     fontWeight: "700",
//   },
// });

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "@/constants/api";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";

type Message = {
  id?: number;
  message: string;
  user_id: number;
  username?: string;
  timestamp?: string;
};

function getWsBaseUrl(apiBaseUrl: string) {
  try {
    const url = new URL(apiBaseUrl);
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${url.host}`;
  } catch {
    const trimmed = apiBaseUrl.replace(/\/+$/, "");
    const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
    return `ws://${withoutProtocol}`;
  }
}

export default function ChatScreen() {
  const { orderId: orderIdParam, userId: userIdParam } = useLocalSearchParams<{
    orderId?: string | string[];
    userId?: string | string[];
  }>();

  const orderId = useMemo(() => {
    const raw = Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }, [orderIdParam]);

  const userId = useMemo(() => {
    const raw = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }, [userIdParam]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const socketRef = useRef<WebSocket | null>(null);

  // ✅ FETCH OLD MESSAGES (WITH TOKEN)
  const fetchMessages = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");

      console.log("🔐 TOKEN:", token);

      if (!token) {
        console.log("❌ No token found");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/orders/chat/${orderId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

   

      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.log("❌ Unexpected API format:", data);
        setMessages([]);
      }

    } catch (error) {
      console.log("❌ Error fetching messages:", error);
      setMessages([]);
    }
  };

  // ✅ SOCKET + LOAD DATA
  useEffect(() => {
    if (!orderId) return;

    fetchMessages(); // 🔥 load old messages

    const wsBaseUrl = getWsBaseUrl(API_BASE_URL);
    const ws = new WebSocket(`${wsBaseUrl}/ws/chat/${orderId}/`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to chat socket");
    };

    ws.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);

      setMessages((prev) => [...prev, data]);
    };

    ws.onerror = (error) => {
      console.log("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("⚠️ WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [orderId]);

  // ✅ SEND MESSAGE
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        message: input,
        user_id: userId
      })
    );

    setInput("");
  };

  // ✅ RENDER MESSAGE
  const renderItem = ({ item }: { item: Message }) => {
    const isMine = userId != null && item.user_id === userId;

    return (
      <View
        style={[
          styles.message,
          isMine ? styles.myMsg : styles.otherMsg,
        ]}
      >
        <Text>{item.message}</Text>
      </View>
    );
  };

  // ❌ INVALID PARAMS
  if (orderId == null || userId == null) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Chat" }} />
        <View style={styles.missingWrap}>
          <Text style={styles.missingTitle}>Missing chat details</Text>
          <Text style={styles.missingText}>
            Go back and open chat from an accepted order.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.missingButton}
          >
            <Text style={styles.missingButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ title: `Chat • Order #${orderId}` }} />

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={styles.input}
        />

        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.send}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },

  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "70%",
  },

  myMsg: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },

  otherMsg: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 5,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },

  send: {
    marginLeft: 10,
    color: "blue",
    fontWeight: "bold",
  },

  missingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  missingTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  missingText: {
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
  },

  missingButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#111827",
  },

  missingButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});