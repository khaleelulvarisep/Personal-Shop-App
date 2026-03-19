import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { API_BASE_URL } from "@/constants/api";
import * as SecureStore from "expo-secure-store";
import { setTokens } from "@/lib/auth-tokens";
import { Colors } from "@/constants/theme";

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
    await SecureStore.setItemAsync("user_id", String(data.user.id));
    if (access) {

      await setTokens({ access, refresh });
      await SecureStore.setItemAsync("username", username.trim());
      router.replace("/(tabs)/home");

    } else {

      alert(data.error);

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Login</Text>

      <TextInput
        placeholder="Username"
        onChangeText={setUsername}
        placeholderTextColor={Colors.light.mutedText}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        placeholderTextColor={Colors.light.mutedText}
        style={styles.input}
      />

      <Pressable
        onPress={login}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    marginTop: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: Colors.light.strongText,
    fontWeight: "800",
  },
});
