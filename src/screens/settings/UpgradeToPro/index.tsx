import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Alert, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {useBrand} from '../../../contexts/BrandContext';
import {getToken} from '../../../services/storage';
import {apiClient} from '../../../services/apiClient';
import {API_BASE_URL} from '../../../config/api';
import {styles} from './styles';

// Get web base URL from API base URL
const getWebBaseUrl = () => {
  const apiUrl = API_BASE_URL;
  if (apiUrl.includes('localhost')) {
    return 'http://localhost:8000';
  }
  // Extract base URL from API URL (remove /api/v1)
  return apiUrl.replace('/api/v1', '').replace('/api', '');
};

export function UpgradeToProScreen() {
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {user, refreshUser} = useAuth();
  const {brand} = useBrand();
  const [loading, setLoading] = useState(true);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);

  const primaryColor = brand?.primary_color || colors.primary;
  const webBaseUrl = getWebBaseUrl();

  React.useEffect(() => {
    loadCheckoutUrl();
  }, []);

  const loadCheckoutUrl = async () => {
    try {
      // Get auth token
      const token = await getToken();
      if (!token) {
        showError('Error', 'Please log in to upgrade to PRO');
        navigation.goBack();
        return;
      }

      // Try to get checkout URL from API first
      try {
        const checkoutUrl = await apiClient.getCheckoutUrl();
        setWebViewUrl(checkoutUrl);
      } catch (apiError) {
        // Fallback to loading subscriptions page directly
        // Note: This requires the backend to accept API token auth for web routes
        // Or the user needs to be logged in via web session
        const url = `${webBaseUrl}/subscriptions`;
        setWebViewUrl(url);
      }
    } catch (error: any) {
      showError('Error', error.message || 'Failed to load upgrade page');
      navigation.goBack();
    }
  };

  const handleNavigationStateChange = async (navState: any) => {
    // Check if we're on the success page
    if (navState.url.includes('/subscriptions/success')) {
      // Refresh user to get updated subscription status
      await refreshUser();
      Alert.alert(
        'Success!',
        'Your subscription has been activated. Welcome to PRO!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }

    // Check if we're on cancel page
    if (navState.url.includes('/subscriptions') && !navState.url.includes('/success')) {
      setLoading(false);
    }
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    // Allow navigation within the app domain
    if (request.url.includes(webBaseUrl) || request.url.includes('stripe.com')) {
      return true;
    }
    // Open external links in browser
    if (request.url.startsWith('http')) {
      Linking.openURL(request.url);
      return false;
    }
    return true;
  };

  const injectAuthScript = () => {
    return `
      (function() {
        // Inject auth token into cookies/localStorage
        // This will be handled by the backend session
        console.log('WebView loaded');
      })();
    `;
  };

  if (!webViewUrl) {
    return (
      <SafeAreaView 
        style={[styles.container, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
        edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={[styles.loadingText, {color: isDark ? colors.textSecondary : '#666666'}]}>
            Loading upgrade page...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.container, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
      edges={['top']}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{
          uri: webViewUrl,
          headers: {
            // Note: WebView doesn't support custom headers for same-origin requests
            // The backend should handle authentication via session cookies
          },
        }}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const {nativeEvent} = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
          showError('Error', 'Failed to load upgrade page. Please try again.');
        }}
        injectedJavaScript={injectAuthScript()}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={primaryColor} />
          </View>
        )}
        style={styles.webView}
      />
    </SafeAreaView>
  );
}
