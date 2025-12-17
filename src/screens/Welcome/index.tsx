import React, {useEffect} from 'react';
import {View, Text, Image, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthContext';
import {useBrand} from '../../contexts/BrandContext';
import {styles} from './styles';

export function WelcomeScreen() {
  const navigation = useNavigation();
  const {isAuthenticated, loading: authLoading} = useAuth();
  const {loading: brandLoading, brand} = useBrand();

  useEffect(() => {
    if (!authLoading && !brandLoading) {
      setTimeout(() => {
        if (isAuthenticated) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Main' as never}],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'Auth' as never}],
          });
        }
      }, 2000);
    }
  }, [authLoading, brandLoading, isAuthenticated, navigation]);

  return (
    <View style={[styles.container, {backgroundColor: brand?.primary_color || '#4CAF50'}]}>
      {brand?.logo_url ? (
        <Image source={{uri: brand.logo_url}} style={styles.logo} resizeMode="contain" />
      ) : (
        <Text style={styles.logoText}>{brand?.display_name || 'ClevrCash'}</Text>
      )}
      <Text style={styles.tagline}>Split expenses with friends</Text>
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      <Text style={styles.footer}>Powered by devsfort</Text>
    </View>
  );
}
