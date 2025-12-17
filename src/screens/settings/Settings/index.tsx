import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {styles} from './styles';

export function SettingsScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {user} = useAuth();

  const menuItems = [
    {
      title: 'Account Settings',
      icon: '👤',
      onPress: () => navigation.navigate('AccountSettings' as never),
    },
    {
      title: 'Password',
      icon: '🔒',
      onPress: () => navigation.navigate('PasswordSettings' as never),
    },
    {
      title: 'Notifications',
      icon: '🔔',
      onPress: () => navigation.navigate('NotificationSettings' as never),
    },
    {
      title: 'Privacy',
      icon: '🔐',
      onPress: () => navigation.navigate('PrivacySettings' as never),
    },
    {
      title: 'Devices',
      icon: '📱',
      onPress: () => navigation.navigate('DevicesSettings' as never),
    },
    {
      title: 'Two-Factor Authentication',
      icon: '🛡️',
      onPress: () => navigation.navigate('TwoFactorSettings' as never),
    },
  ];

  return (
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, {backgroundColor: colors.surface, borderColor: colors.border}]}
            onPress={item.onPress}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={[styles.menuTitle, {color: colors.text}]}>{item.title}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
