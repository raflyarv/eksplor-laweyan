import { typography } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text } from "react-native";
import { Icon } from "react-native-elements";
import RatingStar from "../RatingStar";
import { useState } from "react";
import ReviewFormModal from "../ReviewFormModal";
import { timeAgoIndicator } from "../../utils/dateUtils"; // Adjust the path as needed

interface MyReviewCards {
  reviewId: string;
  siteName: string;
  rating: number;
  timestamp: string;
  visitedDate: Date;
  content: string;
}

export default function MyReviewCards({
  reviewId,
  siteName,
  rating,
  timestamp,
  visitedDate,
  content,
}: MyReviewCards) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const timeObj = new Date(timestamp);

  const timeAgoString = timeAgoIndicator(timeObj);

  const formattedVisitedDate = visitedDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
        <Text style={[typography.footnote]}> {timeAgoString} </Text>
      </View>

      <View
        style={{
          width: "100%",
          display: "flex",
          marginBottom: 8,
        }}
      >
        <Text style={[typography.footnote]}>
          Dikujungi pada {formattedVisitedDate}
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
        reviewId={reviewId}
        ratingScore={3}
        content={content}
        visitedDate={visitedDate}
        siteName={siteName}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}
