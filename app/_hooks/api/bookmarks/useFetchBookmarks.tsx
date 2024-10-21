import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookmarkProps } from "@/app/_models/bookmark.model";

const useFetchBookmarks = () => {
  const [userBookmarks, setUserBookmarks] = useState<BookmarkProps[] | null>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  // Define the fetch function using useCallback to allow re-fetching later
  const fetchUserBookmarks = useCallback(async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const response = await axios.get(`${baseUrl}/api/bookmark`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const bookmarks = response.data || [];

      setUserBookmarks(bookmarks);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [baseUrl]); // Depend on baseUrl

  // Fetch bookmarks on component mount
  useEffect(() => {
    fetchUserBookmarks();
  }, [fetchUserBookmarks]);

  // Return the fetch function so it can be manually triggered
  return { userBookmarks, loading, error, refetch: fetchUserBookmarks };
};

export default useFetchBookmarks;
