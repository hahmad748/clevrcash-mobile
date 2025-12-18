/**
 * Font utility functions for Montserrat font family
 * Maps React Native fontWeight to Montserrat font file names
 */

export const getMontserratFontFamily = (fontWeight?: string | number): string => {
  if (!fontWeight) return 'Montserrat-Regular';

  const weightNum = typeof fontWeight === 'string' ? parseInt(fontWeight, 10) : fontWeight;

  // Map numeric weights to Montserrat font files
  if (weightNum >= 900) return 'Montserrat-Black';
  if (weightNum >= 800) return 'Montserrat-ExtraBold';
  if (weightNum >= 700) return 'Montserrat-Bold';
  if (weightNum >= 600) return 'Montserrat-SemiBold';
  if (weightNum >= 500) return 'Montserrat-Medium';
  if (weightNum >= 300) return 'Montserrat-Light';
  if (weightNum >= 200) return 'Montserrat-ExtraLight';
  if (weightNum >= 100) return 'Montserrat-Thin';
  return 'Montserrat-Regular';
};

export const getMontserratStyle = (fontWeight?: string | number) => {
  return {
    fontFamily: getMontserratFontFamily(fontWeight),
  };
};

/**
 * Helper to get font family based on fontWeight string
 */
export const getFontFamilyFromWeight = (fontWeight?: string): string => {
  if (!fontWeight) return 'Montserrat-Regular';
  
  const weightMap: Record<string, string> = {
    '100': 'Montserrat-Thin',
    '200': 'Montserrat-ExtraLight',
    '300': 'Montserrat-Light',
    '400': 'Montserrat-Regular',
    '500': 'Montserrat-Medium',
    '600': 'Montserrat-SemiBold',
    '700': 'Montserrat-Bold',
    '800': 'Montserrat-ExtraBold',
    '900': 'Montserrat-Black',
    normal: 'Montserrat-Regular',
    bold: 'Montserrat-Bold',
  };

  return weightMap[fontWeight] || 'Montserrat-Regular';
};

/**
 * Default font family for the app
 */
export const DEFAULT_FONT_FAMILY = 'Montserrat-Regular';
