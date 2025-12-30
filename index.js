/**
 * @format
 */

// Silence React Native Firebase v22 deprecation warnings
// Must be set before any Firebase imports
// See: https://rnfirebase.io/migrating-to-v22
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Register background message handler for Firebase
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
