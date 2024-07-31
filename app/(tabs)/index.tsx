import { View, Text, ScrollView } from "react-native";
import React from "react";

export default function HomeScreen() {
  return (
    <ScrollView
      style={{
        marginHorizontal: 20,
        marginTop: 20,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          paddingBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          Matur Nuwun{" "}
        </Text>
        <Text
          style={{
            fontSize: 32,
            paddingEnd: 100,
          }}
        >
          Mau Ke Mana Hari Ini?{" "}
        </Text>
      </View>

      <ScrollView horizontal={true}>
        <View
          style={{
            width: 180,
            height: 250,
            backgroundColor: "orange",
            marginEnd: 12,
            borderRadius: 10,
          }}
        ></View>

        <View
          style={{
            width: 180,
            height: 250,
            backgroundColor: "orange",
            marginEnd: 12,
            borderRadius: 10,
          }}
        ></View>

        <View
          style={{
            width: 180,
            height: 250,
            backgroundColor: "orange",
            marginEnd: 12,
            borderRadius: 10,
          }}
        ></View>

        <View
          style={{
            width: 180,
            height: 250,
            backgroundColor: "orange",
            marginEnd: 12,
            borderRadius: 10,
          }}
        ></View>
      </ScrollView>
    </ScrollView>
  );
}
