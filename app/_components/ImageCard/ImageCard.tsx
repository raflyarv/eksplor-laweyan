import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, ImageBackground, View, Text } from "react-native";
import { colors } from "react-native-elements";

interface ImageCardProps {
  id: string;
  imageUrl: string;
  name: string;
  averageRating: any;
  reviewTotal: number;
  distance: string;
}

export default function ImageCard({
  id,
  imageUrl,
  name,
  averageRating,
  reviewTotal,
  distance,
}: ImageCardProps) {
  return (
    <>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(auth)/details/[id]",
            params: { id: id },
          })
        }
      >
        <ImageBackground
          source={{
            uri: imageUrl,
          }}
          resizeMode="cover"
          borderRadius={5}
          style={{
            marginEnd: 9,
          }}
        >
          <View
            style={{
              width: 175,
              height: 250,
              flex: 1,
              borderRadius: 5,
              justifyContent: "flex-end",
            }}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0)", "rgba(0,0,0,0.552)"]} // Gradient colors
              locations={[0.07, 0.2]} // Corresponding positions for the colors
              style={{
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  paddingHorizontal: spacing.medium,
                  paddingVertical: spacing.medium,
                }}
              >
                <Text
                  style={[
                    typography.headline,
                    { color: "white", marginBottom: spacing.small },
                  ]}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: spacing.medium,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialIcons
                      name="star"
                      size={16}
                      color={colors.warning}
                    />
                    <Text style={[typography.footnote, { color: "white" }]}>
                      {averageRating}
                    </Text>
                    <Text style={[typography.footnote, { color: "white" }]}>
                      {reviewTotal}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialIcons
                      name="near-me"
                      size={16}
                      color={colors.success}
                    />
                    <Text style={[typography.footnote, { color: "white" }]}>
                      {distance}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ImageBackground>
      </Pressable>
    </>
  );
}
