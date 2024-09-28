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

  const [chosenSource, setIsChosenSource] = useState<any>({});
  const [chosenDestination, setIsChosenDestination] = useState<any>({});

  const handleMapPress = (coordinates: {}) => {
    setIsChosenDestination(coordinates);
    console.log(coordinates);
  };

  //   const { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     setErrorMsg("Permission for the device location was denied.");
  //   }
  // };

  // const getCurrentLocation = async () => {
  //   const {
  //     coords: { latitude, longitude },
  //   } = await Location.getCurrentPositionAsync();
  //   return { latitude, longitude };
  // };

  // useEffect(() => {
  //   const fetchLocation = async () => {
  //     await requestLocationPermission();
  //     const location = await getCurrentLocation();
  //     setCurrentLocation(location);
  //   };

  //   fetchLocation();
  // });

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

  console.log(currentLocation);

  const [sortOption, setSortOption] = useState("rating");
  const [categoryFilter, setCategoryFilter] = useState("");

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        // ref={mapRef}
        // onRegionChangeComplete={onRegionChange}
      >
        {/* <Polyline
          coordinates={[
            { latitude: -7.569718650419353, longitude: 110.79690882605378 },
            { latitude: -7.570019098590299, longitude: 110.79563008293876 },
          ]}
        /> */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinates}
            onPress={() => handleMapPress(marker.coordinates)}
          >
            <Callout>
              <View style={{ padding: 10 }}>
                <Text> {marker.name} </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={[styles.input, typography]}
            placeholder="Pencarian"
            placeholderTextColor={colors.disable}
          />
          <MaterialIcons name="search" size={32} color={colors.brand.main} />
        </View>

        <View
          style={{
            width: 140,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: 5,
            paddingVertical: 8,
            gap: 3,
          }}
        >
          <MaterialIcons name="tune" size={20} color={colors.brand.main} />
          <Text style={[typography.subhead, { color: colors.brand.main }]}>
            {" "}
            Sort/Filter{" "}
          </Text>
        </View>

        {/* 
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <Picker
            selectedValue={sortOption}
            onValueChange={(itemValue) => {
              setSortOption(itemValue);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Rating" value="rating" />
            <Picker.Item label="Most Popular" value="popularity" />
            <Picker.Item label="Nearest" value="nearest" />
          </Picker>

          <Picker
            selectedValue={sortOption}
            onValueChange={(itemValue) => {
              setSortOption(itemValue);
            }}
            style={styles.picker}
          >
            <Picker.Item label="All Categories" value="rating" />
            <Picker.Item label="Most Popular" value="popularity" />
            <Picker.Item label="Nearest" value="nearest" />
          </Picker>
        </View> */}
      </View>

      <SlidingContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
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
    alignItems: "flex-end",
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
