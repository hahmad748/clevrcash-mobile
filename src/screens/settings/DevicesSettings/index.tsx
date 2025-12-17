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
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import type {Device} from '../../../types/api';
import {styles} from './styles';

export function DevicesSettingsScreen() {
  const {colors} = useTheme();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getDevices();
      setDevices(data);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
  }, []);

  const handleRevoke = async (device: Device) => {
    Alert.alert(
      'Revoke Device',
      `Are you sure you want to revoke access for ${device.device_name || 'this device'}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.revokeDevice(device.id);
              Alert.alert('Success', 'Device access revoked');
              await loadDevices();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to revoke device');
            }
          },
        },
      ],
    );
  };

  const handleRevokeAll = () => {
    Alert.alert(
      'Revoke All Devices',
      'Are you sure you want to revoke access for all devices? You will need to log in again.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Revoke All',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.revokeAllDevices();
              Alert.alert('Success', 'All devices revoked');
              await loadDevices();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to revoke devices');
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDevice = ({item}: {item: Device}) => (
    <View style={[styles.deviceCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
      <View style={styles.deviceInfo}>
        <Text style={[styles.deviceName, {color: colors.text}]}>
          {item.device_name || 'Unknown Device'}
        </Text>
        <Text style={[styles.deviceDetails, {color: colors.textSecondary}]}>
          {item.platform} • {item.os_version}
        </Text>
        <Text style={[styles.deviceDate, {color: colors.textSecondary}]}>
          Last used: {formatDate(item.last_used_at || item.created_at)}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.revokeButton, {backgroundColor: colors.error}]}
        onPress={() => handleRevoke(item)}>
        <Text style={styles.revokeButtonText}>Revoke</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && devices.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>No devices found</Text>
          </View>
        }
      />
      {devices.length > 0 && (
        <TouchableOpacity
          style={[styles.revokeAllButton, {backgroundColor: colors.error}]}
          onPress={handleRevokeAll}>
          <Text style={styles.revokeAllButtonText}>Revoke All Devices</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
