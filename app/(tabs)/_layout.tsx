import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

export default function TabLayout() {
  return (
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
  );
}
