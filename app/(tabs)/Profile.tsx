import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
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

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const imageHeight = screenHeight * 0.5; // Set height to 60% of screen height
  const imageWidth = screenWidth; // Full width of the screen

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {/* Background Image */}
      <ImageBackground
        source={require("@/assets/static/bg-image/profile-bg.png")}
        style={{
          flex: 1,
          width: imageWidth,
          height: imageHeight,
          borderBottomLeftRadius: 150,
          borderBottomRightRadius: 15,
        }}
      >
        <SafeAreaView
          style={{
            display: "flex",
            flexDirection: "column",
            position: "static",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: "auto",
          }}
        >
          {/* Profile Image Picker */}
          <FormikProvider value={formik}>
            <EditProfileImgPicker
              name="newProfileImage"
              error={formik.errors.newProfileImage}
              setPreview={setPreview}
              preview={preview}
              existingImage={formik.values.existingProfileImage}
              onSubmit={formik.submitForm}
            />
          </FormikProvider>

          {/* Username and Email Section */}
          <Text
            style={[
              typography.title2Bold,
              {
                color: "white",
                marginBottom: spacing.small,
                textAlign: "center",
              },
            ]}
          >
            {userData?.fullName}
          </Text>

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
            <Text
              style={[typography.subhead, { color: colors.brand.semiwhite }]}
            >
              {userData?.username}
            </Text>
            <Text
              style={[typography.subhead, { color: colors.brand.semiwhite }]}
            >
              {userData?.email}
            </Text>
          </View>

          {/* Edit Profile and Logout Buttons */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              columnGap: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/profile/edit-profile")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                columnGap: 5,
              }}
            >
              <MaterialIcons name="edit" size={24} color={colors.brand.main} />
              <Text style={[typography.body, { color: colors.brand.main }]}>
                Edit Profil
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleModal}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                backgroundColor: "white",
                columnGap: 3,
              }}
            >
              <MaterialIcons
                name="exit-to-app"
                size={24}
                color={colors.danger}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "transparent",
          width: "100%",
          marginTop: 20,
        }}
        contentContainerStyle={{
          paddingTop: 35,
        }}
      >
        <View style={{ paddingHorizontal: spacing.medium }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text style={[typography.title3Bold, { color: colors.text.main }]}>
              Ulasan Saya ({userReviews.length})
            </Text>
          </View>

          <ScrollView horizontal>
            {userReviews.length > 0 ? (
              userReviews
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((review, index) => (
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
                <Text>Belum ada ulasan.</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Logout Confirmation Modal */}
        <ConfirmationModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          imageUrl="logout"
          title="Anda yakin Ingin Keluar?"
          onCloseAfter={handleLogout}
          buttonText="Keluar"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backgroundContainer: {
    position: "absolute",
    width: "100%",
    height: Dimensions.get("window").height * 0.5,
    zIndex: -1,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  fullName: {
    ...typography.title2Bold,
    color: "white",
    marginBottom: spacing.small,
    paddingHorizontal: 30,
    textAlign: "center",
  },
  userDetails: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.medium,
  },
  username: {
    ...typography.subhead,
    color: colors.brand.semiwhite,
  },
  email: {
    ...typography.subhead,
    color: colors.brand.semiwhite,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 10,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    columnGap: 3,
  },
  editProfileText: {
    ...typography.subhead,
    color: colors.brand.main,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: spacing.large,
  },
  reviewSection: {
    marginTop: spacing.large,
  },
  reviewTitle: {
    ...typography.title3Bold,
    marginBottom: spacing.medium,
  },
});
