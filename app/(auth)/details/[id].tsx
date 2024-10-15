import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
  ContactItems,
  DynamicAvatar,
  RatingStar,
  ReviewCards,
  ReviewFormModal,
  UniqueFactCard,
} from "@/app/_components";
import { Icon } from "react-native-elements";

import site from "@/assets/dummy/sites.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { SiteDetailsProps } from "@/app/_models/site.model";
import axios from "axios";
import { getOpenCloseStatus } from "@/app/utils/openingHours";
import { calculateWalkingTime } from "@/app/utils/calculateWalkingTime";
import { useUserLocation } from "@/app/_hooks/context/UserLocationContext";
import { calculateDistance } from "@/app/utils/calculateDistance";
import { averageRating } from "@/app/utils/averageRating";

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

  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

  const distance = calculateDistance(
    currentLocation?.latitude || 0,
    currentLocation?.longitude || 0,
    siteData?.latitude || 0,
    siteData?.longitude || 0
  );

  const distanceInMeters = (() => {
    const distanceValue = distance.endsWith("km")
      ? parseFloat(distance) * 1000 // Convert km to meters
      : parseInt(distance); // Already in meters

    return distanceValue;
  })();

  const walkingTime = calculateWalkingTime(distanceInMeters);

  const handleReviewSubmit = () => {
    setRefreshTrigger((prev) => !prev); // Toggle refresh trigger to cause useEffect to re-run
  };
  return (
    <SafeAreaView>
      <ScrollView
        style={{
          paddingHorizontal: spacing.medium,
        }}
      >
        <View
          style={{
            width: "100%",
            marginVertical: spacing.medium,
          }}
        >
          <TouchableOpacity onPress={() => router.push("/(tabs)")}>
            <MaterialIcons
              name="arrow-back"
              color={colors.brand.main}
              size={32}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          style={{
            marginBottom: spacing.medium,
          }}
        >
          {siteData?.images.map((image, index) => (
            <Image
              key={`image-${index}`}
              width={300}
              height={350}
              source={{
                uri: `${process.env.EXPO_PUBLIC_BASE_URL}/${image.url}`,
              }}
              style={{
                borderRadius: 5,
                marginRight: spacing.medium,
              }}
            />
          ))}
        </ScrollView>

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
              {siteData?.siteName}
            </Text>

            <MaterialIcons
              name="bookmark-outline"
              size={32}
              color={colors.brand.main}
            />
          </View>

          {/* Rating and Distance */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: spacing.medium,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                columnGap: 5,
              }}
            >
              <MaterialIcons name="star" size={24} color={colors.warning} />
              <Text style={[typography.subhead, { color: colors.text.main }]}>
                {siteReview.length > 0
                  ? averageRating(siteReview)
                  : "Belum ada ulasan"}
              </Text>
              <Text style={[typography.subhead, { color: colors.text.main }]}>
                {siteReview.length > 0 ? `(${siteReview.length})` : `(0)`}
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
              <MaterialIcons name="near-me" size={24} color={colors.success} />
              <Text style={[typography.subhead, { color: colors.text.main }]}>
                {distance}{" "}
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
                size={24}
                color={colors.success}
              />
              <Text style={[typography.subhead, { color: colors.text.main }]}>
                {walkingTime}{" "}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              columnGap: spacing.small,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              marginBottom: spacing.medium,
            }}
          >
            <MaterialIcons name="location-on" size={24} color={colors.danger} />
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
              marginBottom: spacing.medium,
            }}
          >
            <Text style={typography.headline}>Fakta Unik</Text>
            <ScrollView horizontal>
              {siteData?.uniqueFacts.map((fact, index) => (
                <UniqueFactCard key={`fact-${index}`} fact={fact.fact} />
              ))}
            </ScrollView>
          </View>

          <View
            style={{
              marginBottom: spacing.medium,
            }}
          >
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
                {siteData?.siteName}
              </Text>
            </View>

            <Text style={[typography.subhead, { textAlign: "justify" }]}>
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
              marginBottom: spacing.medium,
            }}
          >
            <View
              style={{
                width: "auto",
              }}
            >
              <Text style={[typography.headline]}>Jam Operasional </Text>
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
                  result.modifiedResult.map((hari, index) => {
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
                          result.indicator === "Tutup"
                            ? colors.danger
                            : colors.success,
                      }}
                    >
                      {result.indicator}
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
                        {result.indicator === "Buka"
                          ? `Tutup ${result.closing}`
                          : `Buka ${result.opening}`}
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
            <Text style={[typography.headline]}>
              Ulasan {siteReview.length > 0 && siteReview.length}{" "}
            </Text>
            <Pressable
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
            </Pressable>
          </View>

          {siteReview.length > 0 ? (
            <ScrollView
              horizontal
              style={{
                marginBottom: spacing.medium,
              }}
            >
              {siteReview.length > 0 &&
                siteReview.map((review, index) => (
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
            style={styles.button}
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
          }}
        >
          <Text style={[typography.headline]}>Hubungi Kami </Text>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {siteData?.contacts.map((item, index) => (
              <ContactItems
                key={`contact-${index}`}
                type={
                  item.type as "Instagram" | "Whatsapp" | "Facebook" | "Website"
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
