import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
// import { createStackNavigator } from "@react-navigation/stack";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import SiteDetails from "./details/[id]";
import SiteReview from "./details/reviews";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: "white",
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="details/[id]"
          options={{
            headerTitle: "Detail Wisata",
          }}
        />

        <Stack.Screen
          name="details/reviews"
          options={{
            headerTitle: "Ulasan",
          }}
        />

        <Stack.Screen
          name="(no-auth)/login"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(no-auth)/register"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(no-auth)/verify-email"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(no-auth)/forgot-password"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(no-auth)/verify-code"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(no-auth)/reset-password"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
