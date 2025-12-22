import React, {useEffect, useRef} from 'react';
import {View, Text, Image, ActivityIndicator, ImageBackground, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthContext';
import {useBrand} from '../../contexts/BrandContext';
import {styles} from './styles';

export function SplashScreen() {
  const navigation = useNavigation();
  const {isAuthenticated, loading: authLoading, user} = useAuth();
  const {loading: brandLoading, loadBrand, brand} = useBrand();
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // Only navigate once on initial load, not when isAuthenticated changes
    if (!authLoading && !brandLoading && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      navigateToNextScreen();
    }
  }, [authLoading, brandLoading]);

  const initializeApp = async () => {
    await loadBrand();
  };

  const navigateToNextScreen = () => {
    // Small delay for smooth transition
    setTimeout(() => {
      try {
        if (isAuthenticated) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Main' as never}],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'Auth' as never}],
          });
        }
      } catch (error) {
        console.error('Navigation error in SplashScreen:', error);
      }
    }, 2000);
  };

  // Don't render anything until both auth and brand are loaded to prevent flickering
  if (authLoading || brandLoading) {
    // Show a minimal loading state while checking
    return (
      <View style={[styles.container, {backgroundColor: '#4CAF50'}]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Check if user is signed in and has brand assets
  const hasBrandAssets = isAuthenticated && brand && (brand.primary_color || brand.logo_url || brand.splash_url);

  // Try to load background image, fallback to solid color
  let backgroundSource;
  try {
    backgroundSource = require('../../assets/images/welcome-background.png');
  } catch {
    try {
      backgroundSource = require('../../assets/images/splash.jpg');
    } catch {
      backgroundSource = null;
    }
  }

  // If user is signed in and has brand assets, show brand-specific splash edge to edge
  if (hasBrandAssets && brand.splash_url) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent={true} />
        <ImageBackground
          source={{uri: brand.splash_url}}
          style={styles.fullScreenSplash}
          resizeMode="cover">
          {/* Optional: Add loading indicator overlay if needed */}
          <View style={styles.splashOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        </ImageBackground>
      </View>
    );
  }

  // If user is signed in but no splash_url, show primary color with logo
  if (hasBrandAssets && !brand.splash_url) {
    return (
      <View style={[styles.container, {backgroundColor: brand.primary_color || '#4CAF50'}]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.fullScreenContent}>
          {brand.logo_url ? (
            <Image source={{uri: brand.logo_url}} style={styles.brandLogo} resizeMode="contain" />
          ) : (
            <Text style={styles.brandLogoText}>{brand.display_name || 'ClevrCash'}</Text>
          )}
          <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
          <Text style={styles.footer}>Powered by devsfort</Text>
        </View>
      </View>
    );
  }

  // If not authenticated or no brand assets, show welcome background without buttons
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Background Image with Overlay - Same as Welcome */}
      {backgroundSource ? (
        <ImageBackground
          source={backgroundSource}
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.overlay} />
        </ImageBackground>
      ) : (
        <View style={[styles.backgroundImage, styles.fallbackBackground]}>
          <View style={styles.overlay} />
        </View>
      )}

      {/* Content - Logo and Loading Only */}
      <View style={styles.content}>
        <View style={styles.logoSection}>
          {brand?.logo_url ? (
            <Image source={{uri: brand.logo_url}} style={styles.logo} resizeMode="contain" />
          ) : (
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>{brand?.display_name || 'CLEVRCASH'}</Text>
            </View>
          )}
          <Text style={styles.tagline}>Split Bills Like a Boss.</Text>
          <Text style={styles.tagline}>No More Awkward Maths.</Text>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingSection}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}
