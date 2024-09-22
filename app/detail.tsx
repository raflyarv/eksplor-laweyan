import { View, Text, ScrollView } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function DetailWisata() {
  const dataJamOperasional =
    "Senin 10.00 - 17.00,Selasa 10.00 - 17.00,Rabu 10.00 - 17.00,Kamis 10.00 - 17.00,Jumat 10.00 - 17.00";

  const result = dataJamOperasional.split(",");

  const modifiedResult = dataJamOperasional.split(",").map((entry) => {
    const [hari, jamBuka, , jamTutup] = entry.split(" ");

    return {
      hari,
      openHour: jamBuka,
      closeHour: jamTutup,
    };
  });

  console.log(modifiedResult);
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
            Rumah Batik Laweyan
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
                borderWidth: 1,
                borderColor: "grey",
                borderRadius: 5,
                marginStart: 15,
                marginTop: 10,
                paddingHorizontal: spacing.medium,
                paddingVertical: spacing.medium,
                position: "relative",
                zIndex: 0,
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

        <View
          style={{
            flexDirection: "row",
            height: "auto",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: "auto",
            }}
          >
            <Text style={[typography.headline]}> Jam Operasional </Text>
          </View>
          <View
            style={{
              width: "40%",
              flexDirection: "column",
            }}
          >
            {result.map((hari, index) => {
              return <Text key={index}>{hari}</Text>;
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
