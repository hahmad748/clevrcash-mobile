import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import {ScreenWrapper} from '../../../components/ScreenWrapper';
import type {User, Category, Currency} from '../../../types/api';
import {styles} from './styles';

type SplitType = 'equal' | 'exact' | 'percentage' | 'shares' | 'adjustment' | 'reimbursement' | 'itemized';

interface Participant {
  user_id: number;
  amount?: number;
  percentage?: number;
  shares?: number;
}

export function CreateExpenseScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {user} = useAuth();
  const {groupId, friendId} = (route.params as any) || {};

  const primaryColor = brand?.primary_color || colors.primary;
  const defaultCurrency = user?.default_currency || 'USD';

  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [paidBy, setPaidBy] = useState<number>(user?.id || 0);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // UI state
  const [showNotes, setShowNotes] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaidByModal, setShowPaidByModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Data state
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  // Loading state
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (splitType === 'equal' && participants.length > 0 && amount) {
      const splitAmount = parseFloat(amount) / participants.length;
      setParticipants(prev =>
        prev.map(p => ({...p, amount: splitAmount, percentage: undefined, shares: undefined})),
      );
    }
  }, [amount, participants.length, splitType]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const [categoriesData, currenciesData] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getCurrencies(),
      ]);
      setCategories(categoriesData);
      setCurrencies(currenciesData);

      // Load participants based on context
      if (groupId) {
        const group = await apiClient.getGroup(groupId);
        const groupMembers = group.members?.map(m => m.user!).filter(Boolean) || [];
        // Remove duplicates and filter out current user from group members
        const uniqueMembers = groupMembers
          .filter((m, index, self) => index === self.findIndex(mem => mem.id === m.id))
          .filter(m => m.id !== user?.id); // Exclude current user from group members
        setAvailableUsers([user!, ...uniqueMembers].filter(Boolean));
        // Only add user once
        setParticipants([{user_id: user!.id}]);
      } else if (friendId) {
        const friends = await apiClient.getFriends();
        const friend = friends.find(f => f.id === friendId);
        if (friend) {
          setAvailableUsers([user!, friend].filter(Boolean));
          setParticipants([{user_id: user!.id}, {user_id: friendId}]);
        } else {
          setAvailableUsers([user!].filter(Boolean));
          setParticipants([{user_id: user!.id}]);
        }
      } else {
        const friends = await apiClient.getFriends();
        setAvailableUsers([user!, ...friends].filter(Boolean));
        setParticipants([{user_id: user!.id}]);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
      Alert.alert('Error', 'Failed to load required data');
    } finally {
      setLoadingData(false);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const results = await apiClient.getFriends({search: query});
      setSearchResults(results.filter(u => u.id !== user?.id));
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const addParticipant = (selectedUser: User) => {
    // Prevent duplicates
    if (!participants.find(p => p.user_id === selectedUser.id)) {
      setParticipants(prev => {
        // Double check for duplicates before adding
        const exists = prev.find(p => p.user_id === selectedUser.id);
        if (exists) return prev;
        return [...prev, {user_id: selectedUser.id}];
      });
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeParticipant = (userId: number) => {
    if (userId === user?.id) {
      Alert.alert('Error', 'You cannot remove yourself from the expense');
      return;
    }
    setParticipants(prev => prev.filter(p => p.user_id !== userId));
  };

  const updateParticipantSplit = (userId: number, value: number) => {
    setParticipants(prev =>
      prev.map(p => {
        if (p.user_id === userId) {
          if (splitType === 'exact') {
            return {...p, amount: value, percentage: undefined, shares: undefined};
          } else if (splitType === 'percentage') {
            return {...p, percentage: value, amount: undefined, shares: undefined};
          } else if (splitType === 'shares') {
            return {...p, shares: Math.floor(value), amount: undefined, percentage: undefined};
          }
        }
        return p;
      }),
    );
  };

  const getSelectedUser = (userId: number): User | undefined => {
    return availableUsers.find(u => u.id === userId) || searchResults.find(u => u.id === userId);
  };

  const getPaidByName = (): string => {
    if (paidBy === user?.id) return 'you';
    const paidByUser = getSelectedUser(paidBy);
    return paidByUser?.name || 'Unknown';
  };

  const getSplitTypeLabel = (): string => {
    const labels: Record<SplitType, string> = {
      equal: 'equally',
      exact: 'exact amounts',
      percentage: 'by percentage',
      shares: 'by shares',
      adjustment: 'by adjustment',
      reimbursement: 'reimbursement',
      itemized: 'itemized',
    };
    return labels[splitType] || 'equally';
  };

  const calculatePerPerson = (): string => {
    if (!amount || participants.length === 0) return '0.00';
    const total = parseFloat(amount);
    const perPerson = total / participants.length;
    return perPerson.toFixed(2);
  };

  const handleSubmit = async () => {
    // Validations
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0');
      return;
    }

    if (participants.length < 2) {
      Alert.alert('Error', 'Please add at least one other participant');
      return;
    }

    // Validate splits
    if (splitType === 'exact') {
      const total = participants.reduce((sum, p) => sum + (p.amount || 0), 0);
      if (Math.abs(total - parseFloat(amount)) > 0.01) {
        Alert.alert('Error', 'Exact amounts must equal the total amount');
        return;
      }
    } else if (splitType === 'percentage') {
      const total = participants.reduce((sum, p) => sum + (p.percentage || 0), 0);
      if (Math.abs(total - 100) > 0.01) {
        Alert.alert('Error', 'Percentages must equal 100%');
        return;
      }
    }

    setLoading(true);
    try {
      await apiClient.createExpense({
        group_id: groupId,
        description: description.trim(),
        amount: parseFloat(amount),
        currency,
        date,
        notes: notes.trim() || undefined,
        paid_by: paidBy,
        participants,
        split_type: splitType as 'equal' | 'exact' | 'percentage' | 'shares',
        category_id: categoryId,
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <ScreenWrapper>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Page Heading */}
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, {color: textColor}]}>Add Expense</Text>
          </View>

          {/* Participants Section */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            <Text style={[styles.sectionLabel, {color: secondaryTextColor}]}>With you and:</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.searchInput, {backgroundColor: backgroundColor, color: textColor}]}
                placeholder="Enter names or email addresses"
                placeholderTextColor={secondaryTextColor}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchResults.length > 0 && (
                <View style={[styles.searchResults, {backgroundColor: cardBackground}]}>
                  {searchResults.map(result => (
                    <TouchableOpacity
                      key={result.id}
                      style={styles.searchResultItem}
                      onPress={() => addParticipant(result)}>
                      <Text style={[styles.searchResultText, {color: textColor}]}>{result.name}</Text>
                      <Text style={[styles.searchResultEmail, {color: secondaryTextColor}]}>{result.email}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.chipsContainer}>
              {participants.map((p, index) => {
                const participantUser = getSelectedUser(p.user_id);
                const isYou = p.user_id === user?.id;
                return (
                  <View
                    key={`participant-${p.user_id}-${index}`}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isYou ? primaryColor + '20' : colors.surface + '80',
                      },
                    ]}>
                    <Text style={[styles.chipText, {color: isYou ? primaryColor : textColor}]}>
                      {isYou ? 'You' : participantUser?.name || 'Unknown'}
                    </Text>
                    {!isYou && (
                      <TouchableOpacity onPress={() => removeParticipant(p.user_id)} style={styles.chipRemove}>
                        <MaterialIcons name="close" size={16} color={textColor} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Expense Details */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            <View style={styles.expenseDetailsRow}>
              {/* Receipt Upload */}
              <TouchableOpacity
                style={[styles.receiptArea, {borderColor: colors.border}]}
                onPress={() => setShowReceipt(!showReceipt)}>
                <MaterialIcons name="receipt" size={32} color={secondaryTextColor} />
                <Text style={[styles.receiptText, {color: secondaryTextColor}]}>Receipt</Text>
              </TouchableOpacity>

              {/* Description and Amount */}
              <View style={styles.expenseInputs}>
                <TextInput
                  style={[styles.descriptionInput, {color: textColor, borderBottomColor: secondaryTextColor + '30'}]}
                  placeholder="Enter a description"
                  placeholderTextColor={secondaryTextColor}
                  value={description}
                  onChangeText={setDescription}
                />
                <View style={styles.amountRow}>
                  <TouchableOpacity
                    style={[styles.currencyButton, {backgroundColor: backgroundColor}]}
                    onPress={() => setShowCurrencyModal(true)}>
                    <Text style={[styles.currencyText, {color: textColor}]}>
                      {currency} ({currencies.find(c => c.code === currency)?.symbol || '$'})
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={20} color={textColor} />
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.amountInput, {color: textColor, borderBottomColor: secondaryTextColor + '30'}]}
                    placeholder="0.00"
                    placeholderTextColor={secondaryTextColor}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Paid By and Split */}
          <View style={[styles.section, styles.paidBySection, {backgroundColor: cardBackground}]}>
            <View style={styles.paidByRow}>
              <Text style={[styles.paidByText, {color: textColor}]}>Paid by</Text>
              <TouchableOpacity
                style={[styles.paidByButton, {backgroundColor: primaryColor}]}
                onPress={() => setShowPaidByModal(true)}>
                <Text style={styles.paidByButtonText}>{getPaidByName()}</Text>
              </TouchableOpacity>
              <Text style={[styles.paidByText, {color: textColor}]}>and split</Text>
              <TouchableOpacity
                style={[styles.paidByButton, {backgroundColor: primaryColor}]}
                onPress={() => setShowSplitModal(true)}>
                <Text style={styles.paidByButtonText}>{getSplitTypeLabel()}</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.splitPerPerson, {color: secondaryTextColor}]}>
              ({currency}{calculatePerPerson()}/person)
            </Text>
          </View>

          {/* Split Inputs (for exact, percentage, shares) */}
          {splitType !== 'equal' && participants.length > 0 && (
            <View style={[styles.section, {backgroundColor: cardBackground}]}>
              <Text style={[styles.sectionLabel, {color: textColor}]}>Split Details</Text>
              {participants.map((p, index) => {
                const participantUser = getSelectedUser(p.user_id);
                return (
                  <View key={`split-${p.user_id}-${index}`} style={styles.splitRow}>
                    <Text style={[styles.splitRowName, {color: textColor}]}>
                      {p.user_id === user?.id ? 'You' : participantUser?.name || 'Unknown'}
                    </Text>
                    <TextInput
                      style={[styles.splitInput, {backgroundColor: backgroundColor, color: textColor}]}
                      placeholder={
                        splitType === 'exact'
                          ? 'Amount'
                          : splitType === 'percentage'
                          ? '%'
                          : 'Shares'
                      }
                      placeholderTextColor={secondaryTextColor}
                      value={
                        splitType === 'exact'
                          ? p.amount?.toString() || ''
                          : splitType === 'percentage'
                          ? p.percentage?.toString() || ''
                          : p.shares?.toString() || ''
                      }
                      onChangeText={text => updateParticipantSplit(p.user_id, parseFloat(text) || 0)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                );
              })}
            </View>
          )}

          {/* Date and Category */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            <View style={styles.dateCategoryRow}>
              <TouchableOpacity
                style={styles.dateContainer}
                onPress={() => setShowDatePicker(true)}>
                <Text style={[styles.fieldLabel, {color: secondaryTextColor}]}>Date</Text>
                <View style={[styles.dateInput, {backgroundColor: backgroundColor}]}>
                  <Text style={[styles.dateText, {color: textColor}]}>
                    {date
                      ? (() => {
                          try {
                            const dateObj = new Date(date);
                            if (isNaN(dateObj.getTime())) return date;
                            return dateObj.toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            });
                          } catch {
                            return date;
                          }
                        })()
                      : 'Select date'}
                  </Text>
                  <MaterialIcons name="calendar-today" size={20} color={secondaryTextColor} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryButton, {borderColor: colors.border}]}
                onPress={() => setShowCategoryModal(true)}>
                <MaterialIcons name="folder" size={20} color={secondaryTextColor} />
                <Text style={[styles.categoryButtonText, {color: categoryId ? textColor : secondaryTextColor}]}>
                  {categoryId ? categories.find(c => c.id === categoryId)?.name : 'Category (Optional)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notes (Collapsible) */}
          {!showNotes ? (
            <TouchableOpacity
              style={[styles.section, styles.addNotesButton, {backgroundColor: cardBackground, borderColor: colors.border}]}
              onPress={() => setShowNotes(true)}>
              <MaterialIcons name="add" size={20} color={textColor} />
              <Text style={[styles.addNotesText, {color: textColor}]}>Add notes</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.section, {backgroundColor: cardBackground}]}>
              <View style={styles.notesHeader}>
                <Text style={[styles.fieldLabel, {color: textColor}]}>Notes</Text>
                <TouchableOpacity onPress={() => setShowNotes(false)}>
                  <MaterialIcons name="close" size={20} color={secondaryTextColor} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.notesInput, {backgroundColor: backgroundColor, color: textColor}]}
                placeholder="Add any additional notes"
                placeholderTextColor={secondaryTextColor}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}>
              <Text style={[styles.cancelButtonText, {color: textColor}]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, {backgroundColor: primaryColor}]}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Paid By Modal */}
        <Modal visible={showPaidByModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
              <Text style={[styles.modalTitle, {color: textColor}]}>Who paid?</Text>
              <ScrollView style={styles.modalScroll}>
                {participants.map((p, index) => {
                  const participantUser = getSelectedUser(p.user_id);
                  const isSelected = paidBy === p.user_id;
                  return (
                    <TouchableOpacity
                      key={`paidby-${p.user_id}-${index}`}
                      style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                      onPress={() => {
                        setPaidBy(p.user_id);
                        setShowPaidByModal(false);
                      }}>
                      <Text style={[styles.modalOptionText, {color: textColor}]}>
                        {p.user_id === user?.id ? 'You' : participantUser?.name || 'Unknown'}
                      </Text>
                      {isSelected && <MaterialIcons name="check" size={20} color={primaryColor} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowPaidByModal(false)}>
                <Text style={[styles.modalCloseText, {color: textColor}]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Split Type Modal */}
        <Modal visible={showSplitModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
              <Text style={[styles.modalTitle, {color: textColor}]}>How to split</Text>
              <ScrollView style={styles.modalScroll}>
                {(['equal', 'exact', 'percentage', 'shares', 'adjustment', 'reimbursement', 'itemized'] as SplitType[]).map(type => {
                  const labels: Record<SplitType, {title: string; description: string}> = {
                    equal: {title: 'Equally', description: 'Split the total equally'},
                    exact: {title: 'Exact amounts', description: 'Enter exact amounts for each person'},
                    percentage: {title: 'By percentage', description: 'Split by percentage'},
                    shares: {title: 'By shares', description: 'Split by shares (e.g., 1:2:3)'},
                    adjustment: {title: 'By adjustment', description: 'Manually adjust amounts for each person'},
                    reimbursement: {title: 'Reimbursement', description: 'One person is being reimbursed'},
                    itemized: {title: 'Itemized expense', description: 'Split by individual items'},
                  };
                  const isSelected = splitType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                      onPress={() => {
                        setSplitType(type);
                        setShowSplitModal(false);
                      }}>
                      <View>
                        <Text style={[styles.modalOptionText, {color: textColor}]}>{labels[type].title}</Text>
                        <Text style={[styles.modalOptionDesc, {color: secondaryTextColor}]}>
                          {labels[type].description}
                        </Text>
                      </View>
                      {isSelected && <MaterialIcons name="check" size={20} color={primaryColor} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowSplitModal(false)}>
                <Text style={[styles.modalCloseText, {color: textColor}]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Currency Modal */}
        <Modal visible={showCurrencyModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, {color: textColor}]}>Select Currency</Text>
                <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                  <MaterialIcons name="close" size={24} color={textColor} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {currencies.map(curr => {
                  const isSelected = currency === curr.code;
                  return (
                    <TouchableOpacity
                      key={curr.code}
                      style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                      onPress={() => {
                        setCurrency(curr.code);
                        setShowCurrencyModal(false);
                      }}>
                      <View>
                        <Text style={[styles.modalOptionText, {color: textColor}]}>
                          {curr.code} ({curr.symbol})
                        </Text>
                        <Text style={[styles.modalOptionDesc, {color: secondaryTextColor}]}>
                          {curr.name}
                        </Text>
                      </View>
                      {isSelected && <MaterialIcons name="check" size={20} color={primaryColor} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Date Picker Modal */}
        <Modal visible={showDatePicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, {color: textColor}]}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <MaterialIcons name="close" size={24} color={textColor} />
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerContainer}>
                {/* Date input with proper format */}
                <TextInput
                  style={[styles.datePickerInput, {backgroundColor: backgroundColor, color: textColor}]}
                  value={date}
                  onChangeText={(text) => {
                    // Allow YYYY-MM-DD format
                    const cleaned = text.replace(/[^\d-]/g, '');
                    if (cleaned.length <= 10) {
                      setDate(cleaned);
                    }
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={secondaryTextColor}
                  keyboardType="numeric"
                />
                {/* Quick date selection buttons */}
                <View style={styles.quickDateButtons}>
                  <TouchableOpacity
                    style={[styles.quickDateButton, {backgroundColor: primaryColor + '20'}]}
                    onPress={() => {
                      const today = new Date();
                      const year = today.getFullYear();
                      const month = String(today.getMonth() + 1).padStart(2, '0');
                      const day = String(today.getDate()).padStart(2, '0');
                      setDate(`${year}-${month}-${day}`);
                      setShowDatePicker(false);
                    }}>
                    <Text style={[styles.quickDateText, {color: primaryColor}]}>Today</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickDateButton, {backgroundColor: primaryColor + '20'}]}
                    onPress={() => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      const year = yesterday.getFullYear();
                      const month = String(yesterday.getMonth() + 1).padStart(2, '0');
                      const day = String(yesterday.getDate()).padStart(2, '0');
                      setDate(`${year}-${month}-${day}`);
                      setShowDatePicker(false);
                    }}>
                    <Text style={[styles.quickDateText, {color: primaryColor}]}>Yesterday</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowDatePicker(false)}>
                <Text style={[styles.modalCloseText, {color: textColor}]}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Category Modal */}
        <Modal visible={showCategoryModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, {color: textColor}]}>Select Category</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <MaterialIcons name="close" size={24} color={textColor} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                <TouchableOpacity
                  style={[styles.modalOption, !categoryId && {backgroundColor: primaryColor + '20'}]}
                  onPress={() => {
                    setCategoryId(undefined);
                    setShowCategoryModal(false);
                  }}>
                  <Text style={[styles.modalOptionText, {color: textColor}]}>None</Text>
                  {!categoryId && <MaterialIcons name="check" size={20} color={primaryColor} />}
                </TouchableOpacity>
                {categories.map(cat => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                      onPress={() => {
                        setCategoryId(cat.id);
                        setShowCategoryModal(false);
                      }}>
                      <Text style={[styles.modalOptionText, {color: textColor}]}>
                        {cat.icon} {cat.name}
                      </Text>
                      {isSelected && <MaterialIcons name="check" size={20} color={primaryColor} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScreenWrapper>
    </View>
  );
}
