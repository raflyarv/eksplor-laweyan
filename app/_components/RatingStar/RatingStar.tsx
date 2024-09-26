import { colors } from "@/theme/colors";
import React, { useState } from "react";
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
  const stars = Array(maxStars).fill(0);

  const [is, setIs] = useState(0);

  // Render the stars based on rating and whether the component is editable or read-only
  return (
    <View style={styles.starContainer}>
      {stars.map((_, index) => {
        const starNumber = index + 1;

        // Show full star if rating is >= starNumber, otherwise show empty star
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (isEditable && setRating) {
                setRating(starNumber);
              }
            }}
            disabled={!isEditable} // Disable press when it's read-only
          >
            <Icon
              name={starNumber <= rating ? "star" : "star-border"}
              type="material"
              color={starNumber <= rating ? colors.warning : "#B0B0B0"}
              size={20}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
