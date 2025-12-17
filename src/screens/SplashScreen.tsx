import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';
import {getBrandConfig} from '../config/brand';

export default function SplashScreen({navigation}: any) {
  const {loading, isAuthenticated} = useAuth();
  const {colors} = useTheme();
  const brand = getBrandConfig();

  useEffect(() => {
    if (!loading) {
      // Small delay for splash screen visibility
      setTimeout(() => {
        if (isAuthenticated) {
          navigation.replace('Main');
        } else {
          navigation.replace('Login');
        }
      }, 1500);
    }
  }, [loading, isAuthenticated, navigation]);

  return (
    <View style={[styles.container, {backgroundColor: brand.primaryColor}]}>
      <Text style={styles.logo}>{brand.displayName}</Text>
      <Text style={styles.tagline}>Split expenses with friends</Text>
      <ActivityIndicator
        size="large"
        color="#fff"
        style={styles.loader}
      />
      <Text style={styles.footer}>Powered by Devsfort</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
  },
});

