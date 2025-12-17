import {useEffect} from 'react';
import {Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../contexts/AuthContext';
import {apiClient} from '../services/apiClient';
import {setPendingDeepLink} from '../services/storage';

export function useDeepLinking() {
  const navigation = useNavigation();
  const {isAuthenticated} = useAuth();

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      console.log('Deep link received:', url);

      // Parse URL
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname;

      // Handle different deep link patterns
      if (path.includes('/invite/')) {
        const token = path.split('/invite/')[1];
        if (isAuthenticated) {
          try {
            // Try friend invitation first
            try {
              await apiClient.acceptFriendInvitationByToken(token);
              navigation.navigate('Friends' as never);
            } catch {
              // Try group invitation
              await apiClient.acceptGroupInvitationByToken(token);
              navigation.navigate('Groups' as never);
            }
          } catch (error) {
            console.error('Failed to accept invitation:', error);
          }
        } else {
          // Store for after login
          await setPendingDeepLink(url);
          navigation.navigate('Auth' as never);
        }
      } else if (path.includes('/group/') || path.includes('/g/')) {
        const groupId = path.split('/').pop();
        if (isAuthenticated) {
          navigation.navigate('Groups' as never, {
            screen: 'GroupDetail',
            params: {groupId},
          } as never);
        } else {
          await setPendingDeepLink(url);
          navigation.navigate('Auth' as never);
        }
      } else if (path.includes('/expense/') || path.includes('/e/')) {
        const expenseId = path.split('/').pop();
        if (isAuthenticated) {
          navigation.navigate('ExpenseDetail' as never, {expenseId} as never);
        } else {
          await setPendingDeepLink(url);
          navigation.navigate('Auth' as never);
        }
      } else if (path.includes('/settle/')) {
        const id = path.split('/settle/')[1];
        if (isAuthenticated) {
          // Determine if it's a group or friend ID
          navigation.navigate('SettleUpGroup' as never, {groupId: id} as never);
        } else {
          await setPendingDeepLink(url);
          navigation.navigate('Auth' as never);
        }
      } else if (path.includes('/notification/')) {
        const notificationId = path.split('/notification/')[1];
        if (isAuthenticated) {
          navigation.navigate('Notifications' as never);
          // TODO: Navigate to specific notification
        } else {
          await setPendingDeepLink(url);
          navigation.navigate('Auth' as never);
        }
      }
    };

    // Listen for deep links
    const subscription = Linking.addEventListener('url', ({url}) => {
      handleDeepLink(url);
    });

    // Check if app was opened via deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [navigation, isAuthenticated]);
}
