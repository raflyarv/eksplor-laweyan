import { spacing } from "@/theme/spacing";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { colors } from "@/theme/colors";

interface UniqueFactCardProps {
  fact: string;
}

export default function UniqueFactCard({ fact }: UniqueFactCardProps) {
  return (
    <>
      <View>
        <MaterialIcons
          name="check-circle"
          size={32}
          color={colors.success}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
          }}
        />
        <View
          style={{
            width: 280,
            maxHeight: 120,
            minHeight: 70,
            borderRadius: 10,
            marginStart: 15,
            marginTop: 10,
            paddingHorizontal: spacing.medium,
            paddingVertical: spacing.medium,
            position: "relative",
            zIndex: 0,
            backgroundColor: "#FFF1EC",
          }}
        >
          <Text
            style={{
              textAlign: "auto",
            }}
            ellipsizeMode="tail"
            numberOfLines={4}
          >
            {fact}
          </Text>
        </View>
      </View>
    </>
  );
}
