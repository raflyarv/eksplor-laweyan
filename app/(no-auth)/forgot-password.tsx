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
import { NoAuthInput } from "../_components";
import { router } from "expo-router";

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
  //   const { id } = useLocalSearchParams();

  const onSubmit = (values: forgotPassSchema) => {
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
        <Text style={[typography.title2Bold]}>Lupa Password </Text>
        <Text style={[typography.footnote]}>
          Masukkan alamat email yang sudah terdaftar untuk melakukan reset
          password.
          {/* <Text style={{ fontWeight: 500, color: colors.brand.main }}>
            {" "}
            tohirraflyy28@gmail.com{" "}
          </Text> */}
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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Kirim Kode</Text>
        </TouchableOpacity>
      </View>

      <Pressable
        style={{
          margin: 0,
          padding: 0,
        }}
        onPress={() => router.push("/(no-auth)/verify-code")}
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
          Verifikasi Kode
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
