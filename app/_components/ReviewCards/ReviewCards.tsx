import { typography } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import DynamicAvatar from "../DynamicAvatar";
import RatingStar from "../RatingStar";
import { timeAgo } from "@/app/utils/timeAgo";
import { formatDateToIndonesian } from "@/app/utils/formattedDate";

interface ReviewCardsProps {
  name: string;
  reviewCount: number;
  userProfileImg: string | null;
  rating: number;
  timestamp: string;
  dateVisited: string;
  content: string;
}

export default function ReviewCards({
  name,
  reviewCount,
  userProfileImg,
  rating,
  timestamp,
  dateVisited,
  content,
}: ReviewCardsProps) {
  const timeIndicator = timeAgo(timestamp);
  const formattedDate = formatDateToIndonesian(dateVisited);
  return (
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
          imageUrl={userProfileImg || "https://invalid-link.com/avatar.jpg"}
          name={name}
          size={50}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text style={[typography.subhead]}> {name} </Text>
          <Text style={[typography.footnote]}> {reviewCount} ulasan </Text>
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
        <Icon name="circle" type="material" size={8} color={colors.disable} />
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
          Dikunjungi pada {formattedDate}
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
          numberOfLines={5}
        >
          {content}
        </Text>
      </View>
    </View>
  );
}
