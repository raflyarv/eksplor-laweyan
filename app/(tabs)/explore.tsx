import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function Explore() {
  const kelurahanLaweyan = {
    coordinate: {
      latitude: -7.569718650419353,
      longitude: 110.79690882605378,
    },
    title: "Kelurahan Laweyan",
    description: "Center for the location and navigation",
  };

  const soliaZigna = {
    coordinate: {
      latitude: -7.570019098590299,
      longitude: 110.79563008293876,
    },
    title: "Solia Zigna",
    description: "Hotel di Laweyan",
  };

  const [errorMsg, setErrorMsg] = useState<any>(null);

  const [currentLocation, setCurrentLocation] = useState<any>({});

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission for the device location was denied.");
    }
  };

  const getCurrentLocation = async () => {
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync();
    return { latitude, longitude };
  };

  useEffect(() => {
    const fetchLocation = async () => {
      await requestLocationPermission();
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    };

    fetchLocation();
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{
          height: "100%",
          width: "100%",
        }}
        initialRegion={{
          latitude: -7.56978246243824,
          longitude: 110.7968015376953,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        region={currentLocation}
      >
        <Marker {...kelurahanLaweyan} />
        <Marker {...soliaZigna} />
        <Marker coordinate={currentLocation} />
      </MapView>
    </View>
  );
}
