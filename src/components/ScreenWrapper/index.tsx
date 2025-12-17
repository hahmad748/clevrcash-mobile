import React, {ReactNode} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useBrand} from '../../contexts/BrandContext';
import {styles} from './styles';

interface ScreenWrapperProps {
  children: ReactNode;
  backgroundColor?: string;
}

export function ScreenWrapper({children, backgroundColor}: ScreenWrapperProps) {
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();

  const primaryColor = brand?.primary_color || colors.primary;
  const screenBackground = backgroundColor || (isDark ? colors.background : '#F5F5F5');

  return (
    <View style={[styles.container, {backgroundColor: screenBackground}]}>
      {/* Curved Header */}
      <SafeAreaView edges={['top']} style={{backgroundColor: primaryColor, borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30, overflow: 'hidden'}}>
        <View style={[styles.header, {backgroundColor: primaryColor}]}>
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.openDrawer();
            }}
            style={styles.headerIcon}>
            <MaterialIcons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications' as never)}
            style={styles.headerIcon}>
            <MaterialIcons name="notifications" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}
