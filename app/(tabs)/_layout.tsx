import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { useAuth } from "../_hooks/context/AuthContext";
import { UserLocationProvider } from "../_hooks/context/UserLocationContext";

export default function TabLayout() {
  const { isAuthenticated } = useAuth(); // Get the isAuthenticated status
  const router = useRouter(); // Get router for navigation

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <UserLocationProvider>
      <Tabs
        screenOptions={{
          title: "",
          tabBarActiveTintColor: colors.brand.main,
          headerShown: false,
          tabBarStyle: { height: 72, paddingBottom: 0 },
          tabBarItemStyle: { width: 50 },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={34} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Explore"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={34} name="explore" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Bookmark"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={34} name="bookmark" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={34} name="account-circle" color={color} />
            ),
          }}
        />
      </Tabs>
    </UserLocationProvider>
  );
}
