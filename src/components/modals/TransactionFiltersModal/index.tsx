import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import type {Currency, Group, User} from '../../../types/api';
import {styles} from './styles';

interface TransactionFiltersModalProps {
  visible: boolean;
  filters: {
    currency?: string;
    group_id?: number;
    friend_id?: number;
  };
  onApply: (filters: {currency?: string; group_id?: number; friend_id?: number}) => void;
  onClose: () => void;
}

export function TransactionFiltersModal({
  visible,
  filters,
  onApply,
  onClose,
}: TransactionFiltersModalProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const [activeTab, setActiveTab] = useState<'currency' | 'group' | 'friend'>('currency');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>(filters.currency);
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(filters.group_id);
  const [selectedFriendId, setSelectedFriendId] = useState<number | undefined>(filters.friend_id);

  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';
  const selectedBackground = primaryColor + '20';
  const selectedTextColor = primaryColor;

  useEffect(() => {
    if (visible) {
      loadFilterData();
      setSelectedCurrency(filters.currency);
      setSelectedGroupId(filters.group_id);
      setSelectedFriendId(filters.friend_id);
    }
  }, [visible, filters]);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      const [currenciesData, groupsData, friendsData] = await Promise.all([
        apiClient.getCurrencies(),
        apiClient.getGroups(),
        apiClient.getFriends(),
      ]);
      setCurrencies(currenciesData);
      setGroups(groupsData);
      setFriends(friendsData);
    } catch (error) {
      console.error('Failed to load filter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onApply({
      currency: selectedCurrency,
      group_id: selectedGroupId,
      friend_id: selectedFriendId,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCurrency(undefined);
    setSelectedGroupId(undefined);
    setSelectedFriendId(undefined);
    onApply({});
    onClose();
  };

  const renderCurrencyItem = ({item}: {item: Currency}) => {
    const isSelected = selectedCurrency === item.code;
    return (
      <TouchableOpacity
        style={[
          styles.filterItem,
          {backgroundColor: cardBackground, borderColor: secondaryTextColor + '30'},
          isSelected && {backgroundColor: selectedBackground, borderColor: primaryColor},
        ]}
        onPress={() => setSelectedCurrency(isSelected ? undefined : item.code)}>
        <View style={styles.filterItemContent}>
          <Text style={[styles.filterItemText, {color: isSelected ? selectedTextColor : textColor}]}>
            {item.code} - {item.name}
          </Text>
          {isSelected && (
            <MaterialIcons name="check-circle" size={20} color={primaryColor} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderGroupItem = ({item}: {item: Group}) => {
    const isSelected = selectedGroupId === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.filterItem,
          {backgroundColor: cardBackground, borderColor: secondaryTextColor + '30'},
          isSelected && {backgroundColor: selectedBackground, borderColor: primaryColor},
        ]}
        onPress={() => setSelectedGroupId(isSelected ? undefined : item.id)}>
        <View style={styles.filterItemContent}>
          <View style={styles.filterItemInfo}>
            <Text style={[styles.filterItemText, {color: isSelected ? selectedTextColor : textColor}]}>
              {item.name}
            </Text>
            {item.description && (
              <Text style={[styles.filterItemSubtext, {color: secondaryTextColor}]} numberOfLines={1}>
                {item.description}
              </Text>
            )}
          </View>
          {isSelected && (
            <MaterialIcons name="check-circle" size={20} color={primaryColor} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFriendItem = ({item}: {item: User}) => {
    const isSelected = selectedFriendId === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.filterItem,
          {backgroundColor: cardBackground, borderColor: secondaryTextColor + '30'},
          isSelected && {backgroundColor: selectedBackground, borderColor: primaryColor},
        ]}
        onPress={() => setSelectedFriendId(isSelected ? undefined : item.id)}>
        <View style={styles.filterItemContent}>
          <View style={styles.filterItemInfo}>
            <Text style={[styles.filterItemText, {color: isSelected ? selectedTextColor : textColor}]}>
              {item.name}
            </Text>
            <Text style={[styles.filterItemSubtext, {color: secondaryTextColor}]} numberOfLines={1}>
              {item.email}
            </Text>
          </View>
          {isSelected && (
            <MaterialIcons name="check-circle" size={20} color={primaryColor} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: textColor}]}>Filter Transactions</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'currency' && {backgroundColor: primaryColor + '20', borderBottomColor: primaryColor},
                {borderBottomColor: secondaryTextColor + '30'},
              ]}
              onPress={() => setActiveTab('currency')}>
              <Text
                style={[
                  styles.tabText,
                  {color: activeTab === 'currency' ? primaryColor : secondaryTextColor},
                ]}>
                Currency
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'group' && {backgroundColor: primaryColor + '20', borderBottomColor: primaryColor},
                {borderBottomColor: secondaryTextColor + '30'},
              ]}
              onPress={() => setActiveTab('group')}>
              <Text
                style={[
                  styles.tabText,
                  {color: activeTab === 'group' ? primaryColor : secondaryTextColor},
                ]}>
                Group
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'friend' && {backgroundColor: primaryColor + '20', borderBottomColor: primaryColor},
                {borderBottomColor: secondaryTextColor + '30'},
              ]}
              onPress={() => setActiveTab('friend')}>
              <Text
                style={[
                  styles.tabText,
                  {color: activeTab === 'friend' ? primaryColor : secondaryTextColor},
                ]}>
                Friend
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={primaryColor} />
              </View>
            ) : (
              <>
                {activeTab === 'currency' && (
                  <FlatList
                    data={currencies}
                    renderItem={renderCurrencyItem}
                    keyExtractor={item => item.code}
                    contentContainerStyle={styles.listContent}
                  />
                )}
                {activeTab === 'group' && (
                  <FlatList
                    data={groups}
                    renderItem={renderGroupItem}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={styles.listContent}
                  />
                )}
                {activeTab === 'friend' && (
                  <FlatList
                    data={friends}
                    renderItem={renderFriendItem}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={styles.listContent}
                  />
                )}
              </>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.clearButton, {borderColor: secondaryTextColor}]}
              onPress={handleClear}>
              <Text style={[styles.clearButtonText, {color: textColor}]}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, {backgroundColor: primaryColor}]}
              onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
