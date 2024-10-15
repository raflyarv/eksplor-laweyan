import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Icon } from "react-native-elements";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import * as z from "zod";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FullScreenLoading from "../FullScreenLoading";

// Define the Zod schema for review form validation
const formSchema = z.object({
  locationId: z.number(),
  rating: z
    .number({ required_error: "Rating harus diisi." })
    .min(1, { message: "Rating minimal 1." })
    .max(5, { message: "Rating maksimal 5." }),
  comments: z
    .string({ required_error: "Ulasan harus diisi." })
    .min(10, { message: "Ulasan minimal 10 karakter." }),
  dateVisited: z.date({ required_error: "Tanggal kunjungan harus diisi." }),
});

type ReviewFormSchema = z.infer<typeof formSchema>;

// Add reviewId and review data props
interface ReviewFormModalProps {
  id: number;
  isVisible: boolean; // for modal visibility
  onClose: () => void; // function to close the modal
  siteName: string;
  onReviewSubmit: () => void;
  reviewId?: string; // optional reviewId for editing
  initialValues?: Partial<ReviewFormSchema>; // optional initial values for editing
}

export default function ReviewFormModal({
  id,
  siteName,
  isVisible,
  onClose,
  onReviewSubmit,
  reviewId, // new prop for editing
  initialValues: providedInitialValues, // new prop for initial values
}: ReviewFormModalProps) {
  // Set default initial values or use provided ones
  const initialValues: ReviewFormSchema = {
    locationId: id,
    rating: providedInitialValues?.rating || 0,
    comments: providedInitialValues?.comments || "",
    dateVisited: providedInitialValues?.dateVisited || new Date(),
  };

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: ReviewFormSchema) => {
    setIsLoading(true);
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const endpoint = reviewId
        ? `${baseUrl}/api/review/${reviewId}`
        : `${baseUrl}/api/review`;
      const method = reviewId ? "put" : "post"; // Use PUT for updating, POST for creating

      const response = await axios({
        method,
        url: endpoint,
        data: values,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.status === (reviewId ? 200 : 201)) {
        // Check for update success or create success
        onReviewSubmit();
        onClose();
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    values,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(formSchema),
    onSubmit,
  });

  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const stars = Array(5).fill(values.rating);

  useEffect(() => {
    setFieldValue("locationId", id);
  }, [id, setFieldValue]);

  // Fetch existing review data if editing
  useEffect(() => {
    const fetchReviewData = async () => {
      if (reviewId) {
        try {
          const refreshToken = await AsyncStorage.getItem("refreshToken");
          const response = await axios.get(
            `${baseUrl}/api/review/detail/${reviewId}`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          const reviewData = response.data; // Assume response data has the required fields
          setFieldValue("rating", reviewData.rating);
          setFieldValue("comments", reviewData.comments);
          setFieldValue("dateVisited", new Date(reviewData.dateVisited)); // Convert to Date object if needed
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchReviewData();
  }, [reviewId, setFieldValue, baseUrl]);

  // Handle date picker change
  const onChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false); // Close the picker
    setDate(currentDate);
    setFieldValue("dateVisited", selectedDate);
  };

  // Show date picker
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      {isLoading && <FullScreenLoading />}
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.modalMessage, typography.headline]}>
              {reviewId ? "Edit Ulasan" : "Buat Ulasan"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={[
                typography.subhead,
                {
                  marginBottom: 15,
                  fontStyle: "italic",
                  color: colors.brand.main,
                },
              ]}
            >
              {siteName}
            </Text>
            <View style={styles.starContainer}>
              {stars.map((_, index) => {
                const starNumber = index + 1;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setFieldValue("rating", starNumber);
                    }}
                  >
                    <Icon
                      name={
                        starNumber <= values.rating ? "star" : "star-border"
                      }
                      type="material"
                      color={
                        starNumber <= values.rating ? colors.warning : "#B0B0B0"
                      }
                      size={36}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {errors.rating && (
            <Text
              style={[
                typography.footnote,
                {
                  color: colors.danger,
                  alignSelf: "flex-start",
                  paddingBottom: 10,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {errors.rating}{" "}
            </Text>
          )}

          <View
            style={{
              display: "flex",
              width: "100%",
              marginBottom: 20,
            }}
          >
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: errors.comments
                    ? colors.danger
                    : colors.brand.main,
                },
              ]}
              placeholder="Tulis ulasan Anda"
              multiline={true}
              numberOfLines={6}
              value={values.comments}
              onChangeText={handleChange("comments")}
            />

            {errors.comments && (
              <Text
                style={[
                  typography.footnote,
                  {
                    color: colors.danger,
                    paddingHorizontal: 5,
                  },
                ]}
              >
                {errors.comments}
              </Text>
            )}
          </View>

          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={(typography.footnote, { fontWeight: 500 })}>
              {" "}
              Tanggal Kunjungan:{" "}
            </Text>
            <View style={styles.datePickerContainer}>
              <TouchableOpacity onPress={showDatePickerModal}>
                <MaterialIcons
                  name="calendar-month"
                  size={24}
                  color={colors.brand.main}
                />
              </TouchableOpacity>
              <Text style={(styles.selectedDate, typography.subhead)}>
                {values.dateVisited?.toLocaleDateString()}{" "}
              </Text>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={values.dateVisited}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          <View
            style={{
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: colors.brand.main,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                paddingVertical: 10,
              }}
              onPress={() => handleSubmit()}
            >
              <Text style={[typography.subhead, { color: "white" }]}>
                {" "}
                {reviewId ? "Update Ulasan" : "Kirim Ulasan"}{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 120,
    marginBottom: 5,
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlignVertical: "top", // Align text at the top for multiline
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
  },
  modalContent: {
    width: 350,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: colors.brand.main,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  starContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 5,
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 16,
    marginLeft: 10,
  },
});
