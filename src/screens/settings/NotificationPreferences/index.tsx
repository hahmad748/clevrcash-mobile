import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import type {NotificationPreferences} from '../../../types/api';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

interface NotificationPreference {
  key: string;
  label: string;
  category: 'groups_and_friends' | 'expenses' | 'news_and_updates';
  mobile: boolean;
  email: boolean;
}

export function NotificationPreferencesScreen() {
  const {colors, isDark} = useTheme();
  const {user, refreshUser} = useAuth();
  const {brand} = useBrand();
  const [preferences, setPreferences] = useState<NotificationPreferences>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      // Fetch fresh user data from backend to get latest notification preferences
      const currentUser = await apiClient.getCurrentUser();
      
      if (currentUser?.notification_preferences) {
        setPreferences(currentUser.notification_preferences);
      } else {
        // If no preferences exist, initialize with empty object
        // The UI will use defaults from the notificationItems array
        setPreferences({});
      }
    } catch (error: any) {
      console.error('Failed to load notification preferences:', error);
      showError('Error', 'Failed to load notification preferences');
      // Fallback to user object if API call fails
      if (user?.notification_preferences) {
        setPreferences(user.notification_preferences);
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (
    category: 'groups_and_friends' | 'expenses' | 'news_and_updates',
    key: string,
    type: 'mobile' | 'email',
    value: boolean,
  ) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: {
          ...(prev[category]?.[key] || {}),
          [type]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Send all preferences to backend
      await apiClient.updateNotifications({
        notification_preferences: preferences,
      });
      // Refresh user data to get updated preferences
      await refreshUser();
      showSuccess('Success', 'Notification preferences updated successfully');
    } catch (error: any) {
      showError('Error', error.message || 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  // Helper function to get preference value with fallback to defaults
  const getPreferenceValue = (
    category: 'groups_and_friends' | 'expenses' | 'news_and_updates',
    key: string,
    type: 'mobile' | 'email',
    defaultValue: boolean,
  ): boolean => {
    return preferences[category]?.[key]?.[type] ?? defaultValue;
  };

  const notificationItems: NotificationPreference[] = [
    // Groups and Friends
    {
      key: 'added_to_group',
      label: 'When someone adds me to a group',
      category: 'groups_and_friends',
      mobile: getPreferenceValue('groups_and_friends', 'added_to_group', 'mobile', true),
      email: getPreferenceValue('groups_and_friends', 'added_to_group', 'email', true),
    },
    {
      key: 'added_as_friend',
      label: 'When someone adds me as a friend',
      category: 'groups_and_friends',
      mobile: getPreferenceValue('groups_and_friends', 'added_as_friend', 'mobile', false),
      email: getPreferenceValue('groups_and_friends', 'added_as_friend', 'email', true),
    },
    {
      key: 'remind',
      label: 'Remind me about balances',
      category: 'groups_and_friends',
      mobile: getPreferenceValue('groups_and_friends', 'remind', 'mobile', false),
      email: getPreferenceValue('groups_and_friends', 'remind', 'email', true),
    },
    // Expenses
    {
      key: 'expense_added',
      label: 'When an expense is added',
      category: 'expenses',
      mobile: getPreferenceValue('expenses', 'expense_added', 'mobile', true),
      email: getPreferenceValue('expenses', 'expense_added', 'email', true),
    },
    {
      key: 'expense_edited_deleted',
      label: 'When an expense is edited/deleted',
      category: 'expenses',
      mobile: getPreferenceValue('expenses', 'expense_edited_deleted', 'mobile', true),
      email: getPreferenceValue('expenses', 'expense_edited_deleted', 'email', true),
    },
    {
      key: 'expense_commented',
      label: 'When someone comments on an expense',
      category: 'expenses',
      mobile: getPreferenceValue('expenses', 'expense_commented', 'mobile', true),
      email: getPreferenceValue('expenses', 'expense_commented', 'email', true),
    },
    {
      key: 'expense_due',
      label: 'When an expense is due',
      category: 'expenses',
      mobile: getPreferenceValue('expenses', 'expense_due', 'mobile', false),
      email: getPreferenceValue('expenses', 'expense_due', 'email', true),
    },
    {
      key: 'payment_received',
      label: 'When someone pays me',
      category: 'expenses',
      mobile: getPreferenceValue('expenses', 'payment_received', 'mobile', false),
      email: getPreferenceValue('expenses', 'payment_received', 'email', true),
    },
    // News and Updates
    {
      key: 'monthly_summary',
      label: 'Monthly summary of my activity',
      category: 'news_and_updates',
      mobile: getPreferenceValue('news_and_updates', 'monthly_summary', 'mobile', false),
      email: getPreferenceValue('news_and_updates', 'monthly_summary', 'email', true),
    },
    {
      key: 'major_updates',
      label: 'Major ClevrCash news and updates',
      category: 'news_and_updates',
      mobile: getPreferenceValue('news_and_updates', 'major_updates', 'mobile', false),
      email: getPreferenceValue('news_and_updates', 'major_updates', 'email', true),
    },
  ];

  const renderNotificationItem = (item: NotificationPreference, index: number) => {
    const getCategoryTitle = () => {
      if (index === 0) return 'GROUPS AND FRIENDS';
      if (index === 3) return 'EXPENSES';
      if (index === 8) return 'NEWS AND UPDATES';
      return null;
    };

    const categoryTitle = getCategoryTitle();

    // Get current values from state
    const currentMobile = getPreferenceValue(item.category, item.key, 'mobile', item.mobile);
    const currentEmail = getPreferenceValue(item.category, item.key, 'email', item.email);

    return (
      <View key={`${item.category}-${item.key}`}>
        {categoryTitle && (
          <Text style={[styles.categoryTitle, {color: isDark ? colors.text : '#1A1A1A'}]}>
            {categoryTitle}
          </Text>
        )}
        <View style={[styles.notificationItem, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
          <Text style={[styles.notificationLabel, {color: isDark ? colors.text : '#1A1A1A'}]}>
            {item.label}
          </Text>
          <View style={styles.toggleContainer}>
            {/* Mobile Toggle */}
            <TouchableOpacity
              style={[
                styles.toggleButton,
                currentMobile && styles.toggleButtonActive,
                currentMobile && {backgroundColor: primaryColor + '20', borderColor: primaryColor},
                !currentMobile && {borderColor: isDark ? colors.border : '#E0E0E0'},
              ]}
              onPress={() => updatePreference(item.category, item.key, 'mobile', !currentMobile)}>
              <MaterialIcons
                name="smartphone"
                size={20}
                color={currentMobile ? primaryColor : (isDark ? colors.textSecondary : '#999999')}
              />
            </TouchableOpacity>
            {/* Email Toggle */}
            <TouchableOpacity
              style={[
                styles.toggleButton,
                currentEmail && styles.toggleButtonActive,
                currentEmail && {backgroundColor: primaryColor + '20', borderColor: primaryColor},
                !currentEmail && {borderColor: isDark ? colors.border : '#E0E0E0'},
              ]}
              onPress={() => updatePreference(item.category, item.key, 'email', !currentEmail)}>
              <MaterialIcons
                name="email"
                size={20}
                color={currentEmail ? primaryColor : (isDark ? colors.textSecondary : '#999999')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {notificationItems.map((item, index) => renderNotificationItem(item, index))}
      </ScrollView>

      <View style={[styles.saveButtonContainer, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}>
        <TouchableOpacity
          style={[styles.saveButton, {backgroundColor: primaryColor}]}
          onPress={handleSave}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
