// import { useLocalSearchParams } from "expo-router";
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

const formSchema = z.object({
  verificationCode: z.string({ required_error: "Kode Verifikasi Harus Diisi" }),
  //   email: z
  //     .string({ required_error: "Alamat email Harus Diisi" })
  //     .email({ message: "Format email harus benar." }),
});

type verifyCodeSchema = z.infer<typeof formSchema>;

const initialValues: verifyCodeSchema = {
  //   email: "",
  verificationCode: "",
};

export default function VerifyCode() {
  //   const { id } = useLocalSearchParams();

  const onSubmit = (values: verifyCodeSchema) => {
    console.log(values);
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
          Silahkan masukkan 4 digit kode yang telah dikirimkan melalui email
          <Text style={{ fontWeight: 500, color: colors.brand.main }}>
            {" "}
            tohirraflyy28@gmail.com{" "}
          </Text>
          untuk melakukan reset password.
        </Text>
      </View>

      <VerificationInput
        name="verificationCode"
        setFieldValue={setFieldValue}
      />

      {/* Submit Button */}
      <View
        style={{
          alignSelf: "flex-end",
        }}
      >
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <Pressable
        style={{
          margin: 0,
          padding: 0,
        }}
        onPress={() => router.push("/(no-auth)/reset-password")}
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
          Reset Password
        </Text>
      </Pressable>
    </View>
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
