import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import type {User} from '../../../types/api';
import {styles} from './styles';

export function SearchFriendsScreen() {
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState<number | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';
  const searchBackground = isDark ? '#1A1F3A' : '#FFFFFF';

  const handleGlobalSearch = async () => {
    if (!globalSearchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      const data = await apiClient.searchFriends(globalSearchQuery.trim());
      setResults(data);
    } catch (error) {
      console.error('Failed to search friends:', error);
      Alert.alert('Error', 'Failed to search friends');
    } finally {
      setLoading(false);
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
      Alert.alert('Error', error.message || 'Failed to send friend request');
    } finally {
      setInviting(null);
    }
  };

  const handleSendInvitation = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
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
      Alert.alert('Error', error.message || 'Failed to send invitation');
    } finally {
      setSendingInvite(false);
    }
  };

  const renderResult = ({item}: {item: User}) => (
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

  return (
    <View style={[styles.container, {backgroundColor}]}>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Page Heading */}
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, {color: textColor}]}>Add Friend</Text>
          </View>

          {/* Global Search Section */}
          <View style={[styles.globalSearchContainer, {backgroundColor: searchBackground}]}>
            <MaterialIcons name="search" size={20} color={secondaryTextColor} style={styles.searchIcon} />
            <TextInput
              style={[styles.globalSearchInput, {color: textColor}]}
              placeholder="Search by name or email"
              placeholderTextColor={secondaryTextColor}
              value={globalSearchQuery}
              onChangeText={setGlobalSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.searchButton, {backgroundColor: primaryColor}]}
              onPress={handleGlobalSearch}
              disabled={loading || !globalSearchQuery.trim()}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          {results.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={[styles.resultsTitle, {color: textColor}]}>Search Results</Text>
              <FlatList
                data={results}
                renderItem={renderResult}
                keyExtractor={item => String(item.id)}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Invite by Email Card */}
          <View style={styles.cardsContainer}>
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
          </View>
        </ScrollView>
    </View>
  );
}
