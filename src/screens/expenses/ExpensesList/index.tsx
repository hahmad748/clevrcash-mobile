import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import type {Expense} from '../../../types/api';
import {styles} from './styles';

export function ExpensesListScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchExpenses();
    } else {
      loadExpenses();
    }
  }, [searchQuery]);

  const loadExpenses = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.getExpenses({
        page: pageNum,
        per_page: 20,
        search: searchQuery.trim() || undefined,
      });
      if (pageNum === 1) {
        setExpenses(response.data);
      } else {
        setExpenses(prev => [...prev, ...response.data]);
      }
      setHasMore(response.current_page < response.last_page);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchExpenses = async () => {
    try {
      const response = await apiClient.getExpenses({
        page: 1,
        per_page: 20,
        search: searchQuery.trim(),
      });
      setExpenses(response.data);
      setHasMore(response.current_page < response.last_page);
    } catch (error) {
      console.error('Failed to search expenses:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await loadExpenses(1);
    setRefreshing(false);
  }, [searchQuery]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadExpenses(nextPage);
    }
  };

  const handleExpensePress = (expense: Expense) => {
    navigation.navigate('ExpenseDetail' as never, {
      expenseId: expense.blockchain_hash || expense.id.toString(),
    } as never);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderExpense = ({item}: {item: Expense}) => (
    <TouchableOpacity
      style={[styles.expenseCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
      onPress={() => handleExpensePress(item)}>
      <View style={styles.expenseHeader}>
        <Text style={[styles.expenseDescription, {color: colors.text}]} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[styles.expenseAmount, {color: colors.text}]}>
          {formatCurrency(item.amount, item.currency)}
        </Text>
      </View>
      <View style={styles.expenseFooter}>
        <Text style={[styles.expenseDate, {color: colors.textSecondary}]}>
          {formatDate(item.date)}
        </Text>
        <Text style={[styles.expensePayer, {color: colors.textSecondary}]}>
          Paid by {item.payer?.name || 'Unknown'}
        </Text>
      </View>
      {item.group && (
        <Text style={[styles.expenseGroup, {color: colors.primary}]}>
          {item.group.name}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading && expenses.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.searchContainer, {backgroundColor: colors.surface}]}>
        <TextInput
          style={[styles.searchInput, {color: colors.text, borderColor: colors.border}]}
          placeholder="Search expenses..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
              {searchQuery.trim() ? 'No expenses found' : 'No expenses yet'}
            </Text>
            {!searchQuery.trim() && (
              <TouchableOpacity
                style={[styles.createButton, {backgroundColor: colors.primary}]}
                onPress={() => {
                  navigation.navigate('Expenses' as never, {
                    screen: 'CreateExpense',
                  } as never);
                }}>
                <Text style={styles.createButtonText}>Create Expense</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
      <TouchableOpacity
        style={[styles.fab, {backgroundColor: colors.primary}]}
        onPress={() => {
          navigation.navigate('Expenses' as never, {
            screen: 'CreateExpense',
          } as never);
        }}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
