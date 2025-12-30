import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function TwoFactorSettingsScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {user, refreshUser} = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enabling, setEnabling] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  useEffect(() => {
    load2FAStatus();
  }, []);

  const load2FAStatus = async () => {
    try {
      setLoading(true);
      if (user) {
        setTwoFactorEnabled(user.two_factor_enabled || false);
      }
    } catch (error) {
      console.error('Failed to load 2FA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    try {
      setEnabling(true);
      const result = await apiClient.enable2FA();
      setRecoveryCodes(result.recovery_codes || []);
      await refreshUser();
      setTwoFactorEnabled(true);
      Alert.alert(
        '2FA Enabled',
        'Two-factor authentication has been enabled. Please save your recovery codes in a safe place.',
        [
          {
            text: 'View Recovery Codes',
            onPress: () => {
              // Show recovery codes
              Alert.alert(
                'Recovery Codes',
                `Save these codes in a safe place:\n\n${recoveryCodes.join('\n')}`,
                [{text: 'OK'}],
              );
            },
          },
          {text: 'OK'},
        ],
      );
    } catch (error: any) {
      showError('Error', error.message || 'Failed to enable 2FA');
    } finally {
      setEnabling(false);
    }
  };

  const handleDisable = () => {
    Alert.alert(
      'Disable 2FA',
      'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.disable2FA();
              await refreshUser();
              setTwoFactorEnabled(false);
              showSuccess('Success', '2FA has been disabled');
            } catch (error: any) {
              showError('Error', error.message || 'Failed to disable 2FA');
            }
          },
        },
      ],
    );
  };

  const handleViewRecoveryCodes = async () => {
    try {
      const result = await apiClient.getRecoveryCodes();
      Alert.alert(
        'Recovery Codes',
        `Save these codes in a safe place:\n\n${result.recovery_codes.join('\n')}`,
        [{text: 'OK'}],
      );
    } catch (error: any) {
      showError('Error', error.message || 'Failed to load recovery codes');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <View style={[styles.statusCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <Text style={[styles.statusTitle, {color: colors.text}]}>
            Two-Factor Authentication
          </Text>
          <Text style={[styles.statusText, {color: colors.textSecondary}]}>
            {twoFactorEnabled
              ? '2FA is currently enabled on your account'
              : '2FA is currently disabled on your account'}
          </Text>
        </View>

        {!twoFactorEnabled ? (
          <TouchableOpacity
            style={[styles.enableButton, {backgroundColor: colors.primary}]}
            onPress={handleEnable}
            disabled={enabling}>
            {enabling ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.enableButtonText}>Enable 2FA</Text>
            )}
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.disableButton, {backgroundColor: colors.error}]}
              onPress={handleDisable}>
              <Text style={styles.disableButtonText}>Disable 2FA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.recoveryButton, {backgroundColor: colors.secondary || colors.primary}]}
              onPress={handleViewRecoveryCodes}>
              <Text style={styles.recoveryButtonText}>View Recovery Codes</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, {color: colors.text}]}>About 2FA</Text>
          <Text style={[styles.infoText, {color: colors.textSecondary}]}>
            Two-factor authentication adds an extra layer of security to your account. When enabled,
            you'll need to enter a code from your authenticator app in addition to your password
            when logging in.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
