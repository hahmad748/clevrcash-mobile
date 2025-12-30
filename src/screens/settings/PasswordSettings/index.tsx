import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';

export function PasswordSettingsScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
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
      showError('Error', 'New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      await apiClient.changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      Alert.alert('Success', 'Password changed successfully', [
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
      showError('Error', error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Current Password *</Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
              ]}
              placeholder="Enter current password"
              placeholderTextColor={colors.textSecondary}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>New Password *</Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
              ]}
              placeholder="Enter new password"
              placeholderTextColor={colors.textSecondary}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <Text style={[styles.hint, {color: colors.textSecondary}]}>
              Must be at least 8 characters
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Confirm New Password *</Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
              ]}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, {backgroundColor: colors.primary}]}
            onPress={handleSave}
            disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Change Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
