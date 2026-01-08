import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ImageBackground,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useAuth} from '../../../contexts/AuthContext';
import {useBrand} from '../../../contexts/BrandContext';
import {getBrandOverlayColor, getBrandColor} from '../../../utils/colorUtils';
import {socialLoginService} from '../../../services/socialLogin';
import {apiClient} from '../../../services/apiClient';
import {styles as baseStyles} from './styles';
import {StyleSheet} from 'react-native';
import { showError } from '../../../utils/flashMessage';

export function LoginScreen() {
  const navigation = useNavigation();
  const {login, socialLogin} = useAuth();
  const {brand, loadBrand} = useBrand();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [enabledProviders, setEnabledProviders] = useState<string[]>([]);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [checkingProviders, setCheckingProviders] = useState(true);

  const primaryColor = getBrandColor(brand?.primary_color);
  const overlayColor = getBrandOverlayColor(brand?.primary_color, 0.7);
  
  // Dynamic styles with brand colors
  const dynamicStyles = StyleSheet.create({
    overlay: {
      ...baseStyles.overlay,
      backgroundColor: overlayColor,
    },
  });

  // Check enabled social providers on mount
  useEffect(() => {
    checkEnabledProviders();
  }, []);

  const checkEnabledProviders = async () => {
    setCheckingProviders(true);
    try {
      const response = await apiClient.getEnabledSocialProviders();
      const providers = Array.isArray(response.providers) ? response.providers : [];
      
      // Filter to only valid provider strings and normalize to lowercase
      const validProviders = providers
        .filter(p => typeof p === 'string' && p.length > 0)
        .map(p => p.toLowerCase().trim());
      
      console.log('[Login] Enabled social providers:', {
        raw: providers,
        filtered: validProviders,
        hasGoogle: validProviders.includes('google'),
        hasApple: validProviders.includes('apple'),
      });
      
      // Only set providers that are explicitly in the array
      setEnabledProviders(validProviders);
    } catch (error) {
      console.error('[Login] Failed to check enabled providers:', error);
      // Don't show any providers if we can't check (security: only show if explicitly enabled)
      setEnabledProviders([]);
    } finally {
      setCheckingProviders(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showError('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const loginEmail = email.trim();
      const loginPassword = password.trim();
      
      await login(loginEmail, loginPassword);
      // Reload brand after successful login
      await loadBrand();
      // Login successful, navigation handled by AuthContext
    } catch (error: any) {
      // Check if 2FA is required
      if (error.message === '2FA_REQUIRED' || error.message?.includes('2FA') || error.message?.includes('two factor')) {
        // Navigate to 2FA verification screen
        navigation.navigate('Verify2FA' as never, {
          email: email.trim(),
          password: password.trim(),
        } as never);
      } else {
        showError('Login Failed', error.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading('google');
    try {
      const result = await socialLoginService.signInWithGoogle();
      if (result) {
        await socialLogin(result);
        await loadBrand();
        // Navigate to Main after successful login
        // Use a small delay to ensure navigation state is updated
        setTimeout(() => {
          try {
            navigation.reset({
              index: 0,
              routes: [{name: 'Main' as never}],
            });
          } catch (navError) {
            console.error('Navigation error after Google login:', navError);
            // Fallback: navigation will happen automatically via AppNavigator re-render
          }
        }, 100);
      }
    } catch (error: any) {
      showError('Google Sign-In Failed', error.message || 'Unable to sign in with Google');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleAppleLogin = async () => {
    setSocialLoading('apple');
    try {
      const result = await socialLoginService.signInWithApple();
      if (result) {
        await socialLogin(result);
        await loadBrand();
        // Navigate to Main after successful login
        // Use a small delay to ensure navigation state is updated
        setTimeout(() => {
          try {
            navigation.reset({
              index: 0,
              routes: [{name: 'Main' as never}],
            });
          } catch (navError) {
            console.error('Navigation error after Apple login:', navError);
            // Fallback: navigation will happen automatically via AppNavigator re-render
          }
        }, 100);
      }
    } catch (error: any) {
      showError('Apple Sign-In Failed', error.message || 'Unable to sign in with Apple');
    } finally {
      setSocialLoading(null);
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
            <Text style={baseStyles.welcomeText}>Welcome Back</Text>
            <Text style={baseStyles.subtitleText}>Sign in to continue</Text>
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

              {/* Password Input */}
              <View style={baseStyles.inputContainer}>
                <View style={baseStyles.inputLabelContainer}>
                  <MaterialIcons name="lock" size={20} color="#666666" style={baseStyles.inputIcon} />
                  <Text style={baseStyles.label}>Password</Text>
                </View>
                <View style={baseStyles.passwordWrapper}>
                  <TextInput
                    style={baseStyles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#999999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={baseStyles.eyeButton}>
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={22}
                      color="#666666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword' as never)}
                style={baseStyles.forgotPassword}>
                <Text style={[baseStyles.forgotPasswordText, {color: primaryColor}]}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[baseStyles.primaryButton, {backgroundColor: primaryColor}]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={baseStyles.primaryButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Divider - Only show if social login is available and not checking */}
              {!checkingProviders && enabledProviders.length > 0 && (
                <View style={baseStyles.divider}>
                  <View style={baseStyles.dividerLine} />
                  <Text style={baseStyles.dividerText}>OR</Text>
                  <View style={baseStyles.dividerLine} />
                </View>
              )}

              {/* Social Login Buttons - Only show if providers are enabled and not checking */}
              {!checkingProviders && enabledProviders.length > 0 && (() => {
                // Calculate available providers
                const hasGoogle = enabledProviders.includes('google');
                const hasApple = Platform.OS === 'ios' && enabledProviders.includes('apple');
                const availableProviders = [hasGoogle, hasApple].filter(Boolean).length;
                const buttonStyle = availableProviders === 1 
                  ? [baseStyles.socialButton, baseStyles.socialButtonFull]
                  : [baseStyles.socialButton, baseStyles.socialButtonHalf];

                return (
                  <View style={baseStyles.socialButtonsContainer}>
                    {hasGoogle && (
                      <TouchableOpacity
                        style={buttonStyle}
                        onPress={handleGoogleLogin}
                        disabled={socialLoading !== null}
                        activeOpacity={0.8}>
                        {socialLoading === 'google' ? (
                          <ActivityIndicator color="#000000" size="small" />
                        ) : (
                          <MaterialIcons name="mail" size={20} color="#000000" />
                        )}
                        <Text style={baseStyles.socialButtonText}>Google</Text>
                      </TouchableOpacity>
                    )}

                    {hasApple && (
                      <TouchableOpacity
                        style={buttonStyle}
                        onPress={handleAppleLogin}
                        disabled={socialLoading !== null}
                        activeOpacity={0.8}>
                        {socialLoading === 'apple' ? (
                          <ActivityIndicator color="#000000" size="small" />
                        ) : (
                          <MaterialIcons name="apple" size={20} color="#000000" />
                        )}
                        <Text style={baseStyles.socialButtonText}>Apple</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })()}

              {/* Sign Up Link */}
              <View style={baseStyles.signUpContainer}>
                <Text style={baseStyles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                  <Text style={[baseStyles.signUpLink, {color: primaryColor}]}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
