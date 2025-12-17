import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import type {User, FriendBalance, Transaction} from '../../../types/api';
import {styles} from './styles';

export function FriendDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {friendId} = route.params as {friendId: number};
  const [friend, setFriend] = useState<User | null>(null);
  const [balance, setBalance] = useState<FriendBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  useEffect(() => {
    loadFriendData();
  }, [friendId]);

  const loadFriendData = async () => {
    try {
      setLoading(true);
      const [balanceData, transactionsData] = await Promise.all([
        apiClient.getFriendBalance(friendId),
        apiClient.getFriendTransactions(friendId, {per_page: 20}),
      ]);
      setFriend(balanceData.friend);
      setBalance(balanceData);
      setTransactions(transactionsData.data || []);
    } catch (error) {
      console.error('Failed to load friend data:', error);
      Alert.alert('Error', 'Failed to load friend details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return `${currency} ${Math.abs(amount).toFixed(2)}`;
  };

  const handleSettleUp = () => {
    navigation.navigate('SettleUpFriend' as never, {friendId} as never);
  };

  const handleRemind = async () => {
    try {
      await apiClient.remindFriend(friendId);
      Alert.alert('Success', 'Reminder sent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to send reminder');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!friend || !balance) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <Text style={[styles.errorText, {color: colors.text}]}>Friend not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {backgroundColor: colors.surface}]}>
        <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
          <Text style={styles.avatarText}>{friend.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={[styles.friendName, {color: colors.text}]}>{friend.name}</Text>
        <Text style={[styles.friendEmail, {color: colors.textSecondary}]}>{friend.email}</Text>
      </View>

      {/* Balance Card */}
      <View style={[styles.balanceCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
        <Text style={[styles.balanceLabel, {color: colors.textSecondary}]}>Balance</Text>
        <Text
          style={[
            styles.balanceAmount,
            {
              color:
                balance.balance > 0
                  ? colors.success
                  : balance.balance < 0
                  ? colors.error
                  : colors.text,
            },
          ]}>
          {formatCurrency(balance.balance)}
        </Text>
        <Text style={[styles.balanceSubtext, {color: colors.textSecondary}]}>
          {balance.balance > 0
            ? 'You are owed'
            : balance.balance < 0
            ? 'You owe'
            : 'Settled up'}
        </Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, {backgroundColor: colors.surface, borderBottomColor: colors.border}]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'overview' && {borderBottomColor: colors.primary, borderBottomWidth: 2},
          ]}
          onPress={() => setActiveTab('overview')}>
          <Text
            style={[
              styles.tabText,
              {color: activeTab === 'overview' ? colors.primary : colors.textSecondary},
            ]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'transactions' && {borderBottomColor: colors.primary, borderBottomWidth: 2},
          ]}
          onPress={() => setActiveTab('transactions')}>
          <Text
            style={[
              styles.tabText,
              {color: activeTab === 'transactions' ? colors.primary : colors.textSecondary},
            ]}>
            Transactions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'overview' && (
          <View>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Friend Info</Text>
            <View style={[styles.infoCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>Email</Text>
              <Text style={[styles.infoValue, {color: colors.text}]}>{friend.email}</Text>
            </View>
          </View>
        )}

        {activeTab === 'transactions' && (
          <View>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Recent Transactions</Text>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => {
                const data = transaction.data as any;
                return (
                  <View
                    key={index}
                    style={[styles.transactionCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
                    <Text style={[styles.transactionDescription, {color: colors.text}]}>
                      {transaction.type === 'expense' ? data.description : `Payment`}
                    </Text>
                    <Text style={[styles.transactionAmount, {color: colors.text}]}>
                      {formatCurrency(data.amount, data.currency)}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
                No transactions yet
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actions, {backgroundColor: colors.surface, borderTopColor: colors.border}]}>
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: colors.secondary || colors.primary}]}
          onPress={handleRemind}>
          <Text style={styles.actionButtonText}>Remind</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: colors.primary}]}
          onPress={handleSettleUp}>
          <Text style={styles.actionButtonText}>Settle Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
