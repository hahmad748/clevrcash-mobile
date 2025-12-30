import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import type {User, Friendship} from '../../../types/api';
import {styles} from './styles';
import {showError, showSuccess} from '../../../utils/flashMessage';

type MainTab = 'search' | 'invite' | 'pending';
type PendingTab = 'received' | 'sent';

export function SearchFriendsScreen() {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('search');
  const [activePendingTab, setActivePendingTab] = useState<PendingTab>('received');

  // Search tab state
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [inviting, setInviting] = useState<number | null>(null);

  // Invite tab state
  const [email, setEmail] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);

  // Pending tab state
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';
  const searchBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const tabBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const activeTabBackground = isDark ? '#252A4A' : '#F0F0F0';

  const loadPendingRequests = async () => {
    try {
      setPendingLoading(true);
      // Clear previous data immediately to prevent showing stale data
      setPendingRequests([]);
      const data = await apiClient.getPendingRequests(activePendingTab);
      setPendingRequests(data);
    } catch (error) {
      console.error('Failed to load pending requests:', error);
      showError('Error', 'Failed to load pending requests');
      // Clear on error too
      setPendingRequests([]);
    } finally {
      setPendingLoading(false);
    }
  };

  // Load pending requests when pending tab is active
  useEffect(() => {
    if (activeMainTab === 'pending') {
      loadPendingRequests();
    } else {
      // Clear requests when leaving pending tab
      setPendingRequests([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMainTab, activePendingTab]);

  // Reset input fields when switching away from tabs
  useEffect(() => {
    if (activeMainTab !== 'search') {
      setGlobalSearchQuery('');
      setResults([]);
    }
    if (activeMainTab !== 'invite') {
      setEmail('');
    }
  }, [activeMainTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPendingRequests();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePendingTab]);

  const handleGlobalSearch = async () => {
    if (!globalSearchQuery.trim()) {
      showError('Error', 'Please enter a search query');
      return;
    }

    try {
      setSearchLoading(true);
      const data = await apiClient.searchFriends(globalSearchQuery.trim());
      setResults(data);
    } catch (error) {
      console.error('Failed to search friends:', error);
      showError('Error', 'Failed to search friends');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleInvite = async (user: User) => {
    setInviting(user.id);
    try {
      await apiClient.sendFriendRequest(user.id);
      Alert.alert('Success', `Friend request sent to ${user.name}`, [
        {
          text: 'OK',
          onPress: () => {
            setResults([]);
            setGlobalSearchQuery('');
          },
        },
      ]);
    } catch (error: any) {
      showError('Error', error.message || 'Failed to send friend request');
    } finally {
      setInviting(null);
    }
  };

  const handleSendInvitation = async () => {
    if (!email.trim()) {
      showError('Error', 'Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showError('Error', 'Please enter a valid email address');
      return;
    }

    setSendingInvite(true);
    try {
      await apiClient.inviteFriendByEmail(email.trim());
      Alert.alert(
        'Success',
        `Invitation sent to ${email}. They will receive an email with instructions to join.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setEmail('');
            },
          },
        ],
      );
    } catch (error: any) {
      showError('Error', error.message || 'Failed to send invitation');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleAccept = async (friendship: Friendship) => {
    try {
      const friendId = activePendingTab === 'received' ? friendship.user_id : friendship.friend_id;
      await apiClient.acceptFriendRequest(friendId);
      showSuccess('Success', 'Friend request accepted');
      await loadPendingRequests();
    } catch (error: any) {
      showError('Error', error.message || 'Failed to accept request');
    }
  };

  const handleDecline = async (friendship: Friendship) => {
    try {
      const friendId = activePendingTab === 'received' ? friendship.user_id : friendship.friend_id;
      await apiClient.declineFriendRequest(friendId);
      showSuccess('Success', 'Friend request declined');
      await loadPendingRequests();
    } catch (error: any) {
      showError('Error', error.message || 'Failed to decline request');
    }
  };

  const renderSearchResult = ({item}: {item: User}) => (
    <View style={[styles.resultCard, {backgroundColor: cardBackground}]}>
      <View style={styles.resultInfo}>
        <View style={[styles.avatar, {backgroundColor: primaryColor + '30'}]}>
          <Text style={[styles.avatarText, {color: primaryColor}]}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.resultDetails}>
          <Text style={[styles.resultName, {color: textColor}]}>{item.name}</Text>
          <Text style={[styles.resultEmail, {color: secondaryTextColor}]}>{item.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.inviteButton, {backgroundColor: primaryColor}]}
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

  const renderPendingRequest = ({item}: {item: Friendship}) => {
    const friend = activePendingTab === 'received' ? item.user : item.friend;

    return (
      <View style={[styles.resultCard, {backgroundColor: cardBackground}]}>
        <View style={styles.resultInfo}>
          <View style={[styles.avatar, {backgroundColor: primaryColor + '30'}]}>
            <Text style={[styles.avatarText, {color: primaryColor}]}>
              {friend?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.resultDetails}>
            <Text style={[styles.resultName, {color: textColor}]}>
              {friend?.name || 'Unknown'}
            </Text>
            <Text style={[styles.resultEmail, {color: secondaryTextColor}]}>
              {friend?.email || ''}
            </Text>
          </View>
        </View>
        {activePendingTab === 'received' ? (
          <View style={styles.pendingActions}>
            <TouchableOpacity
              style={[styles.acceptButton, {backgroundColor: primaryColor}]}
              onPress={() => handleAccept(item)}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.declineButton, {backgroundColor: secondaryTextColor}]}
              onPress={() => handleDecline(item)}>
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={[styles.pendingText, {color: secondaryTextColor}]}>Pending</Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Status Bar Area - Match header background color to fill behind rounded header */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={primaryColor}
        translucent={false}
      />
      <View style={[styles.headerBackground, {backgroundColor: primaryColor}]} />
      
      {/* Main Tabs */}
      <View style={[styles.mainTabs, {backgroundColor: tabBackground}]}>
        <TouchableOpacity
          style={[
            styles.mainTab,
            activeMainTab === 'search' && {backgroundColor: activeTabBackground},
          ]}
          onPress={() => setActiveMainTab('search')}>
          <MaterialIcons
            name="search"
            size={20}
            color={activeMainTab === 'search' ? primaryColor : secondaryTextColor}
          />
          <Text
            style={[
              styles.mainTabText,
              {
                color: activeMainTab === 'search' ? primaryColor : secondaryTextColor,
              },
            ]}>
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.mainTab,
            activeMainTab === 'invite' && {backgroundColor: activeTabBackground},
          ]}
          onPress={() => setActiveMainTab('invite')}>
          <MaterialIcons
            name="email"
            size={20}
            color={activeMainTab === 'invite' ? primaryColor : secondaryTextColor}
          />
          <Text
            style={[
              styles.mainTabText,
              {
                color: activeMainTab === 'invite' ? primaryColor : secondaryTextColor,
              },
            ]}>
            Invite
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.mainTab,
            activeMainTab === 'pending' && {backgroundColor: activeTabBackground},
          ]}
          onPress={() => setActiveMainTab('pending')}>
          <MaterialIcons
            name="person-add"
            size={20}
            color={activeMainTab === 'pending' ? primaryColor : secondaryTextColor}
          />
          <Text
            style={[
              styles.mainTabText,
              {
                color: activeMainTab === 'pending' ? primaryColor : secondaryTextColor,
              },
            ]}>
            Pending
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeMainTab === 'search' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, {color: textColor}]}>Search Friends</Text>
          </View>

          <View style={[styles.globalSearchContainer, {backgroundColor: searchBackground}]}>
            <MaterialIcons name="search" size={20} color={secondaryTextColor} style={styles.searchIcon} />
            <TextInput
              style={[styles.globalSearchInput, {color: textColor}]}
              placeholder="Enter exact email or phone number"
              placeholderTextColor={secondaryTextColor}
              value={globalSearchQuery}
              onChangeText={setGlobalSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
            />
            <TouchableOpacity
              style={[styles.searchButton, {backgroundColor: primaryColor}]}
              onPress={handleGlobalSearch}
              disabled={searchLoading || !globalSearchQuery.trim()}>
              {searchLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>

          {results.length > 0 ? (
            <View style={styles.resultsContainer}>
              <Text style={[styles.resultsTitle, {color: textColor}]}>Search Results</Text>
              <FlatList
                data={results}
                renderItem={renderSearchResult}
                keyExtractor={item => String(item.id)}
                scrollEnabled={false}
              />
            </View>
          ) : (
            // Show centered info when no search made or no results
            (!searchLoading && globalSearchQuery.trim() && (
              <View style={styles.centeredInfoContainer}>
                <MaterialIcons name="search-off" size={48} color={secondaryTextColor} style={styles.emptyIcon} />
                <Text style={[styles.noResultsText, {color: secondaryTextColor}]}>
                  No user found with this email or phone number
                </Text>
                <View style={styles.infoContainer}>
                  <MaterialIcons name="info" size={16} color={secondaryTextColor} style={styles.infoIcon} />
                  <Text style={[styles.infoText, {color: secondaryTextColor}]}>
                    Make sure you enter the exact email or phone number
                  </Text>
                </View>
              </View>
            ))
          )}
          
          {!globalSearchQuery.trim() && !searchLoading && (
            <View style={styles.centeredInfoContainer}>
              <MaterialIcons name="info" size={48} color={secondaryTextColor} style={styles.emptyIcon} />
              <Text style={[styles.infoText, {color: secondaryTextColor, textAlign: 'center', fontSize: 14, marginBottom: 8}]}>
                Search by exact email or phone number if the user already exists on the platform
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {activeMainTab === 'invite' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, {color: textColor}]}>Invite Friend</Text>
          </View>

          <View style={[styles.card, {backgroundColor: cardBackground}]}>
            <View style={[styles.cardIconContainer, {backgroundColor: primaryColor + '30'}]}>
              <MaterialIcons name="email" size={24} color={primaryColor} />
            </View>
            <Text style={[styles.cardTitle, {color: textColor}]}>Invite by Email</Text>
            <Text style={[styles.cardDescription, {color: secondaryTextColor}]}>
              Send an invitation to someone who isn't on ClevrCash yet
            </Text>
            <View style={styles.emailInputContainer}>
              <Text style={[styles.emailLabel, {color: textColor}]}>Email Address</Text>
              <TextInput
                style={[styles.emailInput, {color: textColor, borderColor: secondaryTextColor + '30'}]}
                placeholder="Enter email address"
                placeholderTextColor={secondaryTextColor}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              style={[styles.sendInviteButton, {backgroundColor: primaryColor}]}
              onPress={handleSendInvitation}
              disabled={sendingInvite || !email.trim()}>
              {sendingInvite ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.sendInviteButtonText}>Send Invitation</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {activeMainTab === 'pending' && (
        <View style={styles.pendingContainer}>
          {/* Pending Sub-tabs */}
          <View style={[styles.pendingTabs, {backgroundColor: tabBackground}]}>
            <TouchableOpacity
              style={[
                styles.pendingTab,
                activePendingTab === 'received' && {
                  borderBottomColor: primaryColor,
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setActivePendingTab('received')}>
              <Text
                style={[
                  styles.pendingTabText,
                  {
                    color: activePendingTab === 'received' ? primaryColor : secondaryTextColor,
                  },
                ]}>
                Received
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pendingTab,
                activePendingTab === 'sent' && {
                  borderBottomColor: primaryColor,
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setActivePendingTab('sent')}>
              <Text
                style={[
                  styles.pendingTabText,
                  {
                    color: activePendingTab === 'sent' ? primaryColor : secondaryTextColor,
                  },
                ]}>
                Sent
              </Text>
            </TouchableOpacity>
          </View>

          {pendingLoading ? (
            <View style={[styles.centerContent, {flex: 1}]}>
              <ActivityIndicator size="large" color={primaryColor} />
            </View>
          ) : (
            <FlatList
              data={pendingRequests}
              renderItem={renderPendingRequest}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={
                pendingRequests.length === 0
                  ? [styles.pendingListContent, styles.emptyListContent]
                  : styles.pendingListContent
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, {color: secondaryTextColor}]}>
                    No {activePendingTab} requests
                  </Text>
                </View>
              }
            />
          )}
        </View>
      )}
    </View>
  );
}
