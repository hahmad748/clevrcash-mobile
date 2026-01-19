import messaging from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid, Alert, AppState, InteractionManager} from 'react-native';
import {apiClient} from './apiClient';
import {getToken} from './storage';
import DeviceInfo from 'react-native-device-info';

export interface DeviceInfoData {
  device_id: string;
  device_name: string;
  platform: string;
  os_version: string;
  app_version: string;
}

class PushNotificationService {
  private deviceToken: string | null = null;
  private deviceInfo: DeviceInfoData | null = null;
  private isRegisteringForRemoteMessages: boolean = false;
  private hasRegisteredForRemoteMessages: boolean = false;
  private messageHandlersSetup: boolean = false;
  private lastNotificationId: string | null = null;
  private lastNotificationTime: number = 0;

  /**
   * Ensure device is registered for remote messages (iOS only)
   */
  private async ensureRegisteredForRemoteMessages(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return true; // Not needed on Android
    }

    // If already registered or currently registering, return
    if (this.hasRegisteredForRemoteMessages) {
      return true;
    }

    // If currently registering, wait for it to complete
    if (this.isRegisteringForRemoteMessages) {
      // Wait up to 2 seconds for registration to complete
      for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (this.hasRegisteredForRemoteMessages) {
          return true;
        }
      }
      return false;
    }

    this.isRegisteringForRemoteMessages = true;

    try {
      await messaging().registerDeviceForRemoteMessages();
      console.log('Successfully registered device for remote messages (iOS)');
      this.hasRegisteredForRemoteMessages = true;
      // Longer delay to ensure registration fully completes
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (registerError: any) {
      const errorMessage = registerError?.message || '';
      const errorCode = registerError?.code || '';
      const isAlreadyRegistered =
        errorCode.includes('already') ||
        errorMessage.includes('already') ||
        errorMessage.includes('registered') ||
        errorCode === 'messaging/already-registered';

      if (isAlreadyRegistered) {
        console.log('Device already registered for remote messages');
        this.hasRegisteredForRemoteMessages = true;
        return true;
      } else {
        console.error('Error registering for remote messages:', {
          code: errorCode,
          message: errorMessage,
          error: registerError,
        });
        // Don't mark as registered if there was an actual error
        return false;
      }
    } finally {
      this.isRegisteringForRemoteMessages = false;
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // Android 13+ requires runtime permission
        if (Platform.Version >= 33) {
          // First check if permission is already granted
          const checkResult = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          
          if (checkResult) {
            console.log('Notification permission already granted');
          } else {
            // Only request if not already granted
            // Ensure app is in foreground and Activity is ready
            if (AppState.currentState !== 'active') {
              console.log('App not in foreground, skipping permission request');
              return false;
            }
            
            // Wait for interactions to complete to ensure Activity is ready
            await new Promise<void>(resolve => {
              InteractionManager.runAfterInteractions(() => {
                resolve();
              });
            });
            
            // Small delay to ensure Activity context is available
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Notification permission denied');
              return false;
            }
          }
        }
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted');
        return true;
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      // If permission request fails, check if already granted
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          const checkResult = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (checkResult) {
            // Permission is already granted, continue with Firebase
            const authStatus = await messaging().requestPermission();
            const enabled =
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            return enabled;
          }
        } catch (checkError) {
          console.error('Error checking notification permission:', checkError);
        }
      }
      return false;
    }
  }

  /**
   * Get FCM token
   * On iOS, this requires APNS token to be set first
   * Note: This method assumes registerDeviceForRemoteMessages() has already been called
   */
  async getToken(): Promise<string | null> {
    // On iOS, ensure device is registered for remote messages first
    if (Platform.OS === 'ios') {
      // Ensure device is registered (this should already be done by PushBootstrap)
      const isRegistered = await this.ensureRegisteredForRemoteMessages();
      if (!isRegistered) {
        console.error('Failed to register for remote messages. Cannot get FCM token.');
        return null;
      }
    }

    // Try to get FCM token
    // On iOS, if APNS token isn't ready, this will fail gracefully
    try {
      const token = await messaging().getToken();
      this.deviceToken = token;
      console.log('FCM Token retrieved successfully:', token);
      return token;
    } catch (error: any) {
      // On iOS, if error is about APNS token, return null (PushBootstrap will handle retries)
      if (
        Platform.OS === 'ios' &&
        error?.code === 'messaging/unknown' &&
        (error?.message?.includes('APNS') || error?.message?.includes('No APNS token'))
      ) {
        console.warn('FCM token requires APNS token, which is not yet available');
        return null;
      }
      
      // Other errors
      console.error('Error getting FCM token:', {
        code: error?.code,
        message: error?.message,
        error: error,
      });
      return null;
    }
  }

  /**
   * Get device information
   */
  async getDeviceInfo(): Promise<DeviceInfoData> {
    if (this.deviceInfo) {
      return this.deviceInfo;
    }

    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const deviceName = await DeviceInfo.getDeviceName();
      const systemVersion = DeviceInfo.getSystemVersion();
      const appVersion = DeviceInfo.getVersion();

      this.deviceInfo = {
        device_id: deviceId,
        device_name: deviceName,
        platform: Platform.OS,
        os_version: systemVersion,
        app_version: appVersion,
      };

      return this.deviceInfo;
    } catch (error) {
      console.error('Error getting device info:', error);
      return {
        device_id: 'unknown',
        device_name: 'Unknown Device',
        platform: Platform.OS,
        os_version: 'unknown',
        app_version: '1.0.0',
      };
    }
  }

  /**
   * Register device token with server
   * @param fcmToken Optional FCM token. If not provided, will attempt to get it via getToken()
   */
  private isRegistering = false;
  private lastRegisteredToken: string | null = null;

  async registerDeviceToken(fcmToken?: string | null): Promise<boolean> {
    // Prevent duplicate concurrent registrations
    if (this.isRegistering) {
      console.log('Device token registration already in progress, skipping...');
      return false;
    }

    try {
      this.isRegistering = true;

      const token = await getToken();
      if (!token) {
        console.log('User not authenticated, skipping device registration');
        return false;
      }

      // Use provided token or try to get it
      const tokenToRegister = fcmToken || await this.getToken();
      if (!tokenToRegister) {
        console.log('No FCM token available');
        return false;
      }

      // Skip if we're trying to register the same token again
      if (this.lastRegisteredToken === tokenToRegister) {
        console.log('Device token already registered, skipping duplicate registration');
        return true;
      }

      const deviceInfo = await this.getDeviceInfo();

      // Register device with server
      try {
        await apiClient.registerDevice({
          token: tokenToRegister,
          device_id: deviceInfo.device_id,
          device_name: deviceInfo.device_name,
          platform: deviceInfo.platform,
          os_version: deviceInfo.os_version,
          app_version: deviceInfo.app_version,
        });
        // Mark as successfully registered
        this.lastRegisteredToken = tokenToRegister;
      } catch (error: any) {
        // If endpoint doesn't exist yet, log but don't fail
        console.warn('Device registration endpoint not available:', error.message);
        // Still mark as registered to prevent retries for the same token
        this.lastRegisteredToken = tokenToRegister;
      }

      console.log('Device token registered successfully');
      return true;
    } catch (error) {
      console.error('Error registering device token:', error);
      return false;
    } finally {
      this.isRegistering = false;
    }
  }

  /**
   * Setup message handlers
   */
  setupMessageHandlers() {
    // Prevent duplicate handler registration
    if (this.messageHandlersSetup) {
      console.log('Message handlers already setup, skipping...');
      return;
    }

    this.messageHandlersSetup = true;

    // Handle foreground messages
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      
      // Prevent duplicate alerts for the same notification
      const messageId = remoteMessage.messageId || `${remoteMessage.sentTime}_${remoteMessage.data?.type || 'unknown'}`;
      const currentTime = Date.now();
      
      // Skip if this is the same notification within 2 seconds (duplicate prevention)
      if (messageId === this.lastNotificationId && (currentTime - this.lastNotificationTime) < 2000) {
        console.log('Duplicate notification detected, skipping alert');
        return;
      }

      this.lastNotificationId = messageId;
      this.lastNotificationTime = currentTime;
      
      // Show alert for foreground notifications
      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title || 'Notification',
          remoteMessage.notification.body || '',
        );
      }
    });

    // Handle background/quit state messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message received:', remoteMessage);
    });

    // Handle notification taps (when app is opened from notification)
    // Note: This fires when app is in background/quit state and user taps notification
    // When app is in foreground, onMessage handles it, so we don't show alert here
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      
      // Prevent duplicate handling if onMessage already handled it
      const messageId = remoteMessage.messageId || `${remoteMessage.sentTime}_${remoteMessage.data?.type || 'unknown'}`;
      const currentTime = Date.now();
      
      // Only handle if this is a different notification or enough time has passed
      if (messageId !== this.lastNotificationId || (currentTime - this.lastNotificationTime) >= 2000) {
        this.lastNotificationId = messageId;
        this.lastNotificationTime = currentTime;
        
        // Don't show alert here - onMessage already handled it for foreground
        // Just navigate to appropriate screen based on notification data
        // TODO: Navigate to appropriate screen based on notification data
      }
    });

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
          // TODO: Navigate to appropriate screen
        }
      });
  }

  /**
   * Setup token refresh handler
   */
  setupTokenRefreshHandler() {
    messaging().onTokenRefresh(async token => {
      console.log('FCM token refreshed:', token);
      this.deviceToken = token;
      // Re-register with server
      await this.registerDeviceToken();
    });
  }

  /**
   * Initialize push notifications
   * NOTE: This only sets up handlers and permissions.
   * Token registration is handled by PushBootstrap component based on auth state.
   */
  async initialize(): Promise<void> {
    try {
      // Request permissions first
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log('Notification permissions not granted');
        return;
      }

      // On iOS, register for remote messages after permissions are granted
      // React Native Firebase may auto-register, but we ensure it's done
      if (Platform.OS === 'ios') {
        // Wait a bit for native registration to complete (from AppDelegate)
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.ensureRegisteredForRemoteMessages();
      }

      // Setup message handlers
      this.setupMessageHandlers();
      this.setupTokenRefreshHandler();

      // NOTE: Token registration is handled by PushBootstrap component
      // based on authentication state. Do NOT call registerDeviceToken() here
      // to avoid duplicate registrations.
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  /**
   * Delete token (on logout)
   */
  async deleteToken(): Promise<void> {
    try {
      await messaging().deleteToken();
      this.deviceToken = null;
      console.log('FCM token deleted');
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }
}

export const pushNotificationService = new PushNotificationService();
