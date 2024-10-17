import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useNavigation, useRouter } from "expo-router";
import sites from "@/assets/dummy/sites.json";
import ImageCard from "../_components/ImageCard";
import { averageRating } from "../utils/averageRating";
import { calculateDistance, formatDistance } from "../utils/distanceUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetchSites from "../_hooks/api/sites/useFetchSites";
import { useUserLocation } from "../_hooks/context/UserLocationContext";
import { TextInput } from "react-native";

export default function HomeScreen() {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const [selectedTab, setSelectedTab] = useState("Terdekat");
  const [errorMsg, setErrorMsg] = useState<any>(null);

  const { currentLocation } = useUserLocation();

  const { siteLists, loading, error } = useFetchSites();
  const { push, back } = useRouter();

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: spacing.medium,
          backgroundColor: "white",
        }}
      >
        <ScrollView>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start",
              paddingBottom: 10,
              marginBottom: spacing.small,
              marginTop: 20,
            }}
          >
            <Text style={typography.largeTitleMed}>Matur Nuwun </Text>
            <Text style={typography.title1}>Mau Ke Mana Hari Ini? </Text>
          </View>

          <View style={styles.searchContainer}>
            <TouchableOpacity
              onPress={() => push("/search")}
              style={styles.searchBar}
            >
              <TextInput
                style={[styles.input, typography]}
                placeholder="Pencarian"
                placeholderTextColor={colors.disable}
                readOnly
              />
              <MaterialIcons
                name="search"
                size={32}
                color={colors.brand.main}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
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
                    selectedTab === "Terdekat" ? colors.brand.main : "#FFF0EC",
                }}
                onPress={() => setSelectedTab("Terdekat")}
              >
                <MaterialIcons
                  size={20}
                  name="near-me"
                  color={selectedTab === "Terdekat" ? "white" : colors.primary}
                />
                <Text
                  style={[
                    typography.body,
                    {
                      color:
                        selectedTab === "Terdekat" ? "white" : colors.text.main,
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
                    selectedTab === "Populer" ? colors.brand.main : "#FFF0EC",
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
                        selectedTab === "Populer" ? "white" : colors.text.main,
                    },
                  ]}
                >
                  {" "}
                  Populer{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal={true}
            style={{
              marginBottom: spacing.medium,
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

                    return loading ? (
                      <Text> Loading </Text>
                    ) : (
                      <ImageCard
                        key={index}
                        id={`${item.id}`}
                        name={item.siteName}
                        averageRating={averageRating(item.reviews)}
                        reviewTotal={item.reviews?.length}
                        distance={formatDistance(distance)}
                        imageUrl={`${baseUrl}/${item.images[0].url}`}
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

                    return loading ? (
                      <Text> Loading </Text>
                    ) : (
                      <ImageCard
                        key={index}
                        id={`${item.id}`}
                        name={item.siteName}
                        averageRating={averageRating(item.reviews)}
                        reviewTotal={item.reviews?.length}
                        distance={formatDistance(distance)}
                        imageUrl={`${baseUrl}/${item.images[0].url}`}
                      />
                    );
                  })}
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
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
