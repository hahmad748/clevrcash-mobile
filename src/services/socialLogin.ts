import {Platform, Alert} from 'react-native';
import auth, {GoogleAuthProvider, AppleAuthProvider} from '@react-native-firebase/auth';

export interface SocialLoginResult {
  provider: 'google' | 'apple';
  provider_id: string;
  email: string;
  name: string;
  avatar?: string;
  provider_data?: any;
}

export interface SocialProviderConfig {
  enabled: boolean;
  client_id?: string;
  web_client_id?: string;
  offline_access?: boolean;
  force_code_for_refresh_token?: boolean;
  requested_scopes?: string[];
  [key: string]: any;
}

class SocialLoginService {
  /**
   * Get Firebase Auth instance
   * Note: Requires @react-native-firebase/auth to be installed
   */
  private getAuth() {
    try {
      return auth();
    } catch (error) {
      throw new Error(
        'Firebase Auth is not installed. Please install @react-native-firebase/auth',
      );
    }
  }

  /**
   * Get social provider configs from backend API
   */
  private async getProviderConfigs(): Promise<Record<string, SocialProviderConfig> | null> {
    try {
      const {apiClient} = require('./apiClient');
      const response = await apiClient.getEnabledSocialProviders();
      return response.configs || null;
    } catch (error) {
      console.error('Failed to get provider configs:', error);
      return null;
    }
  }

  /**
   * Get Google provider config
   */
  private async getGoogleConfig(): Promise<SocialProviderConfig | null> {
    const configs = await this.getProviderConfigs();
    return configs?.google || null;
  }

  /**
   * Get Apple provider config
   */
  private async getAppleConfig(): Promise<SocialProviderConfig | null> {
    const configs = await this.getProviderConfigs();
    return configs?.apple || null;
  }

  /**
   * Sign in with Google using Firebase Auth
   * 
   * Following the official React Native Firebase documentation:
   * https://rnfirebase.io/auth/social-auth#google
   * 
   * Note: This requires @react-native-google-signin/google-signin because:
   * 1. Firebase Auth on React Native doesn't provide native Google Sign-In UI
   * 2. We need the native library to show Google's sign-in UI and get the ID token
   * 3. We then use that ID token with Firebase Auth to authenticate
   * 
   * This is the standard Firebase + React Native approach recommended by Firebase.
   */
  async signInWithGoogle(): Promise<SocialLoginResult | null> {
    try {
      const auth = this.getAuth();
      
      // Check if Google Sign-In library is available
      let GoogleSignin;
      try {
        GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
      } catch (error) {
        Alert.alert(
          'Package Required',
          'Google Sign-In requires @react-native-google-signin/google-signin package. Please install it: npm install @react-native-google-signin/google-signin',
        );
        return null;
      }

      // Get Google config from backend
      const googleConfig = await this.getGoogleConfig();
      
      if (!googleConfig || !googleConfig.web_client_id) {
        Alert.alert(
          'Configuration Required',
          'Google Sign-In is not properly configured. Please contact support.',
        );
        return null;
      }
      
      // Configure Google Sign-In with settings from backend
      // webClientId can be found in android/app/google-services.json as client/oauth_client/client_id
      // (the id ends with .apps.googleusercontent.com, client_type: 3)
      GoogleSignin.configure({
        webClientId: googleConfig.web_client_id,
        offlineAccess: googleConfig.offline_access !== undefined ? googleConfig.offline_access : true,
        forceCodeForRefreshToken: googleConfig.force_code_for_refresh_token !== undefined ? googleConfig.force_code_for_refresh_token : true,
      });

      // Check if Google Play Services are available (Android only)
      // Following official docs: https://rnfirebase.io/auth/social-auth#google
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      // Get the users ID token (following official docs pattern)
      const signInResult = await GoogleSignin.signIn();

      // Try the new style of google-sign in result, from v13+ of that module
      let idToken = signInResult.data?.idToken;
      if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.idToken;
      }
      if (!idToken) {
        // Fallback: try getTokens() method
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }
      
      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token (following official docs)
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth.signInWithCredential(googleCredential);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        return null;
      }

      // Get the Firebase ID token for backend verification
      const token = await firebaseUser.getIdToken();

      // Get default name from backend config
      const defaultName = googleConfig.default_name;

