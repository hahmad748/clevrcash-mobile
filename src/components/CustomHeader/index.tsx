import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StatusBar} from 'react-native';
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {apiClient} from '../../services/apiClient';
import {styles} from './styles';

interface CustomHeaderProps {
  title?: string;
  showBack?: boolean;
  showDrawer?: boolean;
  rightComponent?: React.ReactNode;
  showNotifications?: boolean;
  backgroundColor?: string;
}

export function CustomHeader({
  title,
  showBack,
  showDrawer,
  rightComponent,
  showNotifications = true,
  backgroundColor,
}: CustomHeaderProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const {colors, isDark} = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const headerBackground = backgroundColor || (isDark ? colors.surface : '#FFFFFF');
  const textColor = backgroundColor ? '#FFFFFF' : (isDark ? colors.text : '#1A1A1A');
  const iconColor = backgroundColor ? '#FFFFFF' : (isDark ? colors.text : '#1A1A1A');

  useEffect(() => {
    if (showNotifications) {
      loadUnreadCount();
    }
  }, [showNotifications]);

  useFocusEffect(
    React.useCallback(() => {
      if (showNotifications) {
        loadUnreadCount();
      }
    }, [showNotifications])
  );

  const loadUnreadCount = async () => {
    try {
      const response = await apiClient.getNotifications({unread: true, per_page: 100});
      const unreadNotifications = response.data.filter(n => !n.read_at);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Failed to load notification count:', error);
      setUnreadCount(0);
    }
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications' as never);
  };

  // Determine if we should show drawer or back button
  const canGoBack = navigation.canGoBack();
  const shouldShowBack = showBack !== undefined ? showBack : canGoBack;
  const shouldShowDrawer =
    showDrawer !== undefined
      ? showDrawer
      : !canGoBack && route.name !== 'Main';

  const handleDrawerPress = () => {
    // @ts-ignore - drawer navigation type
    navigation.openDrawer();
  };

  const handleBackPress = () => {
    if (canGoBack) {
      navigation.goBack();
    }
  };
  const bgColor = isDark ? '#0A0E27' : '#F5F5F5';

  return (
    <View style={{backgroundColor: bgColor}}>
      <StatusBar
        barStyle={backgroundColor ? 'light-content' : (isDark ? 'light-content' : 'dark-content')}
        backgroundColor={headerBackground}
        translucent={false}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: headerBackground,
            borderBottomColor: isDark ? colors.border : '#E5E5E5',
          },
        ]}>
        <View style={styles.content}>
          {/* Left Button */}
          <View style={styles.leftSection}>
            {shouldShowDrawer ? (
              <TouchableOpacity
                onPress={handleDrawerPress}
                style={styles.iconButton}
                activeOpacity={0.7}>
                <MaterialIcons name="menu" size={24} color={iconColor} />
              </TouchableOpacity>
            ) : shouldShowBack ? (
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.iconButton}
                activeOpacity={0.7}>
                <MaterialIcons name="arrow-back" size={24} color={iconColor} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Title */}
          {title !== '' && (
            <View style={styles.titleSection}>
              <Text
                style={[
                  styles.title,
                  {
                    color: textColor,
                  },
                ]}
                numberOfLines={1}>
                {title || route.name}
              </Text>
            </View>
          )}

          {/* Right Component */}
          <View style={styles.rightSection}>
            {rightComponent || (
              <>
                {showNotifications && (
                  <TouchableOpacity
                    onPress={handleNotificationsPress}
                    style={styles.iconButton}
                    activeOpacity={0.7}>
                    <MaterialIcons name="notifications" size={24} color={iconColor} />
                    {unreadCount > 0 && (
                      <View style={[styles.badge, {backgroundColor: '#FF3B30'}]}>
                        <Text style={styles.badgeText}>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )}
                {!showNotifications && <View style={styles.iconButton} />}
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
