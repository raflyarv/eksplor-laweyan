import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Ensure you have this installed
import { colors } from "@/theme/colors"; // Adjust this according to your project structure
import { typography } from "@/theme/typography";

// Define the props for the custom component
interface ContactItemProps {
  type: string;
  name: string;
  detail: string;
}

// Import your static images
const iconMap = {
  Instagram: require("@/assets/static/contacts/instagram-logo.png"),
  Whatsapp: require("@/assets/static/contacts/whatsapp-logo.png"),
  Facebook: require("@/assets/static/contacts/facebook-logo.png"),
  Website: require("@/assets/static/contacts/website-logo.png"),
};

const urlMap = {
  Instagram: (detail: string) =>
    `https://instagram.com/${detail.replace("@", "")}`,
  Whatsapp: (detail: string) => `whatsapp://send?phone=${detail}`,
  Facebook: (detail: string) => `https://facebook.com/${detail}`,
  Website: (detail: string) => `https://${detail}`,
};

export default function ContactItems({ type, name, detail }: ContactItemProps) {
  // Function to handle press action
  const handleContactPress = () => {
    const url =
      urlMap[type as "Instagram" | "Whatsapp" | "Facebook" | "Website"](detail); // Get the appropriate URL based on type
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={
          iconMap[type as "Instagram" | "Whatsapp" | "Facebook" | "Website"]
        }
        style={styles.icon}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.contactName, typography.subhead]}>{name}</Text>
        {/* <Pressable onPress={handleContactPress}>
          <Text style={styles.contactDetail}>{detail}</Text>
        </Pressable> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "auto",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, // Spacing between contact items
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: "contain", // Maintain the aspect ratio of the image
  },
  infoContainer: {
    marginLeft: 10,
  },
  contactName: {
    fontWeight: "bold",
    color: colors.text.main,
  },
  contactDetail: {
    color: colors.brand.main, // Assuming you have a link color defined in your styles
    textDecorationLine: "underline", // To visually indicate it's a link
  },
});
