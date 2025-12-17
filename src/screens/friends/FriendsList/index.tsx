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
import {ScreenWrapper} from '../../../components/ScreenWrapper';
import type {User} from '../../../types/api';
import {styles} from './styles';

export function FriendsListScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchFriends();
    } else {
      loadFriends();
    }
  }, [searchQuery]);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getFriends();
      setFriends(data);
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
    // Navigate within the Friends stack
    navigation.navigate('FriendDetail' as never, {friendId: friend.id} as never);
  };

  const renderFriend = ({item}: {item: User}) => (
    <TouchableOpacity
      style={[styles.friendCard, {backgroundColor: colors.surface, borderColor: colors.border}]}
      onPress={() => handleFriendPress(item)}>
      <View style={styles.friendInfo}>
        <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.friendDetails}>
          <Text style={[styles.friendName, {color: colors.text}]}>{item.name}</Text>
          <Text style={[styles.friendEmail, {color: colors.textSecondary}]}>{item.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
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
      <View style={[styles.searchContainer, {backgroundColor: colors.surface}]}>
        <TextInput
          style={[styles.searchInput, {color: colors.text, borderColor: colors.border}]}
          placeholder="Search friends..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={friends}
        renderItem={renderFriend}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
              {searchQuery.trim()
                ? 'No friends found'
                : 'No friends yet. Add friends to split expenses!'}
            </Text>
            {!searchQuery.trim() && (
              <TouchableOpacity
                style={[styles.addButton, {backgroundColor: colors.primary}]}
                onPress={() => navigation.navigate('SearchFriends' as never)}>
                <Text style={styles.addButtonText}>Add Friend</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, styles.fabSecondary, {backgroundColor: colors.secondary || colors.primary}]}
          onPress={() => navigation.navigate('PendingRequests' as never)}>
          <Text style={styles.fabText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, {backgroundColor: colors.primary}]}
          onPress={() => navigation.navigate('SearchFriends' as never)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
