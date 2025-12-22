import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {styles} from './styles';

type ThemeMode = 'light' | 'dark' | 'system';

export function DisplaySettingsScreen() {
  const {colors, isDark, theme, setTheme} = useTheme();
  const {brand} = useBrand();
  const [applying, setApplying] = useState(false);
  const [applyingTheme, setApplyingTheme] = useState<ThemeMode | null>(null);

  const primaryColor = brand?.primary_color || colors.primary;

  const themeOptions: {value: ThemeMode; label: string; icon: string}[] = [
    {value: 'light', label: 'Light Mode', icon: 'light-mode'},
    {value: 'dark', label: 'Dark Mode', icon: 'dark-mode'},
    {value: 'system', label: 'System Default', icon: 'brightness-auto'},
  ];

  const handleThemeChange = async (newTheme: ThemeMode) => {
    // Don't do anything if already applying or if it's the same theme
    if (applying || theme === newTheme) {
      return;
    }

    setApplying(true);
    setApplyingTheme(newTheme);
    
    try {
      // Apply the theme
      await setTheme(newTheme);
      
      // Small delay to ensure theme is applied and UI updates
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Failed to change theme:', error);
    } finally {
      setApplying(false);
      setApplyingTheme(null);
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, {backgroundColor: isDark ? colors.background : '#F5F5F5'}]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      
      <View style={[styles.settingsCard, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
        {themeOptions.map((option, index) => {
          const isSelected = theme === option.value;
          const isApplying = applying && applyingTheme === option.value;
          const isDisabled = applying && !isApplying;
          
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                index < themeOptions.length - 1 && styles.optionItemBorder,
                {borderBottomColor: isDark ? colors.border : '#F0F0F0'},
                isDisabled && styles.optionItemDisabled,
              ]}
              onPress={() => handleThemeChange(option.value)}
              disabled={isDisabled}>
              <View style={styles.optionLeft}>
                {isApplying ? (
                  <ActivityIndicator size="small" color={primaryColor} style={styles.loaderIcon} />
                ) : (
                  <MaterialIcons 
                    name={option.icon as any} 
                    size={22} 
                    color={isSelected ? primaryColor : (isDark ? colors.textSecondary : '#666666')} 
                  />
                )}
                <Text style={[
                  styles.optionLabel,
                  {color: isSelected ? primaryColor : (isDark ? colors.text : '#1A1A1A')},
                  isDisabled && {opacity: 0.5},
                ]}>
                  {option.label}
                </Text>
              </View>
              {isSelected && !isApplying && (
                <MaterialIcons name="check" size={24} color={primaryColor} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.infoCard, {backgroundColor: isDark ? colors.surface : '#FFFFFF'}]}>
        <MaterialIcons name="info-outline" size={20} color={colors.primary} />
        <Text style={[styles.infoText, {color: isDark ? colors.textSecondary : '#666666'}]}>
          System Default will automatically match your device's theme settings.
        </Text>
      </View>

    </ScrollView>
  
  );
}
