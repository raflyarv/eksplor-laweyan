import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";

import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Link,
  router,
  useFocusEffect,
  useNavigation,
  useRouter,
} from "expo-router";
import ImageCard from "../_components/ImageCard";
import { averageRating } from "../utils/averageRating";
import { calculateDistance, formatDistance } from "../utils/distanceUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetchSites from "../_hooks/api/sites/useFetchSites";
import { useUserLocation } from "../_hooks/context/UserLocationContext";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { useAuth } from "../_hooks/context/AuthContext";
import { useNavHistory } from "../_hooks/context/NavigationContext";

const INITIAL_REGION = {
  latitude: -7.56978246243824,
  longitude: 110.7968015376953,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

export default function HomeScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const [selectedTab, setSelectedTab] = useState("Terdekat");
  const [errorMsg, setErrorMsg] = useState<any>(null);

  const { currentLocation } = useUserLocation();
  const { refetchUserData, userData } = useAuth();
  const [userCurrentLocation, setUserCurrentLocation] = useState<any>({});

  const { push } = useNavHistory();

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      push("");
    }, [])
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});
      setUserCurrentLocation({ latitude, longitude });
    })();
  }, []);

  useEffect(() => {
    refetchUserData();
  }, []);

  const { siteLists, loading } = useFetchSites();

  return (
    <>
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: 400,
            zIndex: -1,
          }}
        >
          <Image
            source={require("@/assets/static/bg-image/batik-artist.jpg")}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              width: "100%",
              height: "100%",
              zIndex: -1, // Ensure the image stays behind the overlay
            }}
          />
          {/* Dark overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity for darkness
              zIndex: 1, // Ensures the overlay is above the image
            }}
          />
        </View>
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "flex-start",
            zIndex: 1,
            marginTop: 220,
            paddingHorizontal: spacing.medium,
          }}
        >
          <Text style={[typography.largeTitleMed, { color: "white" }]}>
            Matur Nuwun{" "}
          </Text>
          <Text style={[typography.title1, { color: "white" }]}>
            Mau Ke Mana Hari Ini?{" "}
          </Text>
        </View>
        <SafeAreaView style={{ flex: 1, zIndex: 2 }}>
          {/* Background Image */}

          {/* Scrollable Content */}
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: "transparent",
            }}
            contentContainerStyle={{
              paddingTop: 300,
            }}
          >
            {/* Content below the image */}
            <SafeAreaView
              style={{
                paddingHorizontal: spacing.medium,
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                backgroundColor: "white",
                paddingTop: -10,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: spacing.medium,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    columnGap: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      columnGap: 5,
                      paddingVertical: 8,
                      borderRadius: 5,
                      backgroundColor:
                        selectedTab === "Terdekat"
                          ? colors.brand.main
                          : "#FFF0EC",
                    }}
                    onPress={() => setSelectedTab("Terdekat")}
                  >
                    <MaterialIcons
                      size={20}
                      name="near-me"
                      color={
                        selectedTab === "Terdekat" ? "white" : colors.primary
                      }
                    />
                    <Text
                      style={[
                        typography.body,
                        {
                          color:
                            selectedTab === "Terdekat"
                              ? "white"
                              : colors.text.main,
                        },
                      ]}
                    >
                      Terdekat
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      columnGap: 5,
                      paddingVertical: 7,
                      borderRadius: 5,
                      backgroundColor:
                        selectedTab === "Populer"
                          ? colors.brand.main
                          : "#FFF0EC",
                    }}
                    onPress={() => setSelectedTab("Populer")}
                  >
                    <MaterialIcons
                      size={20}
                      name="stars"
                      color={selectedTab === "Populer" ? "white" : "#E29804"}
                    />
                    <Text
                      style={[
                        typography.body,
                        {
                          color:
                            selectedTab === "Populer"
                              ? "white"
                              : colors.text.main,
                        },
                      ]}
                    >
                      {" "}
                      Populer{" "}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => push("/search")}>
                  <Text
                    style={[
                      typography.subhead,
                      {
                        color: colors.brand.light,
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    Lihat Semua
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal={true}
                style={{
                  marginBottom: 20,
                }}
              >
                {selectedTab === "Terdekat"
                  ? siteLists
                      ?.sort((a, b) => {
                        const distanceA = calculateDistance(
                          currentLocation?.latitude || 0,
                          currentLocation?.longitude || 0,
                          a.latitude,
                          a.longitude
                        );
                        const distanceB = calculateDistance(
                          currentLocation?.latitude || 0,
                          currentLocation?.longitude || 0,
                          b.latitude,
                          b.longitude
                        );
                        return distanceA - distanceB; // Sort by nearest distance
                      })
                      .map((item, index) => {
                        const distance = calculateDistance(
                          currentLocation?.latitude || 0,
                          currentLocation?.longitude || 0,
                          item.latitude,
                          item.longitude
                        );

                        return (
                          <ImageCard
                            key={index}
                            id={`${item.id}`}
                            name={item.siteName}
                            isLoading={loading}
                            averageRating={averageRating(item.reviews)}
                            reviewTotal={item.reviews?.length}
                            distance={formatDistance(distance)}
                            imageUrl={`${baseUrl}/${item.images[0].url}`}
                            onNavigate={(id) => push(`/details/${id}`)}
                          />
                        );
                      })
                  : siteLists
                      ?.sort(
                        (a, b) =>
                          averageRating(b.reviews) - averageRating(a.reviews)
                      ) // Sort by highest rating
                      .map((item, index) => {
                        const distance = calculateDistance(
                          currentLocation?.latitude || 0,
                          currentLocation?.longitude || 0,
                          item.latitude,
                          item.longitude
                        );

                        return (
                          <ImageCard
                            key={index}
                            id={`${item.id}`}
                            name={item.siteName}
                            isLoading={loading}
                            averageRating={averageRating(item.reviews)}
                            reviewTotal={item.reviews?.length}
                            distance={formatDistance(distance)}
                            imageUrl={`${baseUrl}/${item.images[0].url}`}
                            onNavigate={(id) => push(`/details/${id}`)}
                          />
                        );
                      })}
              </ScrollView>

              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: spacing.medium,
                }}
              >
                {/* Title and Subtitle */}
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: spacing.medium,
                    columnGap: 5,
                  }}
                >
                  <Text
                    style={[
                      {
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                        borderRadius: 5,
                        backgroundColor: colors.brand.main,
                        color: "white",
                      },
                      typography.title3Bold,
                    ]}
                  >
                    Jelajahi
                  </Text>
                  <Text
                    style={[
                      typography.title3Bold,
                      { color: colors.brand.main },
                    ]}
                  >
                    Kampung Batik Laweyan
                  </Text>
                </View>

                {/* MapView */}
                <View
                  style={{ position: "relative", width: "100%", height: 200 }}
                >
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ width: "100%", height: "100%" }}
                    initialRegion={INITIAL_REGION}
                    showsUserLocation
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                  >
                    {siteLists?.map((marker, index) => (
                      <Marker
                        key={index}
                        coordinate={{
                          latitude: marker.latitude,
                          longitude: marker.longitude,
                        }}
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

                  {/* Overlay with button */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => router.push("/Explore")}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        style={[
                          typography.subhead,
                          {
                            color: "white",
                            fontWeight: "bold",
                            textDecorationLine: "underline",
                          },
                        ]}
                      >
                        Mulai Jelajah
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>

          <TouchableOpacity
            onPress={() => router.push("/scan-qr")}
            style={{
              position: "absolute",
              bottom: 30,
              right: 30,
              width: 60,
              height: 60,
              borderRadius: 100,
              backgroundColor: colors.brand.main,
              justifyContent: "center",
              alignItems: "center",
              elevation: 8,
            }}
          >
            <MaterialIcons name="qr-code-scanner" size={30} color={"white"} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: spacing.medium,
    rowGap: 10,
    top: 0,
    position: "relative",
  },

  searchBar: {
    width: "100%",
    height: 56,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: colors.brand.main,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: spacing.medium,
    backgroundColor: "white",
  },
  input: {
    width: 300,
    height: "100%",
  },
});
