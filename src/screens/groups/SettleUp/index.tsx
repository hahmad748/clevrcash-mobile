import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import type {Group, Balance} from '../../../types/api';
import {styles} from './styles';

export function SettleUpGroupScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {user} = useAuth();
  const {groupId} = route.params as {groupId: string};
  const [group, setGroup] = useState<Group | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState<number | null>(null);
  const [selectedTo, setSelectedTo] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [method, setMethod] = useState('cash');

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      setLoading(true);
      const [groupData, balancesData] = await Promise.all([
        apiClient.getGroup(groupId),
        apiClient.getGroupBalances(groupId),
      ]);
      setGroup(groupData);
      setBalances(balancesData.balances || []);
      setCurrency(groupData.currency);
    } catch (error) {
      console.error('Failed to load group data:', error);
      Alert.alert('Error', 'Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async () => {
    if (!selectedFrom || !selectedTo || !amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please select users and enter a valid amount');
      return;
    }

    setSettling(true);
    try {
      await apiClient.settleUpInGroup(groupId, {
        amount: parseFloat(amount),
        currency,
        method,
        from_user_id: selectedFrom,
        to_user_id: selectedTo,
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
      setSettling(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${Math.abs(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const methods = ['cash', 'bank_transfer', 'stripe', 'paypal', 'manual', 'other'];
  const usersWithBalances = balances.filter(b => b.balance !== 0);

  return (
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>Settle Up</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Record a payment to settle balances in this group
        </Text>

        <View style={styles.form}>
          {/* From User */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>From *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userScroll}>
              {usersWithBalances.map(balance => (
                <TouchableOpacity
                  key={balance.user_id}
                  style={[
                    styles.userButton,
                    {
                      backgroundColor:
                        selectedFrom === balance.user_id ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setSelectedFrom(balance.user_id)}>
                  <Text
                    style={[
                      styles.userButtonText,
                      {
                        color: selectedFrom === balance.user_id ? '#FFFFFF' : colors.text,
                      },
                    ]}>
                    {balance.user?.name || 'Unknown'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* To User */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>To *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userScroll}>
              {usersWithBalances.map(balance => (
                <TouchableOpacity
                  key={balance.user_id}
                  style={[
                    styles.userButton,
                    {
                      backgroundColor:
                        selectedTo === balance.user_id ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setSelectedTo(balance.user_id)}>
                  <Text
                    style={[
                      styles.userButtonText,
                      {
                        color: selectedTo === balance.user_id ? '#FFFFFF' : colors.text,
                      },
                    ]}>
                    {balance.user?.name || 'Unknown'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Amount */}
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

          {/* Currency */}
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

          {/* Payment Method */}
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

          <TouchableOpacity
            style={[styles.submitButton, {backgroundColor: colors.primary}]}
            onPress={handleSettle}
            disabled={settling}>
            {settling ? (
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
