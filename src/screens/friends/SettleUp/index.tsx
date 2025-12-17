import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';

export function SettleUpFriendScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {user} = useAuth();
  const {friendId} = route.params as {friendId: number};
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(user?.default_currency || 'USD');
  const [method, setMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const methods = ['cash', 'bank_transfer', 'stripe', 'paypal', 'manual', 'other'];

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await apiClient.settleUpWithFriend(friendId, {
        amount: parseFloat(amount),
        currency,
        method,
        notes: notes.trim() || undefined,
      });
      Alert.alert('Success', 'Payment recorded successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>Settle Up</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Record a payment to settle the balance
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Amount *</Text>
            <TextInput
              style={[styles.input, {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border}]}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Currency</Text>
            <TextInput
              style={[styles.input, {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border}]}
              value={currency}
              onChangeText={setCurrency}
              maxLength={3}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Payment Method</Text>
            <View style={styles.methodContainer}>
              {methods.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.methodButton,
                    {
                      backgroundColor: method === m ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setMethod(m)}>
                  <Text
                    style={[
                      styles.methodButtonText,
                      {color: method === m ? '#FFFFFF' : colors.text},
                    ]}>
                    {m.charAt(0).toUpperCase() + m.slice(1).replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Notes</Text>
            <TextInput
              style={[
                styles.textArea,
                {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
              ]}
              placeholder="Add a note (optional)"
              placeholderTextColor={colors.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, {backgroundColor: colors.primary}]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Record Payment</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
