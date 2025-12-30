import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {Swipeable} from 'react-native-gesture-handler';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import {ScreenWrapper} from '../../../components/ScreenWrapper';
import {TransactionFiltersModal} from '../../../components/modals/TransactionFiltersModal';
import type {Transaction, TransactionFilters} from '../../../types/api';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function TransactionsListScreen() {
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {user} = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isLoadingRef = useRef(false);

  const primaryColor = brand?.primary_color || colors.primary;
  const defaultCurrency = user?.default_currency || 'USD';
  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';
  const searchBackground = isDark ? '#1A1F3A' : '#FFFFFF';

  // Combined effect for filters and search query
  useEffect(() => {
    // Skip initial load if already loaded
    if (isInitialLoad) {
      setIsInitialLoad(false);
      loadTransactions(1);
      return;
    }

    // Debounce search query
    if (searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        loadTransactions(1);
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      // Reset to page 1 when filters change or search is cleared
      loadTransactions(1);
    }
  }, [filters, searchQuery]);

  const loadTransactions = async (pageNum = 1) => {
    // Prevent loading if already loading (for page 1)
    if (pageNum === 1 && isLoadingRef.current) {
      return;
    }

    // Prevent loading more if already loading more
    if (pageNum > 1 && loadingMore) {
      return;
    }

    try {
      if (pageNum === 1) {
        isLoadingRef.current = true;
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const filtersWithSearch: TransactionFilters = {
        ...filters,
        page: pageNum,
        per_page: 20,
      };
      if (searchQuery.trim()) {
        filtersWithSearch.search = searchQuery.trim();
      }
      const response = await apiClient.getTransactions(filtersWithSearch);
      if (pageNum === 1) {
        setTransactions(response.data || []);
      } else {
        setTransactions(prev => [...prev, ...(response.data || [])]);
      }
      setHasMore(response.current_page < response.last_page);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      // On error, set empty array to show empty state
      if (pageNum === 1) {
        setTransactions([]);
        setHasMore(false);
      }
    } finally {
      if (pageNum === 1) {
        isLoadingRef.current = false;
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await loadTransactions(1);
    setRefreshing(false);
  }, [filters, searchQuery]);

  const loadMore = () => {
    // Only load more if we have more pages, not loading (initial or more), and have transactions
    if (!loading && !loadingMore && hasMore && transactions.length > 0) {
      const nextPage = page + 1;
      loadTransactions(nextPage);
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate('TransactionDetail' as never, {transaction} as never);
  };

  const handleDelete = async (transaction: Transaction) => {
    if (transaction.type === 'expense') {
      const expense = transaction.data as any;
      Alert.alert(
        'Delete Expense',
        'Are you sure you want to delete this expense? This action cannot be undone.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await apiClient.deleteExpense(String(expense.id));
                setTransactions(prev => prev.filter(t => t.id !== transaction.id));
                showSuccess('Success', 'Expense deleted successfully');
              } catch (error: any) {
                showError('Error', error.message || 'Failed to delete expense');
              }
            },
          },
        ],
      );
    }
  };

  const formatCurrency = (amount: number, currency: string = defaultCurrency) => {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currency} ${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getSplitTypeLabel = (splitType: string) => {
    const labels: Record<string, string> = {
      equal: 'Equal',
      exact: 'Exact',
      percentage: 'Percentage',
      shares: 'Shares',
      adjustment: 'Adjustment',
      reimbursement: 'Reimbursement',
      itemized: 'Itemized',
    };
    return labels[splitType] || splitType;
  };

  const renderRightActions = (transaction: Transaction) => {
    if (transaction.type !== 'expense') return null;
    return (
      <TouchableOpacity
        style={[styles.deleteAction, {backgroundColor: '#F44336'}]}
        onPress={() => handleDelete(transaction)}>
        <MaterialIcons name="delete" size={24} color="#FFFFFF" />
        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderTransaction = ({item}: {item: Transaction}) => {
    const isExpense = item.type === 'expense';
    const data = item.data as any;
    // Get payment user names with fallback
    const getPaymentDescription = () => {
      if (isExpense) return data?.description || 'Expense';
      const fromName = data?.fromUser?.name || data?.from_user?.name || 'Unknown';
      const toName = data?.toUser?.name || data?.to_user?.name || 'Unknown';
      return `Payment: ${fromName} → ${toName}`;
    };
    const description = getPaymentDescription();
    const amount = data?.amount || 0;
    const currency = data?.currency || defaultCurrency;
    const category = isExpense ? data?.category?.name : null;
    const splitType = isExpense ? data?.split_type : null;
    const payerName = isExpense ? data?.payer?.name || data?.creator?.name : null;
    const groupName = isExpense ? data?.group?.name : data?.group?.name;
    const friendName = !groupName && isExpense ? null : !groupName && !isExpense ? (data?.fromUser?.name || data?.toUser?.name) : null;

    // Calculate user's share for expenses
    let userShare = null;
    if (isExpense && data?.splits) {
      const userSplit = data.splits.find((s: any) => s.user_id === user?.id);
      if (userSplit) {
        userShare = formatCurrency(userSplit.amount || 0, currency);
      }
    }

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <TouchableOpacity
          style={[styles.transactionCard, {backgroundColor: cardBackground}]}
          onPress={() => handleTransactionPress(item)}>
          <View style={styles.transactionContent}>
            <View style={styles.transactionLeft}>
              <View style={[styles.transactionIcon, {backgroundColor: primaryColor + '30'}]}>
                <MaterialIcons
                  name={isExpense ? 'receipt' : 'payment'}
                  size={20}
                  color={primaryColor}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionTitle, {color: textColor}]} numberOfLines={1}>
                  {description}
                </Text>
                <View style={styles.transactionMeta}>
                  {category && (
                    <>
                      <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>
                        {category}
                      </Text>
                      <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>•</Text>
                    </>
                  )}
                  {splitType && (
                    <>
                      <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>
                        {getSplitTypeLabel(splitType)}
                      </Text>
                      <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>•</Text>
                    </>
                  )}
                  {userShare && (
                    <>
                      <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>
                        Share: {userShare}
                      </Text>
                      <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>•</Text>
                    </>
                  )}
                  {groupName ? (
                    <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>
                      Group: {groupName}
                    </Text>
                  ) : friendName ? (
                    <Text style={[styles.transactionMetaText, {color: secondaryTextColor}]}>
                      Friend: {friendName}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.transactionFooter}>
                  {payerName && (
                    <Text style={[styles.transactionPayer, {color: secondaryTextColor}]}>
                      Paid by {payerName}
                    </Text>
                  )}
                  <Text style={[styles.transactionDate, {color: secondaryTextColor}]}>
                    {formatDate(item.date || item.timestamp)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text style={[styles.transactionAmount, {color: textColor}]}>
                {formatCurrency(amount, currency)}
              </Text>
              <Text style={[styles.transactionCurrency, {color: secondaryTextColor}]}>
                {currency}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  if (loading && transactions.length === 0) {
    return (
      <View style={[styles.container, {backgroundColor}]}>
        <ScreenWrapper>
          <View style={[styles.centerContent, {flex: 1}]}>
            <ActivityIndicator size="large" color={primaryColor} />
          </View>
        </ScreenWrapper>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <ScreenWrapper>
        {/* Screen Heading */}
        <View style={styles.headingContainer}>
          <Text style={[styles.heading, {color: textColor}]}>Transactions</Text>
        </View>

        {/* Search Bar and Filter */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, {backgroundColor: searchBackground}]}>
            <MaterialIcons name="search" size={20} color={secondaryTextColor} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, {color: textColor}]}
              placeholder="Search by description or payer name..."
              placeholderTextColor={secondaryTextColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <MaterialIcons name="close" size={20} color={secondaryTextColor} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {backgroundColor: activeFiltersCount > 0 ? primaryColor : searchBackground},
            ]}
            onPress={() => setShowFilters(true)}>
            <MaterialIcons
              name="filter-list"
              size={20}
              color={activeFiltersCount > 0 ? '#FFFFFF' : secondaryTextColor}
            />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
          contentContainerStyle={
            transactions.length === 0
              ? [styles.listContent, styles.emptyListContent]
              : styles.listContent
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="receipt-long" size={48} color={secondaryTextColor} />
                <Text style={[styles.emptyText, {color: secondaryTextColor}]}>
                  {searchQuery.trim() || activeFiltersCount > 0
                    ? 'No transactions found'
                    : 'No transactions yet'}
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={primaryColor} />
              </View>
            ) : null
          }
        />

        {/* Filters Modal */}
        <TransactionFiltersModal
          visible={showFilters}
          filters={{
            currency: filters.currency,
            group_id: filters.group_id,
            friend_id: filters.friend_id,
          }}
          onApply={appliedFilters => {
            setFilters({
              ...filters,
              currency: appliedFilters.currency,
              group_id: appliedFilters.group_id,
              friend_id: appliedFilters.friend_id,
            });
          }}
          onClose={() => setShowFilters(false)}
        />
      </ScreenWrapper>
    </View>
  );
}
