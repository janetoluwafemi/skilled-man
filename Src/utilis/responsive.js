import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = SCREEN_WIDTH / guidelineBaseWidth;
const verticalScale = SCREEN_HEIGHT / guidelineBaseHeight;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Normalizes font sizes and layout dimensions based on screen width.
 * @param {number} size - The size to normalize.
 * @returns {number} The normalized size.
 */
export const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

/**
 * Normalizes layout dimensions based on screen width.
 * @param {number} size - The size to normalize.
 * @returns {number} The normalized size.
 */
export const horizontalScale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Normalizes layout dimensions based on screen height.
 * @param {number} size - The size to normalize.
 * @returns {number} The normalized size.
 */
export const verticalScaleSize = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

export const widthPercentage = (percent) => {
  return (percent * SCREEN_WIDTH) / 100;
};

export const heightPercentage = (percent) => {
  return (percent * SCREEN_HEIGHT) / 100;
};

export default {
  normalize,
  horizontalScale,
  verticalScale: verticalScaleSize,
  widthPercentage,
  heightPercentage,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
};
