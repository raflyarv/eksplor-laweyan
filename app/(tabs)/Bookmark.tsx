import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import { FullScreenLoading, SiteListCard } from "../_components";
import useFetchBookmarks from "../_hooks/api/bookmarks/useFetchBookmarks";
import { averageRating } from "../utils/averageRating";
import { calculateDistance, formatDistance } from "../utils/distanceUtils";
import { calculateWalkingTime } from "../utils/calculateWalkingTime";
import { useUserLocation } from "../_hooks/context/UserLocationContext";
import { getOpenCloseStatus } from "../utils/openingHours";
import { router, useRouter } from "expo-router";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { typography } from "@/theme/typography";

// Assuming you have an asset named 'checkmark-icon.png' in your assets folder
const CHECKMARK_ICON = require("@/assets/static/icons/saved-location.png");

const INITIAL_REGION = {
  latitude: -7.56978246243824,
  longitude: 110.7968015376953,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

const mapStyle = [
  {
    featureType: "poi",
    elementType: "all",
    stylers: [
      { visibility: "off" }, // This hides all points of interest
    ],
  },
];

export default function Bookmark() {
  const { userBookmarks, loading, refetch } = useFetchBookmarks();
  const { currentLocation } = useUserLocation();
  const { push } = useRouter();

  return (
    <>
      {loading && <FullScreenLoading />}
      <View style={{ flex: 1 }}>
        {/* MapView */}
        <View style={{ width: "100%", height: 300 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ width: "100%", height: "100%" }}
            initialRegion={INITIAL_REGION}
            showsUserLocation
            customMapStyle={mapStyle}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            {userBookmarks?.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                // Custom marker with a checkmark image
                image={CHECKMARK_ICON}
              >
                <Callout
                  onPress={() =>
                    router.push({
                      pathname: "/details/[id]",
                      params: { id: marker.id },
                    })
                  }
                >
                  <View style={{ padding: 10 }}>
                    <Text> {marker.siteName} </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>

        {/* Title "Bookmark" fixed at the top */}
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              width: "100%",
              position: "absolute",
              top: 0,
              left: spacing.medium,
              zIndex: 10,
              backgroundColor: colors.background.offwhite,
              paddingVertical: spacing.medium,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: colors.brand.main,
              }}
            >
              Bookmark
            </Text>
          </View>

          {/* ScrollView for bookmark list */}
          <ScrollView
            contentContainerStyle={{
              paddingTop: 60, // Push content below the fixed "Bookmark" title
              paddingHorizontal: spacing.medium,
            }}
            style={{
              backgroundColor: colors.background.offwhite,
              flex: 1,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            {userBookmarks && userBookmarks.length === 0 ? (
              <View
                style={{
                  width: "100%",
                  height: 300,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: spacing.medium,
                }}
              >
                <Image
                  style={{
                    width: 200,
                    height: 200,
                  }}
                  source={require("@/assets/static/empty-bookmark.png")}
                />
                <Text
                  style={[
                    typography.subhead,
                    { color: colors.text.disable, fontStyle: "italic" },
                  ]}
                >
                  {" "}
                  Belum ada yang disimpan.{" "}
                </Text>
                <Pressable onPress={() => push("/Explore")}>
                  <Text
                    style={[
                      typography.subhead,
                      {
                        color: colors.brand.main,
                        fontStyle: "italic",
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    {" "}
                    Jelajah sekarang!{" "}
                  </Text>
                </Pressable>
              </View>
            ) : (
              userBookmarks
                ?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                ) // Sort by createdAt, descending

                .map((bookmark, index) => {
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
                    <SiteListCard
                      key={`bookmark-${index}`}
                      id={bookmark.id}
                      siteName={bookmark.siteName}
                      address={bookmark.address}
                      avrgRating={averageRating(bookmark.reviews)}
                      reviewCount={bookmark.reviews.length}
                      formattedDistance={formatDistance(distance)}
                      walkingTime={calculateWalkingTime(distance)}
                      openStatus={openStatus}
                      images={bookmark.images}
                      reviews={bookmark.reviews}
                      onBookmarkToggled={refetch}
                    />
                  );
                })
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
}
