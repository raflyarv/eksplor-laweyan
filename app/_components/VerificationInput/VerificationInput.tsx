import { colors } from "@/theme/colors";
import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

interface VerificationInput {
  name: string;
  setFieldValue: (field: string, value: any) => void;
}

export default function VerificationInput({
  name,
  setFieldValue,
}: VerificationInput) {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]); // State for OTP digits
  const inputs = useRef<(TextInput | null)[]>([]); // Reference to TextInput components

  useEffect(() => {
    if (otp.length === 4 && otp.every((digit) => digit !== "")) {
      // Check if all fields are filled
      const otpString = otp.join("");
      console.log(otpString);
      setFieldValue(name, otpString); // Update the form value with the OTP string
    }
  }, [otp]); // Runs when otp changes

  // Function to handle text change in each input box
  const handleChange = (text: string, index: number): void => {
    const newOtp = [...otp];
    newOtp[index] = text;

    // Update the OTP state
    setOtp(newOtp);

    // Move to the next input box automatically if input is a digit
    if (text && index < 3) {
      inputs.current[index + 1]?.focus(); // Use optional chaining to prevent errors
    }

    // If the backspace key is pressed, move to the previous input box
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus(); // Use optional chaining to prevent errors
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(input) => (inputs.current[index] = input)}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            style={styles.otpInput}
            textAlign="center"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  otpInput: {
    backgroundColor: colors.brand.semiwhite,
    borderRadius: 10,
    width: 70,
    height: 80,
    fontSize: 24,
    color: "whiite",
  },
});
