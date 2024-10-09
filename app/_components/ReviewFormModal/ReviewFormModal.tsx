import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
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

interface ReviewFormModalProps {
  isVisible: boolean; // for modal visibility
  onClose: () => void; // function to close the modal
}

export default function ReviewFormModal({
  isVisible,
  onClose,
}: ReviewFormModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const stars = Array(5).fill(0);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle date picker change
  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false); // Close the picker on Android after selection
    setDate(currentDate);
  };

  // Show the date picker
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
              Buat Ulasan
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
              Rumah Batik Laweyan
            </Text>
            <View style={styles.starContainer}>
              {stars.map((_, index) => {
                const starNumber = index + 1;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setRating(starNumber);
                    }}
                  >
                    <Icon
                      name={starNumber <= rating ? "star" : "star-border"}
                      type="material"
                      color={starNumber <= rating ? colors.warning : "#B0B0B0"}
                      size={36}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View
            style={{
              display: "flex",
              width: "100%",
              marginBottom: 20,
            }}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Tulis ulasan Anda"
              multiline={true}
              numberOfLines={6}
              value={review}
              onChangeText={setReview}
            />
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
                {date.toLocaleDateString()}{" "}
              </Text>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
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
            >
              <Text style={[typography.subhead, { color: "white" }]}>
                {" "}
                Kirim Ulasan{" "}
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
    borderColor: colors.brand.main,
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
    marginBottom: 20,
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
