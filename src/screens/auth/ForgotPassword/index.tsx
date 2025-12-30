import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import {getBrandOverlayColor, getBrandColor} from '../../../utils/colorUtils';
import {styles as baseStyles} from './styles';
import {StyleSheet} from 'react-native';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {brand} = useBrand();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const primaryColor = getBrandColor(brand?.primary_color);
  const overlayColor = getBrandOverlayColor(brand?.primary_color, 0.7);
  
  // Dynamic styles with brand colors
  const dynamicStyles = StyleSheet.create({
    overlay: {
      ...baseStyles.overlay,
      backgroundColor: overlayColor,
    },
  });

  const handleSubmit = async () => {
    if (!email.trim()) {
      showError('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await apiClient.forgotPassword(email.trim());
      showSuccess(
        'Success',
        'Password reset link has been sent to your email',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      showError('Error', error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
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
        </ImageBackground>
      ) : (
        <View style={[baseStyles.backgroundImage, baseStyles.fallbackBackground]}>
          <View style={dynamicStyles.overlay} />
        </View>
      )}

      <KeyboardAvoidingView
        style={baseStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={baseStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Logo Section */}
          <View style={baseStyles.logoSection}>
            {brand?.logo_url ? (
              <Image source={{uri: brand.logo_url}} style={baseStyles.logo} resizeMode="contain" />
            ) : (
              <View style={baseStyles.logoContainer}>
                <Image
                  source={require('../../../assets/images/icon.png')}
                  style={baseStyles.logo}
                  resizeMode="contain"
                />
                <Text style={baseStyles.logoText}>{brand?.display_name || 'CLEVRCASH'}</Text>
              </View>
            )}
            <Text style={baseStyles.welcomeText}>Forgot Password</Text>
            <Text style={baseStyles.subtitleText}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
          </View>

          {/* Form Card */}
          <View style={baseStyles.formCard}>
            <View style={baseStyles.form}>
              {/* Email Input */}
              <View style={baseStyles.inputContainer}>
                <View style={baseStyles.inputLabelContainer}>
                  <MaterialIcons name="email" size={20} color="#666666" style={baseStyles.inputIcon} />
                  <Text style={baseStyles.label}>Email</Text>
                </View>
                <TextInput
                  style={baseStyles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[baseStyles.primaryButton, {backgroundColor: primaryColor}]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={baseStyles.primaryButtonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity
                style={baseStyles.backButton}
                onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={20} color={primaryColor} />
                <Text style={[baseStyles.backButtonText, {color: primaryColor}]}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
