import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useAuth} from '../../../contexts/AuthContext';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {ScreenWrapper} from '../../../components/ScreenWrapper';
import {styles} from './styles';

export function AccountScreen() {
  const navigation = useNavigation();
  const {user, logout} = useAuth();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();

  const primaryColor = brand?.primary_color || colors.primary;

  const generalSettings = [
    {
      title: 'Email',
      icon: 'email',
      onPress: () => navigation.navigate('AccountSettings' as never),
    },
    {
      title: 'Username',
      icon: 'person',
      onPress: () => navigation.navigate('AccountSettings' as never),
    },
    {
      title: 'Step data source',
      icon: 'people',
      onPress: () => navigation.navigate('Settings' as never),
    },
    {
      title: 'Language',
      icon: 'language',
      onPress: () => navigation.navigate('Settings' as never),
    },
    {
      title: 'Privacy',
      icon: 'lock',
      onPress: () => navigation.navigate('PrivacySettings' as never),
    },
  ];

  const appCustomization = [
    {
      title: 'App Icon',
      icon: 'apps',
      onPress: () => {},
    },
    {
      title: 'Widget',
      icon: 'widgets',
      onPress: () => {},
    },
  ];

  const isPremium = user?.subscription_status === 'active';

  return (
    <ScreenWrapper backgroundColor={isDark ? colors.background : '#F5F5F5'}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
      {/* General Settings Section */}
      <View style={[styles.section, {backgroundColor: '#FFFFFF'}]}>
        {generalSettings.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.settingItem,
              index < generalSettings.length - 1 && styles.settingItemBorder,
            ]}
            onPress={item.onPress}>
            <View style={styles.settingLeft}>
              <MaterialIcons name={item.icon} size={24} color="#666" />
              <Text style={styles.settingTitle}>{item.title}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Premium Status Section */}
      <View style={[styles.section, {backgroundColor: '#FFFFFF', marginTop: 16}]}>
        <TouchableOpacity style={styles.settingItem} onPress={() => {}}>
          <View style={styles.settingLeft}>
            <MaterialIcons name="diamond" size={24} color="#2196F3" />
            <Text style={styles.settingTitle}>Premium Status</Text>
          </View>
          <View style={styles.settingRight}>
            <Text
              style={[
                styles.premiumStatus,
                {color: isPremium ? '#4CAF50' : '#FF6B35'},
              ]}>
              {isPremium ? 'Active' : 'Inactive'}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Referral Banner */}
      <TouchableOpacity
        style={[styles.referralBanner, {backgroundColor: '#FF6B35'}]}
        onPress={() => {}}>
        <View style={styles.referralContent}>
          <View style={styles.referralLeft}>
            <MaterialIcons name="card-giftcard" size={32} color="#FFD700" />
            <View style={styles.referralTextContainer}>
              <Text style={styles.referralTitle}>Refer a friend</Text>
              <Text style={styles.referralSubtitle}>$50/referral</Text>
            </View>
          </View>
          <View style={styles.referralIllustration}>
            <MaterialIcons name="people" size={40} color="rgba(255,255,255,0.3)" />
          </View>
        </View>
      </TouchableOpacity>

      {/* App Customization Section */}
      <View style={[styles.section, {backgroundColor: '#FFFFFF', marginTop: 16}]}>
        {appCustomization.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.settingItem,
              index < appCustomization.length - 1 && styles.settingItemBorder,
            ]}
            onPress={item.onPress}>
            <View style={styles.settingLeft}>
              <MaterialIcons name={item.icon} size={24} color="#666" />
              <Text style={styles.settingTitle}>{item.title}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, {backgroundColor: '#FFFFFF', marginTop: 16}]}
        onPress={logout}>
        <MaterialIcons name="logout" size={24} color="#F44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by devsfort</Text>
      </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
