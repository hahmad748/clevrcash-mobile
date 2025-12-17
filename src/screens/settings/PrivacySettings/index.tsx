import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Switch, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';

export function PrivacySettingsScreen() {
  const {colors} = useTheme();
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showEmail, setShowEmail] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [allowFriendRequests, setAllowFriendRequests] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // TODO: Add API endpoint to get privacy settings
      // const settings = await apiClient.getPrivacySettings();
      // Update state with settings
    } catch (error) {
      console.error('Failed to load privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Add API endpoint to update privacy settings
      // await apiClient.updatePrivacySettings({...});
      Alert.alert('Success', 'Privacy settings updated');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update privacy settings');
    }
  };

  const renderSetting = (
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
  ) => (
    <View style={[styles.settingRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, {color: colors.text}]}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: '#767577', true: colors.primary}}
        thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>Privacy Preferences</Text>
        {renderSetting('Show Email', showEmail, setShowEmail)}
        {renderSetting('Show Balance', showBalance, setShowBalance)}
        {renderSetting('Allow Friend Requests', allowFriendRequests, setAllowFriendRequests)}

        <TouchableOpacity
          style={[styles.saveButton, {backgroundColor: colors.primary}]}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
