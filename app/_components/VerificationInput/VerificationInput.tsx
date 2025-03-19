import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
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
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]); // State for OTP digits
  const inputs = useRef<(TextInput | null)[]>([]); // Reference to TextInput components

  useEffect(() => {
    if (otp.length === 6 && otp.every((digit) => digit !== "")) {
      // Check if all fields are filled
      const otpString = otp.join("");
      setFieldValue(name, otpString); // Update the form value with the OTP string
    }
  }, [otp]);

  const handleChange = (text: string, index: number): void => {
    const newOtp = [...otp];

    if (text.length > 1) {
      // Handle multi-character paste
      const chars = text.split("");
      const remainingInputs = 6 - index; // Calculate remaining inputs available
      const charsToPaste = chars.slice(0, remainingInputs); // Limit chars to paste to available inputs

      charsToPaste.forEach((char, i) => {
        newOtp[index + i] = char; // Paste character into the OTP state
      });

      setOtp(newOtp);

      // Move focus to the next empty input after pasting
      const nextIndex = Math.min(index + charsToPaste.length, 5);
      inputs.current[nextIndex]?.focus();
    } else {
      // Handle single character input
      newOtp[index] = text;
      setOtp(newOtp);

      // Move focus to the next input box if not empty
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }

      // Move focus back if backspace is pressed
      if (!text && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      // If current field is empty and user presses backspace
      if (otp[index] === "" && index > 0) {
        // Move to the previous input
        inputs.current[index - 1]?.focus();
        // Clear the previous input's value
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else if (otp[index] !== "") {
        // If current field is not empty, clear the current input's value
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
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
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => {
              // Automatically select text on focus
              if (digit) {
                setTimeout(() => {
                  inputs.current[index]?.setNativeProps({ text: "" });
                }, 0);
              }
            }}
            keyboardType="numeric"
            maxLength={1}
            blurOnSubmit={false} // Keeps the input focused even when tapping outside
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
    width: 50,
    height: 80,
    color: colors.brand.main,
    ...typography.title2Bold,
  },
});
