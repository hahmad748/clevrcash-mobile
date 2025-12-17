import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import {ScreenWrapper} from '../../../components/ScreenWrapper';
import type {Transaction} from '../../../types/api';
import {styles} from './styles';

export function TransactionsListScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.getTransactions({page: pageNum, per_page: 20});
      if (pageNum === 1) {
        setTransactions(response.data);
      } else {
        setTransactions(prev => [...prev, ...response.data]);
      }
      setHasMore(response.current_page < response.last_page);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await loadTransactions(1);
    setRefreshing(false);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTransactions(nextPage);
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    if (transaction.type === 'expense') {
      navigation.navigate('ExpenseDetail' as never, {
        expenseId: transaction.data.id.toString(),
      } as never);
    } else {
      // Navigate to payment detail if needed
    }
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) {
      return new Date().toLocaleDateString();
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleDateString();
      }
      return date.toLocaleDateString();
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  const formatAmount = (amount: number | undefined | null, currency: string = 'USD') => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return `${currency} 0.00`;
    }
    return `${currency} ${Number(amount).toFixed(2)}`;
  };

  const renderTransaction = ({item}: {item: Transaction}) => {
    const isExpense = item.type === 'expense';
    const data = item.data as any;

    return (
      <TouchableOpacity
        style={[styles.transactionCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
        onPress={() => handleTransactionPress(item)}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionIcon}>
            <Text style={styles.transactionIconText}>{isExpense ? '💰' : '💸'}</Text>
          </View>
          <View style={styles.transactionInfo}>
            <Text style={[styles.transactionDescription, {color: colors.text}]}>
              {isExpense
                ? data?.description || 'Expense'
                : `Payment to ${data?.toUser?.name || data?.to_user?.name || 'User'}`}
            </Text>
            <Text style={[styles.transactionDate, {color: colors.textSecondary}]}>
              {formatDate(item.date || item.created_at || new Date().toISOString())}
            </Text>
          </View>
          <Text style={[styles.transactionAmount, {color: colors.text}]}>
            {formatAmount(data?.amount, data?.currency || item.currency || 'USD')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && transactions.length === 0) {
    return (
      <ScreenWrapper>
        <View style={[styles.centerContent, {flex: 1}]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
              No transactions yet
            </Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}
