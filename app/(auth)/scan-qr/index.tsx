import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QRScanner() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleBarcodeScanned = ({ data }: any) => {
    // Assuming the scanned data is in the format "/detail/[id]".
    // You may need to adjust this based on your QR code structure.
    const id = data.split(":").pop(); // Extract the id from the scanned data.

    // Navigate to the detail page with the extracted id
    router.push({
      pathname: "/details/[id]",
      params: { id: id },
    });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginLeft: 20,
            backgroundColor: "white",
            width: 56,
            height: 56,
            borderRadius: 100,
          }}
        >
          <MaterialIcons
            name="arrow-back"
            size={32}
            color={colors.brand.main}
          />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Arahkan Kamera ke Kode QR</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
