import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useRoute, useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import type {Group} from '../../../types/api';
import {styles} from './styles';

export function InviteMemberScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {groupId} = route.params as {groupId: string};
  const [group, setGroup] = useState<Group | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGroup, setLoadingGroup] = useState(true);

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    try {
      setLoadingGroup(true);
      const data = await apiClient.getGroup(groupId);
      setGroup(data);
    } catch (error) {
      console.error('Failed to load group:', error);
      Alert.alert('Error', 'Failed to load group details');
    } finally {
      setLoadingGroup(false);
    }
  };

  const handleInvite = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.inviteToGroup(groupId, email.trim());
      Alert.alert(
        'Success',
        `Invitation sent to ${email}. They will receive an email with instructions to join the group.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setEmail('');
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (group?.invite_code) {
      Clipboard.setString(group.invite_code);
      Alert.alert('Success', 'Invite code copied to clipboard');
    }
  };

  if (loadingGroup) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor}]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, {color: textColor}]}>Invite to Group</Text>
            {group && <Text style={[styles.groupName, {color: secondaryTextColor}]}>{group.name}</Text>}
          </View>

          {/* Email Address Section */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>Email Address</Text>
            <TextInput
              style={[styles.input, {backgroundColor: backgroundColor, color: textColor}]}
              placeholder="user@example.com"
              placeholderTextColor={secondaryTextColor}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={[styles.description, {color: secondaryTextColor}]}>
              Enter the email address of the user you want to invite. They must already have an account.
            </Text>
          </View>

          {/* Share Invite Code Section */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>Share Invite Code</Text>
            <Text style={[styles.description, {color: secondaryTextColor, marginBottom: 12}]}>
              Users can also join this group using the invite code below.
            </Text>
            {group?.invite_code && (
              <View style={styles.inviteCodeContainer}>
                <TextInput
                  style={[styles.inviteCodeInput, {backgroundColor: backgroundColor, color: textColor}]}
                  value={group.invite_code}
                  editable={false}
                />
                <TouchableOpacity
                  style={[styles.copyButton, {backgroundColor: primaryColor}]}
                  onPress={handleCopyCode}>
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, {borderColor: secondaryTextColor}]}
              onPress={() => navigation.goBack()}>
              <Text style={[styles.cancelButtonText, {color: textColor}]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendButton, {backgroundColor: primaryColor}]}
              onPress={handleInvite}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>Send Invite</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
    </View>
  );
}
