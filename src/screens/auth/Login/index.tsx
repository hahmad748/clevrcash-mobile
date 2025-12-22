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
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useAuth} from '../../../contexts/AuthContext';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {styles} from './styles';

export function LoginScreen() {
  const navigation = useNavigation();
  const {login, user} = useAuth();
  const {colors} = useTheme();
  const {brand} = useBrand();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const primaryColor = brand?.primary_color || '#4CAF50';

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const loginEmail = email.trim();
      const loginPassword = password.trim();
      
      await login(loginEmail, loginPassword);
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
        Alert.alert('Login Failed', error.message || 'Invalid credentials');
      }
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Background Image with Overlay */}
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

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            {brand?.logo_url ? (
              <Image source={{uri: brand.logo_url}} style={styles.logo} resizeMode="contain" />
            ) : (
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../../assets/images/icon.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.logoText}>{brand?.display_name || 'CLEVRCASH'}</Text>
              </View>
            )}
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>Sign in to continue</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <MaterialIcons name="email" size={20} color="#666666" style={styles.inputIcon} />
                  <Text style={styles.label}>Email</Text>
                </View>
                <TextInput
                  style={styles.input}
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
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <MaterialIcons name="lock" size={20} color="#666666" style={styles.inputIcon} />
                  <Text style={styles.label}>Password</Text>
                </View>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
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
                    style={styles.eyeButton}>
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
                style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.primaryButton, {backgroundColor: primaryColor}]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => {
                    Alert.alert('Coming Soon', 'Google login will be available soon');
                  }}
                  activeOpacity={0.8}>
                  <MaterialIcons name="mail" size={20} color="#000000" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => {
                      Alert.alert('Coming Soon', 'Apple login will be available soon');
                    }}
                    activeOpacity={0.8}>
                    <MaterialIcons name="apple" size={20} color="#000000" />
                    <Text style={styles.socialButtonText}>Apple</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                  <Text style={[styles.signUpLink, {color: primaryColor}]}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
