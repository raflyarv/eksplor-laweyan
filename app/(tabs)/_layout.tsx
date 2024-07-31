import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerShown: false,
        tabBarStyle: { height: 73, paddingBottom: 12 },
        tabBarItemStyle: { width: 50 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          title: "Jelajah",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="compass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Bookmark"
        options={{
          title: "Simpan",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bookmark" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
