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
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';
import MaterialIcons from '@react-native-vector-icons/material-icons';

export function JoinGroupScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      showError('Error', 'Please enter an invite code');
      return;
    }

    setLoading(true);
    try {
      const group = await apiClient.joinGroupByCode(inviteCode.trim());
      Alert.alert('Success', 'You have joined the group!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('Groups' as never, {
              screen: 'GroupDetail',
              params: {groupId: group.hash || String(group.id)},
            } as never),
        },
      ]);
    } catch (error: any) {
      showError('Error', error.message || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>Join Group</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Enter the invite code to join a group
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Invite Code</Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
              ]}
              placeholder="Enter invite code"
              placeholderTextColor={colors.textSecondary}
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.primary}]}
            onPress={handleJoin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Join Group</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
