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
import {DatePickerModal} from '../DatePickerModal';
import type {Currency, Group, User} from '../../../types/api';
import {spacing} from '../../../theme/typography';
import {styles} from './styles';

interface TransactionFiltersModalProps {
  visible: boolean;
  filters: {
    currency?: string;
    group_id?: number;
    friend_id?: number;
    date_from?: string;
    date_to?: string;
  };
  onApply: (filters: {
    currency?: string;
    group_id?: number;
    friend_id?: number;
    date_from?: string;
    date_to?: string;
  }) => void;
  onClose: () => void;
}

export function TransactionFiltersModal({
  visible,
  filters,
  onApply,
  onClose,
}: TransactionFiltersModalProps) {
  const {colors} = useTheme();
  const {brand} = useBrand();
  const [activeTab, setActiveTab] = useState<'currency' | 'group' | 'friend' | 'date'>('date');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>(filters.currency);
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(filters.group_id);
  const [selectedFriendId, setSelectedFriendId] = useState<number | undefined>(filters.friend_id);
  const [selectedDateFrom, setSelectedDateFrom] = useState<string | undefined>(filters.date_from);
  const [selectedDateTo, setSelectedDateTo] = useState<string | undefined>(filters.date_to);
  const [datePickerType, setDatePickerType] = useState<'from' | 'to' | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.textSecondary;
  const selectedBackground = primaryColor + '20';
  const selectedTextColor = primaryColor;

  useEffect(() => {
    if (visible) {
      loadFilterData();
      setSelectedCurrency(filters.currency);
      setSelectedGroupId(filters.group_id);
      setSelectedFriendId(filters.friend_id);
      setSelectedDateFrom(filters.date_from);
      setSelectedDateTo(filters.date_to);
      // Check if current dates match a preset
      checkPreset(filters.date_from, filters.date_to);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if current dates match a preset
  const checkPreset = (dateFrom?: string, dateTo?: string) => {
    if (!dateFrom || !dateTo) {
      setSelectedPreset(null);
      return;
    }

    const presets = getDatePresets();
    const matchingPreset = presets.find(
      preset => preset.date_from === dateFrom && preset.date_to === dateTo
    );
    setSelectedPreset(matchingPreset?.id || null);
  };

  // Get date range presets
  const getDatePresets = () => {
    const today = new Date();
    const presets = [];

    // This Week (Monday to Sunday)
    const thisWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Make Monday = 0
    thisWeekStart.setDate(today.getDate() - diff);
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
    presets.push({
      id: 'this_week',
      label: 'This Week',
      date_from: formatDate(thisWeekStart),
      date_to: formatDate(thisWeekEnd),
    });

    // This Month
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    presets.push({
      id: 'this_month',
      label: 'This Month',
      date_from: formatDate(thisMonthStart),
      date_to: formatDate(thisMonthEnd),
    });

    // Last Month
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    presets.push({
      id: 'last_month',
      label: 'Last Month',
      date_from: formatDate(lastMonthStart),
      date_to: formatDate(lastMonthEnd),
    });

    // Last 30 Days
    const last30DaysStart = new Date(today);
    last30DaysStart.setDate(today.getDate() - 30);
    presets.push({
      id: 'last_30_days',
      label: 'Last 30 Days',
      date_from: formatDate(last30DaysStart),
      date_to: formatDate(today),
    });

    // Last 90 Days
    const last90DaysStart = new Date(today);
    last90DaysStart.setDate(today.getDate() - 90);
    presets.push({
      id: 'last_90_days',
      label: 'Last 90 Days',
      date_from: formatDate(last90DaysStart),
      date_to: formatDate(today),
    });

    // This Year
    const thisYearStart = new Date(today.getFullYear(), 0, 1);
    const thisYearEnd = new Date(today.getFullYear(), 11, 31);
    presets.push({
      id: 'this_year',
      label: 'This Year',
      date_from: formatDate(thisYearStart),
      date_to: formatDate(thisYearEnd),
    });

    return presets;
  };

  const handlePresetSelect = (preset: any) => {
    setSelectedDateFrom(preset.date_from);
    setSelectedDateTo(preset.date_to);
    setSelectedPreset(preset.id);
  };

  const handleApply = () => {
    onApply({
      currency: selectedCurrency,
      group_id: selectedGroupId,
      friend_id: selectedFriendId,
      date_from: selectedDateFrom,
      date_to: selectedDateTo,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCurrency(undefined);
    setSelectedGroupId(undefined);
    setSelectedFriendId(undefined);
    setSelectedDateFrom(undefined);
    setSelectedDateTo(undefined);
    setSelectedPreset(null);
    onApply({});
    onClose();
  };

  const handleDateSelect = (date: string) => {
    if (datePickerType === 'from') {
      setSelectedDateFrom(date);
      setSelectedPreset(null); // Clear preset when custom date is selected
    } else if (datePickerType === 'to') {
      setSelectedDateTo(date);
      setSelectedPreset(null); // Clear preset when custom date is selected
    }
    setDatePickerType(null);
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

  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return 'Select Date';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'date' && {backgroundColor: primaryColor + '20', borderBottomColor: primaryColor},
                {borderBottomColor: secondaryTextColor + '30'},
              ]}
              onPress={() => setActiveTab('date')}>
              <Text
                style={[
                  styles.tabText,
                  {color: activeTab === 'date' ? primaryColor : secondaryTextColor},
                ]}>
                Date Range
              </Text>
            </TouchableOpacity>
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
          </ScrollView>

          {/* Content */}
          <View style={styles.contentContainer}>
            {loading && activeTab !== 'date' ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={primaryColor} />
              </View>
            ) : (
              <>
                {activeTab === 'date' && (
                  <ScrollView contentContainerStyle={styles.listContent}>
                    {/* Date Presets */}
                    <Text style={[styles.sectionTitle, {color: textColor}]}>Quick Select</Text>
                    <View style={styles.datePresetsGrid}>
                      {getDatePresets().map(preset => (
                        <TouchableOpacity
                          key={preset.id}
                          style={[
                            styles.datePresetItem,
                            {backgroundColor: cardBackground, borderColor: secondaryTextColor + '30'},
                            selectedPreset === preset.id && {backgroundColor: selectedBackground, borderColor: primaryColor},
                          ]}
                          onPress={() => handlePresetSelect(preset)}>
                          <Text style={[styles.datePresetText, {color: selectedPreset === preset.id ? selectedTextColor : textColor}]}>
                            {preset.label}
                          </Text>
                          {selectedPreset === preset.id && (
                            <MaterialIcons name="check-circle" size={16} color={primaryColor} style={{marginTop: spacing.xs}} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Custom Date Range */}
                    <View style={{marginTop: spacing.xxl}}>
                      <Text style={[styles.sectionTitle, {color: textColor}]}>Custom Range</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.dateRangeButton, {backgroundColor: cardBackground, borderColor: secondaryTextColor + '30'}]}
                      onPress={() => setDatePickerType('from')}>
                      <View style={styles.dateRangeContent}>
                        <MaterialIcons name="event" size={20} color={primaryColor} />
                        <View style={styles.dateRangeInfo}>
                          <Text style={[styles.dateRangeLabel, {color: secondaryTextColor}]}>From Date</Text>
                          <Text style={[styles.dateRangeValue, {color: textColor}]}>{formatDisplayDate(selectedDateFrom)}</Text>
                        </View>
                      </View>
                      <MaterialIcons name="chevron-right" size={24} color={secondaryTextColor} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.dateRangeButton, {backgroundColor: cardBackground, borderColor: secondaryTextColor + '30'}]}
                      onPress={() => setDatePickerType('to')}>
                      <View style={styles.dateRangeContent}>
                        <MaterialIcons name="event" size={20} color={primaryColor} />
                        <View style={styles.dateRangeInfo}>
                          <Text style={[styles.dateRangeLabel, {color: secondaryTextColor}]}>To Date</Text>
                          <Text style={[styles.dateRangeValue, {color: textColor}]}>{formatDisplayDate(selectedDateTo)}</Text>
                        </View>
                      </View>
                      <MaterialIcons name="chevron-right" size={24} color={secondaryTextColor} />
                    </TouchableOpacity>

                    {selectedDateFrom && selectedDateTo && (
                      <TouchableOpacity
                        style={[styles.clearDateButton, {borderColor: primaryColor}]}
                        onPress={() => {
                          setSelectedDateFrom(undefined);
                          setSelectedDateTo(undefined);
                          setSelectedPreset(null);
                        }}>
                        <Text style={[styles.clearDateText, {color: primaryColor}]}>Clear Date Range</Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                )}
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

      {/* Date Picker Modal */}
      {datePickerType && (
        <DatePickerModal
          visible={true}
          selectedDate={datePickerType === 'from' ? selectedDateFrom || formatDate(new Date()) : selectedDateTo || formatDate(new Date())}
          onSelect={handleDateSelect}
          onClose={() => setDatePickerType(null)}
        />
      )}
    </Modal>
  );
}
