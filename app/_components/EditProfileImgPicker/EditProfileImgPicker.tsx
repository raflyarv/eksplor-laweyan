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
import { typography } from "@/theme/typography";

interface EditProfileImgPickerProps {
  name: string;
  preview: string | null;
  setPreview: Dispatch<SetStateAction<string | null>>;
  error: any;
  existingImage: string | null; // Add this prop to manage the existing profile image
  onSubmit: () => void;
}

export default function EditProfileImgPicker({
  name,
  preview,
  setPreview,
  error,
  existingImage, // Handle existing image
  onSubmit,
}: EditProfileImgPickerProps) {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const [image, setImage] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const { setFieldValue, submitForm, resetForm, values } = useFormikContext();

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
      setFieldValue("existingProfileImage", null);

      onSubmit(); // Auto-submit form when image is picked
    }
  };

  // Handle Image Deletion
  const handleDeleteImage = () => {
    setImage(null);
    setPreview(null);
    setFieldValue(name, null);
    setFieldValue("existingProfileImage", null);
    resetForm();
    setModalVisible(false);
    onSubmit(); // Auto-submit form when image is deleted
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
    <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.7}>
      <View>
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <MaterialIcons name="account-circle" size={150} color="white" />
          </View>
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
              {/* Text with Icon for selecting an image */}
              <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
                <MaterialIcons name="image" size={24} color={colors.success} />
                <Text style={[typography.subhead, styles.modalOptionText]}>
                  Pilih Gambar
                </Text>
              </TouchableOpacity>

              {/* Text with Icon for deleting the existing profile image */}
              {existingImage && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleDeleteImage}
                >
                  <MaterialIcons
                    name="delete"
                    size={24}
                    color={colors.danger}
                  />
                  <Text style={[typography.subhead, styles.modalOptionText]}>
                    Hapus Gambar Profil
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  { alignSelf: "flex-end", justifyContent: "flex-end" },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[
                    typography.subhead,
                    styles.modalOptionText,
                    { color: colors.danger },
                  ]}
                >
                  Batal{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableOpacity>
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
  placeholderContainer: {
    alignItems: "center",
    marginBottom: 20,
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
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
  },
  modalOptionText: {
    fontWeight: 600,
    marginLeft: 10,
    color: colors.brand.main,
  },
});
