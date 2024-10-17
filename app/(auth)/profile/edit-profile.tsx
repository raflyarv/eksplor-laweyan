import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { useFormik } from "formik";
import {
  ConfirmationModal,
  FullScreenLoading,
  NoAuthInput,
} from "@/app/_components";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { router } from "expo-router";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/app/_hooks/context/AuthContext";

const formSchema = z
  .object({
    username: z.string({ required_error: "Username Harus Diisi" }),
    email: z
      .string({ required_error: "Alamat email Harus Diisi" })
      .email({ message: "Format email harus benar." }),
    fullName: z.string({ required_error: "Nama Lengkap Harus Diisi" }),
    oldPassword: z
      .string({
        required_error: "Kata sandi yang lama harus diisi.",
      })
      .optional(), // Allow this field to be optional initially
    newPassword: z
      .string({ required_error: "Kata sandi baru harus diisi." })
      .optional(), // Allow this field to be optional initially
    confirmNewPassword: z
      .string({
        required_error: "Konfirmasi kata sandi yang baru harus diisi.",
      })
      .optional(), // Allow this field to be optional initially
  })
  .superRefine((values, ctx) => {
    const { oldPassword, newPassword, confirmNewPassword } = values;

    // Check if at least one password field is filled
    const isAnyPasswordFilled = [
      oldPassword,
      newPassword,
      confirmNewPassword,
    ].some((field) => field);

    // If any password field is filled, ensure all are filled
    if (isAnyPasswordFilled) {
      if (!oldPassword) {
        ctx.addIssue({
          path: ["oldPassword"],
          message: "Kata sandi yang lama harus diisi jika mengubah kata sandi.",
          code: "custom",
        });
      }
      if (!newPassword) {
        ctx.addIssue({
          path: ["newPassword"],
          message: "Kata sandi baru harus diisi jika mengubah kata sandi.",
          code: "custom",
        });
      }
      if (!confirmNewPassword) {
        ctx.addIssue({
          path: ["confirmNewPassword"],
          message:
            "Konfirmasi kata sandi yang baru harus diisi jika mengubah kata sandi.",
          code: "custom",
        });
      }
    }

    // Ensure new password and confirm new password match
    if (
      newPassword &&
      confirmNewPassword &&
      newPassword !== confirmNewPassword
    ) {
      ctx.addIssue({
        path: ["confirmNewPassword"],
        message: "Kata sandi baru dan konfirmasi kata sandi harus sama.",
        code: "custom",
      });
    }
  });

type editProfileSchema = z.infer<typeof formSchema>;

const initialValues: editProfileSchema = {
  username: "",
  fullName: "",
  newPassword: "",
  confirmNewPassword: "",
  oldPassword: "",
  email: "",
};

