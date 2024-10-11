// ModalContext.tsx
import React, { createContext, useContext, useState } from "react";
import {
  Modal,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Define image mapping for different modal types
const imageMap: { [key: string]: any } = {
  "email-sent": require("@/assets/static/email-sent.png"),
  "email-verified": require("@/assets/static/email-verified.png"),
  "password-not-same": require("@/assets/static/password-not-same.png"),
  "not-found": require("@/assets/static/not-found.png"), // Default fallback
  // Add more types of images as needed
};

// Define the type of context to include setModal as a callable function
type ModalContextType = {
  setModal: (
    title: string,
    description: string,
    imageUrl: string,
    buttonText: string
  ) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Hook to use the Modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

// ModalProvider Component
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    imageUrl: "not-found",
    buttonText: "",
  });

  const setModal = (
    title: string,
    description: string,
    imageUrl: string,
    buttonText: string
  ) => {
    setModalContent({ title, description, imageUrl, buttonText });
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const imageSource = imageMap[modalContent.imageUrl] || imageMap["not-found"];

  return (
    <ModalContext.Provider value={{ setModal }}>
      {children}
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={imageSource} style={styles.image} />
            <Text style={[styles.modalMessage, typography.headline]}>
              {modalContent.title}
            </Text>
            <Text style={[typography.footnote, { marginBottom: 15 }]}>
              {modalContent.description}
            </Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.buttonText}>{modalContent.buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ModalContext.Provider>
  );
};

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
