import { Slot } from "expo-router";

import { AuthProvider, useAuth } from "./_hooks/context/AuthContext";
import { ModalProvider } from "./_hooks/context/ModalContext";

import { Asset } from "expo-asset";

Asset.loadAsync([
  require("../assets/images/icon.png"),
  require("../assets/images/splash.png"),
]);

export default function RootLayout() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Slot />
      </ModalProvider>
    </AuthProvider>
  );
}
