// utils/fontUtils.js
import { PixelRatio } from 'react-native';

// Converts base px size to sp (scaled size based on user's font setting)
export const scaleFont = (size) => size * PixelRatio.getFontScale();

// Define font categories with default sizes within the client range
export const FONT_SIZES = {
  bodySmall: scaleFont(14),     // within 14–16sp
  body: scaleFont(15),
  bodyLarge: scaleFont(16),

  subheadingSmall: scaleFont(16),  // within 16–18sp
  subheading: scaleFont(17),
  subheadingLarge: scaleFont(18),

  headingSmall: scaleFont(18),     // within 18–24sp
  heading: scaleFont(20),
  headingLarge: scaleFont(24),
};
