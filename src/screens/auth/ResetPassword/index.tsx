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
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function ResetPasswordScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {token} = (route.params as {token?: string}) || {};
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password.trim()) {
      showError("Error", 'Please enter a new password');
      return;
    }

    if (password.length < 8) {
      showError("Error", 'Password must be at least 8 characters long');
      return;
    }

    if (password !== passwordConfirmation) {
      showError("Error", 'Passwords do not match');
      return;
    }

    if (!token) {
      showError("Error", 'Invalid reset token. Please request a new password reset link.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.resetPassword({
        token,
        email: '', // Email should be extracted from token or passed separately
        password,
        password_confirmation: passwordConfirmation,
      });
      showSuccess('Success', 'Your password has been reset successfully');
      navigation.navigate('Login' as never)
    } catch (error: any) {
      showError("Error", error.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>Reset Password</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Enter your new password below
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>New Password</Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
              ]}
              placeholder="Enter new password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <Text style={[styles.hint, {color: colors.textSecondary}]}>
              Must be at least 8 characters
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
              ]}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textSecondary}
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.primary}]}
            onPress={handleReset}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
