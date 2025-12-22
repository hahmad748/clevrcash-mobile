import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ActionSheetIOS} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchCamera, launchImageLibrary, ImagePickerResponse, MediaType} from 'react-native-image-picker';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';

export function ProfileSettingsScreen() {
  const {colors, isDark} = useTheme();
  const {user, refreshUser} = useAuth();
  const {brand} = useBrand();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const primaryColor = brand?.primary_color || colors.primary;

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
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
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        if (asset.uri) {
          uploadAvatar(asset.uri);
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

  const uploadAvatar = async (uri: string) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const updatedUser = await apiClient.uploadAvatar(formData);
      setAvatarUri(updatedUser.avatar || null);
      await refreshUser();
      Alert.alert('Success', 'Avatar updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await apiClient.updateAccount({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });
      await refreshUser();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
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
              Alert.alert('Error', error.message || 'Failed to submit request');
            }
          },
        },
      ],
    );
  };

  return (
    
      <KeyboardAvoidingView
        style={styles.keyboardView}
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
    
  );
}
