import { typography } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text } from "react-native";
import { Icon } from "react-native-elements";
import RatingStar from "../RatingStar";
import { useState } from "react";
import ReviewFormModal from "../ReviewFormModal";
import { timeAgoIndicator } from "../../utils/dateUtils"; // Adjust the path as needed
import { formatDateToIndonesian } from "@/app/utils/formattedDate";
import { timeAgo } from "@/app/utils/timeAgo";
import ConfirmationModal from "../ConfirmationModal";
import axios from "axios";
import FullScreenLoading from "../FullScreenLoading";

interface MyReviewCards {
  locationId: number;
  reviewId: string;
  siteName: string;
  rating: number;
  timestamp: string;
  dateVisited: string;
  content: string;
  onReviewSubmit: () => void;
}

export default function MyReviewCards({
  locationId,
  reviewId,
  siteName,
  rating,
  timestamp,
  dateVisited,
  content,
  onReviewSubmit,
}: MyReviewCards) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timeIndicator = timeAgo(timestamp);
  const formattedDate = formatDateToIndonesian(dateVisited);

  // Define the initial values for the review form
  const initialValues = {
    rating,
    comments: content,
    dateVisited: new Date(dateVisited), // Assuming dateVisited is in a format that can be converted to a Date object
  };

  const toggleConfirm = () => {
    setIsConfirmVisible(!isConfirmVisible);
  };

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${baseUrl}/api/review/${reviewId}`);

      setIsConfirmVisible(false);
      onReviewSubmit();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        width: 360,
        height: "auto",
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginRight: 10,

        borderRadius: 10,
        backgroundColor: "#FFF1EC",
      }}
    >
      {isLoading && <FullScreenLoading />}
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
            {siteName}{" "}
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
            onPress={() => setIsModalVisible(true)}
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
            <MaterialIcons name="edit" size={20} color={colors.brand.main} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleConfirm}
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
            <MaterialIcons name="delete" size={20} color={colors.danger} />
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
        <RatingStar rating={rating} isEditable={false} />
        <Icon name="circle" type="material" size={10} color={colors.disable} />
        <Text style={[typography.footnote]}> {timeIndicator} </Text>
      </View>

      <View
        style={{
          width: "100%",
          display: "flex",
          marginBottom: 8,
        }}
      >
        <Text style={[typography.footnote]}>
          Dikujungi pada {formattedDate}
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
        <Text
          style={[typography.subhead]}
          ellipsizeMode="tail"
          numberOfLines={4}
        >
          {content}
        </Text>
      </View>

      <ReviewFormModal
        id={locationId} // Pass the review id
        siteName={siteName}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onReviewSubmit={onReviewSubmit}
        reviewId={reviewId} // Pass the reviewId for editing
        initialValues={initialValues} // Pass the initial values for the form
      />

      <ConfirmationModal
        title="Anda yakin ingin menghapus ulasan?"
        isVisible={isConfirmVisible}
        imageUrl="delete"
        onClose={toggleConfirm}
        onCloseAfter={() => handleDelete()}
        buttonText="Hapus"
      />
    </View>
  );
}
