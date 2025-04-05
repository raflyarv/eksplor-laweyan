import React, { useRef, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { useFocusEffect, useRouter } from "expo-router";
import axios from "axios";
import { debounce } from "lodash";
import { SiteDetailsProps } from "@/app/_models/site.model";
import { FullScreenLoading, SiteListCard } from "@/app/_components";
import { calculateDistance, formatDistance } from "@/app/utils/distanceUtils";
import { useUserLocation } from "@/app/_hooks/context/UserLocationContext";
import { getOpenCloseStatus } from "@/app/utils/openingHours";
import { averageRating } from "@/app/utils/averageRating";
import { calculateWalkingTime } from "@/app/utils/calculateWalkingTime";
import useFetchBookmarks from "@/app/_hooks/api/bookmarks/useFetchBookmarks";
import useFetchSites from "@/app/_hooks/api/sites/useFetchSites";
import { useNavHistory } from "@/app/_hooks/context/NavigationContext";

interface SortFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (options: {
    sort: string;
    rating: number;
    openNow: boolean;
  }) => void;
}

const SortFilterModal = ({
  isVisible,
  onClose,
  onApply,
}: SortFilterModalProps) => {
  const [selectedSort, setSelectedSort] = useState("Popularitas");
  const [selectedRating, setSelectedRating] = useState(1);
  const [isOpenNow, setIsOpenNow] = useState(false);

  // Dummy data for the sort options
  const sortOptions = ["Popularitas", "Jarak"];
  const ratingOptions = [1, 2, 3, 4, 5];

  const handleApply = () => {
    onApply({
      sort: selectedSort,
      rating: selectedRating,
      openNow: isOpenNow,
    });
    onClose(); // Close the modal after applying
  };

  const handleClear = () => {
    setSelectedSort("Popularity"); // Reset to default sort option
    setSelectedRating(1); // Reset rating to default
    setIsOpenNow(false); // Reset open now to false
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              display: "flex",
              backgroundColor: "white",
              margin: 20,
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text
              style={[
                typography.title3Bold,
                {
                  marginBottom: spacing.medium,
                  color: colors.brand.main,
                  fontStyle: "italic",
                },
              ]}
            >
              Urutkan
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: spacing.medium,
              }}
            >
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSelectedSort(option)}
                  style={
                    {
                      // nanti masukkin custom style
                    }
                  }
                >
                  <Text
                    style={[
                      {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 5,
                        color:
                          option === selectedSort ? "white" : colors.brand.main,
                        backgroundColor:
                          option === selectedSort ? colors.brand.main : "white",
                      },
                      typography.body,
                    ]}
                  >
                    {option}{" "}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text
              style={[
                typography.title3Bold,
                {
                  marginBottom: spacing.medium,
                  color: colors.brand.main,
                  fontStyle: "italic",
                },
              ]}
            >
              Filter
            </Text>

            <View
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                marginBottom: spacing.medium,
              }}
            >
              <Text
                style={[typography.headline, { marginBottom: spacing.small }]}
              >
                Rating
              </Text>

              <FlatList
                data={ratingOptions}
                contentContainerStyle={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                renderItem={({ item }) => {
                  const isSelected = item === selectedRating;
                  return (
                    <TouchableOpacity
                      onPress={() => setSelectedRating(item)}
                      style={{
                        paddingHorizontal: 27,
                        paddingVertical: 10,
                        borderColor: isSelected
                          ? colors.brand.main
                          : colors.text.disable, // Change border color when selected
                        backgroundColor: isSelected
                          ? colors.brand.main
                          : colors.background.offwhite, // Change background color when selected
                        alignItems: "center", // Center the text
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected ? "white" : "black", // Change text color when selected
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.toString()}
                horizontal
              />
            </View>

            <TouchableOpacity onPress={() => setIsOpenNow(!isOpenNow)}>
              <Text
                style={[
                  typography.headline,
                  {
                    color: isOpenNow ? colors.brand.main : "black",
                  },
                ]}
              >
                Buka Sekarang: {isOpenNow ? "Iya" : "Tidak"}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity onPress={handleClear} style={{ flex: 1 }}>
                <Text
                  style={[
                    typography.headline,
                    {
                      textAlign: "center",
                      backgroundColor: colors.disable,
                      color: colors.text.disable,
                      padding: 10,
                      borderRadius: 5,
                    },
                  ]}
                >
                  Hilangkan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                style={{ flex: 1, marginLeft: 5 }}
              >
                <Text
                  style={[
                    typography.headline,
                    {
                      textAlign: "center",
                      backgroundColor: colors.brand.main,
                      color: "white",
                      padding: 10,
                      borderRadius: 5,
                    },
                  ]}
                >
                  Terapkan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function SearchPage() {
  const inputRef = useRef<TextInput | null>(null);
  const { back, push } = useNavHistory();

  const { currentLocation } = useUserLocation();
  const { siteLists, loading } = useFetchSites();
  const { refetch } = useFetchBookmarks();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState("Popularitas");
  const [filterOption, setFilterOption] = useState({
    rating: 1,
    openNow: false,
  });

  const handleApplyFilters = (options: any) => {
    setSortOption(options.sort);
    setFilterOption({ rating: options.rating, openNow: options.openNow });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [])
  );

  const [query, setQuery] = useState("");
  const [allSites, setAllSites] = useState<SiteDetailsProps[]>([]); // All fetched sites
  const [filteredSites, setFilteredSites] = useState<SiteDetailsProps[]>([]); // Filtered data

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    setAllSites(siteLists || []);
    setFilteredSites(siteLists || []);
  }, [siteLists]);

  // Debounced function to filter sites based on query
  const debouncedFilter = debounce((searchQuery) => {
    let filteredData = allSites;

    // Filter by search query
    if (searchQuery) {
      filteredData = filteredData.filter(
        (site) =>
          site.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply additional filters from the modal
    filteredData = filteredData.filter(
      (site) =>
        averageRating(site.reviews) >= filterOption.rating && // Rating filter
        (!filterOption.openNow ||
          getOpenCloseStatus(site.operationalHours).indicator === "Buka") // Open now filter
    );

    // Sort the data
    if (sortOption === "Jarak") {
      filteredData = filteredData.sort((a, b) => {
        const distanceA = calculateDistance(
          currentLocation?.latitude || 0,
          currentLocation?.longitude || 0,
          a.latitude || 0,
          a.longitude || 0
        );
        const distanceB = calculateDistance(
          currentLocation?.latitude || 0,
          currentLocation?.longitude || 0,
          b.latitude || 0,
          b.longitude || 0
        );
        return distanceA - distanceB;
      });
    } else if (sortOption === "Popularitas") {
      filteredData = filteredData.sort((a, b) => {
        const ratingA = averageRating(a.reviews) || 0; // Default to 0 if no reviews
        const ratingB = averageRating(b.reviews) || 0; // Default to 0 if no reviews

        // Sort such that unrated sites are at the end
        return ratingB - ratingA;
      });
    }

    setFilteredSites(filteredData); // Update filtered sites
  }, 300);

  useEffect(() => {
    debouncedFilter(query);
    return () => {
      debouncedFilter.cancel();
    };
  }, [query, allSites, sortOption, filterOption]);

  return (
    <>
      {loading && <FullScreenLoading />}
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.medium,
          backgroundColor: colors.background.offwhite,
        }}
      >
        <SafeAreaView
          style={{
            position: "relative",
            height: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              position: "static",
              top: 0,
            }}
          >
            <View
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                marginBottom: 20,
                columnGap: 15,
                alignItems: "flex-start",
              }}
            >
              <TouchableOpacity onPress={() => back()}>
                <MaterialIcons
                  name="arrow-back"
                  size={32}
                  color={colors.brand.main}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <TextInput
                  ref={inputRef}
                  style={[styles.input, typography.headline]}
                  placeholder="Pencarian"
                  placeholderTextColor={colors.disable}
                  value={query}
                  onChangeText={setQuery} // Update query state
                />
                <MaterialIcons
                  name="search"
                  size={32}
                  color={colors.brand.main}
                />
              </View>
              <TouchableOpacity
                style={{
                  width: 140,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  borderRadius: 5,
                  paddingVertical: 8,
                  gap: 3,
                }}
                onPress={() => setIsModalVisible(true)}
              >
                <MaterialIcons
                  name="tune"
                  size={20}
                  color={colors.brand.main}
                />
                <Text
                  style={[typography.subhead, { color: colors.brand.main }]}
                >
                  {" "}
                  Sort/Filter{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <SortFilterModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onApply={handleApplyFilters}
          />
          <ScrollView
            style={{
              position: "static",
            }}
          >
            {filteredSites.length === 0 ? (
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 100,
                }}
              >
                <Image
                  style={{
                    width: 200,
                    height: 200,
                  }}
                  source={require("@/assets/static/empty-result.png")}
                />
                <Text
                  style={[
                    typography.subhead,
                    { color: colors.text.disable, fontStyle: "italic" },
                  ]}
                >
                  {" "}
                  Data Tidak Ditemukan.{" "}
                </Text>
              </View>
            ) : (
              filteredSites.map((item) => {
                const distance = calculateDistance(
                  currentLocation?.latitude || 0,
                  currentLocation?.longitude || 0,
                  item.latitude || 0,
                  item.longitude || 0
                );

                const openStatus = getOpenCloseStatus(
                  item.operationalHours || ""
                );

                return (
                  <SiteListCard
                    key={item.id} // Ensure you add a key prop
                    id={item.id}
                    siteName={item.siteName}
                    address={item.address}
                    avrgRating={averageRating(item.reviews)}
                    reviewCount={item.reviews.length}
                    formattedDistance={formatDistance(distance)}
                    walkingTime={calculateWalkingTime(distance)}
                    openStatus={openStatus}
                    images={item.images}
                    reviews={item.reviews}
                    onBookmarkToggled={refetch}
                    onNavigate={(id) => push(`/details/${id}`)}
                  />
                );
              })
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: spacing.medium,
    rowGap: 10,
    top: 0,
  },

  searchBar: {
    width: "100%",
    height: 56,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: colors.brand.main,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: spacing.medium,
    backgroundColor: "white",
  },

  input: {
    flex: 1, // Allow the TextInput to take up remaining space
    height: "100%",
    marginRight: spacing.small, // Add margin to separate from the icon
  },
});
