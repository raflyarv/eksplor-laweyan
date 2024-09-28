import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { View, FlatList, Text, Pressable, Image } from "react-native";
import { colors } from "@/theme/colors";

interface LastSeenCard {
  id: string;
  name: string;
  address: string;
  averageRating: number;
  totalReviews: number;
  distance: number;
  images: [
    {
      url: string;
    }
  ];
}

export default function LastSeenCard({
  id,
  name,
  address,
  averageRating,
  totalReviews,
  distance,
  images,
}: LastSeenCard) {
  return (
    <>
      <Pressable
        style={{
          width: "100%",
          height: "auto",
          borderRadius: 5,
          flexDirection: "column",
          justifyContent: "center",
          marginBottom: spacing.medium,
          backgroundColor: "#FFF0EC",
        }}
      >
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image
              source={{
                uri: item.url,
              }}
              style={{
                width: 180,
                height: 140,
                marginEnd: spacing.small,
                objectFit: "cover",
                borderRadius: 5,
              }}
            />
          )}
        />

        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          {/* Title & Bookmark */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: spacing.small,
            }}
          >
            <Text
              style={[typography.headline, { width: 300 }]}
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              {name}
            </Text>

            <MaterialIcons
              name="bookmark-outline"
              size={24}
              color={colors.brand.main}
            />
          </View>

          {/* Rating and Distance */}
          <View
            style={{
              flexDirection: "row",
              columnGap: spacing.medium,
              marginBottom: spacing.small,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="star" size={16} color={colors.warning} />
              <Text style={[typography.footnote, { color: colors.text.main }]}>
                {averageRating}
              </Text>
              <Text style={[typography.footnote, { color: colors.text.main }]}>
                ({totalReviews})
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="near-me" size={16} color={colors.success} />
              <Text style={[typography.footnote, { color: colors.text.main }]}>
                {distance} m
              </Text>
            </View>
          </View>

          <Text
            style={[typography.caption1, { marginBottom: spacing.small }]}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {address}
          </Text>
        </View>
      </Pressable>
    </>
  );
}
