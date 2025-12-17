import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const {theme, setTheme, isDark} = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return '🌓';
    }
    return isDark ? '☀️' : '🌙';
  };

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.button}>
      <Text style={styles.icon}>{getIcon()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    fontSize: 20,
  },
});

