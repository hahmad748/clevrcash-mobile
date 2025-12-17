import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import type {Friendship} from '../../../types/api';
import {styles} from './styles';

export function PendingRequestsScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [requests, setRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    loadRequests();
  }, [activeTab]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPendingRequests(activeTab);
      setRequests(data);
    } catch (error) {
      console.error('Failed to load pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  }, [activeTab]);

  const handleAccept = async (friendship: Friendship) => {
    try {
      const friendId = activeTab === 'received' ? friendship.user_id : friendship.friend_id;
      await apiClient.acceptFriendRequest(friendId);
      Alert.alert('Success', 'Friend request accepted');
      await loadRequests();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to accept request');
    }
  };

  const handleDecline = async (friendship: Friendship) => {
    try {
      const friendId = activeTab === 'received' ? friendship.user_id : friendship.friend_id;
      await apiClient.declineFriendRequest(friendId);
      Alert.alert('Success', 'Friend request declined');
      await loadRequests();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to decline request');
    }
  };

  const renderRequest = ({item}: {item: Friendship}) => {
    const friend = activeTab === 'received' ? item.user : item.friend;

    return (
      <View style={[styles.requestCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
        <View style={styles.requestInfo}>
          <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
            <Text style={styles.avatarText}>
              {friend?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.requestDetails}>
            <Text style={[styles.requestName, {color: colors.text}]}>
              {friend?.name || 'Unknown'}
            </Text>
            <Text style={[styles.requestEmail, {color: colors.textSecondary}]}>
              {friend?.email || ''}
            </Text>
          </View>
        </View>
        {activeTab === 'received' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.acceptButton, {backgroundColor: colors.success}]}
              onPress={() => handleAccept(item)}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.declineButton, {backgroundColor: colors.error}]}
              onPress={() => handleDecline(item)}>
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
        {activeTab === 'sent' && (
          <Text style={[styles.pendingText, {color: colors.textSecondary}]}>Pending</Text>
        )}
      </View>
    );
  };

  if (loading && requests.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Tabs */}
      <View style={[styles.tabs, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'received' && {borderBottomColor: colors.primary, borderBottomWidth: 2},
          ]}
          onPress={() => setActiveTab('received')}>
          <Text
            style={[
              styles.tabText,
              {color: activeTab === 'received' ? colors.primary : colors.textSecondary},
            ]}>
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'sent' && {borderBottomColor: colors.primary, borderBottomWidth: 2},
          ]}
          onPress={() => setActiveTab('sent')}>
          <Text
            style={[
              styles.tabText,
              {color: activeTab === 'sent' ? colors.primary : colors.textSecondary},
            ]}>
            Sent
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
              No {activeTab} requests
            </Text>
          </View>
        }
      />
    </View>
  );
}
