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
import {useRoute, useNavigation, useFocusEffect} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import type {Group, Balance, Transaction} from '../../../types/api';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function GroupDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {user} = useAuth();
  const {groupId} = route.params as {groupId: string};
  const [group, setGroup] = useState<Group | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usersMap, setUsersMap] = useState<Record<number, any>>({});

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = colors.background;
  const cardBackground = colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.textSecondary;

  const loadGroupData = useCallback(async () => {
    try {
      setLoading(true);
      const [groupData, balancesData, transactionsData] = await Promise.all([
        apiClient.getGroup(groupId),
        apiClient.getGroupBalances(groupId),
        apiClient.getGroupTransactions(groupId, {limit: 10}),
      ]);

      setGroup(groupData);
      
      // API now returns: { user_balance: number, balances: [...] }
      // where balances are between current user and each member
      setUserBalance(balancesData.user_balance || 0);
      setBalances(balancesData.balances || []);

      // Set transactions
      const transactionsList = transactionsData.data || [];
      setTransactions(transactionsList);
      
      // Build users map from transactions for fallback lookup
      const users: Record<number, any> = {};
      transactionsList.forEach((t: any) => {
        const data = t.data;
        if (t.type === 'expense' && data?.payer) {
          if (data.payer.id) users[data.payer.id] = data.payer;
        } else if (t.type === 'payment') {
          if (data?.fromUser?.id) users[data.fromUser.id] = data.fromUser;
          if (data?.toUser?.id) users[data.toUser.id] = data.toUser;
          // Also check snake_case
          if (data?.from_user?.id) users[data.from_user.id] = data.from_user;
          if (data?.to_user?.id) users[data.to_user.id] = data.to_user;
        }
      });
      setUsersMap(users);
    } catch (error) {
      console.error('Failed to load group:', error);
      showError('Error', 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  }, [groupId, user?.id]);

  useEffect(() => {
    loadGroupData();
  }, [loadGroupData]);

  // Refresh stats when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadGroupData();
    }, [loadGroupData]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroupData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number, currency: string) => {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currency} ${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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

  const handleSettle = (memberId: number, memberName: string, balance: number) => {
    navigation.navigate('Groups' as never, {
      screen: 'SettleUpGroup',
      params: {
        groupId,
        friendId: memberId,
        amount: Math.abs(balance),
      },
    } as never);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor}]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor}]}>
        <Text style={[styles.errorText, {color: textColor}]}>Group not found</Text>
      </View>
    );
  }

  const groupCurrency = group.currency || 'USD';
  const isOwed = userBalance > 0;
  const isOwe = userBalance < 0;
  const isSettled = Math.abs(userBalance) < 0.01;

  // Filter out current user from balances
  const memberBalances = balances.filter((b: any) => b.user_id !== user?.id);

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />}
        showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.groupAvatar, {backgroundColor: primaryColor + '30'}]}>
                <Text style={[styles.groupAvatarText, {color: primaryColor}]}>
                  {group.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={[styles.groupName, {color: textColor}]}>{group.name}</Text>
                {group.description && (
                  <Text style={[styles.groupDescription, {color: secondaryTextColor}]}>
                    {group.description}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.addExpenseButton, {backgroundColor: primaryColor}]}
              onPress={() => {
                navigation.navigate('Expenses' as never, {
                  screen: 'CreateExpense',
                  params: {groupId: group.hash || groupId},
                } as never);
              }}>
              <MaterialIcons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addExpenseText}>Add Expense</Text>
            </TouchableOpacity>
          </View>

          {/* Two Column Layout */}
          <View style={styles.twoColumnLayout}>
            {/* Left Column - Main Content */}
            <View style={styles.leftColumn}>
              {/* Your Balance Card */}
              <View style={[styles.card, {backgroundColor: cardBackground}]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, {color: textColor}]}>Your Balance</Text>
                  <Text style={[styles.cardSubtitle, {color: secondaryTextColor}]}>{groupCurrency}</Text>
                </View>
                <Text
                  style={[
                    styles.balanceAmount,
                    {
                      color: isOwed ? '#4CAF50' : isOwe ? '#F44336' : textColor,
                    },
                  ]}>
                  {formatCurrency(userBalance, groupCurrency)}
                </Text>
                <Text style={[styles.balanceLabel, {color: secondaryTextColor}]}>
                  {isSettled ? 'All settled up' : isOwed ? 'You are owed' : 'You owe'}
                </Text>
              </View>

              {/* Balances Card */}
              <View style={[styles.card, {backgroundColor: cardBackground}]}>
                <Text style={[styles.cardTitle, {color: textColor}]}>Balances</Text>
                {memberBalances.length > 0 ? (
                  <View style={styles.balancesList}>
                    {memberBalances.map((balance: any) => {
                      const memberBalance = balance.balance || 0;
                      const isMemberOwed = memberBalance > 0;
                      const isMemberOwe = memberBalance < 0;
                      const isMemberSettled = Math.abs(memberBalance) < 0.01;

                      return (
                        <View key={`balance-${balance.user_id}-${balance.user?.id || 'unknown'}`} style={styles.balanceItem}>
                          <View style={styles.balanceItemLeft}>
                            <View style={[styles.memberAvatar, {backgroundColor: primaryColor + '30'}]}>
                              <Text style={[styles.memberAvatarText, {color: primaryColor}]}>
                                {balance.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </Text>
                            </View>
                            <Text style={[styles.memberName, {color: textColor}]}>
                              {balance.user?.name || 'User'}
                            </Text>
                          </View>
                          <View style={styles.balanceItemRight}>
                            <Text
                              style={[
                                styles.memberBalanceAmount,
                                {
                                  color: isMemberOwed ? '#4CAF50' : isMemberOwe ? '#F44336' : textColor,
                                },
                              ]}>
                              {formatCurrency(memberBalance, balance.currency || groupCurrency)}
                            </Text>
                            <Text style={[styles.memberBalanceLabel, {color: secondaryTextColor}]}>
                              {isMemberSettled
                                ? 'settled'
                                : isMemberOwed
                                ? 'owes you'
                                : 'you owe'}
                            </Text>
                            {!isMemberSettled && (
                              <TouchableOpacity
                                style={[styles.settleButton, {backgroundColor: primaryColor}]}
                                onPress={() =>
                                  handleSettle(balance.user_id, balance.user?.name || 'User', memberBalance)
                                }>
                                <Text style={styles.settleButtonText}>Settle</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <Text style={[styles.emptyText, {color: secondaryTextColor}]}>
                    No balances to display
                  </Text>
                )}
              </View>

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
                      const currency = data?.currency || groupCurrency;
                      const date = transaction.date || data?.date || transaction.timestamp;
                      
                      // For expenses: use payer, for payments: use fromUser and toUser
                      let payerName = 'Unknown';
                      let recipientName = 'Unknown';
                      
                      if (isExpense) {
                        payerName = data?.payer?.name || 'Unknown';
                      } else {
                        // Payment: fromUser and toUser should be loaded by API with relationships
                        // Laravel might serialize as snake_case in JSON, so check both
                        const fromUser = data?.fromUser || data?.from_user;
                        const toUser = data?.toUser || data?.to_user;
                        
                        // Try to get name from relationship object, then usersMap, then group members
                        if (fromUser?.name) {
                          payerName = fromUser.name;
                        } else if (data?.from_user_id && usersMap[data.from_user_id]?.name) {
                          payerName = usersMap[data.from_user_id].name;
                        } else if (data?.from_user_id && group?.members) {
                          const fromMember = group.members.find((m: any) => 
                            (m.user_id || m.user?.id || m.id) === data.from_user_id
                          );
                          payerName = fromMember?.user?.name || fromMember?.name || 'Unknown';
                        }
                        
                        if (toUser?.name) {
                          recipientName = toUser.name;
                        } else if (data?.to_user_id && usersMap[data.to_user_id]?.name) {
                          recipientName = usersMap[data.to_user_id].name;
                        } else if (data?.to_user_id && group?.members) {
                          const toMember = group.members.find((m: any) => 
                            (m.user_id || m.user?.id || m.id) === data.to_user_id
                          );
                          recipientName = toMember?.user?.name || toMember?.name || 'Unknown';
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
                            if (isExpense && data?.id) {
                              navigation.navigate('ExpenseDetail' as never, {expenseId: data.id} as never);
                            }
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
                                  {formatCurrency(amount, currency)}
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
            </View>

            {/* Right Column - Sidebar */}
            <View style={styles.rightColumn}>
              {/* Members Card */}
              <View style={[styles.card, {backgroundColor: cardBackground}]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, {color: textColor}]}>Members</Text>
                  <Text style={[styles.cardSubtitle, {color: secondaryTextColor}]}>
                    {group.members?.length || 0}
                  </Text>
                </View>
                {group.members && group.members.length > 0 ? (
                  <View style={styles.membersList}>
                    {group.members.map((member: any, index: number) => (
                      <View key={`member-${member.id || member.user_id || index}-${member.user?.id || 'unknown'}`} style={styles.memberItem}>
                        <View style={[styles.memberAvatar, {backgroundColor: primaryColor + '30'}]}>
                          <Text style={[styles.memberAvatarText, {color: primaryColor}]}>
                            {member.user?.name?.charAt(0)?.toUpperCase() ||
                              member.name?.charAt(0)?.toUpperCase() ||
                              'U'}
                          </Text>
                        </View>
                        <View style={styles.memberInfo}>
                          <Text style={[styles.memberName, {color: textColor}]}>
                            {member.user?.name || member.name || 'User'}
                          </Text>
                          <Text style={[styles.memberRole, {color: secondaryTextColor}]}>
                            {member.role === 'owner' ? 'Owner' : member.role === 'admin' ? 'Admin' : 'Member'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={[styles.emptyText, {color: secondaryTextColor}]}>No members</Text>
                )}
              </View>

              {/* Group Info Card */}
              <View style={[styles.card, {backgroundColor: cardBackground}]}>
                <Text style={[styles.cardTitle, {color: textColor}]}>Group Info</Text>
                <View style={styles.infoList}>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, {color: secondaryTextColor}]}>Currency:</Text>
                    <Text style={[styles.infoValue, {color: textColor}]}>{groupCurrency}</Text>
                  </View>
                  {group.created_at && (
                    <View style={styles.infoItem}>
                      <Text style={[styles.infoLabel, {color: secondaryTextColor}]}>Created:</Text>
                      <Text style={[styles.infoValue, {color: textColor}]}>
                        {formatDate(group.created_at)}
                      </Text>
                    </View>
                  )}
                  {group.creator && (
                    <View style={styles.infoItem}>
                      <Text style={[styles.infoLabel, {color: secondaryTextColor}]}>Created by:</Text>
                      <Text style={[styles.infoValue, {color: textColor}]}>
                        {group.creator.name || 'Unknown'}
                      </Text>
                    </View>
                  )}
                  {group.invite_code && (
                    <View style={styles.infoItem}>
                      <Text style={[styles.infoLabel, {color: secondaryTextColor}]}>Invite Code:</Text>
                      <Text style={[styles.infoValue, {color: textColor}]}>{group.invite_code}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Actions Card */}
              <View style={[styles.card, {backgroundColor: cardBackground}]}>
                <Text style={[styles.cardTitle, {color: textColor}]}>Actions</Text>
                <View style={styles.actionsList}>
                  <TouchableOpacity
                    style={[styles.actionButton, {backgroundColor: primaryColor}]}
                    onPress={() => navigation.navigate('InviteMember' as never, {groupId} as never)}>
                    <Text style={styles.actionButtonText}>Invite to Group</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary, {backgroundColor: cardBackground, borderColor: primaryColor}]}
                    onPress={async () => {
                      try {
                        await apiClient.remindGroup(groupId);
                        showSuccess('Success', 'Reminder sent to all group members');
                      } catch (error: any) {
                        showError('Error', error.message || 'Failed to send reminder');
                      }
                    }}>
                    <MaterialIcons name="notifications" size={18} color={primaryColor} />
                    <Text style={[styles.actionButtonTextSecondary, {color: primaryColor}]}>
                      Remind Members
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary, {backgroundColor: cardBackground, borderColor: primaryColor}]}
                    onPress={() => navigation.navigate('EditGroup' as never, {groupId} as never)}>
                    <Text style={[styles.actionButtonTextSecondary, {color: primaryColor}]}>
                      Edit Group
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
      </ScrollView>
    </View>
  );
}
