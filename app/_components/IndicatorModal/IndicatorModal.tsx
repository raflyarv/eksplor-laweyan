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
  "email-sent": require("@/assets/static/email-sent.png"),
  "email-verified": require("@/assets/static/email-verified.png"),
  "password-not-same": require("@/assets/static/password-not-same.png"),
  // 'not-found': require("@/assets/static/not-found.png")
  // Add more images here
};

interface IndicatorModalProps {
  isVisible: boolean; // for modal visibility
  onClose: () => void; // function to close the modal
  imageUrl: string; // URL of the image to display
  title: string; // title of the operation result
  description: string; // description of the operation result
}

export default function IndicatorModal({
  isVisible,
  onClose,
  imageUrl,
  title,
  description,
}: IndicatorModalProps) {
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
          <Text style={[typography.footnote, { marginBottom: 15 }]}>
            {description}
          </Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton]}>
            <Text style={[styles.buttonText]}>Tutup</Text>
          </TouchableOpacity>
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
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: colors.brand.main,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
