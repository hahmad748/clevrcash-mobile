import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, Platform, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useAuth} from '../../../contexts/AuthContext';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {styles} from './styles';

export function AccountScreen() {
  const navigation = useNavigation();
  const {user, logout} = useAuth();
  const {colors, isDark, theme} = useTheme();
  const {brand} = useBrand();

  const primaryColor = brand?.primary_color || colors.primary;
  const isPremium = user?.subscription_status === 'active';

  // Mask email for privacy
  const maskEmail = (email: string) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = localPart.length > 2 
      ? localPart.substring(0, 2) + '*'.repeat(Math.min(localPart.length - 2, 3))
      : localPart;
    return `${maskedLocal}@${domain}`;
  };

  const settingsOptions = [
    {
      title: 'Profile Settings',
      icon: 'person',
      onPress: () => navigation.navigate('ProfileSettings' as never),
    },
    {
      title: 'Reset Password',
      icon: 'lock-reset',
      onPress: () => navigation.navigate('ResetPassword' as never),
    },
    {
      title: 'Notification Preferences',
      icon: 'notifications',
      onPress: () => navigation.navigate('NotificationPreferences' as never),
    },
    {
      title: 'Privacy',
      icon: 'privacy-tip',
      onPress: () => navigation.navigate('Privacy' as never),
    },
    {
      title: 'Devices',
      icon: 'devices',
      onPress: () => navigation.navigate('Devices' as never),
    },
    {
      title: 'Two Factor Authentication',
      icon: 'security',
      onPress: () => navigation.navigate('TwoFactorAuth' as never),
    },
    {
      title: 'Display settings',
      icon: 'brightness-6',
      onPress: () => navigation.navigate('DisplaySettings' as never),
      rightText: theme === 'system' ? 'System Default' : theme === 'dark' ? 'Dark Mode' : 'Light Mode',
    },
    {
      title: 'Logout',
      icon: 'logout',
      onPress: () => {
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: async () => {
                await logout();
              },
            },
          ],
          {cancelable: true}
        );
      },
      isDestructive: true,
    },
  ];

  return (
    <SafeAreaView 
      style={[styles.container, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
      edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={[styles.profileCard, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image source={{uri: user.avatar}} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, {backgroundColor: primaryColor + '20', borderColor: primaryColor}]}>
                  <Text style={[styles.avatarText, {color: primaryColor}]}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, {color: isDark ? colors.text : '#1A1A1A'}]}>
                {user?.name || 'User'}
              </Text>
              <Text style={[styles.userEmail, {color: isDark ? colors.textSecondary : '#666666'}]}>
                {maskEmail(user?.email || '')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileSettings' as never)}
              style={styles.editButton}>
              <MaterialIcons name="edit" size={20} color={isDark ? colors.textSecondary : '#666666'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={[styles.sectionHeader, {color: isDark ? colors.text : '#1A1A1A'}]}>Settings</Text>
        <View style={[styles.settingsCard, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
          {settingsOptions.map((item, index) => {
            const isDestructive = (item as any).isDestructive;
            const destructiveColor = '#FF3B30'; // iOS red color
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.settingItem,
                  index < settingsOptions.length - 1 && styles.settingItemBorder,
                  {borderBottomColor: isDark ? colors.border : '#F0F0F0'},
                ]}
                onPress={item.onPress}>
                <View style={styles.settingLeft}>
                  <MaterialIcons 
                    name={item.icon as any} 
                    size={22} 
                    color={isDestructive ? destructiveColor : (isDark ? colors.textSecondary : '#666666')} 
                  />
                  <Text style={[
                    styles.settingTitle, 
                    {color: isDestructive ? destructiveColor : (isDark ? colors.text : '#1A1A1A')}
                  ]}>
                    {item.title}
                  </Text>
                </View>
                <View style={styles.settingRight}>
                  {item.rightText && (
                    <Text style={[styles.settingRightText, {color: isDark ? colors.textSecondary : '#666666'}]}>
                      {item.rightText}
                    </Text>
                  )}
                  {!isDestructive && (
                    <MaterialIcons 
                      name="chevron-right" 
                      size={24} 
                      color={isDark ? colors.textSecondary : '#999999'} 
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upgrade to PRO Banner */}
        {!isPremium && (
          <TouchableOpacity
            style={[styles.proBanner, {backgroundColor: primaryColor}]}
            onPress={() => navigation.navigate('UpgradeToPro' as never)}>
            <View style={styles.proBannerContent}>
              <View style={styles.proBannerLeft}>
                <MaterialIcons name="diamond" size={28} color="#FFFFFF" />
                <View style={styles.proBannerTextContainer}>
                  <Text style={styles.proBannerTitle}>Upgrade to PRO</Text>
                  <Text style={styles.proBannerSubtitle}>Unlock premium features</Text>
                </View>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
