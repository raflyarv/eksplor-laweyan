import { IndicatorModal } from "@/app/_components";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QRScanner() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [hasScanned, setHasScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Aplikasi membutuhkan akses ke kamera</Text>
        <Button onPress={requestPermission} title="Berikan Akses" />
      </View>
    );
  }

  // function toggleCameraFacing() {
  //   setFacing((current) => (current === "back" ? "front" : "back"));
  // }

  const handleBarcodeScanned = ({ data }: any) => {
    if (!hasScanned) {
      // Check if a scan has already been processed
      setHasScanned(true);
      const [prefix, id] = data.split(":");

      if (prefix === "sololaweyan") {
        // Navigate to the detail page if the prefix is valid
        router.push({
          pathname: "/details/[id]",
          params: { id: id },
        });
      } else {
        // Show a message if the prefix is invalid
        alert("QR tidak ditemukan");
      }

      setTimeout(() => {
        setHasScanned(false);
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
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
            marginTop: 40,
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

        <View
          style={[
            {
              width: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 80,
            },
          ]}
        >
          <Text
            style={[
              typography.title3Bold,
              {
                color: colors.brand.main,
                backgroundColor: "white",
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderRadius: 5,
              },
            ]}
          >
            Arahkan Kamera ke Kode QR
          </Text>
        </View>

        <View style={styles.scannerOverlay}>
          <View style={[styles.scannerCorner, styles.topLeftCorner]} />
          <View style={[styles.scannerCorner, styles.topRightCorner]} />
          <View style={[styles.scannerCorner, styles.bottomLeftCorner]} />
          <View style={[styles.scannerCorner, styles.bottomRightCorner]} />
        </View>
      </CameraView>

      <IndicatorModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        imageUrl=""
        title="Kode QR Tidak Ditemukan"
        description="Silahkan scan kode QR pada toko/tempat wisata batik yang tersedia"
      />
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
  scannerOverlay: {
    position: "absolute",
    top: "35%", // Adjusted to position it closer to the center
    left: "15%",
    right: "15%",
    height: "35%", // Height adjusted for a more square aspect ratio
    borderWidth: 2,
    borderColor: "transparent", // Make the border transparent
    borderStyle: "solid",
  },
  scannerCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
  },
  topLeftCorner: {
    top: -15,
    left: -15,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  topRightCorner: {
    top: -15,
    right: -15,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomLeftCorner: {
    bottom: -15,
    left: -15,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomRightCorner: {
    bottom: -15,
    right: -15,
    borderBottomWidth: 0,
    borderRightWidth: 0,
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
