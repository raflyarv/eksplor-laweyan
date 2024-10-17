import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { Icon } from "react-native-elements";
import {
  ConfirmationModal,
  DynamicAvatar,
  EditProfileImgPicker,
  FullScreenLoading,
  MyReviewCards,
  RatingStar,
} from "../_components";
import { router } from "expo-router";
import IndicatorModal from "../_components/IndicatorModal/IndicatorModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../_hooks/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ReviewProps } from "../_models/review.model";
import { z } from "zod";
import { Formik, FormikProvider, useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

const validationSchema = z.object({
  newProfileImage: z.any().nullable(),
  existingProfileImage: z.string().nullable(),
});

type profileFormType = z.infer<typeof validationSchema>;

const initialValues: profileFormType = {
  newProfileImage: null as File | null,
  existingProfileImage: "",
};

export default function Profile() {
  const { isAuthenticated, setIsAuthenticated, userData, refetchUserData } =
    useAuth(); // Get the isAuthenticated status
  const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // New state to track refresh
  const [preview, setPreview] = useState<string | null>(null);

  const [userReviews, setUserReviews] = useState<ReviewProps[]>([]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleReviewSubmit = () => {
    setRefreshTrigger((prev) => !prev); // Toggle refresh trigger to cause useEffect to re-run
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      await axios.post(
        `${baseUrl}/auth/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`, // Use the refresh token as Bearer token
          },
        }
      );

      await AsyncStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
      setModalVisible(false);
      router.push("/login");
    } catch (err: any) {
      setModalVisible(true);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await axios.get(`${baseUrl}/api/review/`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`, // Use the refresh token as Bearer token
          },
        });

        setUserReviews(response.data.reviews);
      } catch (error: any) {
        setUserReviews([]);
      } finally {
      }
    };
    fetchUserReviews();
    refetchUserData();
  }, [refreshTrigger]);

  const onSubmit = async (values: profileFormType) => {
    setIsLoading(true);
    const formData = new FormData();

    // Append existing image URL (if applicable)
    if (values.existingProfileImage) {
      formData.append("existingProfileImage", values.existingProfileImage);
    } else {
      formData.append("existingProfileImage", "");
    }

    // Append new image file (if applicable)
    if (values.newProfileImage && values.newProfileImage.uri) {
      // Convert the new image URI into a file

      const fileExtension = values.newProfileImage.uri.split(".").pop();

      const newImageUri = values.newProfileImage.uri;
      const fileName = `${userData.username}-profileImage.${fileExtension}`;
      const imageType = values.newProfileImage.mimeType;

      formData.append("profileImage", {
        uri: newImageUri,
        name: fileName,
        type: imageType,
      } as any);
    } else {
      formData.append("profileImage", "");
    }

    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      const response = await axios.put(`${baseUrl}/api/user/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important: Set the correct content type
          Authorization: `Bearer ${refreshToken}`, // Use the refresh token as Bearer token
        },
      });
      await refetchUserData();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(validationSchema),
    onSubmit,
  });

  const { setFieldValue, values } = formik;

  useEffect(() => {
    setFieldValue("existingProfileImage", userData.profileImage || "");
  }, [setFieldValue, userData.profileImage]);

  return (
    <>
      {isLoading && <FullScreenLoading />}
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center", // Centers vertically
          backgroundColor: "white", // Optional: Background color for better visuals
        }}
      >
        <View style={{}}>
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
              {/* {userData.profileImage ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: `${baseURL}/${userData?.profileImage}`,
                    }}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    // onPress={() => setImage(null)}
                    style={styles.clearButton}
                  >
                    <MaterialIcons
                      name="delete"
                      size={24}
                      color={colors.danger}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <MaterialIcons
                    name="account-circle"
                    size={150}
                    color={colors.disable}
                  />
                </>
              )} */}
              <FormikProvider value={formik}>
                <EditProfileImgPicker
                  name="newProfileImage"
                  error={formik.errors.newProfileImage}
                  setPreview={setPreview}
                  preview={preview}
                  existingImage={formik.values.existingProfileImage}
                />
              </FormikProvider>

              <Text
                style={[
                  typography.title3Bold,
                  { color: colors.brand.main, marginBottom: 15 },
                ]}
              >
                {userData?.fullName}
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
                  onPress={toggleModal}
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
                Ulasan yang Diberikan ({userReviews.length}){" "}
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
              {userReviews.length > 0 ? (
                userReviews.map((review, index) => (
                  <MyReviewCards
                    key={`review-${index}`}
                    locationId={review.locationId}
                    reviewId={review._id}
                    siteName={review.siteName}
                    rating={review.rating}
                    timestamp={review.createdAt}
                    dateVisited={review.dateVisited}
                    content={review.comments}
                    onReviewSubmit={handleReviewSubmit}
                  />
                ))
              ) : (
                <View>
                  <Text> Belum ada ulasan. </Text>
                </View>
              )}
            </ScrollView>
          </View>

          <ConfirmationModal
            isVisible={isModalVisible}
            onClose={toggleModal}
            imageUrl="logout"
            title="Anda yakin Ingin Keluar ?"
            onCloseAfter={() => handleLogout()}
            buttonText="Keluar"
          />
        </View>
      </SafeAreaView>
      {isLoading && <FullScreenLoading />}
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  clearButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    padding: 5,
  },
});
