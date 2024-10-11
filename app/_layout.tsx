import { Stack, useRouter, useSegments, Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { AuthProvider, useAuth } from "./_hooks/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
