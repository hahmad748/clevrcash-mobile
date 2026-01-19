import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import type {Device} from '../../../types/api';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function DevicesScreen() {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revoking, setRevoking] = useState<number | null>(null);

  const primaryColor = brand?.primary_color || colors.primary;

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const deviceList = await apiClient.getDevices();
      setDevices(deviceList);
    } catch (error: any) {
      showError('Error', error.message || 'Failed to load devices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRevokeDevice = (deviceId: number, deviceName: string) => {
    Alert.alert(
      'Revoke Device',
      `Are you sure you want to revoke access for "${deviceName}"? You will need to log in again on this device.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            setRevoking(deviceId);
            try {
              await apiClient.revokeDevice(deviceId);
              await loadDevices();
              showSuccess('Success', 'Device access revoked successfully');
            } catch (error: any) {
              showError('Error', error.message || 'Failed to revoke device');
            } finally {
              setRevoking(null);
            }
          },
        },
      ],
    );
  };

  const handleRevokeAll = () => {
    Alert.alert(
      'Revoke All Devices',
      'Are you sure you want to revoke access for all devices? You will need to log in again on all devices.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Revoke All',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.revokeAllDevices();
              await loadDevices();
              showSuccess('Success', 'All device access revoked successfully');
              // reset to auth screen
            } catch (error: any) {
              showError('Error', error.message || 'Failed to revoke devices');
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) {
      return 'Never';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) + ' ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
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
      style={[styles.scrollView, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadDevices} tintColor={primaryColor} />
      }>
      
      {devices.length === 0 ? (
        <View style={[styles.emptyContainer, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
          <MaterialIcons name="devices" size={48} color={isDark ? colors.textSecondary : '#999999'} />
          <Text style={[styles.emptyText, {color: isDark ? colors.textSecondary : '#666666'}]}>
            No devices found
          </Text>
        </View>
      ) : (
        <>
          {devices.map((device) => (
            <View key={device.id} style={[styles.deviceCard, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
              <View style={styles.deviceInfo}>
                <MaterialIcons 
                  name="smartphone" 
                  size={24} 
                  color={primaryColor} 
                  style={styles.deviceIcon}
                />
                <View style={styles.deviceDetails}>
                  <Text style={[styles.deviceName, {color: isDark ? colors.text : '#1A1A1A'}]}>
                    {device.device_name || device.name || 'Unknown Device'}
                  </Text>
                  <Text style={[styles.deviceDate, {color: isDark ? colors.textSecondary : '#666666'}]}>
                    Last used: {formatDate(device.last_active_at || device.last_used_at || device.created_at)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.revokeButton, {borderColor: colors.error}]}
                onPress={() => handleRevokeDevice(device.id, device.device_name || device.name || 'Unknown Device')}
                disabled={revoking === device.id}>
                {revoking === device.id ? (
                  <ActivityIndicator size="small" color={colors.error} />
                ) : (
                  <MaterialIcons name="close" size={20} color={colors.error} />
                )}
              </TouchableOpacity>
            </View>
          ))}

          {devices.length > 1 && (
            <TouchableOpacity
              style={[styles.revokeAllButton, {borderColor: colors.error}]}
              onPress={handleRevokeAll}>
              <MaterialIcons name="logout" size={20} color={colors.error} />
              <Text style={[styles.revokeAllText, {color: colors.error}]}>
                Revoke All Devices
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
}
