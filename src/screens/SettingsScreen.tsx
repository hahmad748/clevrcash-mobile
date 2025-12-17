import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function SettingsScreen() {
  const {logout, user} = useAuth();
  const {colors, theme} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: colors.text}]}>Settings</Text>
        <ThemeToggle />
      </View>
      {user && <Text style={[styles.userName, {color: colors.text}]}>{user.name}</Text>}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>Appearance</Text>
        <View style={[styles.option, {borderBottomColor: colors.border}]}>
          <Text style={[styles.optionLabel, {color: colors.text}]}>Theme</Text>
          <Text style={[styles.optionValue, {color: colors.textSecondary}]}>
            {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.logoutButton, {backgroundColor: '#f44336'}]}
        onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <Text style={[styles.footer, {color: colors.textSecondary}]}>
        Powered by devsfort
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  optionLabel: {
    fontSize: 16,
  },
  optionValue: {
    fontSize: 14,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: 12,
  },
});

