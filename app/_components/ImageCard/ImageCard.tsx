import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Pressable,
  ImageBackground,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "react-native-elements";

interface ImageCardProps {
  id: string;
  imageUrl: string;
  name: string;
  averageRating: any;
  reviewTotal: number;
  distance: string;
  isLoading: boolean;
  onNavigate: (id: string) => void;
}

export default function ImageCard({
  id,
  imageUrl,
  name,
  averageRating,
  reviewTotal,
  distance,
  isLoading,
  onNavigate,
}: ImageCardProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onNavigate(id)} style={styles.container}>
        <ImageBackground
          source={{
            uri: imageUrl,
          }}
          resizeMode="cover"
          borderRadius={5}
          style={styles.imageBackground}
        >
          <View style={styles.innerContainer}>
            <LinearGradient
              colors={["rgba(255,255,255,0)", "rgba(0,0,0,0.552)"]}
              locations={[0.07, 0.2]}
              style={styles.gradient}
            >
              <View style={styles.textContainer}>
                <Text
                  style={[typography.headline, styles.nameText]}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {name}
                </Text>
                <View style={styles.infoContainer}>
                  <View style={styles.ratingContainer}>
                    <MaterialIcons
                      name="star"
                      size={16}
                      color={colors.warning}
                    />
                    <Text style={styles.ratingText}>{averageRating}</Text>
                    <Text style={styles.reviewCountText}> ({reviewTotal})</Text>
                  </View>
                  <View style={styles.distanceContainer}>
                    <MaterialIcons
                      name="near-me"
                      size={16}
                      color={colors.success}
                    />
                    <Text style={styles.distanceText}>{distance}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ImageBackground>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 250,
    borderRadius: 5,
  },
  skeletonContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  imageBackground: {
    flex: 1,
    borderRadius: 5,
    marginEnd: 9,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 5,
    justifyContent: "flex-end",
  },
  gradient: {
    borderRadius: 5,
  },
  textContainer: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
  },
  nameText: {
    color: "white",
    marginBottom: spacing.small,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "white",
    ...typography.footnote,
  },
  reviewCountText: {
    color: "white",
    ...typography.footnote,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    color: "white",
    ...typography.footnote,
  },
});
