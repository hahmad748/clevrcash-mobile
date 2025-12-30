import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import {getBrandConfig} from '../../config/brand';
import { showError } from '../../utils/flashMessage';

export default function RegisterScreen({navigation}: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const {register} = useAuth();
  const {colors} = useTheme();
  const brand = getBrandConfig();

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      showError('Error', 'Please fill in all fields');
      return;
    }

    if (password !== passwordConfirmation) {
      showError('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({name, email, password, password_confirmation: passwordConfirmation});
    } catch (error: any) {
      showError('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: brand.primaryColor}]}>
        Create Account
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.text,
          },
        ]}
        placeholder="Name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.text,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.text,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.text,
          },
        ]}
        placeholder="Confirm Password"
        placeholderTextColor={colors.textSecondary}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, {backgroundColor: brand.primaryColor}]}
        onPress={handleRegister}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.linkText, {color: colors.textSecondary}]}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    marginTop: 16,
    textAlign: 'center',
  },
});

