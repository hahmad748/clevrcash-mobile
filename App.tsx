/**
 * ClevrCash
 * Powered by devsfort
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import {ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import {BrandProvider} from './src/contexts/BrandContext';
import AppNavigator from './src/navigation/AppNavigator';
import {pushNotificationService} from './src/services/pushNotifications';

function AppContent() {
  const {isDark} = useTheme();
  const {isAuthenticated} = useAuth();

  useEffect(() => {
    // Initialize push notifications when app starts
    pushNotificationService.initialize();
  }, []);

  useEffect(() => {
    // Re-register device token when user logs in
    if (isAuthenticated) {
      pushNotificationService.registerDeviceToken();
    }
  }, [isAuthenticated]);

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <BrandProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </BrandProvider>
    </SafeAreaProvider>
  );
}

export default App;
