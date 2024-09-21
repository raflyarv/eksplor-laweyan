import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";

import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const [selectedTab, setSelectedTab] = useState("Terdekat");

  const terdekatData = [
    {
      lokasiID: "1122",
      nama: "Rumah Batik Laweyan",
      ulasan: [
        {
          id: 1,
          rating: 5,
        },
        {
          id: 2,
          rating: 3,
        },
      ],
      jarak: 100,
      imageUri:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_9TclsHMaZgj6jecm1ryOnuATCWNG2evM6Q&s",
    },

    {
      lokasiID: "1123",
      nama: "Esensi Coffee & Batik Lokakarya Setempat",
      ulasan: [
        {
          id: 1,
          rating: 3,
        },
        {
          id: 2,
          rating: 4,
        },
      ],
      jarak: 10,
      imageUri:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEaUAahCeFTygci14Kqa6WEXXLQBaQlODpdg&s",
    },

    {
      lokasiID: "1124",
      nama: "Esensi Coffee & Batik",
      ulasan: [
        {
          id: 1,
          rating: 3,
        },
        {
          id: 2,
          rating: 4,
        },
      ],
      jarak: 10,
      imageUri:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEaUAahCeFTygci14Kqa6WEXXLQBaQlODpdg&s",
    },
  ];

  const popularData = [
    "Site X (Popular)",
    "Site Y (Popular)",
    "Site Z (Popular)",
  ];

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
        paddingHorizontal: spacing.medium,
        paddingTop: spacing.medium,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          paddingBottom: 10,
          marginBottom: spacing.medium,
        }}
      >
        <Text style={typography.largeTitleMed}>Matur Nuwun </Text>
        <Text style={typography.title1}>Mau Ke Mana Hari Ini? </Text>
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
            columnGap: spacing.small,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
              columnGap: 9,
              paddingVertical: 7,
              borderRadius: 5,
              backgroundColor:
                selectedTab === "Terdekat" ? colors.brand.main : "transparent",
            }}
            onPress={() => setSelectedTab("Terdekat")}
          >
            <MaterialIcons
              size={20}
              name="stars"
              color={selectedTab === "Terdekat" ? "white" : colors.warning}
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
              columnGap: 9,
              paddingVertical: 7,
              borderRadius: 5,
              backgroundColor:
                selectedTab === "Populer" ? colors.brand.main : "transparent",
            }}
            onPress={() => setSelectedTab("Populer")}
          >
            <MaterialIcons
              size={20}
              name="near-me"
              color={selectedTab === "Populer" ? "white" : colors.primary}
            />
            <Text
              style={[
                typography.body,
                {
                  color: selectedTab === "Populer" ? "white" : colors.text.main,
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
          ? terdekatData.map((item, index) => {
              const totalRating = item.ulasan.reduce(
                (sum, ulasan) => sum + ulasan.rating,
                0
              );
              const averageRating = item.ulasan.length
                ? (totalRating / item.ulasan.length).toFixed(1)
                : 0;

              return (
                <ImageBackground
                  key={index}
                  source={{
                    uri: item.imageUri,
                  }}
                  resizeMode="cover"
                  borderRadius={5}
                  style={{
                    marginEnd: 9,
                  }}
                >
                  <View
                    style={{
                      width: 175,
                      height: 250,
                      flex: 1,
                      borderRadius: 5,
                      justifyContent: "flex-end",
                    }}
                  >
                    <LinearGradient
                      colors={["rgba(255,255,255,0)", "rgba(0,0,0,0.552)"]} // Gradient colors
                      locations={[0.07, 0.2]} // Corresponding positions for the colors
                      style={{
                        borderRadius: 5,
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: spacing.medium,
                          paddingVertical: spacing.medium,
                        }}
                      >
                        <Text
                          style={[
                            typography.headline,
                            { color: "white", marginBottom: spacing.small },
                          ]}
                          ellipsizeMode="tail"
                          numberOfLines={2}
                        >
                          {item.nama}{" "}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            columnGap: spacing.medium,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <MaterialIcons
                              name="star"
                              size={16}
                              color={colors.warning}
                            />
                            <Text
                              style={[typography.footnote, { color: "white" }]}
                            >
                              {" "}
                              {averageRating}{" "}
                            </Text>
                            <Text
                              style={[typography.footnote, { color: "white" }]}
                            >
                              {" "}
                              ({item.ulasan.length}){" "}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <MaterialIcons
                              name="near-me"
                              size={16}
                              color={colors.success}
                            />
                            <Text
                              style={[typography.footnote, { color: "white" }]}
                            >
                              {item.jarak} m{" "}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </ImageBackground>
              );
            })
          : popularData.map((item, index) => (
              <View
                key={index}
                style={{
                  width: 172,
                  height: 250,
                  backgroundColor: "orange",
                  marginEnd: 12,
                  borderRadius: 10,
                }}
              >
                <Text> {item} </Text>
              </View>
            ))}
        {/* <View
          style={{
            width: 180,
            height: 250,
            backgroundColor: "orange",
            marginEnd: 12,
            borderRadius: 10,
          }}
        ></View>

        <View
          style={{
            width: 180,
            height: 250,
            backgroundColor: "orange",
            marginEnd: 12,
            borderRadius: 10,
          }}
        ></View>

        <View
          style={{
            width: 180,
            height: 250,
            backgroundColor: "orange",
            marginEnd: 12,
            borderRadius: 10,
          }}
        ></View>

        <View
          style={{
            width: 180,
            height: 250,
            backgroundColor: "orange",
            marginEnd: 12,
            borderRadius: 10,
          }}
        ></View> */}
      </ScrollView>

      <View>
        <Text style={[typography.headline, { color: colors.brand.main }]}>
          {" "}
          Terakhir Dilihat{" "}
        </Text>
        <ScrollView horizontal={true}></ScrollView>
      </View>
    </ScrollView>
  );
}
