import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function PrivacyScreen() {
  const {colors, isDark} = useTheme();
  const {user, refreshUser} = useAuth();
  const {brand} = useBrand();
  const [allowFriendSuggestions, setAllowFriendSuggestions] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;

  useEffect(() => {
    if (user) {
      setAllowFriendSuggestions(user.allow_friend_suggestions ?? true);
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.updatePrivacy({
        allow_friend_suggestions: allowFriendSuggestions,
      });
      await refreshUser();
      showSuccess('Success', 'Privacy settings updated successfully');
    } catch (error: any) {
      showError('Error', error.message || 'Failed to update privacy settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView 
        style={[styles.container, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
        edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      
      <View style={[styles.card, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Text style={[styles.settingTitle, {color: isDark ? colors.text : '#1A1A1A'}]}>
              Allow Friend Suggestions
            </Text>
            <Text style={[styles.settingDescription, {color: isDark ? colors.textSecondary : '#666666'}]}>
              Allow others to find you by phone number if you're in their contacts
            </Text>
          </View>
          <Switch
            value={allowFriendSuggestions}
            onValueChange={setAllowFriendSuggestions}
            trackColor={{false: '#767577', true: primaryColor}}
            thumbColor={allowFriendSuggestions ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, {backgroundColor: primaryColor}]}
        onPress={handleSave}
        disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>Save Settings</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
