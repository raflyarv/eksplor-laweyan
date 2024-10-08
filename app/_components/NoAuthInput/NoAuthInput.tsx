import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";

interface NoAuthInputProps {
  inputMode?: string;
  type: "text" | "password";
  placeholder: string;
  onChangeText: (text: string) => void | undefined;
  onBlur: (e: any) => void;
  value: string;
  error?: string;
  touched?: boolean;
  placeholderTextColor?: string;
}

export default function NoAuthInput({
  inputMode,
  type,
  placeholder,
  onChangeText,
  onBlur,
  value,
  error,
  touched,
  placeholderTextColor,
}: NoAuthInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      {type === "password" ? (
        <View style={styles.container}>
          <View
            style={[
              styles.input,
              {
                borderColor: error && touched ? "red" : colors.brand.main,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color={placeholderTextColor || "gray"}
              style={styles.icon}
            />
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor || "gray"}
              onChangeText={onChangeText}
              onBlur={onBlur}
              value={value}
              secureTextEntry={!passwordVisible}
              style={styles.textInput}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.iconButton}
            >
              <Ionicons
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={placeholderTextColor || "gray"}
              />
            </TouchableOpacity>
          </View>
          {touched && error && (
            <Text style={[typography.footnote, styles.errorText]}>{error}</Text>
          )}
        </View>
      ) : (
        <View style={styles.container}>
          <View
            style={[
              styles.input,
              {
                borderColor: error && touched ? "red" : colors.brand.main,
              },
            ]}
          >
            <MaterialIcons
              name={
                inputMode === "fullName"
                  ? "assignment-ind"
                  : inputMode === "email"
                  ? "email"
                  : "alternate-email"
              }
              size={24}
              color={colors.brand.light}
              style={styles.icon}
            />
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor || "gray"}
              onChangeText={onChangeText}
              onBlur={onBlur}
              value={value}
              style={styles.textInput}
              inputMode={inputMode === "email" ? "email" : "text"}
            />
          </View>
          {touched && error && (
            <Text style={[typography.footnote, styles.errorText]}>{error}</Text>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  input: {
    width: "100%",
    height: 56,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginRight: 10,
  },

  textInput: {
    flex: 1,
  },

  iconButton: {
    padding: 10,
  },

  errorText: {
    color: "red",
    marginTop: 5,
    marginLeft: 15,
    alignSelf: "flex-start",
  },
});
