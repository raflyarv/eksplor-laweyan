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
import { FullScreenLoading, NoAuthInput } from "../_components";
import { router } from "expo-router";
import { useState } from "react";
import axios from "axios";
import { IndicatorModal } from "../_components";

const formSchema = z.object({
  email: z
    .string({ required_error: "Alamat email Harus Diisi" })
    .email({ message: "Format email harus benar." }),
});

type forgotPassSchema = z.infer<typeof formSchema>;

const initialValues: forgotPassSchema = {
  email: "",
};

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [operationSuccess, setOperationSuccess] = useState<boolean>(false); // Change this to simulate success or failure

  const onSubmit = async (values: forgotPassSchema) => {
    setIsLoading(true);
    const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
    try {
      const response = await axios.post(
        `${baseUrl}/api/user/forgot-password`,
        values
      );

      router.push({
        pathname: "/verify-code",
        params: { email: values.email },
      });
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
          <Text style={[typography.title2Bold]}>Lupa Password </Text>
          <Text style={[typography.subhead]}>
            Masukkan alamat email yang sudah terdaftar untuk melakukan reset
            password.
          </Text>
        </View>

        <NoAuthInput
          type="text"
          placeholder="Masukkan Alamat Email Anda"
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          value={values.email}
          error={errors.email}
          touched={touched.email}
          placeholderTextColor={colors.brand.light}
          inputMode="email"
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
            <Text style={styles.buttonText}>Kirim Kode</Text>
          </TouchableOpacity>
        </View>

        <IndicatorModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          imageUrl={operationSuccess ? "email-verified" : "password-not-same"}
          title={
            operationSuccess
              ? "Email Telah Terverifikasi!"
              : "Email tidak terdaftar"
          }
          description={
            operationSuccess
              ? "Silahkan lakukan login kembali untuk mengakses aplikasi"
              : `Email ${values.email} yang Anda Masukkan Belum Terdaftar.`
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
