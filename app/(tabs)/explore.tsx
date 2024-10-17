import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  Dimensions,
  PanResponder,
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
import { MenuView } from "@react-native-menu/menu";
import { Picker } from "@react-native-picker/picker";
import { SlidingContainer } from "../_components";
import useFetchSites from "../_hooks/api/sites/useFetchSites";
import { router } from "expo-router";

const INITIAL_REGION = {
  latitude: -7.56978246243824,
  longitude: 110.7968015376953,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

interface MarkerProps {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const markers: MarkerProps[] = [
  {
    name: "Kantor Kelurahan Laweyan",
    coordinates: {
      latitude: -7.569718650419353,
      longitude: 110.79690882605378,
    },
  },
  {
    name: "Solia Zigna",

    coordinates: {
      latitude: -7.570019098590299,
      longitude: 110.79563008293876,
    },
  },
];

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Explore() {
  const [errorMsg, setErrorMsg] = useState<any>(null);

  const [currentLocation, setCurrentLocation] = useState<any>({});
  const { siteLists } = useFetchSites();

  const [chosenSource, setIsChosenSource] = useState<any>({});
  const [chosenDestination, setIsChosenDestination] = useState<any>({});

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
        >
          {siteLists?.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              onPress={() => handleMapPress(marker.siteName)}
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

        <View style={styles.searchContainer}>
          <Text style={[typography.title1Bold, { color: colors.brand.main }]}>
            Explore
          </Text>
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
    marginTop: spacing.medium,
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
    width: 300,
    height: "100%",
  },

  picker: {
    height: 50,
    width: 150,
    paddingHorizontal: 2,
    marginBottom: 20,
  },
});
