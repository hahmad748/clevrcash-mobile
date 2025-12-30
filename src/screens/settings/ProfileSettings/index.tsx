import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ActionSheetIOS} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchCamera, launchImageLibrary, ImagePickerResponse, MediaType} from 'react-native-image-picker';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import {CurrencyModal} from '../../../components/modals/CurrencyModal';
import {TimezoneModal} from '../../../components/modals/TimezoneModal';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function ProfileSettingsScreen() {
  const {colors, isDark} = useTheme();
  const {user, refreshUser} = useAuth();
  const {brand} = useBrand();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('');
  const [timezone, setTimezone] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setDefaultCurrency(user.default_currency || '');
      setTimezone(user.timezone || '');
      setAvatarUri(user.avatar || null);
    }
  }, [user]);

  const handleImagePicker = (useCamera: boolean) => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    const callback = (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorCode) {
        if (response.errorMessage) {
          showError('Error', response.errorMessage);
        }
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        if (asset.uri) {
          uploadAvatar(asset.uri, asset.fileName, asset.type);
        } else {
          showError('Error', 'Failed to get image URI');
        }
      }
    };

    if (useCamera) {
      launchCamera(options, callback);
    } else {
      launchImageLibrary(options, callback);
    }
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleImagePicker(true);
          } else if (buttonIndex === 2) {
            handleImagePicker(false);
          }
        },
      );
    } else {
      Alert.alert(
        'Select Photo',
        'Choose an option',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Take Photo', onPress: () => handleImagePicker(true)},
          {text: 'Choose from Library', onPress: () => handleImagePicker(false)},
        ],
      );
    }
  };

  const uploadAvatar = async (uri: string, fileName?: string, mimeType?: string) => {
    if (!uri || uri.trim().length === 0) {
      showError('Error', 'Invalid image URI');
      return;
    }

    setUploadingAvatar(true);
    try {
      // Ensure proper URI format for both platforms
      let fileUri = uri;
      if (Platform.OS === 'android' && !uri.startsWith('file://')) {
        fileUri = `file://${uri}`;
      } else if (Platform.OS === 'ios') {
        // For iOS, keep the URI as-is (it may or may not have file://)
        fileUri = uri;
      }

      // Determine MIME type
      let imageType = mimeType || 'image/jpeg';
      if (fileName) {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (extension === 'png') {
          imageType = 'image/png';
        } else if (extension === 'jpg' || extension === 'jpeg') {
          imageType = 'image/jpeg';
        }
      }

      // Generate file name - ensure it's never empty
      let imageName = fileName?.trim() || '';
      
      // If no filename or empty, generate one
      if (!imageName || imageName.length === 0) {
        // Try to extract filename from URI
        const uriParts = uri.split('/');
        const lastPart = uriParts[uriParts.length - 1];
        if (lastPart && lastPart.includes('.')) {
          imageName = lastPart;
        } else {
          // Extract extension from URI if possible
          const uriExtension = uri.split('.').pop()?.toLowerCase();
          const extension = (uriExtension && ['jpg', 'jpeg', 'png'].includes(uriExtension)) 
            ? uriExtension 
            : 'jpg';
          imageName = `avatar_${Date.now()}.${extension}`;
        }
      }

      // Ensure name has a valid extension
      if (!imageName.includes('.')) {
        imageName = `${imageName}.jpg`;
      }

      // Final validation - ensure name is never empty
      if (!imageName || imageName.trim().length === 0) {
        imageName = `avatar_${Date.now()}.jpg`;
      }

      // Always generate a unique filename with timestamp to ensure it's never empty
      // Extract extension from current imageName, URI, or default to jpg
      let extension = 'jpg';
      
      // Try to get extension from provided filename
      if (imageName && imageName.includes('.')) {
        const ext = imageName.split('.').pop()?.toLowerCase();
        if (ext && ['jpg', 'jpeg', 'png'].includes(ext)) {
          extension = ext;
        }
      }
      
      // If still no extension, try to get from URI
      if (extension === 'jpg' && uri.includes('.')) {
        const uriExt = uri.split('.').pop()?.toLowerCase();
        if (uriExt && ['jpg', 'jpeg', 'png'].includes(uriExt)) {
          extension = uriExt === 'jpeg' ? 'jpg' : uriExt;
        }
      }
      
      // Generate a guaranteed unique filename with timestamp and random suffix
      // Format: avatar_TIMESTAMP_RANDOM.jpg
      // This ensures Laravel's getClientOriginalExtension() will always have a value
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      imageName = `avatar_${timestamp}_${randomSuffix}.${extension}`;

      // Final validation - this should never fail now
      if (!imageName || imageName.length === 0 || !imageName.includes('.')) {
        imageName = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
      }
      
      // Ensure minimum length
      if (imageName.length < 15) {
        imageName = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
      }

      console.log('Uploading avatar:', { 
        originalUri: uri, 
        fileUri, 
        imageName, 
        imageType,
        fileNameParam: fileName,
        mimeTypeParam: mimeType,
        imageNameLength: imageName.length,
        imageNameValid: imageName && imageName.length > 0 && imageName.includes('.')
      });

      const formData = new FormData();
      
      // React Native FormData format for file upload
      // Ensure all properties are set correctly
      const fileData = {
        uri: fileUri,
        type: imageType,
        name: imageName,
      };
      
      // Verify the fileData before appending
      if (!fileData.name || fileData.name.length === 0) {
        throw new Error(`Invalid filename: "${fileData.name}"`);
      }
      
      formData.append('avatar', fileData as any);
      
      console.log('FormData appended with fileData:', {
        hasUri: !!fileData.uri,
        hasType: !!fileData.type,
        hasName: !!fileData.name,
        nameLength: fileData.name?.length || 0,
        name: fileData.name
      });

      const updatedUser = await apiClient.uploadAvatar(formData);
      setAvatarUri(updatedUser.avatar || null);
      await refreshUser();
      showSuccess('Success', 'Avatar updated successfully');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      showError('Error', error.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      showError('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await apiClient.updateAccount({
        name: name.trim(),
        phone: phone.trim() || undefined,
        default_currency: defaultCurrency || undefined,
        timezone: timezone || undefined,
      });
      await refreshUser();
      showSuccess('Success', 'Profile updated successfully');
    } catch (error: any) {
      showError('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDataRemoval = () => {
    Alert.alert(
      'Request Account/Data Removal',
      'Are you sure you want to request account or data removal? This action cannot be undone and all your data will be permanently deleted.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Request',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.requestDataRemoval();
              Alert.alert(
                'Request Submitted',
                'Your data removal request has been submitted. You will receive a confirmation email shortly.',
              );
            } catch (error: any) {
              showError('Error', error.message || 'Failed to submit request');
            }
          },
        },
      ],
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        style={[styles.keyboardView,{backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Profile Card - Account Options */}
          <View style={[styles.profileCard, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <TouchableOpacity
                onPress={showImagePickerOptions}
                disabled={uploadingAvatar}
                style={styles.avatarTouchable}>
                <View style={styles.avatarContainer}>
                  {avatarUri ? (
                    <Image source={{uri: avatarUri}} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatarPlaceholder, {backgroundColor: primaryColor + '20', borderColor: primaryColor}]}>
                      <Text style={[styles.avatarText, {color: primaryColor}]}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Text>
                    </View>
                  )}
                  {uploadingAvatar && (
                    <View style={styles.avatarLoader}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    </View>
                  )}
                  {!uploadingAvatar && (
                    <View style={[styles.avatarEditBadge, {backgroundColor: primaryColor}]}>
                      <MaterialIcons name="camera-alt" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <Text style={[styles.avatarHint, {color: isDark ? colors.textSecondary : '#666666'}]}>
                Tap to change photo
              </Text>
            </View>

            {/* Name Input */}
            <View style={styles.inputSection}>
              <View style={styles.inputLabelRow}>
                <MaterialIcons 
                  name="person" 
                  size={18} 
                  color={isDark ? colors.textSecondary : '#666666'} 
                />
                <Text style={[styles.inputLabel, {color: isDark ? colors.textSecondary : '#666666'}]}>
                  Full Name
                </Text>
              </View>
              <TextInput
                style={[styles.input, {color: isDark ? colors.text : '#1A1A1A', borderColor: isDark ? colors.border : '#E0E0E0', backgroundColor: isDark ? colors.background : '#FAFAFA'}]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={isDark ? colors.textSecondary : '#999999'}
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputSection}>
              <View style={styles.inputLabelRow}>
                <MaterialIcons 
                  name="phone" 
                  size={18} 
                  color={isDark ? colors.textSecondary : '#666666'} 
                />
                <Text style={[styles.inputLabel, {color: isDark ? colors.textSecondary : '#666666'}]}>
                  Phone Number
                </Text>
              </View>
              <TextInput
                style={[styles.input, {color: isDark ? colors.text : '#1A1A1A', borderColor: isDark ? colors.border : '#E0E0E0', backgroundColor: isDark ? colors.background : '#FAFAFA'}]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor={isDark ? colors.textSecondary : '#999999'}
                keyboardType="phone-pad"
              />
              <Text style={[styles.inputHint, {color: isDark ? colors.textSecondary : '#666666'}]}>
                Add your phone number to help others find you
              </Text>
            </View>

            {/* Email Input (Readonly) */}
            <View style={styles.inputSection}>
              <View style={styles.inputLabelRow}>
                <MaterialIcons 
                  name="email" 
                  size={18} 
                  color={isDark ? colors.textSecondary : '#666666'} 
                />
                <Text style={[styles.inputLabel, {color: isDark ? colors.textSecondary : '#666666'}]}>
                  Email Address
                </Text>
              </View>
              <View style={[styles.readonlyInputContainer, {borderColor: isDark ? colors.border : '#E0E0E0', backgroundColor: isDark ? colors.background : '#F5F5F5'}]}>
                <Text style={[styles.readonlyInputText, {color: isDark ? colors.textSecondary : '#999999'}]}>
                  {user?.email || 'Not set'}
                </Text>
                <MaterialIcons name="lock" size={16} color={isDark ? colors.textSecondary : '#999999'} />
              </View>
              <Text style={[styles.inputHint, {color: isDark ? colors.textSecondary : '#666666'}]}>
                Email cannot be changed. Contact support if you need to update your email.
              </Text>
            </View>

            {/* Default Currency Selection */}
            <View style={styles.inputSection}>
              <View style={styles.inputLabelRow}>
                <MaterialIcons 
                  name="attach-money" 
                  size={18} 
                  color={isDark ? colors.textSecondary : '#666666'} 
                />
                <Text style={[styles.inputLabel, {color: isDark ? colors.textSecondary : '#666666'}]}>
                  Default Currency
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.selectableInputContainer, {borderColor: isDark ? colors.border : '#E0E0E0', backgroundColor: isDark ? colors.background : '#FAFAFA'}]}
                onPress={() => setShowCurrencyModal(true)}
                activeOpacity={0.7}>
                <Text style={[styles.selectableInputText, {color: defaultCurrency ? (isDark ? colors.text : '#1A1A1A') : (isDark ? colors.textSecondary : '#999999')}]}>
                  {defaultCurrency || 'Select currency'}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color={isDark ? colors.textSecondary : '#999999'} />
              </TouchableOpacity>
              <Text style={[styles.inputHint, {color: isDark ? colors.textSecondary : '#666666'}]}>
                This currency will be used as default for new expenses
              </Text>
            </View>

            {/* Timezone Selection */}
            <View style={styles.inputSection}>
              <View style={styles.inputLabelRow}>
                <MaterialIcons 
                  name="schedule" 
                  size={18} 
                  color={isDark ? colors.textSecondary : '#666666'} 
                />
                <Text style={[styles.inputLabel, {color: isDark ? colors.textSecondary : '#666666'}]}>
                  Timezone
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.selectableInputContainer, {borderColor: isDark ? colors.border : '#E0E0E0', backgroundColor: isDark ? colors.background : '#FAFAFA'}]}
                onPress={() => setShowTimezoneModal(true)}
                activeOpacity={0.7}>
                <Text 
                  style={[styles.selectableInputText, {color: timezone ? (isDark ? colors.text : '#1A1A1A') : (isDark ? colors.textSecondary : '#999999')}]}
                  numberOfLines={1}>
                  {timezone ? timezone.replace(/_/g, ' ') : 'Select timezone'}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color={isDark ? colors.textSecondary : '#999999'} />
              </TouchableOpacity>
              <Text style={[styles.inputHint, {color: isDark ? colors.textSecondary : '#666666'}]}>
                Your local timezone for date and time display
              </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, {backgroundColor: primaryColor}]}
              onPress={handleSaveProfile}
              disabled={loading}
              activeOpacity={0.8}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="check" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Account Deletion Section */}
          <View style={[styles.dangerCard, {backgroundColor: isDark ? colors.surface : '#FFFFFF', borderColor: colors.error + '20'}]}>
            <View style={styles.dangerHeader}>
              <MaterialIcons name="warning" size={20} color={colors.error} />
              <Text style={[styles.dangerTitle, {color: colors.error}]}>
                Danger Zone
              </Text>
            </View>
            <Text style={[styles.dangerDescription, {color: isDark ? colors.textSecondary : '#666666'}]}>
              Once you request account or data removal, all your data will be permanently deleted. This action cannot be undone.
            </Text>
            <TouchableOpacity
              style={[styles.dangerButton, {borderColor: colors.error}]}
              onPress={handleRequestDataRemoval}
              activeOpacity={0.8}>
              <MaterialIcons name="delete-outline" size={20} color={colors.error} />
              <Text style={[styles.dangerButtonText, {color: colors.error}]}>
                Request Account/Data Removal
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Currency Modal */}
      <CurrencyModal
        visible={showCurrencyModal}
        selectedCurrency={defaultCurrency}
        onSelect={setDefaultCurrency}
        onClose={() => setShowCurrencyModal(false)}
      />

      {/* Timezone Modal */}
      <TimezoneModal
        visible={showTimezoneModal}
        selectedTimezone={timezone}
        onSelect={setTimezone}
        onClose={() => setShowTimezoneModal(false)}
      />
    </>
  );
}
