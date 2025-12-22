import React from 'react';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {BlurView} from '@react-native-community/blur';
import {CommonActions} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import {useBrand} from '../../contexts/BrandContext';
import {styles} from './styles';

export function DrawerContent(props: any) {
  const {user, logout} = useAuth();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {navigation, state} = props;

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';

  const menuItems = [
    {label: 'Home', icon: 'home', screen: 'MainTabs', tabScreen: 'Home'},
    {label: 'Groups', icon: 'groups', screen: 'MainTabs', tabScreen: 'Groups'},
    {label: 'Friends', icon: 'people', screen: 'MainTabs', tabScreen: 'Friends'},
    {label: 'Transactions', icon: 'account-balance-wallet', screen: 'MainTabs', tabScreen: 'Transactions'},
    {label: 'Add Expense', icon: 'add-circle-outline', screen: 'MainTabs', tabScreen: 'Expenses', action: 'CreateExpense'},
    {label: 'Settings', icon: 'settings', screen: 'Settings'},
    {label: 'Help Center', icon: 'help-outline', screen: 'Help'},
    {label: 'Notifications', icon: 'notifications', screen: 'Notifications'},
  ];

  const isActive = (screen: string, tabScreen?: string) => {
    const currentRoute = state?.routes[state?.index];
    if (tabScreen) {
      return (
        currentRoute?.name === 'MainTabs' &&
        currentRoute?.state?.routes[currentRoute?.state?.index]?.name === tabScreen
      );
    }
    return currentRoute?.name === screen;
  };

  const handleMenuPress = (item: typeof menuItems[0]) => {
    if (item.action && item.tabScreen) {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'MainTabs',
          params: {
            screen: item.tabScreen,
            params: {
              screen: item.action,
            },
          },
        }),
      );
    } else if (item.tabScreen) {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'MainTabs',
          params: {
            screen: item.tabScreen,
          },
        }),
      );
    } else {
      navigation.navigate(item.screen as never);
    }
    navigation.closeDrawer();
  };

  return (
    <View style={[styles.drawerContainer, {backgroundColor}]}>
      {/* iOS Liquid Glass Effect with BlurView */}
      <BlurView
        style={styles.blurContainer}
        blurType={isDark ? 'dark' : 'light'}
        blurAmount={20}
        reducedTransparencyFallbackColor={isDark ? '#1A1F3A' : '#FFFFFF'}>
        {/* Glass overlay for additional depth */}
        <View style={[styles.glassOverlay, {borderRightColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.5)'}]} />
      </BlurView>
      
      {/* Content Container */}
      <SafeAreaView style={styles.safeContent} edges={['top', 'left', 'right']}>
        <View style={styles.contentWrapper}>
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            
            {/* User Header Section - Glass Card */}
            <View style={[styles.userHeader, {backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)', borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.9)'}]}>
              <View style={styles.userInfo}>
                {user?.avatar ? (
                  <View style={styles.avatarContainer}>
                    <Image source={{uri: user.avatar}} style={styles.avatar} />
                  </View>
                ) : (
                  <View style={[styles.avatarPlaceholder, {backgroundColor: primaryColor + '30', borderColor: primaryColor + '50'}]}>
                    <Text style={[styles.avatarText, {color: primaryColor}]}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                )}
                <View style={styles.userDetails}>
                  <Text style={[styles.userName, {color: isDark ? '#FFFFFF' : '#1A1A1A'}]} numberOfLines={1}>
                    {user?.name || 'User'}
                  </Text>
                  <Text style={[styles.userEmail, {color: isDark ? '#B0B0B0' : '#666666'}]} numberOfLines={1}>
                    {user?.email || ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu Items Container */}
            <View style={styles.menuContainer}>
              {menuItems.map((item, index) => {
                const active = isActive(item.screen, item.tabScreen);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.menuItem,
                      active && styles.menuItemActive,
                      {
                        backgroundColor: active 
                          ? (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.8)')
                          : 'transparent',
                      },
                    ]}
                    onPress={() => handleMenuPress(item)}
                    activeOpacity={0.7}>
                    <MaterialIcons
                      name={item.icon as any}
                      size={20}
                      color={active 
                        ? (isDark ? primaryColor : primaryColor)
                        : (isDark ? '#FFFFFF' : '#1A1A1A')}
                      style={styles.menuIcon}
                    />
                    <Text
                      style={[
                        styles.menuLabel,
                        {
                          color: active 
                            ? (isDark ? primaryColor : primaryColor)
                            : (isDark ? '#FFFFFF' : '#1A1A1A'),
                          fontWeight: active ? '600' : '500',
                        },
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </DrawerContentScrollView>

          {/* Sticky Logout Button at Bottom */}
          <SafeAreaView style={styles.stickyFooter} edges={['bottom', 'left', 'right']}>
            <View style={[styles.logoutSection, {backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)', borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.5)'}]}>
              <TouchableOpacity 
                style={[styles.logoutButton, {borderColor: isDark ? 'rgba(244, 67, 54, 0.4)' : 'rgba(244, 67, 54, 0.3)'}]}
                onPress={logout}
                activeOpacity={0.7}>
                <View style={[styles.logoutIconContainer, {backgroundColor: 'rgba(244, 67, 54, 0.15)'}]}>
                  <MaterialIcons name="logout" size={18} color="#F44336" />
                </View>
                <Text style={[styles.logoutText, {color: '#F44336'}]}>Logout</Text>
              </TouchableOpacity>
            </View>
            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, {color: isDark ? '#666666' : '#999999'}]}>
                Powered by Devsfort
              </Text>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </View>
  );
}
