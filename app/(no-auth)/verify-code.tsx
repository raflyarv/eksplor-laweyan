import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import VerificationInput from "../_components/VerificationInput";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { router } from "expo-router";
import axios from "axios";
import { useState } from "react";
import { FullScreenLoading, IndicatorModal } from "../_components";

const formSchema = z.object({
  resetPasswordCode: z.string({
    required_error: "Kode Verifikasi Harus Diisi",
  }),
  //   email: z
  //     .string({ required_error: "Alamat email Harus Diisi" })
  //     .email({ message: "Format email harus benar." }),
});

type verifyCodeSchema = z.infer<typeof formSchema>;

const initialValues: verifyCodeSchema = {
  //   email: "",
  resetPasswordCode: "",
};

export default function VerifyCode() {
  const { email } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [operationSuccess, setOperationSuccess] = useState<boolean>(false); // Change this to simulate success or fail

  const onSubmit = async (values: verifyCodeSchema) => {
    setIsLoading(true);

    try {
      const requestBody = {
        ...values,
        email,
      };

      const response = await axios.post(
        "http://192.168.100.18:5000/api/user/verify-reset-password",
        requestBody
      );

      router.push({
        pathname: "/reset-password",
        params: { email: email },
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
          <Text style={[typography.title2Bold]}>Masukkan Kode </Text>
          <Text style={[typography.footnote]}>
            Silahkan masukkan 6 digit kode yang telah dikirimkan melalui email
            <Text style={{ fontWeight: 500, color: colors.brand.main }}>
              {" "}
              {email}{" "}
            </Text>
            untuk melakukan reset password.
          </Text>
        </View>

        <VerificationInput
          name="resetPasswordCode"
          setFieldValue={setFieldValue}
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
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <IndicatorModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          imageUrl={operationSuccess ? "email-verified" : "password-not-same"}
          title={
            operationSuccess
              ? "Email Telah Terverifikasi!"
              : "Kode yang Dimasukkan Salah"
          }
          description={
            operationSuccess
              ? "Silahkan lakukan login kembali untuk mengakses aplikasi"
              : `Silahkan cek email Anda: ${email} untuk 6 digit kode.`
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
    fontWeight: "bold",
  },
});
