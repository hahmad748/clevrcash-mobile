import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import QRCode from 'react-qr-code';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

type SetupStep = 'initial' | 'qr_code' | 'verification' | 'backup_codes';

export function TwoFactorAuthScreen() {
  const {colors, isDark} = useTheme();
  const {user, refreshUser} = useAuth();
  const {brand} = useBrand();
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setupStep, setSetupStep] = useState<SetupStep>('initial');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [disabling, setDisabling] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;

  useEffect(() => {
    if (user) {
      setIsEnabled(user.two_factor_enabled ?? false);
      setLoading(false);
    }
  }, [user]);

  const handleEnable2FA = async () => {
    try {
      setLoading(true);
      const result = await apiClient.enable2FA();
      setQrCodeUrl(result.qr_code_url);
      setSecret(result.secret);
      setSetupStep('qr_code');
    } catch (error: any) {
      showError('Error', error.message || 'Failed to initialize 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      showError('Error', 'Please enter a valid 6-digit code');
      return;
    }

    setVerifying(true);
    try {
      const result = await apiClient.verify2FA(verificationCode);
      setBackupCodes(result.backup_codes);
      setSetupStep('backup_codes');
      await refreshUser();
      setIsEnabled(true);
    } catch (error: any) {
      showError('Error', error.message || 'Invalid verification code');
    } finally {
      setVerifying(false);
    }
  };

  const handleBackupCodesSaved = () => {
    setSetupStep('initial');
    setQrCodeUrl(null);
    setSecret(null);
    setVerificationCode('');
    setBackupCodes([]);
    showSuccess('Success', 'Two-factor authentication has been enabled successfully');
  };

  const handleDisable2FA = () => {
    Alert.alert(
      'Disable Two-Factor Authentication',
      'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            setDisabling(true);
            try {
              await apiClient.disable2FA('');
              await refreshUser();
              setIsEnabled(false);
              showSuccess('Success', 'Two-factor authentication has been disabled');
            } catch (error: any) {
              showError('Error', error.message || 'Failed to disable 2FA');
            } finally {
              setDisabling(false);
            }
          },
        },
      ],
    );
  };

  const handleCancelSetup = () => {
    Alert.alert(
      'Cancel Setup',
      'Are you sure you want to cancel? You will need to start over to enable 2FA.',
      [
        {text: 'Continue Setup', style: 'cancel'},
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => {
            setSetupStep('initial');
            setQrCodeUrl(null);
            setSecret(null);
            setVerificationCode('');
          },
        },
      ],
    );
  };

  if (loading && setupStep === 'initial') {
    return (
      <View style={[styles.loadingContainer, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  // Show QR Code Step
  if (setupStep === 'qr_code') {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={[styles.scrollView, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          <View style={[styles.card, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
            <View style={styles.statusSection}>
              <MaterialIcons name="qr-code-2" size={48} color={primaryColor} />
              <Text style={[styles.statusTitle, {color: isDark ? colors.text : '#1A1A1A'}]}>
                Scan QR Code
              </Text>
              <Text style={[styles.statusDescription, {color: isDark ? colors.textSecondary : '#666666'}]}>
                Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code.
              </Text>
            </View>

            {/* QR Code */}
            {qrCodeUrl && (
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={qrCodeUrl}
                  size={250}
                  style={styles.qrCode}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </View>
            )}

            {/* Manual Entry */}
            {secret && (
              <View style={[styles.manualEntrySection, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}>
                <Text style={[styles.manualEntryTitle, {color: isDark ? colors.textSecondary : '#666666'}]}>
                  Can't scan? Enter this code manually:
                </Text>
                <Text style={[styles.manualEntryCode, {color: isDark ? colors.text : '#1A1A1A'}]}>
                  {secret}
                </Text>
              </View>
            )}

            {/* Next Button */}
            <TouchableOpacity
              style={[styles.primaryButton, {backgroundColor: primaryColor}]}
              onPress={() => setSetupStep('verification')}
              activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>I've Scanned the Code</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.cancelButton, {borderColor: isDark ? colors.border : '#E0E0E0'}]}
              onPress={handleCancelSetup}
              activeOpacity={0.8}>
              <Text style={[styles.cancelButtonText, {color: isDark ? colors.textSecondary : '#666666'}]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Show Verification Step
  if (setupStep === 'verification') {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={[styles.scrollView, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          <View style={[styles.card, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
            <View style={styles.statusSection}>
              <MaterialIcons name="verified" size={48} color={primaryColor} />
              <Text style={[styles.statusTitle, {color: isDark ? colors.text : '#1A1A1A'}]}>
                Enter Verification Code
              </Text>
              <Text style={[styles.statusDescription, {color: isDark ? colors.textSecondary : '#666666'}]}>
                Enter the 6-digit code from your authenticator app to verify and enable 2FA.
              </Text>
            </View>

            {/* Verification Code Input */}
            <View style={styles.inputSection}>
              <TextInput
                style={[styles.codeInput, {
                  color: isDark ? colors.text : '#1A1A1A',
                  borderColor: isDark ? colors.border : '#E0E0E0',
                  backgroundColor: isDark ? colors.background : '#FAFAFA',
                }]}
                value={verificationCode}
                onChangeText={(text) => setVerificationCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                placeholderTextColor={isDark ? colors.textSecondary : '#999999'}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[styles.primaryButton, {backgroundColor: primaryColor}]}
              onPress={handleVerifyCode}
              disabled={verifying || verificationCode.length !== 6}
              activeOpacity={0.8}>
              {verifying ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify and Enable</Text>
              )}
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity
              style={[styles.cancelButton, {borderColor: isDark ? colors.border : '#E0E0E0'}]}
              onPress={() => setSetupStep('qr_code')}
              activeOpacity={0.8}>
              <Text style={[styles.cancelButtonText, {color: isDark ? colors.textSecondary : '#666666'}]}>
                Back to QR Code
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Show Backup Codes Step
  if (setupStep === 'backup_codes') {
    return (
      <ScrollView
        style={[styles.scrollView, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={[styles.card, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
          <View style={styles.statusSection}>
            <MaterialIcons name="security" size={48} color={primaryColor} />
            <Text style={[styles.statusTitle, {color: isDark ? colors.text : '#1A1A1A'}]}>
              Save Your Backup Codes
            </Text>
            <Text style={[styles.statusDescription, {color: isDark ? colors.textSecondary : '#666666'}]}>
              Save these backup codes in a safe place. You can use them to access your account if you lose access to your authenticator app.
            </Text>
          </View>

          {/* Backup Codes */}
          <View style={[styles.backupCodesContainer, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}>
            {backupCodes.map((code, index) => (
              <View key={index} style={[styles.backupCodeItem, {borderColor: isDark ? colors.border : '#E0E0E0'}]}>
                <Text style={[styles.backupCodeText, {color: isDark ? colors.text : '#1A1A1A'}]}>
                  {code}
                </Text>
              </View>
            ))}
          </View>

          {/* Done Button */}
          <TouchableOpacity
            style={[styles.primaryButton, {backgroundColor: primaryColor}]}
            onPress={handleBackupCodesSaved}
            activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>I've Saved the Codes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Initial State - Enable/Disable
  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={[styles.scrollView, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={[styles.card, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
          <View style={styles.statusSection}>
            <MaterialIcons
              name={isEnabled ? 'security' : 'security'}
              size={48}
              color={isEnabled ? primaryColor : (isDark ? colors.textSecondary : '#999999')}
            />
            <Text style={[styles.statusTitle, {color: isDark ? colors.text : '#1A1A1A'}]}>
              {isEnabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled'}
            </Text>
            <Text style={[styles.statusDescription, {color: isDark ? colors.textSecondary : '#666666'}]}>
              {isEnabled
                ? 'Your account is protected with two-factor authentication. You will need to enter a code from your authenticator app when logging in.'
                : 'Enable two-factor authentication to add an extra layer of security to your account.'}
            </Text>
          </View>

          {!isEnabled ? (
            <TouchableOpacity
              style={[styles.enableButton, {backgroundColor: primaryColor}]}
              onPress={handleEnable2FA}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="lock" size={20} color="#FFFFFF" />
                  <Text style={styles.enableButtonText}>Enable Two-Factor Authentication</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.disableButton, {borderColor: colors.error}]}
              onPress={handleDisable2FA}
              disabled={disabling}
              activeOpacity={0.8}>
              {disabling ? (
                <ActivityIndicator color={colors.error} />
              ) : (
                <>
                  <MaterialIcons name="lock-open" size={20} color={colors.error} />
                  <Text style={[styles.disableButtonText, {color: colors.error}]}>
                    Disable Two-Factor Authentication
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.infoCard, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
          <MaterialIcons name="info-outline" size={20} color={primaryColor} />
          <Text style={[styles.infoText, {color: isDark ? colors.textSecondary : '#666666'}]}>
            Two-factor authentication adds an extra layer of security. You'll need to use an authenticator app (like Google Authenticator) to generate codes when logging in.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
