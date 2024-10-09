import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import React, { useState, useEffect } from "react";
import { Text, Pressable, View } from "react-native";
import IndicatorModal from "../IndicatorModal/IndicatorModal";
import { useLocalSearchParams } from "expo-router";

interface SendAgainButtonProps {
  name: string;
}

export default function SendAgainButton({ name }: SendAgainButtonProps) {
  const { email } = useLocalSearchParams();
  const [countdown, setCountdown] = useState(30); // Countdown starts from 30s
  const [isDisabled, setIsDisabled] = useState(true); // Button is disabled initially

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [operationSuccess, setOperationSuccess] = useState<boolean>(true); // Change this to simulate success or failure

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

  const handleResendPress = () => {
    // Logic for resend action
    console.log("Kirim ulang code");
    setIsDisabled(true); // Disable the button again
    setCountdown(30); // Reset countdown to 30 seconds
    setModalVisible(true);
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
        title="Kode Verifikasi Telah Dikirim"
        description={`Cek email: ${email} untuk kode verifikasi yang telah dikirim`}
        isSuccess={operationSuccess}
      />
    </View>
  );
}
