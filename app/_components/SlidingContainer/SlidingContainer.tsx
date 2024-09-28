import { colors } from "@/theme/colors";
import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SlidingContainer() {
  // Set the initial height to 20% of the screen height
  const INITIAL_HEIGHT = SCREEN_HEIGHT * 0.3;
  const containerHeight = useRef(new Animated.Value(INITIAL_HEIGHT)).current;
  const handleOpacity = useRef(new Animated.Value(0)).current; // Initialize handle opacity to 0 (invisible)

  // Create a pan responder to handle dragging on the "handle"
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        // Clamp the height between the initial height and full screen
        const newHeight = INITIAL_HEIGHT - gestureState.dy;
        if (newHeight >= INITIAL_HEIGHT && newHeight <= SCREEN_HEIGHT) {
          containerHeight.setValue(newHeight);

          // Update handle opacity as the container height approaches full screen
          if (newHeight >= SCREEN_HEIGHT * 0.6) {
            // Show the handle when close to full screen
            Animated.timing(handleOpacity, {
              toValue: 1, // Fully visible
              duration: 100,
              useNativeDriver: true,
            }).start();
          } else if (newHeight <= SCREEN_HEIGHT * 0.9) {
            // Hide the handle when not close to full screen
            Animated.timing(handleOpacity, {
              toValue: 0, // Fully hidden
              duration: 100,
              useNativeDriver: true,
            }).start();
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const newHeight = INITIAL_HEIGHT - gestureState.dy;
        // Snap to full screen or initial position based on drag
        if (newHeight > SCREEN_HEIGHT * 0.6) {
          Animated.spring(containerHeight, {
            toValue: SCREEN_HEIGHT, // Full screen
            useNativeDriver: false,
          }).start(() => {
            // Ensure handle is visible when fully expanded
            Animated.timing(handleOpacity, {
              toValue: 1, // Fully visible
              duration: 100,
              useNativeDriver: true,
            }).start();
          });
        } else {
          Animated.spring(containerHeight, {
            toValue: INITIAL_HEIGHT, // Snap back to initial height
            useNativeDriver: false,
          }).start(() => {
            // Ensure handle is hidden when collapsed
            Animated.timing(handleOpacity, {
              toValue: 0, // Fully hidden
              duration: 100,
              useNativeDriver: true,
            }).start();
          });
        }
      },
    })
  ).current;

  return (
    <View style={styles.mainContainer}>
      {/* Sticky handle, its visibility is controlled by opacity */}
      <Animated.View
        style={[styles.stickyHandle, { opacity: handleOpacity }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handleIndicator} />
      </Animated.View>

      {/* Sliding animated container */}
      <Animated.View style={[styles.container, { height: containerHeight }]}>
        <View {...panResponder.panHandlers} style={styles.handle}>
          <View style={styles.handleIndicator} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Example scrollable content */}
          {Array.from({ length: 30 }, (_, i) => (
            <Text key={i} style={styles.item}>
              Scrollable Item {i + 1}
            </Text>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container that fills the screen
  mainContainer: {
    ...StyleSheet.absoluteFillObject, // Full screen
    justifyContent: "center",
    alignItems: "center",
  },

  handle: {
    width: "100%",
    height: 30,
    backgroundColor: colors.brand.main,
    borderTopStartRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  // Sticky handle, initially hidden
  stickyHandle: {
    position: "absolute",
    top: 0, // Fixed at the top of the screen
    width: "100%",
    height: 30,
    backgroundColor: colors.brand.main,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2, // Ensure it's above the sliding container
    borderTopStartRadius: 5,
  },

  handleIndicator: {
    width: 50,
    height: 5,
    backgroundColor: "white",
    borderRadius: 3,
  },
  // Sliding container for scrollable content
  container: {
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1, // Below the sticky handle
  },
  scrollViewContent: {
    padding: 20,
  },
  item: {
    padding: 10,
    fontSize: 16,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
});
