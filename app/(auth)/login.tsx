import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { API_BASE_URL } from "@/constants/api";
import * as SecureStore from "expo-secure-store";
import { setTokens } from "@/lib/auth-tokens";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    const response = await fetch(
      `${API_BASE_URL}/api/delivery/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    const access = typeof data?.access === "string" ? data.access : typeof data?.token === "string" ? data.token : null;
    const refresh = typeof data?.refresh === "string" ? data.refresh : null;

    if (access) {

      await setTokens({ access, refresh });
      await SecureStore.setItemAsync("username", username.trim());
      router.replace("/(tabs)/home");

    } else {

      alert(data.error);

    }
  };

  return (
    <View style={{ padding: 30 }}>

      <Text style={{ fontSize: 22 }}>Delivery Login</Text>

      <TextInput
        placeholder="Username"
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginTop: 20, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginTop: 20, padding: 10 }}
      />

      <Pressable
        onPress={login}
        style={{ backgroundColor: "#0EA5E9", padding: 15, marginTop: 20 }}
      >
        <Text style={{ color: "white" }}>Login</Text>
      </Pressable>

    </View>
  );
}
