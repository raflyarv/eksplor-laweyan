import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";

const imageMap: { [key: string]: any } = {
  logout: require("@/assets/static/not-found.png"),
  "change-profile-img": require("@/assets/static/not-found.png"),
  "change-profile": require("@/assets/static/not-found.png"),
};

interface ConfirmationModalProps {
  isVisible: boolean; // for modal visibility
  onClose: () => void; // function to close the modal
  onCloseAfter: () => void;
  imageUrl: string; // URL of the image to display
  title: string; // title of the operation result
  buttonText: string;
}

export default function ConfirmationModal({
  isVisible,
  onClose,
  onCloseAfter,
  imageUrl,
  title,
  buttonText,
}: ConfirmationModalProps) {
  const imageSource =
    imageMap[imageUrl] || require("@/assets/static/not-found.png"); // Fallback image

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={imageSource} style={styles.image} />

          <Text style={[styles.modalMessage, typography.headline]}>
            {title}{" "}
          </Text>

          <View
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: "transparent",
                  borderColor: colors.brand.main,
                  borderWidth: 2,
                },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.brand.main }]}>
                Batalkan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCloseAfter}
              style={[styles.closeButton, { backgroundColor: colors.danger }]}
            >
              <Text style={[styles.buttonText]}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
  },
  modalContent: {
    width: 350,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: colors.brand.main,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
