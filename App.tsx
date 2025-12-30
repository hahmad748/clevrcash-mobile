/**
 * ClevrCash
 * Powered by devsfort
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/contexts/AuthContext';
import {ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import {BrandProvider} from './src/contexts/BrandContext';
import AppNavigator from './src/navigation/AppNavigator';
import {PushBootstrap} from './src/components/PushBootstrap';

function AppContent() {
  const {isDark} = useTheme();

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
            <PushBootstrap />
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </BrandProvider>
    </SafeAreaProvider>
  );
}

export default App;
