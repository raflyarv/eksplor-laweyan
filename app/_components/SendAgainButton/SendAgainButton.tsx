import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import React, { useState, useEffect } from "react";
import { Text, Pressable, View } from "react-native";
import IndicatorModal from "../IndicatorModal/IndicatorModal";
import { useLocalSearchParams } from "expo-router";
import axios from "axios"; // Make sure to import axios

interface SendAgainButtonProps {
  name: "forgot-password" | "verify-email"; // Specify the action type
}

export default function SendAgainButton({ name }: SendAgainButtonProps) {
  const { email } = useLocalSearchParams();
  const [countdown, setCountdown] = useState(30); // Countdown starts from 30s
  const [isDisabled, setIsDisabled] = useState(true); // Button is disabled initially
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [operationSuccess, setOperationSuccess] = useState<boolean>(true);

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      setIsDisabled(false); // Enable the button after countdown ends
    }

    return () => clearInterval(interval); // Clean up the interval
  }, [countdown]);

  const handleResendPress = async () => {
    try {
      let response;
      const values = { email }; // Construct your request body here

      // Logic for resend action based on the name prop
      if (name === "forgot-password") {
        response = await axios.post(
          `${baseUrl}/api/user/send-reset-password-code`,
          values
        );
      } else if (name === "verify-email") {
        response = await axios.post(
          `${baseUrl}/api/user/resend-verification-code`,
          values
        );
      }

      console.log(response);
      setOperationSuccess(true); // Set success based on response
    } catch (error) {
      console.error(error);
      setOperationSuccess(false); // Set failure if there's an error
    } finally {
      setIsDisabled(true); // Disable the button again
      setCountdown(30); // Reset countdown to 30 seconds
      setModalVisible(true); // Show modal
    }
  };

  return (
    <View style={{ marginBottom: 20, alignItems: "center" }}>
      {isDisabled ? (
        <Text style={[typography.footnote, { color: "gray" }]}>
          Kirim ulang ({countdown})
        </Text>
      ) : (
        <Pressable onPress={handleResendPress}>
          <Text
            style={[
              typography.footnote,
              { color: colors.brand.main, textDecorationLine: "underline" },
            ]}
          >
            Kirim Ulang Kode
          </Text>
        </Pressable>
      )}

      <IndicatorModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        imageUrl="email-sent"
        title={
          operationSuccess
            ? "Kode Verifikasi Telah Dikirim"
            : "Terjadi Kesalahan"
        }
        description={
          operationSuccess
            ? `Cek email: ${email} untuk kode verifikasi yang telah dikirim`
            : "Silakan coba lagi."
        }
      />
    </View>
  );
}
