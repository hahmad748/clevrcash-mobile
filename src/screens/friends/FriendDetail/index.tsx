import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import {ManageRelationshipModal} from '../../../components/modals/ManageRelationshipModal';
import type {User, FriendBalance, Transaction, Group} from '../../../types/api';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function FriendDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {user} = useAuth();
  const {friendId} = route.params as {friendId: number};
  const [friend, setFriend] = useState<User | null>(null);
  const [balance, setBalance] = useState<FriendBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sharedGroups, setSharedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = colors.background;
  const cardBackground = colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.textSecondary;
  const defaultCurrency = user?.default_currency || 'USD';

  useEffect(() => {
    loadFriendData();
  }, [friendId]);

  const loadFriendData = async () => {
    try {
      setLoading(true);
      const [balanceData, transactionsData, sharedGroupsData] = await Promise.all([
        apiClient.getFriendBalance(friendId),
        apiClient.getFriendTransactions(friendId, {per_page: 10}),
        apiClient.getSharedGroups(friendId),
      ]);
      setFriend(balanceData.friend);
      setBalance(balanceData);
      setTransactions(transactionsData.data || []);
      setSharedGroups(sharedGroupsData);
    } catch (error) {
      console.error('Failed to load friend data:', error);
      showError('Error', 'Failed to load friend details');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFriendData();
    setRefreshing(false);
  }, [friendId]);

  const formatCurrency = (amount: number, currency: string = defaultCurrency) => {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currency} ${Math.abs(amount).toFixed(2)}`;
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleSettleUp = () => {
    navigation.navigate('SettleUpFriend' as never, {friendId} as never);
  };

  const handleRemind = async () => {
    try {
      await apiClient.remindFriend(friendId);
      showSuccess('Success', 'Reminder sent successfully');
    } catch (error: any) {
      showError('Error', error.message || 'Failed to send reminder');
    }
  };

  const handleRemove = () => {
    navigation.goBack();
  };

  const handleBlock = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor}]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (!friend || !balance) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor}]}>
        <Text style={[styles.errorText, {color: textColor}]}>Friend not found</Text>
      </View>
    );
  }

  const balanceValue = balance.balance || 0;
  const convertedBalance = balance.converted_balance ?? balanceValue;
  const convertedCurrency = balance.converted_currency || defaultCurrency;
  const balancesByCurrency = balance.balances_by_currency || [];
  const isOwed = convertedBalance > 0;
  const isOwe = convertedBalance < 0;
  const isSettled = Math.abs(convertedBalance) < 0.01;

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />}
        showsVerticalScrollIndicator={false}>
          {/* Header - Profile Card */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.friendAvatar, {backgroundColor: primaryColor + '30'}]}>
                <Text style={[styles.friendAvatarText, {color: primaryColor}]}>
                  {friend.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={[styles.friendName, {color: textColor}]}>{friend.name}</Text>
                <Text style={[styles.friendEmail, {color: secondaryTextColor}]}>{friend.email}</Text>
              </View>
            </View>
          </View>

          {/* Your Balance Card */}
          <View style={[styles.card, {backgroundColor: cardBackground}]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, {color: textColor}]}>Your Balance</Text>
              <Text style={[styles.cardSubtitle, {color: secondaryTextColor}]}>
                {convertedCurrency}
              </Text>
            </View>
            <Text
              style={[
                styles.balanceAmount,
                {
                  color: isOwed ? '#4CAF50' : isOwe ? '#F44336' : textColor,
                },
              ]}>
              {formatCurrency(convertedBalance, convertedCurrency)}
            </Text>
            <Text style={[styles.balanceLabel, {color: secondaryTextColor}]}>
              {isSettled ? 'All settled up' : isOwed ? 'You are owed' : 'You owe'}
            </Text>
            {!isSettled && (
              <TouchableOpacity
                style={[styles.settleButton, {backgroundColor: primaryColor}]}
                onPress={handleSettleUp}>
                <Text style={styles.settleButtonText}>Settle Up</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Balances by Currency Card */}
          {balancesByCurrency.length > 0 && (
            <View style={[styles.card, {backgroundColor: cardBackground}]}>
              <Text style={[styles.cardTitle, {color: textColor}]}>Balances by Currency</Text>
              <View style={styles.currencyBalancesList}>
                {balancesByCurrency.map((item, index) => {
                  const currencyBalance = item.balance || 0;
                  const isCurrencyOwed = currencyBalance > 0;
                  const isCurrencyOwe = currencyBalance < 0;
                  return (
                    <View
                      key={`currency-${item.currency}-${index}`}
                      style={[
                        styles.currencyBalanceItem,
                        index < balancesByCurrency.length - 1 && styles.currencyBalanceItemBorder,
                      ]}>
                      <Text style={[styles.currencyLabel, {color: textColor}]}>
                        {item.currency}
                      </Text>
                      <Text
                        style={[
                          styles.currencyAmount,
                          {
                            color: isCurrencyOwed
                              ? '#4CAF50'
                              : isCurrencyOwe
                              ? '#F44336'
                              : textColor,
                          },
                        ]}>
                        {formatCurrency(currencyBalance, item.currency)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Transaction History Card */}
          <View style={[styles.card, {backgroundColor: cardBackground}]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, {color: textColor}]}>Transaction History</Text>
              <Text style={[styles.cardSubtitle, {color: secondaryTextColor}]}>
                {transactions.length} total
              </Text>
            </View>
            {transactions.length > 0 ? (
              <View style={styles.transactionsList}>
                {transactions.map((transaction, index) => {
                  const isExpense = transaction.type === 'expense';
                  const data = transaction.data as any;
                  const description = isExpense ? data?.description : 'Payment settled';
                  const amount = data?.amount || 0;
                  const transactionCurrency = data?.currency || defaultCurrency;
                  const date = transaction.date || data?.date || transaction.timestamp;

                  // For expenses: use payer, for payments: use fromUser and toUser
                  let payerName = 'Unknown';
                  let recipientName = 'Unknown';

                  if (isExpense) {
                    payerName = data?.payer?.name || friend.name || 'Unknown';
                  } else {
                    // Payment: fromUser and toUser
                    const fromUser = data?.fromUser || data?.from_user;
                    const toUser = data?.toUser || data?.to_user;

                    if (fromUser?.name) {
                      payerName = fromUser.name;
                    } else if (data?.from_user_id === user?.id) {
                      payerName = user?.name || 'You';
                    } else if (data?.from_user_id === friendId) {
                      payerName = friend.name;
                    }

                    if (toUser?.name) {
                      recipientName = toUser.name;
                    } else if (data?.to_user_id === user?.id) {
                      recipientName = user?.name || 'You';
                    } else if (data?.to_user_id === friendId) {
                      recipientName = friend.name;
                    }
                  }

                  const method = !isExpense ? data?.method : null;

                  return (
                    <TouchableOpacity
                      key={`transaction-${transaction.type}-${transaction.id || data?.id || index}-${index}`}
                      style={[
                        styles.transactionItem,
                        index < transactions.length - 1 && styles.transactionItemBorder,
                      ]}
                      onPress={() => {
                        navigation.navigate('TransactionDetail' as never, {transaction} as never);
                      }}>
                      <View style={styles.transactionContent}>
                        <View
                          style={[
                            styles.transactionIcon,
                            {backgroundColor: isExpense ? primaryColor + '30' : '#4CAF50' + '30'},
                          ]}>
                          <MaterialIcons
                            name={isExpense ? 'receipt' : 'check-circle'}
                            size={20}
                            color={isExpense ? primaryColor : '#4CAF50'}
                          />
                        </View>
                        <View style={styles.transactionInfo}>
                          <View style={styles.transactionTitleRow}>
                            <Text style={[styles.transactionDescription, {color: textColor}]} numberOfLines={1}>
                              {description || 'Transaction'}
                            </Text>
                            <Text style={[styles.transactionAmount, {color: textColor}]}>
                              {formatCurrency(amount, transactionCurrency)}
                            </Text>
                          </View>
                          <View style={styles.transactionMeta}>
                            <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>
                              {isExpense
                                ? `Paid by ${payerName || 'Unknown'}`
                                : `${payerName || 'Unknown'} → ${recipientName || 'Unknown'}`}
                            </Text>
                            <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>•</Text>
                            <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>
                              {formatDateTime(date)}
                            </Text>
                          </View>
                          {!isExpense && method && (
                            <Text style={[styles.transactionMethod, {color: secondaryTextColor}]}>
                              {method.charAt(0).toUpperCase() + method.slice(1).replace('_', ' ')}
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <Text style={[styles.emptyText, {color: secondaryTextColor}]}>
                No recent transactions
              </Text>
            )}
          </View>

          {/* Shared Groups Card */}
          {sharedGroups.length > 0 && (
            <View style={[styles.card, {backgroundColor: cardBackground}]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, {color: textColor}]}>Shared Groups</Text>
                <Text style={[styles.cardSubtitle, {color: secondaryTextColor}]}>
                  {sharedGroups.length}
                </Text>
              </View>
              <View style={styles.groupsList}>
                {sharedGroups.map((group, index) => (
                  <TouchableOpacity
                    key={`group-${group.id}-${index}`}
                    style={[
                      styles.groupItem,
                      index < sharedGroups.length - 1 && styles.groupItemBorder,
                    ]}
                    onPress={() => {
                      navigation.navigate('Groups' as never, {
                        screen: 'GroupDetail',
                        params: {groupId: group.hash || String(group.id)},
                      } as never);
                    }}>
                    <View style={[styles.groupAvatar, {backgroundColor: primaryColor + '30'}]}>
                      <Text style={[styles.groupAvatarText, {color: primaryColor}]}>
                        {group.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.groupInfo}>
                      <Text style={[styles.groupName, {color: textColor}]}>{group.name}</Text>
                      {group.description && (
                        <Text style={[styles.groupDescription, {color: secondaryTextColor}]} numberOfLines={1}>
                          {group.description}
                        </Text>
                      )}
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={secondaryTextColor} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Actions Card */}
          <View style={[styles.card, {backgroundColor: cardBackground}]}>
            <Text style={[styles.cardTitle, {color: textColor}]}>Actions</Text>
            <View style={styles.actionsList}>
              <TouchableOpacity
                style={[styles.actionButton, {backgroundColor: primaryColor}]}
                onPress={handleSettleUp}>
                <Text style={styles.actionButtonText}>Settle Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.actionButtonSecondary,
                  {backgroundColor: cardBackground, borderColor: primaryColor},
                ]}
                onPress={handleRemind}>
                <MaterialIcons name="notifications" size={18} color={primaryColor} />
                <Text style={[styles.actionButtonTextSecondary, {color: primaryColor}]}>
                  Send Reminder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.actionButtonSecondary,
                  {backgroundColor: cardBackground, borderColor: primaryColor},
                ]}
                onPress={() => setShowManageModal(true)}>
                <MaterialIcons name="settings" size={18} color={primaryColor} />
                <Text style={[styles.actionButtonTextSecondary, {color: primaryColor}]}>
                  Manage Relationship
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Floating Add Expense Button */}
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={[styles.fab, {backgroundColor: primaryColor}]}
            onPress={() => {
              navigation.navigate('Expenses' as never, {
                screen: 'CreateExpense',
                params: {friendId},
              } as never);
            }}>
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Manage Relationship Modal */}
        <ManageRelationshipModal
          visible={showManageModal}
          friendName={friend.name}
          friendId={friendId}
          onClose={() => setShowManageModal(false)}
          onRemove={handleRemove}
          onBlock={handleBlock}
        />
    </View>
  );
}
