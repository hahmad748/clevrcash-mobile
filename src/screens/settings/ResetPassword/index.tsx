import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';

export function ResetPasswordScreen() {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;

  const handleResetPassword = async () => {
    if (!currentPassword.trim()) {
      showError('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      showError('Error', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      showError('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Error', 'New password and confirmation do not match');
      return;
    }

    setLoading(true);
    try {
      await apiClient.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      Alert.alert('Success', 'Password updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          },
        },
      ]);
    } catch (error: any) {
      showError('Error', error.message || 'Failed to update password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.keyboardView,{backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={[styles.card, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
          <Text style={[styles.title, {color: isDark ? colors.text : '#1A1A1A'}]}>
            Reset Password
          </Text>
          <Text style={[styles.subtitle, {color: isDark ? colors.textSecondary : '#666666'}]}>
            Enter your current password and choose a new one.
          </Text>

          {/* Current Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, {color: isDark ? colors.textSecondary : '#666666'}]}>
              Current Password
            </Text>
            <View style={[styles.passwordInputContainer, {borderColor: isDark ? colors.border : '#E0E0E0'}]}>
              <TextInput
                style={[styles.passwordInput, {color: isDark ? colors.text : '#1A1A1A'}]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={isDark ? colors.textSecondary : '#999999'}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeButton}>
                <MaterialIcons
                  name={showCurrentPassword ? 'visibility' : 'visibility-off'}
                  size={22}
                  color={isDark ? colors.textSecondary : '#666666'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, {color: isDark ? colors.textSecondary : '#666666'}]}>
              New Password
            </Text>
            <View style={[styles.passwordInputContainer, {borderColor: isDark ? colors.border : '#E0E0E0'}]}>
              <TextInput
                style={[styles.passwordInput, {color: isDark ? colors.text : '#1A1A1A'}]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={isDark ? colors.textSecondary : '#999999'}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}>
                <MaterialIcons
                  name={showNewPassword ? 'visibility' : 'visibility-off'}
                  size={22}
                  color={isDark ? colors.textSecondary : '#666666'}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.hint, {color: isDark ? colors.textSecondary : '#666666'}]}>
              Password must be at least 8 characters long
            </Text>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, {color: isDark ? colors.textSecondary : '#666666'}]}>
              Confirm New Password
            </Text>
            <View style={[styles.passwordInputContainer, {borderColor: isDark ? colors.border : '#E0E0E0'}]}>
              <TextInput
                style={[styles.passwordInput, {color: isDark ? colors.text : '#1A1A1A'}]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={isDark ? colors.textSecondary : '#999999'}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}>
                <MaterialIcons
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                  size={22}
                  color={isDark ? colors.textSecondary : '#666666'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, {backgroundColor: primaryColor}]}
            onPress={handleResetPassword}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  
  );
}
