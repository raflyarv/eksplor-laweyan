import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import {
  BookmarkButton,
  ContactItems,
  DynamicAvatar,
  RatingStar,
  ReviewCards,
  ReviewFormModal,
  UniqueFactCard,
} from "@/app/_components";
import { Icon } from "react-native-elements";

import { SafeAreaView } from "react-native-safe-area-context";
import { SiteDetailsProps } from "@/app/_models/site.model";
import axios from "axios";
import { getOpenCloseStatus } from "@/app/utils/openingHours";
import { calculateWalkingTime } from "@/app/utils/calculateWalkingTime";
import { useUserLocation } from "@/app/_hooks/context/UserLocationContext";
import { calculateDistance, formatDistance } from "@/app/utils/distanceUtils";
import { averageRating } from "@/app/utils/averageRating";
import * as Linking from "expo-linking";

// Perlu dibuat Models untuk cetakan
interface OpeningHours {
  day: string;
  openHour: string;
  closeHour: string;
}

// Define the structure for the User who submitted the review
interface User {
  _id: string;
  fullName: string;
  profileImage: string | null; // profileImage can be null if not provided
  reviewCount: number;
}

// Define the structure for a Review
interface Review {
  userId: User; // Reference to the user who submitted the review
  locationId: number; // The location the review is related to
  rating: number; // The rating provided (e.g., 1 to 5)
  comments: string; // The content of the review
  dateVisited: string; // The date when the location was visited
  createdAt: string; // The date when the review was created
  updatedAt: string; // The date when the review was last updated
}

