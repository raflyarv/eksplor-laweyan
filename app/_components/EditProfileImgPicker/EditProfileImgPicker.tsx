import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useFormikContext } from "formik";
import { colors } from "@/theme/colors"; // Replace with your color definitions

interface EditProfileImgPickerProps {
  name: string;
  preview: string | null;
  setPreview: Dispatch<SetStateAction<string | null>>;
  error: any;
  existingImage: string | null; // Add this prop to manage the existing profile image
}

export default function EditProfileImgPicker({
  name,
  preview,
  setPreview,
  error,
  existingImage, // Handle existing image
}: EditProfileImgPickerProps) {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const [image, setImage] = useState<string | null>(null);

  // Initialize with existing image
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const { setFieldValue, submitForm } = useFormikContext();

  // Function to open the image picker
  const pickImage = async () => {
    setModalVisible(false); // Close modal when picking image

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      setPreview(selectedImage);
      setFieldValue(name, result.assets[0]);

      submitForm(); // Auto-submit form when image is picked
    }
  };

  // Handle Image Deletion
  const handleDeleteImage = () => {
    setImage(null);
    setPreview(null);
    setFieldValue(name, null);
    setFieldValue("existingProfileImage", null);
    submitForm(); // Auto-submit form when image is deleted
  };

  // Open Modal
  const handleEditProfile = () => {
    if (existingImage) {
      setModalVisible(true); // Show modal if existing image is present
    } else {
      pickImage(); // Directly open picker if no existing image
    }
  };

  useEffect(() => {
    if (existingImage) {
      setImage(`${baseUrl}/${existingImage}`);
    } else if (preview) {
      setImage(preview);
    } else {
      setImage(null);
    }
  }, [existingImage, preview]);

  return (
    <View>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleDeleteImage}
          >
            <MaterialIcons name="delete" size={24} color={colors.danger} />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <MaterialIcons
            name="account-circle"
            size={150}
            color={colors.disable}
          />
          <TouchableOpacity
            onPress={handleEditProfile}
            style={styles.editProfileButton}
          >
            <Text style={styles.editText}>Edit Foto Profil </Text>
          </TouchableOpacity>
        </>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Modal for choosing image or deleting */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Button title="Pilih Gambar" onPress={pickImage} />
            {existingImage && (
              <Button
                title="Hapus Gambar Profil"
                color={colors.danger}
                onPress={handleDeleteImage}
              />
            )}
            <Button title="Batal" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  clearButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 5,
  },
  editProfileButton: {
    alignItems: "center",
    marginVertical: 10,
  },
  editText: {
    color: colors.primary, // Blue text
    fontSize: 16,
    textDecorationLine: "underline", // Emphasize with underline
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
});
