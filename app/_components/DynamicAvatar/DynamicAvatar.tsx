import { useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
// import { Avatar } from "react-native-paper";

interface DynamicAvatarProps {
  imageUrl: string;
  name: string;
  size: 50;
}

export default function DynamicAvatar({
  imageUrl,
  name,
  size,
}: DynamicAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const arrayOfName = name.trim().split(" ");
  const firstNameInitial = arrayOfName[0]?.charAt(0).toUpperCase() || "";

  const lastNameInitial =
    arrayOfName[arrayOfName.length - 1]?.charAt(0).toUpperCase() || "";

  const initials = firstNameInitial + lastNameInitial;

  return (
    <View
      style={[
        styles.avatarContainer,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {!imageError ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.avatarImage,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
          onError={() => setImageError(true)}
        />
      ) : (
        <View
          style={[
            styles.avatarFallback,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.avatarText, { fontSize: size / 3 }]}>
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
    overflow: "hidden",
  },
  avatarImage: {
    resizeMode: "cover",
  },
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7f8c8d",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
});
