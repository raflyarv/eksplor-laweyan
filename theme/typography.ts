import { TextStyle, PixelRatio } from "react-native";

// Helper function to make font sizes fixed
const scaleFontSize = (size: number): number => {
  const fontScale = PixelRatio.getFontScale();
  return size / fontScale;
};

export const typography: { [key: string]: TextStyle } = {
  largeTitleMed: {
    fontSize: scaleFontSize(34),
    fontWeight: "500",
  },

  largeTitleBold: {
    fontSize: scaleFontSize(34),
    fontWeight: "600",
  },

  title1: {
    fontWeight: "400",
    fontSize: scaleFontSize(28),
  },

  title1Bold: {
    fontWeight: "600",
    fontSize: scaleFontSize(28),
  },

  title2: {
    fontWeight: "400",
    fontSize: scaleFontSize(24),
  },

  title2Bold: {
    fontWeight: "500",
    fontSize: scaleFontSize(24),
  },

  title3: {
    fontWeight: "400",
    fontSize: scaleFontSize(20),
  },

  title3Bold: {
    fontWeight: "500",
    fontSize: scaleFontSize(20),
  },

  headline: {
    fontWeight: "500",
    fontSize: scaleFontSize(17),
  },

  body: {
    fontWeight: "400",
    fontSize: scaleFontSize(17),
  },

  callout: {
    fontWeight: "400",
    fontSize: scaleFontSize(16),
  },

  subhead: {
    fontWeight: "400",
    fontSize: scaleFontSize(15),
  },

  footnote: {
    fontWeight: "400",
    fontSize: scaleFontSize(13),
  },

  caption1: {
    fontWeight: "400",
    fontSize: scaleFontSize(12),
  },

  caption2: {
    fontWeight: "400",
    fontSize: scaleFontSize(11),
  },
};
