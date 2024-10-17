import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import { BookmarkButton, FullScreenLoading, RatingStar } from "../_components";
import { typography } from "@/theme/typography";
import useFetchBookmarks from "../_hooks/api/bookmarks/useFetchBookmarks";
import { averageRating } from "../utils/averageRating";
import { calculateDistance, formatDistance } from "../utils/distanceUtils";
import { calculateWalkingTime } from "../utils/calculateWalkingTime";
import { useUserLocation } from "../_hooks/context/UserLocationContext";
import { getOpenCloseStatus } from "../utils/openingHours";
import { router } from "expo-router";

export default function Bookmark() {
  const { userBookmarks, loading } = useFetchBookmarks();
  const { currentLocation } = useUserLocation();

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  return (
    <>
      {loading && <FullScreenLoading />}

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: spacing.medium,
          backgroundColor: colors.background.offwhite,
        }}
      >
        <SafeAreaView>
          <View
            style={{
              marginBottom: spacing.medium,
            }}
          >
            <Text style={[typography.title1Bold, { color: colors.brand.main }]}>
              Bookmark{" "}
            </Text>
          </View>
          {userBookmarks?.map((bookmark, index) => {
            const distance = calculateDistance(
              currentLocation?.latitude || 0,
              currentLocation?.longitude || 0,
              bookmark.latitude || 0,
              bookmark.longitude || 0
            );

            const openStatus = getOpenCloseStatus(
              bookmark.operationalHours || ""
            );

            return (
              <Pressable
                key={`bookmark-${index}`}
                onPress={() =>
                  router.push({
                    pathname: "/details/[id]",
                    params: { id: bookmark.id },
                  })
                }
              >
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
                    data={bookmark.images}
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
                          marginEnd:
                            index === bookmark.images.length - 1 ? 0 : 5, // Set margin to 0 if it's the last item
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
                        style={[
                          typography.headline,
                          { flex: 1, marginRight: 10 },
                        ]}
                      >
                        {bookmark.siteName}
                      </Text>
                      <BookmarkButton locationId={bookmark.id} />
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
                          style={[
                            typography.subhead,
                            { color: colors.text.disable },
                          ]}
                        >
                          {" "}
                          {averageRating(bookmark.reviews)}{" "}
                        </Text>
                        <RatingStar
                          rating={averageRating(bookmark.reviews)}
                          isEditable={false}
                        />
                        <Text
                          style={[
                            typography.subhead,
                            { color: colors.text.disable },
                          ]}
                        >
                          {" "}
                          ({bookmark.reviews.length}){" "}
                        </Text>
                      </View>

                      <View>
                        <Text
                          style={[
                            typography.subhead,
                            { color: colors.text.disable },
                          ]}
                        >
                          {" "}
                          {formatDistance(distance)}{" "}
                        </Text>
                      </View>

                      <View>
                        <Text
                          style={[
                            typography.subhead,
                            { color: colors.text.disable },
                          ]}
                        >
                          {" "}
                          {calculateWalkingTime(distance)}{" "}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        width: "100%",
                        marginBottom: 8,
                      }}
                    >
                      <Text style={[typography.subhead]}>
                        {bookmark.address}{" "}
                      </Text>
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
                      {openStatus.closing !== null &&
                        openStatus.opening !== null && (
                          <Text
                            style={{
                              color: colors.text.disable,
                            }}
                          >
                            &#x2022;
                          </Text>
                        )}

                      <Text
                        style={[
                          typography.subhead,
                          { color: colors.text.disable },
                        ]}
                      >
                        {openStatus.closing !== null &&
                        openStatus.opening !== null
                          ? openStatus.indicator === "Buka"
                            ? `Tutup ${openStatus.closing}`
                            : openStatus.nextOpeningDay
                            ? `Tutup, buka ${openStatus.nextOpeningDay} jam ${openStatus.opening}`
                            : `Buka ${openStatus.opening}`
                          : " "}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
