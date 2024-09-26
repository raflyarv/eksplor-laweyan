import { TouchableOpacity, View, Text, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Region,
  Callout,
} from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "expo-router";

const INITIAL_REGION = {
  latitude: -7.56978246243824,
  longitude: 110.7968015376953,
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

const markers = [
  {
    latitude: -7.569718650419353,
    longitude: 110.79690882605378,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    name: "Kantor Kelurahan Laweyan",
  },
  {
    latitude: -7.570019098590299,
    longitude: 110.79563008293876,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    name: "Solia Zigna",
  },
];

export default function Explore() {
  // const mapRef = useRef<MapView | any>(undefined);
  // const navigation = useNavigation();

  // const kelurahanLaweyan = {
  //   coordinate: {},
  //   title: "Kelurahan Laweyan",
  //   description: "Center for the location and navigation",
  // };

  // const soliaZigna = {
  //   coordinate: {},
  //   title: "Solia Zigna",
  //   description: "Hotel di Laweyan",
  // };

  const [errorMsg, setErrorMsg] = useState<any>(null);

  const [currentLocation, setCurrentLocation] = useState<any>({});
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
  });

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => {
  //       <TouchableOpacity onPress={focusMap}>
  //         <View style={{ padding: 10 }}>
  //           <Text> Focus </Text>
  //         </View>
  //       </TouchableOpacity>;
  //     },
  //   });
  // });

  // const focusMap = () => {
  //   const KelurahanLaweyan = INITIAL_REGION;

  //   mapRef.current.animateToRegion(KelurahanLaweyan);
  // };

  // const onRegionChange = (region: Region) => {
  //   console.log(region);
  // };

  // const onMarkerSelected = (marker: any) => {
  //   Alert.alert(marker.name);
  // };

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
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        // ref={mapRef}
        // onRegionChangeComplete={onRegionChange}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            // onPress={() => onMarkerSelected(marker)}
          >
            <Callout>
              <View style={{ padding: 10 }}>
                <Text> {marker.name} </Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {/* <Marker
          coordinate={{
            latitude: kelurahanLaweyan.coordinate.latitude,
            longitude: kelurahanLaweyan.coordinate.latitude
                    }}          title={kelurahanLaweyan.title}
          description={kelurahanLaweyan.description}
        /> */}
        {/* <Marker
          coordinate={{
            latitude: -7.570019098590299,
            longitude: 110.79563008293876,
          }}
        /> */}
        {/* <Marker coordinate={currentLocation} /> */}
      </MapView>
    </View>
  );
}
