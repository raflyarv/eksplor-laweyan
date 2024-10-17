import React, { useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { useFocusEffect, useRouter } from "expo-router";

export default function SearchPage() {
  const inputRef = useRef<TextInput | null>(null);
  const { back, push } = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      // Focus the TextInput when the screen is focused
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [])
  );
  return (
    <SafeAreaView
      style={{
        paddingHorizontal: spacing.medium,
      }}
    >
      <View
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          marginVertical: 30,
          columnGap: 15,
          alignItems: "flex-start",
        }}
      >
        <TouchableOpacity onPress={() => back()}>
          <MaterialIcons
            name="arrow-back"
            size={32}
            color={colors.brand.main}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            ref={inputRef}
            style={[styles.input, typography]}
            placeholder="Pencarian"
            placeholderTextColor={colors.disable}
          />
          <MaterialIcons name="search" size={32} color={colors.brand.main} />
        </View>
        <View
          style={{
            width: 140,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: 5,
            paddingVertical: 8,
            gap: 3,
          }}
        >
          <MaterialIcons name="tune" size={20} color={colors.brand.main} />
          <Text style={[typography.subhead, { color: colors.brand.main }]}>
            {" "}
            Sort/Filter{" "}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: spacing.medium,
    rowGap: 10,
    top: 0,
  },

  searchBar: {
    width: "100%",
    height: 56,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: colors.brand.main,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: spacing.medium,
    backgroundColor: "white",
  },
  input: {
    width: 300,
    height: "100%",
  },
});
