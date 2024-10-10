import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { useFormik } from "formik";
import { NoAuthInput } from "@/app/_components";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { router } from "expo-router";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

const formSchema = z
  .object({
    username: z.string({ required_error: "Username Harus Diisi" }),
    email: z
      .string({ required_error: "Alamat email Harus Diisi" })
      .email({ message: "Format email harus benar." }),
    fullName: z.string({ required_error: "Nama Lengkap Harus Diisi" }),
    oldPassword: z.string({
      required_error: "Kata sandi yang lama harus diisi.",
    }),
    password: z.string({ required_error: "Kata sandi baru harus diisi." }),
    confirmPassword: z.string({
      required_error: "Konfirmasi kata sandi yang baru harus diisi.",
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

type editProfileSchema = z.infer<typeof formSchema>;

const initialValues: editProfileSchema = {
  username: "",
  fullName: "",
  password: "",
  confirmPassword: "",
  oldPassword: "",
  email: "",
};

export default function EditProfile() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = (values: editProfileSchema) => {
    setIsLoading(true);
    try {
      // const hashedPassword = await bcrypt.hash(values.confirmPassword, 10);
      // const { password, confirmPassword, ...registerValues } = values;
      // const sendData = { ...registerValues, password: confirmPassword };

      // await axios.post("http://localhost:5000/api/admin", sendData, {
      //   withCredentials: true,
      //   headers: {
      //     "Content-Type": "multipart/form-data", // Important: Set the correct content type
      //   },
      // });
      console.log(values);
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
      // setIsOpen(true);
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
    <View
      style={{
        paddingHorizontal: spacing.medium,
        justifyContent: "center", // Centers vertically
        alignItems: "center", // Centers horizontally
      }}
    >
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
        <TouchableOpacity onPress={() => router.back()}>
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
          onChangeText={handleChange("username")}
          onBlur={handleBlur("username")}
          value={values.username}
          error={errors.username}
          touched={touched.username}
          placeholderTextColor={colors.brand.light}
          inputMode="username"
        />

        <NoAuthInput
          type="text"
          placeholder="Masukkan Nama Lengkap Anda"
          onChangeText={handleChange("fullName")}
          onBlur={handleBlur("fullName")}
          value={values.fullName}
          error={errors.fullName}
          touched={touched.fullName}
          placeholderTextColor={colors.brand.light}
          inputMode="fullName"
        />

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
          onChangeText={handleChange("oldPassword")}
          onBlur={handleBlur("oldPassword")}
          value={values.oldPassword}
          error={errors.oldPassword}
          touched={touched.oldPassword}
          placeholderTextColor={colors.brand.light}
        />

        <NoAuthInput
          type="password"
          placeholder="Buat Kata Sandi"
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
            <Text style={styles.buttonText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  clearButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    padding: 5,
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
  // clearText: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   color: "red",
  // },
});
