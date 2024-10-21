import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios"; // Import axios for making API calls
import { colors } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFetchBookmarks from "@/app/_hooks/api/bookmarks/useFetchBookmarks";

interface BookmarkButtonProps {
  locationId: any;
  onBookmarkToggled?: () => void;
}

export default function BookmarkButton({
  locationId,
  onBookmarkToggled,
}: BookmarkButtonProps) {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { refetch } = useFetchBookmarks();

  // Fetch bookmark status from your backend when the component mounts
  useEffect(() => {
    fetchBookmarkStatus();
  }, [locationId]);

  // Function to fetch bookmark status
  const fetchBookmarkStatus = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const response = await axios.get(
        `${baseUrl}/api/bookmark/${locationId}`,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      setIsBookmarked(response.data.exists); // Assuming the API returns { exists: true/false }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to toggle bookmark
  const toggleBookmark = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (isBookmarked) {
        // Remove bookmark
        await axios.delete(`${baseUrl}/api/bookmark/${locationId}`, {
          withCredentials: true,

          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await axios.post(
          `${baseUrl}/api/bookmark`,
          { locationId },
          {
            withCredentials: true,

            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        setIsBookmarked(true);
      }

      // Refetch bookmark status
      await refetch();
      await fetchBookmarkStatus();

      if (onBookmarkToggled) {
        onBookmarkToggled();
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleBookmark}>
        <MaterialIcons
          name={isBookmarked ? "bookmark" : "bookmark-outline"}
          size={32}
          color={colors.brand.main}
        />
      </TouchableOpacity>
    </View>
  );
}
