import { colors } from "@/theme/colors";
import { View, ActivityIndicator } from "react-native";

export default function FullScreenLoading() {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        position: "absolute",
        backgroundColor: "rgba(128, 128, 128, 0.8)",
        zIndex: 10,
      }}
    >
      <ActivityIndicator size={46} color={colors.brand.semiwhite} />
    </View>
  );
}
