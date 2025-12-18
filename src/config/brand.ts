import type {Brand} from '../types/api';

export interface BrandConfig {
  name: string;
  displayName: string;
  primaryColor: string;
  secondaryColor?: string;
  fontFamily: string;
  logoUrl?: string;
  splashUrl?: string;
}

export const defaultBrand: BrandConfig = {
  name: 'ClevrCash',
  displayName: 'ClevrCash',
  primaryColor: '#4CAF50',
  secondaryColor: '#45a049',
  fontFamily: 'Montserrat',
  logoUrl: undefined,
  splashUrl: undefined,
};

export const getBrandConfig = (): BrandConfig => {
  // In production, this could fetch from remote config
  return defaultBrand;
};

export const brandToConfig = (brand: Brand | null): BrandConfig => {
  if (!brand) {
    return defaultBrand;
  }

  return {
    name: brand.name,
    displayName: brand.display_name,
    primaryColor: brand.primary_color,
    secondaryColor: brand.secondary_color,
    fontFamily: brand.font_family,
    logoUrl: brand.logo_url,
    splashUrl: brand.splash_url,
  };
};

