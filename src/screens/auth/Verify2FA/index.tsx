import React, {useState, useRef} from 'react';
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
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {useBrand} from '../../../contexts/BrandContext';
import {getBrandOverlayColor, getBrandColor} from '../../../utils/colorUtils';
import {styles as baseStyles} from './styles';
import {StyleSheet} from 'react-native';
import { showError } from '../../../utils/flashMessage';

export function Verify2FAScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {colors} = useTheme();
  const {brand, loadBrand} = useBrand();
  const {loginWith2FA} = useAuth();
  const {email, password} = (route.params as any) || {};
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const primaryColor = getBrandColor(brand?.primary_color);
  const overlayColor = getBrandOverlayColor(brand?.primary_color, 0.7);
  
  // Dynamic styles with brand colors
  const dynamicStyles = StyleSheet.create({
    overlay: {
      ...baseStyles.overlay,
      backgroundColor: overlayColor,
    },
  });

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      // Handle paste or multiple characters
      const digits = numericText.slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(index + digits.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }
    } else {
      // Single character input
      const newCode = [...code];
      newCode[index] = numericText;
      setCode(newCode);
      
      // Auto-focus next input if a digit was entered
      if (numericText && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      // If current input is empty and backspace is pressed, focus previous input
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      showError('Error', 'Please enter a valid 6-digit code');
      return;
    }

    if (!email || !password) {
      showError('Error', 'Missing credentials');
      navigation.goBack();
      return;
    }

    setLoading(true);
    try {
      await loginWith2FA(email, password, fullCode);
      // Reload brand after successful login
      await loadBrand();
    } catch (error: any) {
      showError('Verification Failed', error.message || 'Invalid code');
      // Clear code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
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

  const fullCode = code.join('');

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
            <Text style={baseStyles.welcomeText}>Two-Factor Authentication</Text>
            <Text style={baseStyles.subtitleText}>Enter the 6-digit code from your authenticator app</Text>
          </View>

          {/* Form Card */}
          <View style={baseStyles.formCard}>
            <View style={baseStyles.form}>
              {/* Shield Icon */}
              <View style={baseStyles.shieldContainer}>
                <MaterialIcons name="verified" size={48} color={primaryColor} />
              </View>

              {/* Verification Code Label */}
              <Text style={baseStyles.codeLabel}>Verification Code</Text>

              {/* Segmented Code Input */}
              <View style={baseStyles.codeInputContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (inputRefs.current[index] = ref)}
                    style={[
                      baseStyles.codeDigitInput,
                      {
                        borderColor: digit ? primaryColor : 'rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        color: '#333333',
                      },
                    ]}
                    value={digit}
                    onChangeText={text => handleCodeChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                style={[baseStyles.primaryButton, {backgroundColor: primaryColor}]}
                onPress={handleVerify}
                disabled={loading || fullCode.length !== 6}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={baseStyles.primaryButtonText}>Verify</Text>
                )}
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity
                style={baseStyles.backButton}
                onPress={() => navigation.goBack()}>
                <Text style={[baseStyles.backButtonText, {color: primaryColor}]}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
