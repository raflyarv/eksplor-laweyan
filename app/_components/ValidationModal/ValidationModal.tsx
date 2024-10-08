import { typography } from "@/theme/typography";
import React from "react";
import { Modal, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

interface ValidationModalType {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonMessage: string;
}

export default function ValidationModal({
  visible,
  onClose,
  message,
  title,
  buttonMessage,
}: ValidationModalType) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalMessage, typography.headline]}>
            {title}{" "}
          </Text>
          <Text style={[typography.footnote, { marginBottom: 15 }]}>
            {message}
          </Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton]}>
            <Text style={[styles.buttonText]}>{buttonMessage}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 10,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
