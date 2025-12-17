import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const {colors} = useTheme();

  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    switch (variant) {
      case 'primary':
        return [
          ...baseStyle,
          {backgroundColor: colors.primary},
          (disabled || loading) && {opacity: 0.5},
        ];
      case 'secondary':
        return [
          ...baseStyle,
          {backgroundColor: colors.secondary || colors.primary},
          (disabled || loading) && {opacity: 0.5},
        ];
      case 'outline':
        return [
          ...baseStyle,
          {backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary},
        ];
      case 'danger':
        return [
          ...baseStyle,
          {backgroundColor: colors.error},
          (disabled || loading) && {opacity: 0.5},
        ];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    if (variant === 'outline') {
      return [...baseStyle, {color: colors.primary}];
    }
    return [...baseStyle, {color: '#FFFFFF'}];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
