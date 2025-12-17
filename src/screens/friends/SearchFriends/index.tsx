import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import type {User} from '../../../types/api';
import {styles} from './styles';

export function SearchFriendsScreen() {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState<number | null>(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      searchFriends();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchFriends = async () => {
    try {
      setLoading(true);
      const data = await apiClient.searchFriends(query.trim());
      setResults(data);
    } catch (error) {
      console.error('Failed to search friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (user: User) => {
    setInviting(user.id);
    try {
      await apiClient.sendFriendRequest(user.id);
      Alert.alert('Success', `Friend request sent to ${user.name}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send friend request');
    } finally {
      setInviting(null);
    }
  };

  const handleInviteByEmail = () => {
    navigation.navigate('InviteFriend' as never);
  };

  const renderResult = ({item}: {item: User}) => (
    <View style={[styles.resultCard, {backgroundColor: colors.surface, borderColor: colors.border}]}>
      <View style={styles.resultInfo}>
        <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.resultDetails}>
          <Text style={[styles.resultName, {color: colors.text}]}>{item.name}</Text>
          <Text style={[styles.resultEmail, {color: colors.textSecondary}]}>{item.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.inviteButton, {backgroundColor: colors.primary}]}
        onPress={() => handleInvite(item)}
        disabled={inviting === item.id}>
        {inviting === item.id ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.inviteButtonText}>Add</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.searchContainer, {backgroundColor: colors.surface}]}>
        <TextInput
          style={[styles.searchInput, {color: colors.text, borderColor: colors.border}]}
          placeholder="Search by name or email..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {query.trim().length < 2 && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            Enter at least 2 characters to search
          </Text>
          <TouchableOpacity
            style={[styles.inviteEmailButton, {backgroundColor: colors.primary}]}
            onPress={handleInviteByEmail}>
            <Text style={styles.inviteEmailButtonText}>Invite by Email</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {!loading && query.trim().length >= 2 && (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
                No users found. Try inviting by email instead.
              </Text>
              <TouchableOpacity
                style={[styles.inviteEmailButton, {backgroundColor: colors.primary}]}
                onPress={handleInviteByEmail}>
                <Text style={styles.inviteEmailButtonText}>Invite by Email</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}
