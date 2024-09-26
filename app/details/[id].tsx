import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { DynamicAvatar, RatingStar } from "../_components";
import { Icon } from "react-native-elements";
import { color } from "react-native-elements/dist/helpers";

// Perlu dibuat Models untuk cetakan
interface OpeningHours {
  day: string;
  openHour: string;
  closeHour: string;
}

function getCurrentTime(): string {
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();

  const formattedTime = `${hours.toString().padStart(2, "0")}.${minutes
    .toString()
    .padStart(2, "0")}`;

  return formattedTime;
}

const dataJamOperasional =
  "Senin 10.00 - 17.00,Selasa 10.00 - 17.00,Rabu 10.00 - 17.00,Kamis 10.00 - 17.00,Jumat 10.00 - 17.00";

const modifiedResult: OpeningHours[] = dataJamOperasional
  .split(",")
  .map((entry) => {
    const [day, open, , close] = entry.split(" ");

    return {
      day,
      openHour: open,
      closeHour: close,
    };
  });

const daysMap: { [key: number]: string } = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

function getOpenCloseStatus(): {
  indicator: string;
  opening: string | null;
  closing: string | null;
} {
  const now = new Date();

  const currentDay = daysMap[now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const todayHours = modifiedResult.find((hours) => hours.day === currentDay);

  if (!todayHours) {
    return {
      indicator: "Tutup",
      opening: null,
      closing: null,
    };
  }

  const [openHour, openMinute] = todayHours.openHour.split(".").map(Number);
  const [closeHour, closeMinute] = todayHours.closeHour.split(".").map(Number);

  const isOpenNow =
    (currentHour > openHour ||
      (currentHour === openHour && currentMinute >= openMinute)) &&
    (currentHour < closeHour ||
      (currentHour === closeHour && currentMinute <= closeMinute));

  return {
    indicator: isOpenNow ? "Buka" : "Tutup",
    opening: todayHours.openHour,
    closing: todayHours.closeHour,
  };
}

export default function SiteDetails() {
  const status = getOpenCloseStatus();
  const [isOpenDropdown, setIsOpenDropwdown] = useState(false);

  const { id } = useLocalSearchParams<{ id: string }>();

  const [starRating, setStarRating] = useState(0);

  return (
    <ScrollView
      style={{
        paddingHorizontal: spacing.medium,
      }}
    >
      <View
        style={{
          width: 200,
          height: 250,
          backgroundColor: "grey",
          marginTop: spacing.medium,
        }}
      ></View>

      <View>
        {/* Title & Bookmark */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: spacing.small,
          }}
        >
          <Text
            style={[typography.title3Bold, { width: 300 }]}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {id}
          </Text>

          <MaterialIcons
            name="bookmark-outline"
            size={24}
            color={colors.brand.main}
          />
        </View>

        {/* Rating and Distance */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: spacing.small,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="star" size={16} color={colors.warning} />
            <Text style={[typography.subhead, { color: colors.text.main }]}>
              {" "}
              4.5{" "}
            </Text>
            <Text style={[typography.subhead, { color: colors.text.main }]}>
              {" "}
              (100){" "}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              columnGap: spacing.small,
              alignItems: "center",
            }}
          >
            <MaterialIcons name="near-me" size={16} color={colors.success} />
            <Text style={[typography.subhead, { color: colors.text.main }]}>
              100 m{" "}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              columnGap: spacing.small,
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="directions-walk"
              size={16}
              color={colors.success}
            />
            <Text style={[typography.subhead, { color: colors.text.main }]}>
              10 menit{" "}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            columnGap: spacing.small,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            marginBottom: spacing.medium,
          }}
        >
          <MaterialIcons name="location-on" size={16} color={colors.danger} />
          <Text style={typography.subhead}>
            Jl. Setono No.22, Laweyan, Kec. Laweyan, Kota Surakarta, Jawa Tengah
            57148
          </Text>
        </View>

        <View
          style={{
            marginBottom: spacing.medium,
          }}
        >
          <Text style={typography.headline}>Fakta Unik</Text>
          <View>
            <MaterialIcons
              name="check-circle"
              size={32}
              color={colors.success}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 1,
              }}
            />
            <View
              style={{
                width: 280,
                maxHeight: 120,
                borderRadius: 5,
                marginStart: 15,
                marginTop: 10,
                paddingHorizontal: spacing.medium,
                paddingVertical: spacing.medium,
                position: "relative",
                zIndex: 0,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.1,
                shadowRadius: 1.41,

                elevation: 2,
              }}
            >
              <Text
                style={{
                  textAlign: "auto",
                }}
                ellipsizeMode="tail"
                numberOfLines={4}
              >
                Lorem ipsum dolor sit amet consectetur. Risus quis non mattis
                proin amet turpis pharetra ullamcorper.
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.small,
            }}
          >
            <Text style={[typography.headline]}>Seputar </Text>

            <Text
              style={[
                {
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  backgroundColor: colors.brand.main,
                  color: "white",
                },
                typography.headline,
              ]}
            >
              Rumah Batik Laweyan
            </Text>
          </View>

          <Text style={[typography.subhead, { textAlign: "justify" }]}>
            Lorem ipsum dolor sit amet consectetur. Leo platea et in amet cras
            et non in. Sed varius cum dapibus ultrices at. Ut massa donec tempor
            eleifend. Risus tincidunt turpis turpis et pellentesque sagittis.
          </Text>
        </View>

        {/* Jam Operasional Dropdown */}
        <View
          style={{
            flexDirection: "row",
            height: "auto",
            justifyContent: "space-between",
            alignItems: isOpenDropdown ? "flex-start" : "center",
            marginBottom: spacing.medium,
          }}
        >
          <View
            style={{
              width: "auto",
            }}
          >
            <Text style={[typography.headline]}> Jam Operasional </Text>
          </View>
          <Pressable
            style={{
              width: "55%",
            }}
            onPress={() => setIsOpenDropwdown(!isOpenDropdown)}
          >
            <View
              style={{
                flexDirection: "column",
              }}
            >
              {isOpenDropdown ? (
                modifiedResult.map((hari, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          width: "30%",
                        }}
                      >
                        {hari.day}
                      </Text>
                      <Text
                        style={{
                          width: "55%",
                        }}
                      >
                        : {hari.openHour} - {hari.closeHour}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <View
                  style={{
                    width: "auto",
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      color:
                        status.indicator === "Tutup"
                          ? colors.danger
                          : colors.success,
                    }}
                  >
                    {status.indicator}
                  </Text>

                  <Text
                    style={{
                      width: "10%",
                      color: colors.text.disable,
                    }}
                  >
                    &#x2022;
                  </Text>

                  <View
                    style={{
                      width: "auto",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        width: 100,
                        color: colors.text.disable,
                      }}
                    >
                      {status.indicator === "Buka"
                        ? `Tutup ${status.closing}`
                        : `Buka ${status.opening}`}
                    </Text>

                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={18}
                      color={colors.text.disable}
                    />
                  </View>
                </View>
              )}
            </View>
          </Pressable>
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.medium,
          }}
        >
          <Text style={[typography.headline]}> Ulasan (5) </Text>
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/details/reviews",
                params: { id: id },
              });
            }}
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
              marginRight: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <DynamicAvatar
                imageUrl="https://invalid-link.com/avatar.jpg"
                name="Muhammad Tohir Rafly"
                size={50}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text style={[typography.subhead]}> Muhammad Tohir Rafly </Text>
                <Text style={[typography.footnote]}> 10 ulasan </Text>
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
                gap: 5,
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <DynamicAvatar
                imageUrl="https://invalid-link.com/avatar.jpg"
                name="Muhammad Tohir Rafly"
                size={50}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text style={[typography.subhead]}> Muhammad Tohir Rafly </Text>
                <Text style={[typography.footnote]}> 10 ulasan </Text>
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
    </ScrollView>
  );
}
