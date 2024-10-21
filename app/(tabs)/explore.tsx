import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { Button } from "react-native-elements";
import { colors } from "@/theme/colors";
import { Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import useFetchSites from "../_hooks/api/sites/useFetchSites";
import { router, useRouter } from "expo-router";

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

export default function Explore() {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const [errorMsg, setErrorMsg] = useState<any>(null);

  const [currentLocation, setCurrentLocation] = useState<any>({});
  const { siteLists } = useFetchSites();

  const [chosenSource, setIsChosenSource] = useState<any>({});
  const [chosenDestination, setIsChosenDestination] = useState<any>({});

  const { push } = useRouter();

  const handleMapPress = (name: string) => {
    setIsChosenDestination(name);
  };

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
      setCurrentLocation({ latitude, longitude });
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          customMapStyle={mapStyle}
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
                tooltip={true}
                onPress={() =>
                  router.push({
                    pathname: "/details/[id]",
                    params: { id: marker.id },
                  })
                }
              >
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  {/* Site Name */}
                  <Text
                    style={[
                      typography.title3Bold,
                      { color: colors.brand.main },
                    ]}
                  >
                    {" "}
                    {marker.siteName}{" "}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        <View style={styles.searchContainer}>
          <Text
            style={[
              typography.title1Bold,
              {
                color: colors.brand.main,
                textShadowColor: "white", // White shadow color
                textShadowOffset: { width: 2, height: 2 }, // Shadow offset
                textShadowRadius: 0, // Shadow blur radius
              },
            ]}
          >
            Explore
          </Text>

          <TouchableOpacity
            onPress={() => push("/search")}
            style={styles.searchBar}
          >
            <TextInput
              style={[styles.input, typography.headline]}
              placeholder="Pencarian"
              placeholderTextColor={colors.disable}
              readOnly
            />
            <MaterialIcons name="search" size={32} color={colors.brand.main} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  map: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    position: "absolute",
  },
  buttonContainer: {
    position: "absolute",
    backgroundColor: "white",
    bottom: 0,
  },
  buttonGroup: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  searchContainer: {
    width: "100%",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
    paddingHorizontal: spacing.medium,
    marginTop: spacing.large,
    top: 0,
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
    flex: 1, // Allow the TextInput to take up remaining space
    height: "100%",
    marginRight: spacing.small, // Add margin to separate from the icon
  },

  picker: {
    height: 50,
    width: 150,
    paddingHorizontal: 2,
    marginBottom: 20,
  },
});
