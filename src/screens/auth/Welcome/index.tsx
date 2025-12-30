import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useBrand} from '../../../contexts/BrandContext';
import {getBrandOverlayColor, getBrandColor} from '../../../utils/colorUtils';
import {styles as baseStyles} from './styles';
import {Icon, WelcomeBackground as WelcomeBg, SplashImage as SplashImg} from '../../../assets/images';

export function WelcomeScreen() {
  const navigation = useNavigation();
  const {brand} = useBrand();

  const primaryColor = getBrandColor(brand?.primary_color);
  const overlayColor = getBrandOverlayColor(brand?.primary_color, 0.7);
  
  // Dynamic styles with brand colors
  const dynamicStyles = StyleSheet.create({
    overlay: {
      ...baseStyles.overlay,
      backgroundColor: overlayColor,
    },
    getStartedButton: {
      ...baseStyles.getStartedButton,
      backgroundColor: primaryColor,
    },
  });

  const handleGetStarted = () => {
    navigation.navigate('Login' as never);
  };

  // Try to load background image, fallback to solid color
  let backgroundSource;
  try {
    backgroundSource = WelcomeBg;
  } catch {
    try {
      backgroundSource = SplashImg;
    } catch {
      backgroundSource = null;
    }
  }

  const renderContent = () => (
    <View style={baseStyles.content}>
      {/* Logo and Tagline */}
      <View style={baseStyles.headerSection}>
        {brand?.logo_url ? (
          <Image 
            source={{uri: brand.logo_url}} 
            style={baseStyles.logo} 
            resizeMode="contain"
            onError={(error) => {
              console.warn('Failed to load brand logo from URL:', error);
            }}
          />
        ) : (
          <View style={baseStyles.logoContainer}>
            <Image 
              source={Icon} 
              style={baseStyles.logo} 
              resizeMode="contain"
              onError={(error) => {
                console.warn('Failed to load local logo image:', error);
              }}
            />
            <Text style={baseStyles.logoText}>{brand?.display_name || 'CLEVRCASH'}</Text>
          </View>
        )}
        <Text style={baseStyles.tagline}>Split Bills Like a Boss.</Text>
        <Text style={baseStyles.tagline}>No More Awkward Maths.</Text>
      </View>

      {/* Get Started Button at Bottom */}
      <View style={baseStyles.buttonContainer}>
        <TouchableOpacity
          style={dynamicStyles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}>
          <Text style={baseStyles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={baseStyles.container}>
      <StatusBar barStyle="light-content" />
      {/* Background Image with Overlay */}
      {backgroundSource ? (
        <ImageBackground
          source={backgroundSource}
          style={baseStyles.backgroundImage}
          resizeMode="cover">
          <View style={dynamicStyles.overlay} />
          {renderContent()}
        </ImageBackground>
      ) : (
        <View style={[baseStyles.backgroundImage, baseStyles.fallbackBackground]}>
          <View style={dynamicStyles.overlay} />
          {renderContent()}
        </View>
      )}
    </View>
  );
}
