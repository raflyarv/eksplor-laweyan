import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function SiteReview() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text> This is Review for {id} </Text>
    </View>
  );
}
