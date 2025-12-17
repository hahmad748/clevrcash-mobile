import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useBrand} from '../../../contexts/BrandContext';
import {styles} from './styles';

export function WelcomeScreen() {
  const navigation = useNavigation();
  const {brand} = useBrand();

  const primaryColor = brand?.primary_color || '#4CAF50'; // Green default

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log('Google login');
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple login
    console.log('Apple login');
  };

  const handleEmailLogin = () => {
    navigation.navigate('Login' as never);
  };

  // Try to load background image, fallback to solid color
  let backgroundSource;
  try {
    backgroundSource = require('../../../assets/images/welcome-background.png');
  } catch {
    try {
      backgroundSource = require('../../../assets/images/splash.jpg');
    } catch {
      backgroundSource = null;
    }
  }

  const renderContent = () => (
    <View style={styles.content}>
      {/* Logo and Tagline */}
      <View style={styles.headerSection}>
        {brand?.logo_url ? (
          <Image source={{uri: brand.logo_url}} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.logoText}>{brand?.display_name || 'CLEVRCASH'}</Text>
          </View>
        )}
        <Text style={styles.tagline}>Split Bills Like a Boss.</Text>
        <Text style={styles.tagline}>No More Awkward Maths.</Text>
      </View>

      {/* Login Buttons */}
      <View style={styles.buttonsContainer}>
        {/* Primary Login Button */}
        <TouchableOpacity
          style={[styles.primaryButton, {backgroundColor: primaryColor}]}
          onPress={handleLogin}
          activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Social Login Buttons */}
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.8}>
          <View style={styles.googleIconContainer}>
            <MaterialIcons name="mail" size={24} color="#000000"/>
          </View>
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleAppleLogin}
          activeOpacity={0.8}>
          <MaterialIcons name="apple" size={24} color="#000000" />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleEmailLogin}
          activeOpacity={0.8}>
          <MaterialIcons name="email" size={24} color="#000000" />
          <Text style={styles.socialButtonText}>Continue with Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Background Image with Overlay */}
      {backgroundSource ? (
        <ImageBackground
          source={backgroundSource}
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.overlay} />
          {renderContent()}
        </ImageBackground>
      ) : (
        <View style={[styles.backgroundImage, styles.fallbackBackground]}>
          <View style={styles.overlay} />
          {renderContent()}
        </View>
      )}
    </View>
  );
}
