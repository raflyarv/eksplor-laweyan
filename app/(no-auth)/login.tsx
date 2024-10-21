import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { spacing } from "@/theme/spacing";

import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useFormik } from "formik";
import { typography } from "@/theme/typography";
import { colors } from "@/theme/colors";
import {
  FullScreenLoading,
  NoAuthInput,
  ValidationModal,
} from "../_components";
import { router } from "expo-router";
import IndicatorModal from "../_components/IndicatorModal/IndicatorModal";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../_hooks/context/AuthContext";

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
  const { isAuthenticated, setIsAuthenticated, userData } = useAuth(); // Get the isAuthenticated status

  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [operationSuccess, setOperationSuccess] = useState<boolean>(false); // Change this to simulate success or failure

  const onSubmit = async (values: loginFormSchema) => {
    setIsLoading(true);
    const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
    try {
      const response = await axios.post(`${baseUrl}/auth/user/login`, values);

      await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
      setIsAuthenticated(true);

      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (isAuthenticated && refreshToken) {
        router.push("/(tabs)");
      }
    } catch (err: any) {
      console.log(err);
      setModalVisible(true);
      setOperationSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const redirect = async () => {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (isAuthenticated && refreshToken) {
        router.push("/(tabs)");
      }
    };

    redirect();
  }, [isAuthenticated]);

  const toggleModal = () => {
    if (operationSuccess === true) {
      setModalVisible(false);
      router.push("/(tabs)");
    } else {
      setModalVisible(false);
    }
  };

  const { handleChange, handleBlur, handleSubmit, errors, touched, values } =
    useFormik({
      initialValues,
      validationSchema: toFormikValidationSchema(formSchema),
      onSubmit,
    });

  return (
    <>
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
            onPress={() => router.push("/forgot-password")}
          >
            <Text
              style={[
                typography.subhead,
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
          <Text style={[typography.subhead, { fontWeight: 500 }]}>
            {" "}
            Belum memiliki akun?{" "}
          </Text>
          <Pressable
            style={{
              margin: 0,
              padding: 0,
            }}
            onPress={() => router.push("/register")}
          >
            <Text
              style={[
                typography.subhead,
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.buttonText}>Masuk</Text>
          </TouchableOpacity>
        </View>

        <IndicatorModal
          isVisible={operationSuccess ? false : isModalVisible}
          onClose={toggleModal}
          imageUrl={operationSuccess ? "" : "password-not-same"}
          title={
            operationSuccess
              ? "Email Telah Terverifikasi!"
              : "Username/password salah!"
          }
          description={
            operationSuccess
              ? "Silahkan lakukan login kembali untuk mengakses aplikasi"
              : "Silahkan coba lagi atau melakukan lupa kata sandi."
          }
        />
      </View>
      {isLoading && <FullScreenLoading />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Occupy full screen height
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    backgroundColor: "white", // Optional: Background color for better visuals
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
    ...typography.callout,
    fontWeight: "bold",
  },
});
