import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { useFormik } from "formik";
import { NoAuthInput, ProfileImagePicker } from "../_components";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { router } from "expo-router";

const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

const formSchema = z
  .object({
    profileImage: z
      .instanceof(File)
      .nullable()
      .refine(
        (file) => file === null || SUPPORTED_FORMATS.includes(file.type),
        {
          message: "Tipe file tidak didukung.",
        }
      ),

    username: z.string({ required_error: "Username Harus Diisi" }),
    email: z
      .string({ required_error: "Alamat email Harus Diisi" })
      .email({ message: "Format email harus benar." }),
    fullName: z.string({ required_error: "Nama Lengkap Harus Diisi" }),
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

type registerFormSchema = z.infer<typeof formSchema>;

const initialValues: registerFormSchema = {
  profileImage: null as File | null,
  username: "",
  fullName: "",
  password: "",
  confirmPassword: "",
  email: "",
};

const getMimeType = (uri: string | undefined): string => {
  if (!uri) {
    // Return a default MIME type or handle the error
    console.warn("URI is undefined");
    return "application/octet-stream"; // Fallback MIME type
  }

  const extension = uri.split(".").pop()?.toLowerCase(); // Use optional chaining to handle undefined
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream"; // Fallback type
  }
};

export default function Register() {
  const onSubmit = (values: registerFormSchema) => {
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

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Create a File object
      const fileUri = result.assets[0].uri; // Access the uri of the selected image
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      // Create a File object (make sure your environment supports this)
      const mimeType = getMimeType(fileUri);
      const file = new File(
        [await fetch(fileUri).then((res) => res.blob())],
        fileInfo.uri, // ini nanti diganti jadi profile-images/[nama-user]
        { type: mimeType }
      );

      // Set the file using setFieldValue
      setFieldValue("profileImage", file);
      setImage(result.assets[0].uri);
    } else {
      console.log("Image selection was canceled");
    }
  };
  return (
    <View style={styles.mainContainer}>
      <Text
        style={[
          typography.title1Bold,
          {
            marginBottom: spacing.medium,
          },
        ]}
      >
        Buat Akun{" "}
      </Text>
      <View style={styles.container}>
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              onPress={() => setImage(null)}
              style={styles.clearButton}
            >
              <MaterialIcons name="delete" size={24} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={pickImage}>
              <MaterialIcons
                name="account-circle"
                size={150}
                color={colors.disable}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.brand.main,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <MaterialIcons name="upload-file" size={24} color="white" />
              <Text style={[typography.subhead, { color: "white" }]}>
                {" "}
                Upload Gambar{" "}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

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
        placeholder="Masukkan Alamat Email Anda"
        onChangeText={handleChange("email")}
        onBlur={handleBlur("email")}
        value={values.email}
        error={errors.email}
        touched={touched.email}
        placeholderTextColor={colors.brand.light}
        inputMode="email"
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

      <View
        style={{
          width: "100%",
          marginBottom: 15,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text style={[typography.footnote, { fontWeight: 500 }]}>
          {" "}
          Sudah memiliki akun?{" "}
        </Text>
        <Pressable
          style={{
            margin: 0,
            padding: 0,
          }}
          onPress={() => router.push("/(no-auth)/login")}
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
            Masuk di sini
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={{
          margin: 0,
          padding: 0,
        }}
        onPress={() => router.push("/(no-auth)/verify-email")}
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
