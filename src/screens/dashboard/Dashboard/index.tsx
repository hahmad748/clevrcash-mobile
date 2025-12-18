import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import type {DashboardSummary, Transaction} from '../../../types/api';
import {styles} from './styles';
import {ScreenWrapper} from '../../../components/ScreenWrapper';

export function DashboardScreen() {
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {user} = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;
  const defaultCurrency = user?.default_currency || 'USD';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryData, transactionsData] = await Promise.all([
        apiClient.getDashboardSummary(),
        apiClient.getTransactions({limit: 5}),
      ]);

      setSummary(summaryData);
      setTransactions(transactionsData.data || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  const formatCurrency = (amount: number, currency: string = defaultCurrency) => {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currency} ${Math.abs(amount).toFixed(2)}`;
  };

  // Get values directly from API response
  const youAreOwed = summary?.you_are_owed || 0;
  const youOwe = summary?.you_owe || 0;
  const highestOwedGroup = summary?.highest_owed_group;
  const highestOwedFriend = summary?.highest_owed_friend;
  const balancesByCurrency = summary?.balances_by_currency || [];

  if (loading && !summary) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <ScreenWrapper>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
          }
          showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={[styles.profileCard, {backgroundColor: cardBackground}]}>
            <View style={styles.profileHeader}>
              {user?.avatar ? (
                <Image source={{uri: user.avatar}} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, {backgroundColor: primaryColor}]}>
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, {color: textColor}]}>
                  {user?.name || 'User'}
                </Text>
                <Text style={[styles.profileEmail, {color: secondaryTextColor}]}>
                  {user?.email || ''}
                </Text>
                <View style={styles.followersRow}>
                  <Text style={[styles.followersText, {color: secondaryTextColor}]}>
                    {summary?.friends_count || 0} Friends
                  </Text>
                  <Text style={[styles.followersText, {color: secondaryTextColor}]}>
                    {summary?.groups_count || 0} Groups
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.addFriendButton, {backgroundColor: primaryColor}]}
                onPress={() => navigation.navigate('InviteFriend' as never)}>
                <Text style={styles.addFriendText}>+ Friends</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* You Are Owed / You Owe Row */}
          <View style={styles.owedRow}>
            <View style={[styles.owedCard, {backgroundColor: cardBackground}]}>
              <View style={styles.owedHeader}>
                <MaterialIcons name="arrow-downward" size={20} color="#4CAF50" />
                <Text style={[styles.owedLabel, {color: secondaryTextColor}]}>You Are Owed</Text>
              </View>
              <Text style={[styles.owedAmount, {color: '#4CAF50'}]}>
                {formatCurrency(youAreOwed, defaultCurrency)}
              </Text>
            </View>

            <View style={[styles.owedCard, {backgroundColor: cardBackground}]}>
              <View style={styles.owedHeader}>
                <MaterialIcons name="arrow-upward" size={20} color="#F44336" />
                <Text style={[styles.owedLabel, {color: secondaryTextColor}]}>You Owe</Text>
              </View>
              <Text style={[styles.owedAmount, {color: '#F44336'}]}>
                {formatCurrency(youOwe, defaultCurrency)}
              </Text>
            </View>
          </View>

          {/* Balances by Currency */}
          {balancesByCurrency.length > 0 && (
            <View style={[styles.sectionCard, {backgroundColor: cardBackground}]}>
              <Text style={[styles.sectionTitle, {color: textColor}]}>Balances by Currency</Text>
              <ScrollView style={styles.currencyGridView} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.currencyGrid} nestedScrollEnabled={true}>
                {balancesByCurrency.map(({currency, balance}) => {
                  const balanceNum = Number(balance) || 0;
                  const isPositive = balanceNum >= 0;
                  if(balanceNum === 0) return null;
                  return (
                    <View
                      key={currency}
                      style={[
                        styles.currencyItem,
                        {backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'},
                      ]}>
                      <Text style={[styles.currencyLabel, {color: secondaryTextColor}]}>
                        {currency}
                      </Text>
                      <Text
                        style={[
                          styles.currencyAmount,
                          {color: isPositive ? '#4CAF50' : '#F44336'},
                        ]}>
                        {balanceNum.toFixed(2)}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Highest Owed Group and Friend Row */}
          <View style={styles.topOwedRow}>
            <View style={[styles.topOwedCard, {backgroundColor: cardBackground}]}>
              <Text style={[styles.sectionTitle, {color: textColor}]}>Highest Owed Group</Text>
              {highestOwedGroup ? (
                <TouchableOpacity
                  style={styles.topOwedItem}
                  onPress={() => {
                    // Navigate to Groups tab, then to GroupDetail
                    navigation.navigate('Groups' as never, {
                      screen: 'GroupDetail',
                      params: {groupId: highestOwedGroup.group?.hash || String(highestOwedGroup.group?.id)},
                    } as never);
                  }}>
                  <View style={styles.topOwedContent}>
                    <View style={[styles.topOwedAvatar, {backgroundColor: primaryColor + '30'}]}>
                      <Text style={[styles.topOwedAvatarText, {color: primaryColor}]}>
                        {highestOwedGroup.group?.name?.charAt(0)?.toUpperCase() || 'G'}
                      </Text>
                    </View>
                    <View style={styles.topOwedInfo}>
                      <Text style={[styles.topOwedName, {color: textColor}]} numberOfLines={1}>
                        {highestOwedGroup.group?.name || 'Group'}
                      </Text>
                      <Text style={[styles.topOwedSubtext, {color: secondaryTextColor}]}>
                        {highestOwedGroup.group?.members?.length || 0} members
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.topOwedBalance, {color: '#4CAF50'}]}>
                    {formatCurrency(
                      highestOwedGroup.balance || 0,
                      highestOwedGroup.currency || defaultCurrency,
                    )}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.emptyText, {color: secondaryTextColor}]}>
                  No groups owe you
                </Text>
              )}
            </View>

            <View style={[styles.topOwedCard, {backgroundColor: cardBackground}]}>
              <Text style={[styles.sectionTitle, {color: textColor}]}>Highest Owed Friend</Text>
              {highestOwedFriend ? (
                <TouchableOpacity
                  style={styles.topOwedItem}
                  onPress={() => {
                    // Navigate to Friends tab, then to FriendDetail
                    navigation.navigate('Friends' as never, {
                      screen: 'FriendDetail',
                      params: {friendId: highestOwedFriend.friend?.id},
                    } as never);
                  }}>
                  <View style={styles.topOwedContent}>
                    <View style={[styles.topOwedAvatar, {backgroundColor: primaryColor + '30'}]}>
                      <Text style={[styles.topOwedAvatarText, {color: primaryColor}]}>
                        {highestOwedFriend.friend?.name?.charAt(0)?.toUpperCase() || 'F'}
                      </Text>
                    </View>
                    <View style={styles.topOwedInfo}>
                      <Text style={[styles.topOwedName, {color: textColor}]} numberOfLines={1}>
                        {highestOwedFriend.friend?.name || 'Friend'}
                      </Text>
                      <Text style={[styles.topOwedSubtext, {color: secondaryTextColor}]} numberOfLines={1}>
                        {highestOwedFriend.friend?.email || ''}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.topOwedBalance, {color: '#4CAF50'}]}>
                    {formatCurrency(
                      highestOwedFriend.balance || 0,
                      highestOwedFriend.currency || defaultCurrency,
                    )}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.emptyText, {color: secondaryTextColor}]}>
                  No friends owe you
                </Text>
              )}
            </View>
          </View>

          {/* Transaction History */}
          <View style={[styles.sectionCard, {backgroundColor: cardBackground}]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, {color: textColor}]}>Latest Transactions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Transactions' as never)}>
                <Text style={[styles.seeAllText, {color: primaryColor}]}>See all</Text>
              </TouchableOpacity>
            </View>
            {transactions.length > 0 ? (
              <View style={styles.transactionsList}>
                {transactions.slice(0, 5).map((transaction, index) => {
                  const isExpense = transaction.type === 'expense';
                  const data = transaction.data as any;
                  const description = isExpense ? data?.description : 'Payment settled';
                  const amount = data?.amount || 0;
                  const currency = data?.currency || defaultCurrency;
                  const group = isExpense ? data?.group : data?.group;
                  const date = transaction.date || data?.date || transaction.timestamp;

                  return (
                    <TouchableOpacity
                      key={transaction.id || index}
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
                              {group?.name || 'Friend'}
                            </Text>
                            <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>•</Text>
                            <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>
                              {date
                                ? new Date(date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : ''}
                            </Text>
                          </View>
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
        </ScrollView>

        {/* Floating Record Button */}
        <TouchableOpacity
          style={[styles.recordButton, {backgroundColor: primaryColor}]}
          onPress={() => {
            navigation.navigate('Expenses' as never, {
              screen: 'CreateExpense',
            } as never);
          }}>
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ScreenWrapper>
    </View>
  );
}
