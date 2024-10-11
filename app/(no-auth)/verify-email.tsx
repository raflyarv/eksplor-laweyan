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
import SendAgainButton from "../_components/SendAgainButton";
import IndicatorModal from "../_components/IndicatorModal/IndicatorModal";
import { useState } from "react";
import axios from "axios";
import { useModal } from "../_hooks/context/ModalContext";
import { FullScreenLoading } from "../_components";

const formSchema = z.object({
  verificationCode: z.string({ required_error: "Kode Verifikasi Harus Diisi" }),
});

type verifyEmailSchema = z.infer<typeof formSchema>;

const initialValues: verifyEmailSchema = {
  verificationCode: "",
};

export default function VerifyEmail() {
  const { email } = useLocalSearchParams();

  const { setModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [operationSuccess, setOperationSuccess] = useState<boolean>(false); // Change this to simulate success or failure

  const onSubmit = async (values: verifyEmailSchema) => {
    setIsLoading(true);
    try {
      const requestBody = {
        verificationCode: values.verificationCode, // spread the values object
        email, // add the email to the body
      };
      const response = await axios.post(
        "http://192.168.100.18:5000/api/user/verify-email",
        requestBody
      );

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
          <Text style={[typography.title2Bold]}>Masukkan Kode Verifikasi </Text>
          <Text style={[typography.footnote]}>
            Silahkan masukkan 6 digit kode verifikasi yang telah dikirimkan
            melalui email
            <Text style={{ fontWeight: 500, color: colors.brand.main }}>
              {" "}
              {email}{" "}
            </Text>
          </Text>
        </View>

        <VerificationInput
          name="verificationCode"
          setFieldValue={setFieldValue}
        />

        <View
          style={{
            alignSelf: "flex-end",
          }}
        >
          <SendAgainButton name="verifyEmail" />
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
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <Pressable
          style={{
            margin: 0,
            padding: 0,
          }}
          onPress={() => router.push("/forgot-password")}
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
            Forgot Password
          </Text>
        </Pressable>

        <IndicatorModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          imageUrl={operationSuccess ? "email-verified" : "password-not-same"}
          title={
            operationSuccess
              ? "Email Telah Terverifikasi!"
              : "Kode Verifikasi Salah"
          }
          description={
            operationSuccess
              ? "Silahkan lakukan login kembali untuk mengakses aplikasi"
              : "Kode verifikasi yang Anda masukkan salah. Silahkan coba lagi."
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
