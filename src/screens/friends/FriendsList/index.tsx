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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import {ScreenWrapper} from '../../../components/ScreenWrapper';
import type {User, FriendBalance, Friendship} from '../../../types/api';
import {styles} from './styles';

export function FriendsListScreen() {
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {user} = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [friendBalances, setFriendBalances] = useState<FriendBalance[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const primaryColor = brand?.primary_color || colors.primary;
  const defaultCurrency = user?.default_currency || 'AED';
  const backgroundColor = colors.background;
  const cardBackground = colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.textSecondary;
  const searchBackground = colors.surface;

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    // Debounce search query
    if (searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        searchFriends();
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      loadFriends();
    }
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      if (!searchQuery.trim()) {
        loadFriends();
      }
    }, [searchQuery])
  );

  const loadFriends = async () => {
    try {
      setLoading(true);
      const [friendsData, balancesData] = await Promise.all([
        apiClient.getFriends(),
        apiClient.getFriendsBalances(),
      ]);
      setFriends(friendsData);
      setFriendBalances(balancesData);
    } catch (error) {
      console.error('Failed to load friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchFriends = async () => {
    try {
      const data = await apiClient.searchFriends(searchQuery);
      setFriends(data);
      // Also fetch balances for search results
      const balancesData = await apiClient.getFriendsBalances();
      setFriendBalances(balancesData);
    } catch (error) {
      console.error('Failed to search friends:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (searchQuery.trim()) {
      await searchFriends();
    } else {
      await loadFriends();
    }
    setRefreshing(false);
  }, [searchQuery]);

  const handleFriendPress = (friend: User) => {
    navigation.navigate('FriendDetail' as never, {friendId: friend.id} as never);
  };

  const getFriendBalance = (friendId: number): FriendBalance | null => {
    return friendBalances.find(fb => fb.friend?.id === friendId) || null;
  };

  const formatCurrency = (amount: number, currency: string = defaultCurrency) => {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currency} ${Math.abs(amount).toFixed(2)}`;
  };

  const renderFriend = ({item}: {item: User}) => {
    const balanceData = getFriendBalance(item.id);
    const balanceValue = balanceData?.balance || 0;
    const convertedBalance = balanceData?.converted_balance ?? balanceValue;
    const convertedCurrency = balanceData?.converted_currency || defaultCurrency;
    const isOwed = convertedBalance > 0;
    const isOwe = convertedBalance < 0;
    const isSettled = Math.abs(convertedBalance) < 0.01;

    return (
      <TouchableOpacity
        style={[styles.friendCard, {backgroundColor: cardBackground}]}
        onPress={() => handleFriendPress(item)}>
        <View style={styles.friendContent}>
          <View style={styles.friendLeft}>
            <View style={[styles.friendAvatar, {backgroundColor: primaryColor + '30'}]}>
              <Text style={[styles.friendAvatarText, {color: primaryColor}]}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.friendInfo}>
              <Text style={[styles.friendName, {color: textColor}]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.friendEmail, {color: secondaryTextColor}]} numberOfLines={1}>
                {item.email}
              </Text>
            </View>
          </View>
          <View style={styles.friendRight}>
            {isSettled ? (
              <View style={styles.balanceContainer}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={[styles.balanceStatus, {color: '#4CAF50'}]}>Settled</Text>
              </View>
            ) : (
              <View style={styles.balanceContainer}>
                <Text style={[styles.balanceAmount, {color: isOwed ? '#4CAF50' : '#F44336'}]}>
                  {formatCurrency(convertedBalance, convertedCurrency)}
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
          <Text style={[styles.heading, {color: textColor}]}>Friends</Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, {backgroundColor: searchBackground}]}>
          <MaterialIcons name="search" size={20} color={secondaryTextColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, {color: textColor}]}
            placeholder="Search friends..."
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
          data={friends}
          renderItem={renderFriend}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
          }
          ListHeaderComponent={
            !searchQuery.trim() && pendingRequests.length > 0 ? (
              <View style={styles.pendingSection}>
                <Text style={[styles.sectionTitle, {color: textColor}]}>Pending Requests</Text>
                {pendingRequests.map(request => {
                  const otherUser = request.user_id === user?.id ? request.friend : request.user;
                  const isReceived = request.user_id !== user?.id;
                  if (!otherUser) return null;
                  
                  return (
                    <View key={request.id} style={[styles.pendingCard, {backgroundColor: cardBackground}]}>
                      <View style={styles.friendLeft}>
                        <View style={[styles.friendAvatar, {backgroundColor: primaryColor + '30'}]}>
                          <Text style={[styles.friendAvatarText, {color: primaryColor}]}>
                            {otherUser.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.friendInfo}>
                          <Text style={[styles.friendName, {color: textColor}]} numberOfLines={1}>
                            {otherUser.name}
                          </Text>
                          <Text style={[styles.friendEmail, {color: secondaryTextColor}]} numberOfLines={1}>
                            {isReceived ? 'Sent you a request' : 'Request sent'}
                          </Text>
                        </View>
                      </View>
                      {isReceived ? (
                        <View style={styles.pendingActions}>
                          <TouchableOpacity
                            style={[styles.acceptButton, {backgroundColor: primaryColor}]}
                            onPress={async () => {
                              try {
                                await apiClient.acceptFriendRequest(otherUser.id);
                                showSuccess('Friend request accepted');
                                await loadFriends();
                              } catch (error: any) {
                                console.error('Failed to accept request:', error);
                                showError('Failed to accept request', error.message);
                              }
                            }}>
                            <Text style={styles.acceptButtonText}>Accept</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.declineButton, {backgroundColor: colors.error || '#F44336'}]}
                            onPress={async () => {
                              try {
                                await apiClient.declineFriendRequest(otherUser.id);
                                await loadFriends();
                              } catch (error: any) {
                                console.error('Failed to decline request:', error);
                              }
                            }}>
                            <Text style={styles.declineButtonText}>Decline</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[styles.cancelButton, {borderColor: secondaryTextColor}]}
                          onPress={async () => {
                            try {
                              await apiClient.declineFriendRequest(otherUser.id);
                              showSuccess('Friend request cancelled');
                              await loadFriends();
                            } catch (error: any) {
                              console.error('Failed to cancel request:', error);
                              showError('Failed to cancel request', error.message);
                            }
                          }}>
                          <Text style={[styles.cancelButtonText, {color: secondaryTextColor}]}>Cancel</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
                <Text style={[styles.sectionTitle, {color: textColor, marginTop: 24}]}>Friends</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="people" size={48} color={secondaryTextColor} />
              <Text style={[styles.emptyText, {color: secondaryTextColor}]}>
                {searchQuery.trim()
                  ? 'No friends found'
                  : 'No friends yet. Add friends to split expenses!'}
              </Text>
              {!searchQuery.trim() && (
                <TouchableOpacity
                  style={[styles.createButton, {backgroundColor: primaryColor}]}
                  onPress={() => navigation.navigate('SearchFriends' as never)}>
                  <Text style={styles.createButtonText}>Add Friend</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={[styles.fab, {backgroundColor: primaryColor}]}
            onPress={() => navigation.navigate('SearchFriends' as never)}>
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    </View>
  );
}
