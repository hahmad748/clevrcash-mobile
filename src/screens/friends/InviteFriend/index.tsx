import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';
import { useBrand } from '../../../contexts/BrandContext';

export function InviteFriendScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const {brand} = useBrand();

  const handleInvite = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.inviteFriendByEmail(email.trim());
      Alert.alert(
        'Success',
        `Invitation sent to ${email}. They will receive an email with instructions to join.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>Invite Friend</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Send an invitation to a friend by email. They'll receive instructions to join {brand?.display_name ?? 'ClevrCash'}.
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Email Address</Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
              ]}
              placeholder={`Enter email address to invite ${brand?.display_name ?? 'ClevrCash'}`}
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.primary}]}
            onPress={handleInvite}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Send Invitation</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
