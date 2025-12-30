import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Switch, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function NotificationSettingsScreen() {
  const {colors} = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [expenseNotifications, setExpenseNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [friendNotifications, setFriendNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // TODO: Add API endpoint to get notification preferences
      // const settings = await apiClient.getNotificationSettings();
      // Update state with settings
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: string, value: boolean) => {
    try {
      // TODO: Add API endpoint to update notification preferences
      // await apiClient.updateNotificationSettings({[key]: value});
      showSuccess('Success', 'Notification preferences updated');
    } catch (error: any) {
      showError('Error', error.message || 'Failed to update preferences');
    }
  };

  const renderSetting = (
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
  ) => (
    <View style={[styles.settingRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
      <Text style={[styles.settingTitle, {color: colors.text}]}>{title}</Text>
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
        <Text style={[styles.sectionTitle, {color: colors.text}]}>Notification Preferences</Text>
        {renderSetting('Email Notifications', emailNotifications, setEmailNotifications)}
        {renderSetting('Push Notifications', pushNotifications, setPushNotifications)}

        <Text style={[styles.sectionTitle, {color: colors.text, marginTop: 24}]}>
          Notification Types
        </Text>
        {renderSetting(
          'Expense Notifications',
          expenseNotifications,
          setExpenseNotifications,
        )}
        {renderSetting(
          'Payment Notifications',
          paymentNotifications,
          setPaymentNotifications,
        )}
        {renderSetting(
          'Reminder Notifications',
          reminderNotifications,
          setReminderNotifications,
        )}
        {renderSetting('Group Notifications', groupNotifications, setGroupNotifications)}
        {renderSetting('Friend Notifications', friendNotifications, setFriendNotifications)}
      </View>
    </ScrollView>
  );
}
