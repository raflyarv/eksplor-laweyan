import React from "react";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { router } from "expo-router";
import { Pressable, View, FlatList, Image, Text } from "react-native";
import { colors } from "@/theme/colors";
import BookmarkButton from "../BookmarkButton";
import RatingStar from "../RatingStar";
import { useNavHistory } from "@/app/_hooks/context/NavigationContext";

interface Images {
  _id: string;
  url: string;
  title: string;
}

interface Review {
  locationId: number;
  rating: number;
}

interface SiteListCardProps {
  id: number;
  siteName: string;
  address: string;
  avrgRating: number;
  reviewCount: number;
  formattedDistance: string;
  walkingTime: string;
  openStatus: any;
  onBookmarkToggled?: () => void;
  onNavigate: (id: number) => void;
  images: Images[];
  reviews: Review[];
}

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

export default function SiteListCard({
  id,
  siteName,
  address,
  avrgRating,
  formattedDistance,
  walkingTime,
  openStatus,
  onBookmarkToggled,
  images,
  reviews,
  onNavigate,
}: SiteListCardProps) {
  return (
    <Pressable onPress={() => onNavigate(id)}>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 300,
          backgroundColor: "white",
          borderRadius: 10,
          marginBottom: spacing.medium,
        }}
      >
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Image
              source={{
                uri: `${baseUrl}/${item.url}`,
              }}
              style={{
                width: 200,
                height: 200,
                marginEnd: index === images.length - 1 ? 0 : 5, // Set margin to 0 if it's the last item
                objectFit: "cover",
                borderRadius: 5,
              }}
            />
          )}
        />

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingHorizontal: spacing.medium,
            paddingVertical: 12,
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              ellipsizeMode="tail"
              numberOfLines={2}
              style={[typography.headline, { flex: 1, marginRight: 10 }]}
            >
              {siteName}
            </Text>
            <BookmarkButton
              locationId={id}
              onBookmarkToggled={onBookmarkToggled}
            />
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={[typography.subhead, { color: colors.text.disable }]}
              >
                {" "}
                {avrgRating}{" "}
              </Text>
              <RatingStar rating={avrgRating} isEditable={false} />
              <Text
                style={[typography.subhead, { color: colors.text.disable }]}
              >
                {" "}
                ({reviews.length}){" "}
              </Text>
            </View>

            <View>
              <Text
                style={[typography.subhead, { color: colors.text.disable }]}
              >
                {" "}
                {formattedDistance}{" "}
              </Text>
            </View>

            <View>
              <Text
                style={[typography.subhead, { color: colors.text.disable }]}
              >
                {" "}
                {walkingTime}{" "}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              marginBottom: 8,
            }}
          >
            <Text style={[typography.subhead]}>{address} </Text>
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              columnGap: 10,
            }}
          >
            <Text
              style={[
                typography.subhead,
                {
                  color:
                    openStatus.indicator === "Buka"
                      ? colors.success
                      : colors.danger,
                },
              ]}
            >
              {openStatus.indicator}{" "}
            </Text>
            {openStatus.closing !== null && openStatus.opening !== null && (
              <Text
                style={{
                  color: colors.text.disable,
                }}
              >
                &#x2022;
              </Text>
            )}

            <Text style={[typography.subhead, { color: colors.text.disable }]}>
              {openStatus.closing !== null && openStatus.opening !== null
                ? openStatus.indicator === "Buka"
                  ? `Tutup ${openStatus.closing}`
                  : openStatus.nextOpeningDay
                  ? `Buka ${openStatus.nextOpeningDay} ${
                      openStatus.modifiedResult.find(
                        (hours: { day: any }) =>
                          hours.day === openStatus.nextOpeningDay
                      )?.openHour
                    }`
                  : `Tutup ${openStatus.closing}`
                : " "}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
