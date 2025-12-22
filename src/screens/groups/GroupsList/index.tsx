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
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import {ScreenWrapper} from '../../../components/ScreenWrapper';
import type {Group, GroupBalance} from '../../../types/api';
import {styles} from './styles';

export function GroupsListScreen() {
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {user} = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupBalances, setGroupBalances] = useState<GroupBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const primaryColor = brand?.primary_color || colors.primary;
  const defaultCurrency = user?.default_currency || 'USD';
  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';
  const searchBackground = isDark ? '#1A1F3A' : '#FFFFFF';

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    // Debounce search query
    if (searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        searchGroups();
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      loadGroups();
    }
  }, [searchQuery]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const [groupsData, balancesData] = await Promise.all([
        apiClient.getGroups(),
        apiClient.getGroupsBalances(),
      ]);
      setGroups(groupsData);
      setGroupBalances(balancesData);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchGroups = async () => {
    try {
      setLoading(true);
      const groupsData = await apiClient.getGroups({search: searchQuery});
      setGroups(groupsData);
      // Also fetch balances for search results
      const balancesData = await apiClient.getGroupsBalances();
      setGroupBalances(balancesData);
    } catch (error) {
      console.error('Failed to search groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (searchQuery.trim()) {
      await searchGroups();
    } else {
      await loadGroups();
    }
    setRefreshing(false);
  }, [searchQuery]);

  const handleGroupPress = (group: Group) => {
    // Navigate within the Groups stack
    navigation.navigate('GroupDetail' as never, {groupId: group.hash || String(group.id)} as never);
  };

  const getGroupBalance = (groupId: number): any => {
    // The API returns: [{group: {...}, balance: number}]
    const balanceData = groupBalances.find(
      (gb: any) => gb.group?.id === groupId || gb.group_id === groupId,
    );
    
    if (!balanceData) return null;

    // Handle different API response structures
    if (balanceData.balances && Array.isArray(balanceData.balances)) {
      // TypeScript interface structure: {group_id, balances: Balance[]}
      const userBalance = balanceData.balances.find((b: any) => b.user_id === user?.id);
      return userBalance
        ? {balance: userBalance.balance, currency: userBalance.currency || balanceData.group?.currency}
        : null;
    }

    // Direct API structure: {group: {...}, balance: number}
    return {
      balance: balanceData.balance || 0,
      currency: balanceData.group?.currency || balanceData.currency,
    };
  };

  const formatCurrency = (amount: number, currency: string = defaultCurrency) => {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currency} ${Math.abs(amount).toFixed(2)}`;
  };

  const renderGroup = ({item}: {item: Group}) => {
    const balanceData = getGroupBalance(item.id);
    const balanceValue = balanceData?.balance || 0;
    const balanceCurrency = balanceData?.currency || item.currency || defaultCurrency;
    const isOwed = balanceValue > 0;
    const isOwe = balanceValue < 0;
    const isSettled = Math.abs(balanceValue) < 0.01;

    return (
      <TouchableOpacity
        style={[styles.groupCard, {backgroundColor: cardBackground}]}
        onPress={() => handleGroupPress(item)}>
        <View style={styles.groupContent}>
          <View style={styles.groupLeft}>
            <View style={[styles.groupAvatar, {backgroundColor: primaryColor + '30'}]}>
              <Text style={[styles.groupAvatarText, {color: primaryColor}]}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.groupInfo}>
              <Text style={[styles.groupName, {color: textColor}]} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.groupMeta}>
                <Text style={[styles.groupMetaText, {color: secondaryTextColor}]}>
                  {item.members?.length || 0} members
                </Text>
                <Text style={[styles.groupMetaText, {color: secondaryTextColor}]}>•</Text>
                <Text style={[styles.groupMetaText, {color: secondaryTextColor}]}>
                  {item.currency}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.groupRight}>
            {isSettled ? (
              <View style={styles.balanceContainer}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={[styles.balanceStatus, {color: '#4CAF50'}]}>Settled</Text>
              </View>
            ) : (
              <View style={styles.balanceContainer}>
                <Text style={[styles.balanceAmount, {color: isOwed ? '#4CAF50' : '#F44336'}]}>
                  {formatCurrency(balanceValue, balanceCurrency)}
                </Text>
                <Text style={[styles.balanceLabel, {color: secondaryTextColor}]}>
                  {isOwed ? 'You are owed' : 'You owe'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={[styles.centerContent, {flex: 1, backgroundColor}]}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <ScreenWrapper>
        {/* Screen Heading */}
        <View style={styles.headingContainer}>
          <Text style={[styles.heading, {color: textColor}]}>Groups</Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, {backgroundColor: searchBackground}]}>
          <MaterialIcons name="search" size={20} color={secondaryTextColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, {color: textColor}]}
            placeholder="Search groups..."
            placeholderTextColor={secondaryTextColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <MaterialIcons name="close" size={20} color={secondaryTextColor} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="groups" size={48} color={secondaryTextColor} />
              <Text style={[styles.emptyText, {color: secondaryTextColor}]}>
                {searchQuery.trim()
                  ? 'No groups found'
                  : 'No groups yet. Create one to get started!'}
              </Text>
              {!searchQuery.trim() && (
                <TouchableOpacity
                  style={[styles.createButton, {backgroundColor: primaryColor}]}
                  onPress={() => navigation.navigate('CreateGroup' as never)}>
                  <Text style={styles.createButtonText}>Create Group</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={[styles.fab, styles.fabSecondary, {backgroundColor: primaryColor}]}
            onPress={() => navigation.navigate('JoinGroup' as never)}>
            <Text style={styles.fabText}>Join</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fab, {backgroundColor: primaryColor}]}
            onPress={() => navigation.navigate('CreateGroup' as never)}>
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    </View>
  );
}