export default function SiteDetails() {
  const [isOpenDropdown, setIsOpenDropwdown] = useState(false);
  const [siteData, setSiteData] = useState<SiteDetailsProps>();
  const [siteReview, setSiteReview] = useState<Review[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // New state to track refresh

  const { id } = useLocalSearchParams<{ id: string }>();

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        // Fetch admin data from your backend API
        const response = await axios.get(`${baseUrl}/api/site/${id}`, {
          withCredentials: true,
        });
        setSiteData(response.data);
      } catch (error: any) {
        setSiteData(undefined);
      } finally {
        // setLoading(false);
      }
    };

    const fetchSiteReviews = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/review/location/${id}`,
          {
            withCredentials: true,
          }
        );

        setSiteReview(response.data.reviews);
      } catch (error: any) {
        setSiteReview([]);
      } finally {
      }
    };

    fetchSiteDetails();
    fetchSiteReviews();
  }, [id, refreshTrigger]);

  const result = getOpenCloseStatus(siteData?.operationalHours || "");
  const { currentLocation } = useUserLocation();

  console.log(currentLocation);

  const distance = useMemo(
    () =>
      calculateDistance(
        currentLocation?.latitude || 0,
        currentLocation?.longitude || 0,
        siteData?.latitude || 0,
        siteData?.longitude || 0
      ),
    [currentLocation, siteData]
  );

  const walkingTime = useMemo(() => calculateWalkingTime(distance), [distance]);

  const handleReviewSubmit = () => {
    setRefreshTrigger((prev) => !prev); // Toggle refresh trigger to cause useEffect to re-run
  };

  const handleDirections = () => {
    const latitude = siteData?.latitude; // Replace with your desired latitude
    const longitude = siteData?.longitude; // Replace with your desired longitude
    const url = `google.navigation:q=${latitude},${longitude}`;

    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL", err)
    );
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            width: "100%",
            position: "static",
            display: "flex",
            flexDirection: "row",
            paddingHorizontal: spacing.medium,
            paddingTop: 20,
            paddingBottom: 10,
            justifyContent: "space-between",
            columnGap: 10,
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.push("/(tabs)")}>
            <MaterialIcons
              name="arrow-back"
              color={colors.brand.main}
              size={32}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1, // Allow it to take up remaining space
              marginBottom: spacing.small,
            }}
          >
            <Text
              style={[
                typography.title2Bold,
                { flexShrink: 1, marginRight: spacing.small }, // Allow the text to shrink and create space for the button
              ]}
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              {siteData?.siteName}
            </Text>

            <BookmarkButton locationId={id} />
          </View>
        </View>

        <ScrollView
          style={{
            paddingHorizontal: spacing.medium,
          }}
        >
          <ScrollView
            horizontal
            style={{
              marginBottom: spacing.medium,
            }}
          >
            {siteData?.images.map((image, index) => (
              <Image
                key={`image-${index}`}
                width={350}
                height={400}
                source={{
                  uri: `${process.env.EXPO_PUBLIC_BASE_URL}/${image.url}`,
                }}
                style={[
                  {
                    borderRadius: 5,
                  },

                  index < siteData.images.length - 1
                    ? { marginRight: spacing.medium }
                    : {},
                ]}
              />
            ))}
          </ScrollView>

          <View>
            {/* Rating and Distance */}

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                columnGap: spacing.small,
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: spacing.medium,
              }}
            >
              <MaterialIcons
                name="location-on"
                size={28}
                color={colors.danger}
              />
              <Text
                style={[
                  typography.subhead,
                  {
                    flex: 1, // Allow the text to take the remaining space
                    flexWrap: "wrap", // Ensure text wraps onto the next line
                  },
                ]}
              >
                {siteData?.address}{" "}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: spacing.small,
              }}
            >
              <View
                style={{
                  display: "flex",
                  width: "45%",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: colors.brand.semitransparent,
                }}
              >
                <Text style={[typography.footnote]}> Jarak Tempuh* </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    columnGap: spacing.small,
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name="near-me"
                    size={28}
                    color={colors.primary}
                  />
                  <Text
                    style={[typography.title3Bold, { color: colors.text.main }]}
                  >
                    {formatDistance(distance)}{" "}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: "45%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: colors.brand.semitransparent,
                }}
              >
                <Text style={[typography.footnote]}>Waktu Tempuh** </Text>
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
                    size={28}
                    color={colors.success}
                  />
                  <Text
                    style={[typography.title3Bold, { color: colors.text.main }]}
                  >
                    {walkingTime}{" "}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                marginBottom: spacing.large,
              }}
            >
              <Text
                style={[
                  typography.caption1,
                  { fontStyle: "italic", color: colors.brand.main },
                ]}
              >
                *Estimasi tanpa adanya kemacetan dan hambatan di jalan.{" "}
              </Text>
              <Text
                style={[
                  typography.caption1,
                  { fontStyle: "italic", color: colors.brand.main },
                ]}
              >
                **Estimasi waktu tempuh berdasarkan kecepatan jalan orang
                dewasa: 5km/jam.{" "}
              </Text>
            </View>

            <View
              style={{
                marginBottom: spacing.large,
              }}
            >
              <Text
                style={[typography.title3Bold, { marginBottom: spacing.small }]}
              >
                Fakta Unik
              </Text>
              <ScrollView horizontal style={{}}>
                {siteData?.uniqueFacts.map((fact, index) => (
                  <UniqueFactCard key={`fact-${index}`} fact={fact.fact} />
                ))}
              </ScrollView>
            </View>

            <View
              style={{
                marginBottom: spacing.large,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: spacing.medium,
                }}
              >
                <Text style={[typography.title3Bold]}>Seputar </Text>

                <Text
                  style={[
                    {
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      backgroundColor: colors.brand.main,
                      color: "white",
                      flexShrink: 1,
                    },
                    typography.title3Bold,
                  ]}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {siteData?.siteName}
                </Text>
              </View>

              <Text style={[typography.callout, { textAlign: "justify" }]}>
                {siteData?.description}
              </Text>
            </View>

            {/* Jam Operasional Dropdown */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                height: "auto",
                justifyContent: "space-between",
                alignItems: isOpenDropdown ? "flex-start" : "center",
                marginBottom: spacing.large,
              }}
            >
              <View
                style={{
                  width: "auto",
                }}
              >
                <Text style={[typography.title3Bold]}>Jam Operasional</Text>
              </View>
              <Pressable
                style={{
                  width: "auto",
                }}
                onPress={() => setIsOpenDropwdown(!isOpenDropdown)}
              >
                <View
                  style={{
                    flexDirection: "column",
                  }}
                >
                  {isOpenDropdown ? (
                    result.modifiedResult.map((hari, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            width: "auto",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Text
                            style={[
                              typography.callout,
                              {
                                width: 70,
                              },
                            ]}
                          >
                            {hari.day}
                          </Text>
                          <Text
                            style={[
                              typography.callout,
                              {
                                width: "auto",
                              },
                            ]}
                          >
                            : {hari.openHour} - {hari.closeHour}
                          </Text>
                        </View>
                      );
                    })
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <Text
                        style={[
                          typography.headline,
                          {
                            width: "auto",
                            color:
                              result.indicator === "Tutup"
                                ? colors.danger
                                : colors.success,
                            marginRight: 5,
                          },
                        ]}
                      >
                        {result.indicator}
                      </Text>

                      <Text
                        style={{
                          width: 10,
                          color: colors.text.disable,
                        }}
                      >
                        &#x2022;
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={[
                            typography.body,
                            {
                              width: "auto",
                              color: colors.text.disable,
                              marginRight: 5,
                            },
                          ]}
                        >
                          {result.closing !== null && result.opening !== null
                            ? result.indicator === "Buka"
                              ? `Tutup ${result.closing}`
                              : result.nextOpeningDay
                              ? `Buka ${result.nextOpeningDay} ${
                                  result.modifiedResult.find(
                                    (hours) =>
                                      hours.day === result.nextOpeningDay
                                  )?.openHour
                                }`
                              : `Buka ${result.closing}`
                            : " "}
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
              <Text style={[typography.title3Bold]}>Ulasan</Text>
              {/* <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/details/reviews",
                    params: { id: id },
                  });
                }}
              >
                {siteReview.length > 4 && (
                  <Text style={[typography.subhead]}> Lihat Semua </Text>
                )}
              </Pressable> */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={[typography.title3Bold, {}]}>
                  {averageRating(siteReview)}{" "}
                  <Text style={[typography.title3, { color: "grey" }]}>
                    ({siteReview.length > 0 && siteReview.length})
                  </Text>
                </Text>

                <RatingStar
                  isEditable={false}
                  rating={averageRating(siteReview)}
                />
              </View>
            </View>

            {siteReview.length > 0 ? (
              <ScrollView
                horizontal
                style={{
                  marginBottom: spacing.medium,
                }}
              >
                {siteReview.length > 0 &&
                  siteReview
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    ) // Sort by createdAt, descending
                    .map((review, index) => (
                      <ReviewCards
                        key={`review-${index}`}
                        name={review.userId?.fullName}
                        reviewCount={review.userId.reviewCount}
                        userProfileImg={review.userId?.profileImage}
                        rating={review.rating}
                        timestamp={review.createdAt}
                        dateVisited={review.dateVisited}
                        content={review.comments}
                      />
                    ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: spacing.medium,
                }}
              >
                <Image
                  style={{
                    width: 200,
                    height: 200,
                  }}
                  source={require("@/assets/static/empty-review.png")}
                />
                <Text
                  style={[
                    typography.subhead,
                    { color: colors.text.disable, fontStyle: "italic" },
                  ]}
                >
                  {" "}
                  Belum ada ulasan.{" "}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, { marginBottom: spacing.large }]}
              onPress={() => setIsModalVisible(true)}
            >
              <MaterialIcons
                name="edit-note"
                size={24}
                color={colors.brand.main}
              />
              <Text style={[styles.buttonText, typography.subhead]}>
                Buat Ulasan{" "}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              rowGap: 5,
              marginBottom: spacing.large,
            }}
          >
            <Text
              style={[typography.title3Bold, { marginBottom: spacing.small }]}
            >
              Hubungi Kami{" "}
            </Text>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                columnGap: 15,
                flexWrap: "wrap",
              }}
            >
              {siteData?.contacts.map((item, index) => (
                <ContactItems
                  key={`contact-${index}`}
                  type={
                    item.type as
                      | "Instagram"
                      | "Whatsapp"
                      | "Facebook"
                      | "Website"
                  }
                  name={item.contactName}
                  detail={item.detail}
                />
              ))}
            </View>
          </View>

          <ReviewFormModal
            id={siteData?.id || 0}
            siteName={siteData?.siteName || ""}
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onReviewSubmit={handleReviewSubmit}
          />
        </ScrollView>
      </SafeAreaView>
      <TouchableOpacity
        onPress={handleDirections}
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
        <MaterialIcons name="directions" size={30} color={"white"} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.brand.main, // You can customize the color
    borderRadius: 5,
    paddingVertical: 5,
    columnGap: 5,
    marginBottom: spacing.medium,
  },
  plusSign: {
    fontSize: 24,
    marginRight: 5,
  },
  buttonText: {
    fontWeight: 600,
    color: colors.brand.main,
  },
});