      return {
        provider: 'google',
        provider_id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || defaultName,
        avatar: firebaseUser.photoURL || undefined,
        provider_data: {
          id_token: token,
          firebase_uid: firebaseUser.uid,
        },
      };
    } catch (error: any) {
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'SIGN_IN_CANCELLED' ||
        error.code === 'auth/user-cancelled' ||
        error.message?.includes('cancelled')
      ) {
        // User cancelled the sign-in
        return null;
      }
      console.error('Google Sign-In Error:', error);
      Alert.alert('Google Sign-In Failed', error.message || 'Unable to sign in with Google');
      return null;
    }
  }

  /**
   * Sign in with Apple using Firebase Auth
   * 
   * Following the official React Native Firebase documentation:
   * https://rnfirebase.io/auth/social-auth#apple
   */
  async signInWithApple(): Promise<SocialLoginResult | null> {
    try {
      const auth = this.getAuth();
      const {appleAuth} = require('@invertase/react-native-apple-authentication');

      // Get Apple config from backend
      const appleConfig = await this.getAppleConfig();
      
      if (!appleConfig) {
        Alert.alert(
          'Configuration Required',
          'Apple Sign-In is not properly configured. Please contact support.',
        );
        return null;
      }

      // Check if Apple Sign-In is available on this device
      const isAvailable = await appleAuth.isSupported();
      if (!isAvailable) {
        Alert.alert(
          'Apple Sign-In Not Available',
          'Apple Sign-In is not available on this device.',
        );
        return null;
      }

      // Map requested scopes from backend config
      // As per the FAQ of react-native-apple-authentication, the name should come first
      // See: https://github.com/invertase/react-native-apple-authentication#faqs
      const requestedScopesArray = appleConfig.requested_scopes || ['name', 'email'];
      const requestedScopes = requestedScopesArray.map((scope: string) => {
        const scopeMap: Record<string, any> = {
          'email': appleAuth.Scope.EMAIL,
          'name': appleAuth.Scope.FULL_NAME,
        };
        return scopeMap[scope.toLowerCase()] || appleAuth.Scope.EMAIL;
      });

      // Start the sign-in request (following official docs)
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: requestedScopes,
      });

      // Ensure Apple returned a user identityToken (following official docs)
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response (following official docs)
      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = AppleAuthProvider.credential(identityToken, nonce);

      // Sign in the user with the credential
      const userCredential = await auth.signInWithCredential(appleCredential);
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        return null;
      }

      // Get the ID token for backend verification
      const token = await firebaseUser.getIdToken();

      // Get default name from backend config
      const defaultName = appleConfig.default_name;

      // Extract name from Apple response (only available on first sign-in)
      const fullName = appleAuthRequestResponse.fullName;
      const name = fullName
        ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() || defaultName
        : firebaseUser.displayName || defaultName;

      return {
        provider: 'apple',
        provider_id: firebaseUser.uid,
        email: appleAuthRequestResponse.email || firebaseUser.email || '',
        name: name,
        avatar: undefined, // Apple doesn't provide avatar
        provider_data: {
          identity_token: identityToken,
          authorization_code: appleAuthRequestResponse.authorizationCode,
          firebase_uid: firebaseUser.uid,
        },
      };
    } catch (error: any) {
      const appleAuth = require('@invertase/react-native-apple-authentication').appleAuth;
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === appleAuth.Error.CANCELED ||
        error.code === 'auth/user-cancelled'
      ) {
        // User cancelled the sign-in
        return null;
      }
      console.error('Apple Sign-In Error:', error);
      Alert.alert('Apple Sign-In Failed', error.message || 'Unable to sign in with Apple');
      return null;
    }
  }

  /**
   * Sign out from Firebase Auth
   */
  async signOut(): Promise<void> {
    try {
      const auth = this.getAuth();
      await auth.signOut();

      // Also sign out from Google if signed in
      try {
        const {GoogleSignin} = require('@react-native-google-signin/google-signin');
        await GoogleSignin.signOut();
      } catch (error) {
        // Ignore if Google Sign-In is not available
      }
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
  }

  /**
   * Get current Firebase user
   */
  async getCurrentUser(): Promise<any> {
    try {
      const auth = this.getAuth();
      return auth.currentUser;
    } catch (error) {
      console.error('Get Current User Error:', error);
      return null;
    }
  }
}

export const socialLoginService = new SocialLoginService();
