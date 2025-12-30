/**
 * PushBootstrap Component
 * 
 * Handles push notification registration based on authentication state.
 * This component is lifecycle-based, not auth-callback-based, to avoid
 * race conditions with APNs token availability on iOS.
 * 
 * IMPORTANT: This component must be mounted at app root level, inside AuthProvider.
 */

import React, {useEffect, useRef} from 'react';
import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useAuth} from '../contexts/AuthContext';
import {pushNotificationService} from '../services/pushNotifications';

export function PushBootstrap() {
  const {isAuthenticated} = useAuth();
  const hasInitializedRef = useRef(false);
  const registrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize push notifications on app start (regardless of auth state)
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      pushNotificationService.initialize();
    }
  }, []);

  useEffect(() => {
    // Clear any pending registration timeout
    if (registrationTimeoutRef.current) {
      clearTimeout(registrationTimeoutRef.current);
      registrationTimeoutRef.current = null;
    }

    // Only proceed if user is authenticated
    if (!isAuthenticated) {
      // User logged out - delete token
      pushNotificationService.deleteToken().catch(error => {
        console.error('Failed to delete push token on logout:', error);
      });
      return;
    }

    // Delay execution until app is stable (2 seconds)
    // This is especially important for social login flows
    registrationTimeoutRef.current = setTimeout(async () => {
      try {
        await registerDeviceTokenWithAPNsCheck();
      } catch (error) {
        // Silently abort - don't throw errors for push notification failures
        console.warn('Push notification registration aborted:', error);
      }
    }, 2000);

    // Cleanup function
    return () => {
      if (registrationTimeoutRef.current) {
        clearTimeout(registrationTimeoutRef.current);
        registrationTimeoutRef.current = null;
      }
    };
  }, [isAuthenticated]);

  /**
   * Register device token with proper iOS APNs handling
   */
  async function registerDeviceTokenWithAPNsCheck(): Promise<void> {
    if (Platform.OS === 'ios') {
      // iOS-specific: Wait for APNs token before getting FCM token
      await handleIOSPushRegistration();
    } else {
      // Android: Direct registration (get token and register)
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          await pushNotificationService.registerDeviceToken(fcmToken);
        }
      } catch (error) {
        console.warn('Android FCM token registration failed:', error);
      }
    }
  }

  /**
   * Handle iOS push notification registration
   * Based on solution: https://github.com/invertase/react-native-firebase/issues/1990
   * The key is to call registerDeviceForRemoteMessages() and then getToken()
   * getAPNSToken() may return null even when token exists, so we try FCM token directly
   */
  async function handleIOSPushRegistration(): Promise<void> {
    try {
      // Step 1: Request notification permissions
      const hasPermission = await pushNotificationService.requestPermission();
      if (!hasPermission) {
        console.log('Notification permissions not granted, skipping registration');
        return;
      }

      // Step 2: Force register device for remote messages
      // This is critical - must be called before getting FCM token
      // Note: AppDelegate already calls registerForRemoteNotifications(), but
      // registerDeviceForRemoteMessages() does additional Firebase Messaging setup
      await messaging().registerDeviceForRemoteMessages();
      console.log('Device registered for remote messages');
      
      // Step 3: Wait for AppDelegate callback to set APNs token
      // The AppDelegate's didRegisterForRemoteNotificationsWithDeviceToken needs time
      // to receive the APNs token from Apple and set it on Firebase Messaging
      // NOTE: On iOS Simulator, APNs tokens are NOT available (except macOS13+/iOS16+/M1)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 4: Try to get FCM token directly with retries
      // According to React Native Firebase docs: call messaging().getToken() after registerDeviceForRemoteMessages()
      // We'll retry multiple times since APNs token callback might be delayed
      // NOTE: This will fail on iOS Simulator - APNs tokens are not available on simulators
      let fcmToken: string | null = null;
      const maxRetries = 20;
      let retryCount = 0;
      
      while (retryCount < maxRetries && !fcmToken) {
        try {
          // Try getting FCM token directly
          fcmToken = await messaging().getToken();
          console.log(`✅ FCM token retrieved successfully (attempt ${retryCount + 1}/${maxRetries})`);
          break;
        } catch (fcmError: any) {
          // If we get APNs error, wait and retry
          if (
            fcmError?.code === 'messaging/unknown' &&
            (fcmError?.message?.includes('APNS') || fcmError?.message?.includes('APNs') || fcmError?.message?.includes('No APNS token'))
          ) {
            retryCount++;
            if (retryCount < maxRetries) {
              // Log every 5th retry to reduce noise
              if (retryCount % 5 === 0 || retryCount === 1) {
                console.log(`⏳ Waiting for APNs token... (attempt ${retryCount}/${maxRetries})`);
                console.log('   Note: APNs tokens are NOT available on iOS Simulator. Test on a real device.');
              }
              // Wait before retry (exponential backoff: 1s, 1.5s, 2s, 2.5s, 3s, then 3s max)
              const delay = Math.min(1000 + (retryCount * 500), 3000);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            } else {
              console.warn('❌ FCM token failed after all retries');
              console.warn('   Possible causes:');
              console.warn('   1. Running on iOS Simulator (APNs not available)');
              console.warn('   2. APNs token callback not fired (check AppDelegate logs)');
              console.warn('   3. Push Notifications capability not enabled in Xcode');
            }
          } else {
            // Other error - silently abort
            console.warn('FCM token registration failed:', fcmError);
            break;
          }
        }
      }

      // Step 5: If we have FCM token, register it with the server
      if (fcmToken) {
        // Pass the token we already got to avoid calling getToken() again
        await pushNotificationService.registerDeviceToken(fcmToken);
      }
    } catch (error) {
      // Silently abort on any error
      console.warn('iOS push registration failed:', error);
    }
  }


  // This component doesn't render anything
  return null;
}
