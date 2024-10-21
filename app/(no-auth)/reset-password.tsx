// import { useLocalSearchParams } from "expo-router";
import { typography } from "@/theme/typography";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { colors } from "@/theme/colors";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { FullScreenLoading, IndicatorModal, NoAuthInput } from "../_components";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useState } from "react";

const formSchema = z
  .object({
    //   email: z
    //     .string({ required_error: "Alamat email Harus Diisi" })
    //     .email({ message: "Format email harus benar." }),
    password: z.string({ required_error: "Kata sandi harus diisi." }),
    confirmPassword: z.string({
      required_error: "Konfirmasi kata sandi harus diisi.",
    }),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Kata sandi harus sama",
        code: "custom",
      });
    }
  });

type resetPasswordSchema = z.infer<typeof formSchema>;

const initialValues: resetPasswordSchema = {
  //   email: "",
  password: "",
  confirmPassword: "",
};

export default function ResetPassword() {
  const { email } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [operationSuccess, setOperationSuccess] = useState<boolean>(false); // Change this to simulate success or fail

  const onSubmit = async (values: resetPasswordSchema) => {
    setIsLoading(true);
    const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

    try {
      const requestBody = {
        email: email,
        newPassword: values.confirmPassword,
      };

      await axios.post(`${baseUrl}/api/user/reset-password`, requestBody);
      setModalVisible(true);
      setOperationSuccess(true);
    } catch (err: any) {
      setModalVisible(true);
      setOperationSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModal = () => {
    if (operationSuccess === true) {
      setModalVisible(false);
      router.push("/login");
    } else {
      setModalVisible(false);
    }
  };

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    values,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(formSchema),
    onSubmit,
  });

  return (
    <>
      <View
        style={[
          styles.mainContainer,
          {
            paddingHorizontal: 20,
          },
        ]}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginBottom: 20,
            rowGap: 10,
          }}
        >
          <Text style={[typography.title2Bold]}>Reset Password </Text>
          <Text style={[typography.subhead]}>
            Buat kata sandi baru dengan min. 8 karakter, terdapat huruf besar
            dan kecil, serta karakter unik atau numerikal.
          </Text>
        </View>

        <NoAuthInput
          type="password"
          placeholder="Buat Kata Sandi Baru"
          onChangeText={handleChange("password")}
          onBlur={handleBlur("password")}
          value={values.password}
          error={errors.password}
          touched={touched.password}
          placeholderTextColor={colors.brand.light}
        />

        <NoAuthInput
          type="password"
          placeholder="Konfirmasi Kata Sandi"
          onChangeText={handleChange("confirmPassword")}
          onBlur={handleBlur("confirmPassword")}
          value={values.confirmPassword}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
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
            onPress={() => handleSubmit()}
          >
            <Text style={styles.buttonText}>Buat Kata Sandi</Text>
          </TouchableOpacity>
        </View>

        <IndicatorModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          imageUrl={operationSuccess ? "email-verified" : "password-not-same"}
          title={
            operationSuccess ? "Reset Password Berhasil!" : "Terjadi Kesalahan"
          }
          description={
            operationSuccess
              ? "Silahkan lakukan login kembali dengan kata sandi yang baru untuk mengakses aplikasi"
              : `Silahkan Coba Lagi`
          }
        />
      </View>
      {isLoading && <FullScreenLoading />}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, // Occupy full screen height
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    paddingHorizontal: 20,
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
