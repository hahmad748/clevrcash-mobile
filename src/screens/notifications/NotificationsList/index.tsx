import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import {ScreenWrapper} from '../../../components/ScreenWrapper';
import type {Notification} from '../../../types/api';
import {styles} from './styles';
import {showError, showSuccess} from '../../../utils/flashMessage';

export function NotificationsListScreen() {
  const {colors} = useTheme();
  const {brand} = useBrand();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isLoadingRef = useRef(false);

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = colors.background;
  const cardBackground = colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.textSecondary;

  // Load notifications on mount and when screen comes into focus
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      loadNotifications(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isInitialLoad) {
        loadNotifications(1);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInitialLoad])
  );

  const loadNotifications = async (pageNum = 1) => {
    if (pageNum === 1 && isLoadingRef.current) {
      return;
    }

    if (pageNum > 1 && loadingMore) {
      return;
    }

    try {
      if (pageNum === 1) {
        isLoadingRef.current = true;
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await apiClient.getNotifications({
        page: pageNum,
        per_page: 20,
      });

      if (pageNum === 1) {
        setNotifications(response.data || []);
      } else {
        setNotifications(prev => [...prev, ...(response.data || [])]);
      }

      setHasMore(response.current_page < response.last_page);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      if (pageNum === 1) {
        setNotifications([]);
        setHasMore(false);
      }
      showError('Error', 'Failed to load notifications');
    } finally {
      if (pageNum === 1) {
        isLoadingRef.current = false;
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await loadNotifications(1);
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore && notifications.length > 0) {
      const nextPage = page + 1;
      loadNotifications(nextPage);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllRead(true);
      await apiClient.markAllNotificationsAsRead();
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({...n, read_at: n.read_at || new Date().toISOString()}))
      );
      showSuccess('Success', 'All notifications marked as read');
    } catch (error: any) {
      showError('Error', error.message || 'Failed to mark all as read');
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.read_at) return;

    try {
      await apiClient.markNotificationAsRead(notification.id);
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? {...n, read_at: new Date().toISOString()} : n
        )
      );
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      expense_added: 'receipt',
      expense_edited: 'edit',
      expense_deleted: 'delete',
      payment_received: 'payment',
      added_as_friend: 'person-add',
      added_to_group: 'group-add',
      group_invitation_accepted: 'check-circle',
      remind: 'notifications-active',
      weekly_summary: 'calendar-view-week',
      monthly_summary: 'calendar-view-month',
      expense_due: 'schedule',
      welcome: 'waving-hand',
      subscription_success: 'star',
      expense_commented: 'comment',
      major_update: 'update',
    };
    return iconMap[type] || 'notifications';
  };

  const getNotificationTitle = (notification: Notification) => {
    const {type, data} = notification.data;
    const titles: Record<string, string> = {
      expense_added: 'New Expense',
      expense_edited: 'Expense Updated',
      expense_deleted: 'Expense Deleted',
      payment_received: 'Payment Received',
      added_as_friend: 'New Friend',
      added_to_group: 'Added to Group',
      group_invitation_accepted: 'Invitation Accepted',
      remind: 'Reminder',
      weekly_summary: 'Weekly Summary',
      monthly_summary: 'Monthly Summary',
      expense_due: 'Expense Due',
      welcome: 'Welcome!',
      subscription_success: 'Subscription Active',
      expense_commented: 'New Comment',
      major_update: 'App Update',
    };
    return titles[type] || 'Notification';
  };

  const getNotificationMessage = (notification: Notification) => {
    const {data} = notification.data;
    // You can customize messages based on notification data
    if (data?.message) {
      return data.message;
    }
    return `${getNotificationTitle(notification)} notification`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const renderNotification = ({item}: {item: Notification}) => {
    const isUnread = !item.read_at;
    const iconName = getNotificationIcon(item.data.type);
    const title = getNotificationTitle(item);
    const message = getNotificationMessage(item);
    const borderLeftColor = isUnread ? primaryColor : 'transparent';

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          {
            backgroundColor: cardBackground,
            borderLeftColor,
          },
        ]}
        onPress={() => handleMarkAsRead(item)}
        activeOpacity={0.7}>
        <View style={styles.notificationContent}>
          <View
            style={[
              styles.notificationIcon,
              {
                backgroundColor: isUnread ? primaryColor + '20' : secondaryTextColor + '15',
              },
            ]}>
            <MaterialIcons
              name={iconName as any}
              size={24}
              color={isUnread ? primaryColor : secondaryTextColor}
            />
          </View>
          <View style={styles.notificationInfo}>
            <View style={styles.notificationHeader}>
              <Text
                style={[
                  styles.notificationTitle,
                  {
                    color: textColor,
                    fontWeight: (isUnread ? '600' : '500') as '600' | '500',
                  },
                ]}
                numberOfLines={1}>
                {title}
              </Text>
              {isUnread && (
                <View style={[styles.unreadDot, {backgroundColor: primaryColor}]} />
              )}
            </View>
            <Text
              style={[styles.notificationMessage, {color: secondaryTextColor}]}
              numberOfLines={2}>
              {message}
            </Text>
            <Text style={[styles.notificationTime, {color: secondaryTextColor}]}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={[styles.container, {backgroundColor}]}>
        <ScreenWrapper>
          <View style={[styles.centerContent, {flex: 1}]}>
            <ActivityIndicator size="large" color={primaryColor} />
          </View>
        </ScreenWrapper>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <ScreenWrapper>
        {/* Header with Mark All as Read */}
        <View style={styles.headerContainer}>
          <Text style={[styles.heading, {color: textColor}]}>Notifications</Text>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={[styles.markAllButton, {borderColor: primaryColor}]}
              onPress={handleMarkAllAsRead}
              disabled={markingAllRead}
              activeOpacity={0.7}>
              {markingAllRead ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : (
                <>
                  <MaterialIcons name="done-all" size={18} color={primaryColor} />
                  <Text style={[styles.markAllText, {color: primaryColor}]}>
                    Mark All Read
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={
            notifications.length === 0
              ? [styles.listContent, styles.emptyListContent]
              : styles.listContent
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="notifications-none" size={64} color={secondaryTextColor} />
                <Text style={[styles.emptyText, {color: secondaryTextColor}]}>
                  No notifications yet
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={primaryColor} />
              </View>
            ) : null
          }
        />
      </ScreenWrapper>
    </View>
  );
}

