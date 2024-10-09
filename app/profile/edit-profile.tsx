import { spacing } from "@/theme/spacing";
import { View, Text, ScrollView } from "react-native";

export default function EditProfile() {
  return (
    <ScrollView
      style={{
        paddingHorizontal: spacing.medium,
      }}
    >
      <Text> This is Edit Profile </Text>
    </ScrollView>
  );
}
