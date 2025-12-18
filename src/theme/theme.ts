import type {Brand} from '../types/api';

export interface ThemeColors {
  primary: string;
  secondary?: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    fontFamily: string;
    h1: {fontSize: number; fontWeight: string; lineHeight: number};
    h2: {fontSize: number; fontWeight: string; lineHeight: number};
    h3: {fontSize: number; fontWeight: string; lineHeight: number};
    body: {fontSize: number; fontWeight: string; lineHeight: number};
    caption: {fontSize: number; fontWeight: string; lineHeight: number};
    button: {fontSize: number; fontWeight: string; lineHeight: number};
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
}

const defaultSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const defaultTypography = {
  fontFamily: 'Montserrat',
  h1: {fontSize: 32, fontWeight: '700', lineHeight: 40},
  h2: {fontSize: 24, fontWeight: '600', lineHeight: 32},
  h3: {fontSize: 20, fontWeight: '600', lineHeight: 28},
  body: {fontSize: 16, fontWeight: '400', lineHeight: 24},
  caption: {fontSize: 14, fontWeight: '400', lineHeight: 20},
  button: {fontSize: 16, fontWeight: '600', lineHeight: 24},
};

const defaultBorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

const defaultShadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const createLightTheme = (brand?: Brand): Theme => {
  const primaryColor = brand?.primary_color || '#4CAF50';
  const secondaryColor = brand?.secondary_color || '#45a049';
  const themeTokens = brand?.theme_tokens?.light;

  return {
    colors: {
      primary: primaryColor,
      secondary: secondaryColor,
      background: themeTokens?.background || '#FFFFFF',
      surface: themeTokens?.surface || '#F5F5F5',
      text: themeTokens?.text || '#212121',
      textSecondary: '#757575',
      border: '#E0E0E0',
      error: '#F44336',
      success: '#4CAF50',
      warning: '#FF9800',
      info: '#2196F3',
    },
    spacing: defaultSpacing,
    typography: {
      ...defaultTypography,
      fontFamily: brand?.font_family || 'Montserrat',
    },
    borderRadius: defaultBorderRadius,
    shadows: defaultShadows,
  };
};

export const createDarkTheme = (brand?: Brand): Theme => {
  const primaryColor = brand?.primary_color || '#4CAF50';
  const secondaryColor = brand?.secondary_color || '#45a049';
  const themeTokens = brand?.theme_tokens?.dark;

  return {
    colors: {
      primary: primaryColor,
      secondary: secondaryColor,
      background: themeTokens?.background || '#121212',
      surface: themeTokens?.surface || '#1E1E1E',
      text: themeTokens?.text || '#FFFFFF',
      textSecondary: '#B0B0B0',
      border: '#333333',
      error: '#EF5350',
      success: '#66BB6A',
      warning: '#FFA726',
      info: '#42A5F5',
    },
    spacing: defaultSpacing,
    typography: {
      ...defaultTypography,
      fontFamily: brand?.font_family || 'Montserrat',
    },
    borderRadius: defaultBorderRadius,
    shadows: defaultShadows,
  };
};
