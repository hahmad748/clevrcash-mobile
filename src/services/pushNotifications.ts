import messaging from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
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
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission denied');
            return false;
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
      return false;
    }
  }

  /**
   * Get FCM token
   */
  async getToken(): Promise<string | null> {
    // On iOS, try to get token first (React Native Firebase may auto-register)
    // Only register manually if we get an unregistered error
    if (Platform.OS === 'ios' && !this.hasRegisteredForRemoteMessages) {
      // Try to get token without registering first
      try {
        const token = await messaging().getToken();
        this.deviceToken = token;
        console.log('FCM Token retrieved successfully (auto-registered):', token);
        this.hasRegisteredForRemoteMessages = true; // Mark as registered since it worked
        return token;
      } catch (error: any) {
        // If we get unregistered error, then register and retry
        if (
          error?.code === 'messaging/unregistered' ||
          error?.message?.includes('registered') ||
          error?.message?.includes('registerDeviceForRemoteMessages')
        ) {
          console.log('Token requires manual registration, registering now...');
          // Fall through to registration logic below
        } else {
          // Some other error, throw it
          console.error('Error getting FCM token:', {
            code: error?.code,
            message: error?.message,
            error: error,
          });
          return null;
        }
      }
    }

    // On iOS, ensure device is registered for remote messages before getting token
    if (Platform.OS === 'ios') {
      const isRegistered = await this.ensureRegisteredForRemoteMessages();
      if (!isRegistered) {
        console.error('Failed to register for remote messages. Cannot get FCM token.');
        return null;
      }
      // Additional delay to ensure registration is fully processed
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      const token = await messaging().getToken();
      this.deviceToken = token;
      console.log('FCM Token retrieved successfully:', token);
      return token;
    } catch (error: any) {
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
   */
  async registerDeviceToken(): Promise<boolean> {
    try {
      const token = await getToken();
      if (!token) {
        console.log('User not authenticated, skipping device registration');
        return false;
      }

      const fcmToken = await this.getToken();
      if (!fcmToken) {
        console.log('No FCM token available');
        return false;
      }

      const deviceInfo = await this.getDeviceInfo();

      // Register device with server
      try {
        await apiClient.registerDevice({
          token: fcmToken,
          device_id: deviceInfo.device_id,
          device_name: deviceInfo.device_name,
          platform: deviceInfo.platform,
          os_version: deviceInfo.os_version,
          app_version: deviceInfo.app_version,
        });
      } catch (error: any) {
        // If endpoint doesn't exist yet, log but don't fail
        console.warn('Device registration endpoint not available:', error.message);
      }

      console.log('Device token registered successfully');
      return true;
    } catch (error) {
      console.error('Error registering device token:', error);
      return false;
    }
  }

  /**
   * Setup message handlers
   */
  setupMessageHandlers() {
    // Handle foreground messages
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      
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
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      // TODO: Navigate to appropriate screen based on notification data
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

      // Get and register token
      await this.registerDeviceToken();
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
