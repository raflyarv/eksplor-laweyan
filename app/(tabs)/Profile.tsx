import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { Icon } from "react-native-elements";
import { DynamicAvatar, RatingStar } from "../_components";
import { router } from "expo-router";

export default function Profile() {
  return (
    <View
      style={{
        flex: 1, // Occupy full screen height
        justifyContent: "center", // Centers vertically
        backgroundColor: "white", // Optional: Background color for better visuals
      }}
    >
      <View
        style={{
          paddingHorizontal: spacing.medium,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <TouchableOpacity>
            <MaterialIcons
              name="account-circle"
              size={150}
              color={colors.disable}
            />
          </TouchableOpacity>
          <Text
            style={[
              typography.title3Bold,
              { color: colors.brand.main, marginBottom: 15 },
            ]}
          >
            {" "}
            Muhammad Tohir Rafly{" "}
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              columnGap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/profile/edit-profile")}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.brand.main,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                columnGap: 3,
              }}
            >
              <MaterialIcons name="edit" size={18} color="white" />
              <Text style={[typography.subhead, { color: "white" }]}>
                {" "}
                Edit Profil{" "}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/profile/edit-profile")}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderColor: colors.danger,
                borderWidth: 2,
                borderRadius: 5,
                columnGap: 3,
              }}
            >
              <MaterialIcons
                name="exit-to-app"
                size={18}
                color={colors.danger}
              />
              <Text style={[typography.subhead, { color: colors.danger }]}>
                Keluar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Text style={[typography.headline, { color: colors.text.main }]}>
            {" "}
            Ulasan yang Diberikan (10){" "}
          </Text>

          <Pressable
          // onPress={() => {
          //   router.push({
          //     pathname: "/details/reviews",
          //     params: { id: id },
          //   });
          // }}
          >
            <Text style={[typography.subhead]}> Lihat Semua </Text>
          </Pressable>
        </View>

        <ScrollView horizontal>
          <View
            style={{
              width: 360,
              height: "auto",
              paddingHorizontal: 15,
              paddingVertical: 15,

              borderRadius: 10,
              backgroundColor: "#FFF1EC",
            }}
          >
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 5,
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <View
                style={{
                  width: "70%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text
                  style={[typography.headline]}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  Nama Tempat Wisata yang sangat panjang omo omo omo{" "}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  alignSelf: "flex-start",
                }}
              >
                <TouchableOpacity
                  // onPress={pickImage}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                    columnGap: 3,
                  }}
                >
                  <MaterialIcons
                    name="edit"
                    size={20}
                    color={colors.brand.main}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={pickImage}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                    columnGap: 3,
                  }}
                >
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color={colors.danger}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginBottom: 8,
              }}
            >
              <RatingStar rating={4} isEditable={false} />
              <Icon
                name="circle"
                type="material"
                size={10}
                color={colors.disable}
              />
              <Text style={[typography.footnote]}> 10 bulan yang lalu </Text>
            </View>

            <View
              style={{
                width: "100%",
                display: "flex",
                marginBottom: 8,
              }}
            >
              <Text style={[typography.footnote]}>
                Dikujungi pada 12 September 2022
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <Text style={[typography.subhead, { fontWeight: "600" }]}>
                Judul Review !{" "}
              </Text>
              <Text
                style={[typography.subhead]}
                ellipsizeMode="tail"
                numberOfLines={4}
              >
                Lorem ipsuum bismillah doa untuk semua hari ini pada pagi ini
                cemungut eakkkkkk Lorem ipsuum bismillah doa untuk semua hari
                ini pada pagi ini cemungut eakkkkkk Lorem ipsuum bismillah doa
                untuk semua hari ini pada pagi ini cemungut eakkkkkk Lorem
                ipsuum bismillah doa untuk semua hari ini pada pagi ini cemungut
                eakkkkkk Lorem ipsuum bismillah doa untuk semua hari ini pada
                pagi ini cemungut eakkkkkk Lorem ipsuum bismillah doa untuk
                semua hari ini pada pagi ini cemungut eakkkkkk
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
