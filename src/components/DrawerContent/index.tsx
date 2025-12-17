import React from 'react';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DrawerContentScrollView} from '@react-navigation/drawer';
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
  const iconColor = isDark ? '#FFFFFF' : '#666666';
  const activeIconColor = primaryColor;

  const menuItems = [
    {label: 'Home', icon: 'home', screen: 'MainTabs', tabScreen: 'Home'},
    {label: 'Groups', icon: 'groups', screen: 'MainTabs', tabScreen: 'Groups'},
    {label: 'Friends', icon: 'people', screen: 'MainTabs', tabScreen: 'Friends'},
    {label: 'Transactions', icon: 'account-balance-wallet', screen: 'MainTabs', tabScreen: 'Transactions'},
    {label: 'Account', icon: 'account-circle', screen: 'MainTabs', tabScreen: 'Account'},
    {label: 'Charts & Graphs', icon: 'bar-chart', screen: 'Charts'},
    {label: 'Recurring Expenses', icon: 'repeat', screen: 'RecurringExpenses'},
    {label: 'Imports', icon: 'file-download', screen: 'Import'},
    {label: 'Notifications', icon: 'notifications', screen: 'Notifications'},
    {label: 'Settings', icon: 'settings', screen: 'Settings'},
    {label: 'Help & About', icon: 'help', screen: 'Help'},
  ];

  const isActive = (screen: string, tabScreen?: string) => {
    const currentRoute = state?.routes[state?.index];
    if (tabScreen) {
      // Check if we're on MainTabs and the active tab matches
      return (
        currentRoute?.name === 'MainTabs' &&
        currentRoute?.state?.routes[currentRoute?.state?.index]?.name === tabScreen
      );
    }
    return currentRoute?.name === screen;
  };

  return (
    <View style={[styles.drawerContainer, {backgroundColor: colors.surface}]}>
      {/* Header - No safe area, extends to edges */}
      <View style={[styles.header, {backgroundColor: primaryColor}]}>
        <View style={styles.userInfo}>
          {user?.avatar ? (
            <Image source={{uri: user.avatar}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
        </View>
      </View>

      {/* Content - With safe area */}
      <SafeAreaView style={styles.safeContent} edges={[ 'left', 'right']}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}>
          {/* Menu Items */}
          <View style={styles.menuContainer}>
                      {menuItems.map((item, index) => {
                        const active = isActive(item.screen, item.tabScreen);
                        return (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.menuItem,
                              active && {backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'},
                              {borderBottomColor: colors.border},
                            ]}
                            onPress={() => {
                              if (item.tabScreen) {
                                // Navigate to MainTabs and then to the specific tab using CommonActions
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
                            }}>
                <MaterialIcons
                  name={item.icon}
                  size={24}
                  color={active ? activeIconColor : iconColor}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuLabel,
                    {color: active ? activeIconColor : colors.text},
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

          {/* Footer */}
          <View style={[styles.footer]}>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <MaterialIcons name="logout" size={20} color={colors.error} />
              <Text style={[styles.logoutText, {color: colors.error}]}>Logout</Text>
            </TouchableOpacity>
            <Text style={[styles.footerText, {color: colors.textSecondary}]}>
              Powered by Devsfort
            </Text>
          </View>
        </DrawerContentScrollView>
      </SafeAreaView>
    </View>
  );
}
