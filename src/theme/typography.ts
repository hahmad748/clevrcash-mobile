import {Platform, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const isSmallDevice = width < 360 || height < 640;
const isMediumDevice = width >= 360 && width < 414;
const isLargeDevice = width >= 414;

// Scale factors for Android
const androidScaleFactor = isSmallDevice ? 0.85 : isMediumDevice ? 0.9 : 0.95;
const iosScaleFactor = 1;

/**
 * Centralized typography system
 * All font sizes are responsive and device-aware
 */
export const typography = {
  // Headings
  h1: {
    fontSize: Platform.select({
      ios: 32,
      android: isSmallDevice ? 26 * androidScaleFactor : 28 * androidScaleFactor,
    }),
    fontWeight: '700' as const,
    lineHeight: Platform.select({
      ios: 40,
      android: isSmallDevice ? 32 * androidScaleFactor : 36 * androidScaleFactor,
    }),
  },
  h2: {
    fontSize: Platform.select({
      ios: 24,
      android: isSmallDevice ? 20 * androidScaleFactor : 22 * androidScaleFactor,
    }),
    fontWeight: '600' as const,
    lineHeight: Platform.select({
      ios: 32,
      android: isSmallDevice ? 26 * androidScaleFactor : 28 * androidScaleFactor,
    }),
  },
  h3: {
    fontSize: Platform.select({
      ios: 20,
      android: isSmallDevice ? 17 * androidScaleFactor : 18 * androidScaleFactor,
    }),
    fontWeight: '600' as const,
    lineHeight: Platform.select({
      ios: 28,
      android: isSmallDevice ? 22 * androidScaleFactor : 24 * androidScaleFactor,
    }),
  },
  // Body text
  body: {
    fontSize: Platform.select({
      ios: 16,
      android: isSmallDevice ? 13 * androidScaleFactor : 14 * androidScaleFactor,
    }),
    fontWeight: '400' as const,
    lineHeight: Platform.select({
      ios: 24,
      android: isSmallDevice ? 19 * androidScaleFactor : 20 * androidScaleFactor,
    }),
  },
  bodySmall: {
    fontSize: Platform.select({
      ios: 14,
      android: isSmallDevice ? 11 * androidScaleFactor : 12 * androidScaleFactor,
    }),
    fontWeight: '400' as const,
    lineHeight: Platform.select({
      ios: 20,
      android: isSmallDevice ? 16 * androidScaleFactor : 17 * androidScaleFactor,
    }),
  },
  // Captions and labels
  caption: {
    fontSize: Platform.select({
      ios: 12,
      android: isSmallDevice ? 10 * androidScaleFactor : 11 * androidScaleFactor,
    }),
    fontWeight: '400' as const,
    lineHeight: Platform.select({
      ios: 16,
      android: isSmallDevice ? 13 * androidScaleFactor : 14 * androidScaleFactor,
    }),
  },
  captionSmall: {
    fontSize: Platform.select({
      ios: 11,
      android: isSmallDevice ? 9 * androidScaleFactor : 10 * androidScaleFactor,
    }),
    fontWeight: '400' as const,
    lineHeight: Platform.select({
      ios: 14,
      android: isSmallDevice ? 12 * androidScaleFactor : 13 * androidScaleFactor,
    }),
  },
  // Buttons
  button: {
    fontSize: Platform.select({
      ios: 16,
      android: isSmallDevice ? 13 * androidScaleFactor : 14 * androidScaleFactor,
    }),
    fontWeight: '600' as const,
    lineHeight: Platform.select({
      ios: 24,
      android: isSmallDevice ? 19 * androidScaleFactor : 20 * androidScaleFactor,
    }),
  },
  buttonSmall: {
    fontSize: Platform.select({
      ios: 14,
      android: isSmallDevice ? 11 * androidScaleFactor : 12 * androidScaleFactor,
    }),
    fontWeight: '600' as const,
    lineHeight: Platform.select({
      ios: 20,
      android: isSmallDevice ? 16 * androidScaleFactor : 17 * androidScaleFactor,
    }),
  },
  // Special sizes
  large: {
    fontSize: Platform.select({
      ios: 24,
      android: isSmallDevice ? 20 * androidScaleFactor : 22 * androidScaleFactor,
    }),
    fontWeight: '700' as const,
    lineHeight: Platform.select({
      ios: 32,
      android: isSmallDevice ? 26 * androidScaleFactor : 28 * androidScaleFactor,
    }),
  },
  medium: {
    fontSize: Platform.select({
      ios: 18,
      android: isSmallDevice ? 15 * androidScaleFactor : 16 * androidScaleFactor,
    }),
    fontWeight: '500' as const,
    lineHeight: Platform.select({
      ios: 24,
      android: isSmallDevice ? 19 * androidScaleFactor : 20 * androidScaleFactor,
    }),
  },
};

/**
 * Centralized spacing system
 * Reduced spacing for better UI density
 */
export const spacing = {
  xs: Platform.select({
    ios: 4,
    android: 3,
  }),
  sm: Platform.select({
    ios: 8,
    android: 6,
  }),
  md: Platform.select({
    ios: 12,
    android: 10,
  }),
  lg: Platform.select({
    ios: 16,
    android: 14,
  }),
  xl: Platform.select({
    ios: 20,
    android: 18,
  }),
  xxl: Platform.select({
    ios: 24,
    android: 20,
  }),
  xxxl: Platform.select({
    ios: 32,
    android: 28,
  }),
};

/**
 * Android-specific text properties
 */
export const androidTextProps = {
  includeFontPadding: false,
  textAlignVertical: 'center' as const,
};

