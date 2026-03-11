import { useEffect } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { View, ActivityIndicator } from "react-native";

export default function Index() {

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {

    const token = await SecureStore.getItemAsync("token");

    if (token) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(auth)/login");
    }

  };

  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      <ActivityIndicator size="large" />
    </View>
  );
}