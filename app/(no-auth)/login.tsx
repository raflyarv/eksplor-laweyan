import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { spacing } from "@/theme/spacing";

import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useFormik } from "formik";
import { typography } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { NoAuthInput, ValidationModal } from "../_components";
import { router } from "expo-router";

// Define a Zod schema
const formSchema = z.object({
  username: z.string({ required_error: "Username harus diisi." }),
  password: z.string({ required_error: "Kata sandi tidak boleh kosong." }),
});

// Adapt the Zod schema for Formik
type loginFormSchema = z.infer<typeof formSchema>;

const initialValues: loginFormSchema = {
  username: "",
  password: "",
};

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const [modalMessage, setModalMessage] = useState("");

  const onSubmit = (values: loginFormSchema) => {
    if (values.username !== "raflyarv") {
      setModalVisible(true);
      setModalMessage(
        "Silahkan coba lagi menggunakan username dan kata sandi yang sudah dibuat"
      );
      setModalTitle("Username/kata sandi salah!");
    } else {
      console.log(values);
    }
  };

  const { handleChange, handleBlur, handleSubmit, errors, touched, values } =
    useFormik({
      initialValues,
      validationSchema: toFormikValidationSchema(formSchema),
      onSubmit,
    });

  return (
    <View style={styles.container}>
      <Text
        style={[
          typography.largeTitleBold,
          {
            marginBottom: spacing.medium,
            alignSelf: "flex-start",
          },
        ]}
      >
        Masuk{" "}
      </Text>

      <NoAuthInput
        type="text"
        placeholder="Masukkan Username Anda"
        onChangeText={handleChange("username")}
        onBlur={handleBlur("username")}
        value={values.username}
        error={errors.username}
        touched={touched.username}
        placeholderTextColor={colors.brand.light}
      />

      <NoAuthInput
        type="password"
        placeholder="Masukkan Kata Sandi Anda"
        onChangeText={handleChange("password")}
        onBlur={handleBlur("password")}
        value={values.password}
        error={errors.password}
        touched={touched.password}
        placeholderTextColor={colors.brand.light}
      />

      <View
        style={{
          width: "100%",
          marginBottom: 8,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          <Text
            style={[
              typography.footnote,
              {
                color: colors.brand.main,
                fontWeight: 500,
              },
            ]}
          >
            Lupa Kata Sandi?
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          width: "100%",
          marginBottom: 15,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Text style={[typography.footnote, { fontWeight: 500 }]}>
          {" "}
          Belum memiliki akun?{" "}
        </Text>
        <Pressable
          style={{
            margin: 0,
            padding: 0,
          }}
          onPress={() => router.push("/(no-auth)/register")}
        >
          <Text
            style={[
              typography.footnote,
              {
                textDecorationLine: "underline",
                color: colors.brand.main,
                fontWeight: 500,
              },
            ]}
          >
            Registrasi di sini
          </Text>
        </Pressable>
      </View>

      {/* Submit Button */}
      <View
        style={{
          alignSelf: "flex-end",
        }}
      >
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <ValidationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          title={modalTitle}
          buttonMessage="Tutup"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Occupy full screen height
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    backgroundColor: "#f0f0f0", // Optional: Background color for better visuals
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: colors.brand.main,
  },
  button: {
    backgroundColor: colors.brand.main,
    paddingHorizontal: 20, // Horizontal padding (left-right)
    paddingVertical: 10, // Vertical padding (top-bottom)
    alignSelf: "flex-start", // Ensure button's width is min-content
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
