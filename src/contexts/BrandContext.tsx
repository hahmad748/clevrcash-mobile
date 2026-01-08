import React, {createContext, useContext, useState, useEffect, useCallback, useRef} from 'react';
import type {Brand} from '../types/api';
import {apiClient} from '../services/apiClient';
import {defaultBrand} from '../config/brand';
import {getToken, getBrand, setBrand as saveBrand} from '../services/storage';

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
  const isLoadingRef = useRef(false);

  const loadBrand = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      return;
    }
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      // First, try to load from storage (for faster initial load)
      const cachedBrand = await getBrand();
      if (cachedBrand) {
        setBrand(cachedBrand);
      }
      
      // Check if user is authenticated
      const token = await getToken();
      if (token) {
        try {
          const brandData = await apiClient.getBrand();
          setBrand(brandData);
          // Save to storage for future use
          await saveBrand(brandData);
        } catch (error) {
          console.error('Failed to load brand from API:', error);
          // If we have cached brand, use it, otherwise fallback to default
          if (cachedBrand) {
            setBrand(cachedBrand);
          } else {
            setBrand(defaultBrandData);
          }
        }
      } else {
        // Use cached brand if available, otherwise default
        if (cachedBrand) {
          setBrand(cachedBrand);
        } else {
          setBrand(defaultBrandData);
        }
      }
    } catch (error) {
      console.error('Failed to load brand:', error);
      // Try to load from cache as last resort
      const cachedBrand = await getBrand();
      setBrand(cachedBrand || defaultBrandData);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadBrand();
  }, [loadBrand]);

  // Reload brand when app comes to foreground (user might have logged in)
  useEffect(() => {
    const {AppState} = require('react-native');
    
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // Reload brand when app becomes active (user might have logged in)
        loadBrand();
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, [loadBrand]);

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
