// ImagePickerComponent.js

import React, { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useField } from "formik";
// import { z } from "zod";
// import { ZodFormikAdapter } from 'zod-formik-adapter';

interface ProfileImagePickerProps {
  name: string;
}

export default function ProfileImagePicker({ name }: ProfileImagePickerProps) {
  const [imageUri, setImageUri] = useState<string>("");
  const [{ value }, , { setValue }] = useField(name);

  const pickImage = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setValue(result.assets[0].uri);
    }
  };

  const clearImage = () => {
    setImageUri("");
    setValue(null);
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity onPress={clearImage} style={styles.clearButton}>
            <Text style={styles.clearText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
          <Text style={styles.pickText}>Pick an Image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  imageContainer: {
    position: "relative",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  clearButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    padding: 5,
  },
  clearText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  pickButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  pickText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