export default function EditProfile() {
  const { isAuthenticated, setIsAuthenticated, userData, refetchUserData } =
    useAuth(); // Get the isAuthenticated status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false); // New state to track refresh

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => !prev); // Toggle refresh trigger to cause useEffect to re-run
  };

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  // Fetch existing user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await axios.get(`${baseUrl}/api/user/user`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`, // Use the refresh token as Bearer token
          },
        }); // Update with your endpoint
        const userData = response.data;

        // Populate the form with existing user data
        formik.setFieldValue("username", userData.username);
        formik.setFieldValue("fullName", userData.fullName);
        formik.setFieldValue("email", userData.email);
        // You can decide whether to populate oldPassword based on your requirements
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [refreshTrigger]);

  const onSubmit = (values: editProfileSchema) => {
    setFormData(values);
    setModalVisible(true);
  };

  const handleAPIEditUser = async (data: any) => {
    setIsLoading(true);
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("username", data.username);
      formData.append("fullName", data.fullName);
      formData.append("oldPassword", data.oldPassword);
      formData.append("newPassword", data.confirmNewPassword);

      const refreshToken = await AsyncStorage.getItem("refreshToken");

      const response = await axios.put(`${baseUrl}/api/user/edit`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", // Important: Set the correct content type
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      handleRefresh();
      refetchUserData();
      setModalVisible(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(formSchema),
    onSubmit,
  });

  return (
    <>
      {isLoading && <FullScreenLoading />}

      <SafeAreaView
        style={{
          paddingHorizontal: spacing.medium,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Loading Indicator */}

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
          <TouchableOpacity onPress={() => router.push("/Profile")}>
            <MaterialIcons
              name="arrow-back"
              size={32}
              color={colors.brand.main}
            />
          </TouchableOpacity>
          <Text
            style={[
              typography.title2Bold,
              {
                marginBottom: spacing.medium,
              },
            ]}
          >
            Edit Profil{" "}
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <Text
            style={[
              typography.title3Bold,
              {
                alignSelf: "flex-start",
                marginBottom: 15,
                color: colors.brand.light,
              },
            ]}
          >
            {" "}
            Informasi Akun Anda{" "}
          </Text>
          <NoAuthInput
            type="text"
            placeholder="Buat Username Anda"
            onChangeText={formik.handleChange("username")}
            onBlur={formik.handleBlur("username")}
            value={formik.values.username}
            error={formik.errors.username}
            touched={formik.touched.username}
            placeholderTextColor={colors.brand.light}
            inputMode="username"
          />

          <NoAuthInput
            type="text"
            placeholder="Masukkan Nama Lengkap Anda"
            onChangeText={formik.handleChange("fullName")}
            onBlur={formik.handleBlur("fullName")}
            value={formik.values.fullName}
            error={formik.errors.fullName}
            touched={formik.touched.fullName}
            placeholderTextColor={colors.brand.light}
            inputMode="fullName"
          />

          <NoAuthInput
            type="text"
            placeholder="Masukkan Alamat Email Anda"
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            value={formik.values.email}
            error={formik.errors.email}
            touched={formik.touched.email}
            placeholderTextColor={colors.brand.light}
            inputMode="email"
          />

          <Pressable
            style={{
              margin: 0,
              paddingHorizontal: 10,
              alignSelf: "flex-end",
              marginBottom: 20,
            }}
            onPress={() => router.push("/verify-email")}
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
              Verifikasi Email
            </Text>
          </Pressable>

          <Text
            style={[
              typography.title3Bold,
              {
                alignSelf: "flex-start",
                marginBottom: 15,
                color: colors.brand.light,
              },
            ]}
          >
            {" "}
            Ganti Kata Sandi{" "}
          </Text>

          <NoAuthInput
            type="password"
            placeholder="Kata Sandi Lama"
            onChangeText={formik.handleChange("oldPassword")}
            onBlur={formik.handleBlur("oldPassword")}
            value={formik.values.oldPassword || ""}
            error={formik.errors.oldPassword}
            touched={formik.touched.oldPassword}
            placeholderTextColor={colors.brand.light}
          />

          <NoAuthInput
            type="password"
            placeholder="Buat Kata Sandi"
            onChangeText={formik.handleChange("newPassword")}
            onBlur={formik.handleBlur("newPassword")}
            value={formik.values.newPassword || ""}
            error={formik.errors.newPassword}
            touched={formik.touched.newPassword}
            placeholderTextColor={colors.brand.light}
          />

          <NoAuthInput
            type="password"
            placeholder="Konfirmasi Kata Sandi"
            onChangeText={formik.handleChange("confirmNewPassword")}
            onBlur={formik.handleBlur("confirmNewPassword")}
            value={formik.values.confirmNewPassword || ""}
            error={formik.errors.confirmNewPassword}
            touched={formik.touched.confirmNewPassword}
            placeholderTextColor={colors.brand.light}
          />

          {/* Submit Button */}
          <View
            style={{
              alignSelf: "flex-end",
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => formik.handleSubmit()}
            >
              <Text style={styles.buttonText}>Simpan Perubahan</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ConfirmationModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          imageUrl="edit"
          title="Anda yakin Ingin Mengubah Data ?"
          onCloseAfter={() => handleAPIEditUser(formData)}
          buttonText="Lanjutkan"
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.brand.main,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "flex-start",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
