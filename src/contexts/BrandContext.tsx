import React, {createContext, useContext, useState, useEffect} from 'react';
import type {Brand} from '../types/api';
import {apiClient} from '../services/apiClient';
import {defaultBrand} from '../config/brand';
import {getToken} from '../services/storage';

interface BrandContextType {
  brand: Brand | null;
  loading: boolean;
  loadBrand: () => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const defaultBrandData: Brand = {
  id: 0,
  name: defaultBrand.name,
  slug: 'clevrcash',
  display_name: defaultBrand.displayName,
  primary_color: defaultBrand.primaryColor,
  secondary_color: defaultBrand.secondaryColor,
  font_family: defaultBrand.fontFamily,
  logo_url: defaultBrand.logoUrl,
  splash_url: defaultBrand.splashUrl,
  theme_tokens: undefined,
  feature_flags: undefined,
  supported_languages: ['en'],
  supported_currencies: ['USD'],
};

export function BrandProvider({children}: {children: React.ReactNode}) {
  const [brand, setBrand] = useState<Brand | null>(defaultBrandData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrand();
  }, []);

  const loadBrand = async () => {
    try {
      setLoading(true);
      // Check if user is authenticated
      const token = await getToken();
      if (token) {
        try {
          const brandData = await apiClient.getBrand();
          setBrand(brandData);
        } catch (error) {
          console.error('Failed to load brand from API:', error);
          // Fallback to default brand
          setBrand(defaultBrandData);
        }
      } else {
        // Use default brand when not authenticated
        setBrand(defaultBrandData);
      }
    } catch (error) {
      console.error('Failed to load brand:', error);
      setBrand(defaultBrandData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandContext.Provider value={{brand, loading, loadBrand}}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
