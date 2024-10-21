import { colors } from "@/theme/colors";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

interface RatingStarProps {
  rating: number;
  setRating?: React.Dispatch<React.SetStateAction<number>>;
  maxStars?: number | 5;
  isEditable: boolean;
}

export default function RatingStar({
  rating,
  setRating,
  maxStars = 5,
  isEditable = false,
}: RatingStarProps) {
  // Create an array representing the number of stars
  const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

  // Render the stars based on rating and whether the component is editable or read-only
  return (
    <View style={styles.starContainer}>
      {stars.map((starNumber) => {
        // Determine if the current star should be full, half, or empty
        const isFullStar = starNumber <= rating;
        const isHalfStar = starNumber > rating && starNumber - 1 < rating;

        return (
          <TouchableOpacity
            key={starNumber}
            onPress={() => {
              if (isEditable && setRating) {
                setRating(starNumber);
              }
            }}
            disabled={!isEditable} // Disable press when it's read-only
          >
            <Icon
              // Show full, half, or empty star based on rating
              name={
                isFullStar ? "star" : isHalfStar ? "star-half" : "star-border"
              }
              type="material"
              color={isFullStar || isHalfStar ? colors.warning : "#B0B0B0"}
              size={22}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
