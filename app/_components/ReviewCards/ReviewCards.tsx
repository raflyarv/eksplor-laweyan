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
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const timeIndicator = timeAgo(timestamp);
  const formattedDate = formatDateToIndonesian(dateVisited);
  return (
    <View
      style={{
        width: 320,
        minHeight: 100,
        maxHeight: 400,
        paddingHorizontal: 15,
        paddingVertical: 15,

        borderRadius: 10,
        backgroundColor: "#FFF1EC",
        marginRight: 10,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <DynamicAvatar
          imageUrl={
            `${baseUrl}/${userProfileImg}` ||
            "https://invalid-link.com/avatar.jpg"
          }
          name={name}
          size={50}
        />
        <View
          style={{
            width: "auto",
            display: "flex",
            flexDirection: "column",
            flexShrink: 1,
            marginLeft: 5,
          }}
        >
          <Text
            style={[typography.headline]}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {name}
          </Text>
          <Text style={[typography.subhead]}>{reviewCount} ulasan </Text>
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
        <Text style={[typography.subhead]}> {timeIndicator} </Text>
      </View>

      <View
        style={{
          width: "100%",
          display: "flex",
          marginBottom: 8,
        }}
      >
        <Text style={[typography.subhead]}>
          Dikunjungi pada
          <Text style={[{ fontWeight: 600 }]}> {formattedDate} </Text>
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
          style={[typography.callout]}
          ellipsizeMode="tail"
          numberOfLines={5}
        >
          {content}
        </Text>
      </View>
    </View>
  );
}
