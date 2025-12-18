import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import {launchCamera, launchImageLibrary, ImagePickerResponse, MediaType} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {useRoute, useNavigation, useFocusEffect} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import {ScreenWrapper} from '../../../components/ScreenWrapper';
import {CurrencyModal} from '../../../components/modals/CurrencyModal';
import {CategoryModal} from '../../../components/modals/CategoryModal';
import {SplitTypeModal, type SplitType} from '../../../components/modals/SplitTypeModal';
import {DatePickerModal} from '../../../components/modals/DatePickerModal';
import {PaidByModal} from '../../../components/modals/PaidByModal';
import type {User, Category, Currency} from '../../../types/api';
import {styles} from './styles';


interface Participant {
  user_id: number;
  amount?: number;
  percentage?: number;
  shares?: number;
}

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  quantity: number;
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
  const [groupCurrency, setGroupCurrency] = useState<string | null>(null);
  const [numericGroupId, setNumericGroupId] = useState<number | undefined>(undefined);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [categoryName, setCategoryName] = useState<string | undefined>();
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [paidBy, setPaidBy] = useState<number>(user?.id || 0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [reimbursedUserId, setReimbursedUserId] = useState<number | undefined>();
  const [items, setItems] = useState<ExpenseItem[]>([]);

  // UI state
  const [showNotes, setShowNotes] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaidByModal, setShowPaidByModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [receiptType, setReceiptType] = useState<'image' | 'document' | null>(null);
  const [receiptName, setReceiptName] = useState<string | null>(null);

  // Data state
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchInputLayout, setSearchInputLayout] = useState<{x: number; y: number; width: number; height: number} | null>(null);

  // Loading state
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Reset form function
  const resetForm = useCallback(() => {
    setDescription('');
    setAmount('');
    setCurrency(defaultCurrency);
    setGroupCurrency(null);
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setCategoryId(undefined);
    setCategoryName(undefined);
    setSplitType('equal');
    setPaidBy(user?.id || 0);
    setParticipants([]);
    setReimbursedUserId(undefined);
    setItems([]);
    setSearchQuery('');
    setSearchResults([]);
    setReceiptUri(null);
    setReceiptType(null);
    setReceiptName(null);
    setNumericGroupId(undefined);
  }, [defaultCurrency, user?.id]);

  // Reset form when screen loses focus (user navigates away)
  useFocusEffect(
    React.useCallback(() => {
      // Load data when screen comes into focus
      loadInitialData();
      return () => {
        // Cleanup: Reset form when screen loses focus
        resetForm();
      };
    }, [resetForm, loadInitialData]),
  );

  useEffect(() => {
    if (splitType === 'equal' && participants.length > 0 && amount) {
      const splitAmount = parseFloat(amount) / participants.length;
      setParticipants(prev =>
        prev.map(p => ({...p, amount: splitAmount, percentage: undefined, shares: undefined})),
      );
    } else if (splitType === 'itemized' && items.length > 0) {
      // Calculate total from items
      const total = items.reduce((sum, item) => sum + item.amount * item.quantity, 0);
      setAmount(total.toFixed(2));
    }
  }, [amount, participants.length, splitType, items]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoadingData(true);

      // Load participants based on context
      if (groupId) {
        const group = await apiClient.getGroup(groupId);
        const groupMembers = group.members?.map(m => m.user!).filter(Boolean) || [];
        // Remove duplicates
        const uniqueMembers = groupMembers
          .filter((m, index, self) => index === self.findIndex(mem => mem.id === m.id));
        setAvailableUsers(uniqueMembers.filter(Boolean));
        // Select all group members by default
        setParticipants(uniqueMembers.map(m => ({user_id: m.id})));
        // Store numeric group ID for API call (groupId from route might be hash)
        setNumericGroupId(group.id);
        // Set group currency as default
        if (group.currency) {
          setGroupCurrency(group.currency);
          setCurrency(group.currency);
        }
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
        // No group or friend context - show friends list for participant selection
        const friends = await apiClient.getFriends();
        setAvailableUsers([user!, ...friends].filter(Boolean));
        // Only select current user by default when no group/friend context
        setParticipants([{user_id: user!.id}]);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
      Alert.alert('Error', 'Failed to load required data');
    } finally {
      setLoadingData(false);
    }
  }, [groupId, friendId, user]);

  const searchUsers = async (query: string) => {
    try {
      if (groupId) {
        // When in group context, search within group members
        const filtered = availableUsers.filter(
          u =>
            u.id !== user?.id &&
            (u.name.toLowerCase().includes(query.toLowerCase()) ||
              u.email?.toLowerCase().includes(query.toLowerCase())),
        );
        setSearchResults(filtered);
      } else {
        // When not in group, search friends
        const results = await apiClient.getFriends({search: query});
        setSearchResults(results.filter(u => u.id !== user?.id));
      }
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
          if (splitType === 'exact' || splitType === 'adjustment') {
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

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: '',
        amount: 0,
        quantity: 1,
      },
    ]);
  };

  const updateItem = (itemId: string, field: 'name' | 'amount' | 'quantity', value: string | number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              [field]: field === 'name' ? value : parseFloat(String(value)) || 0,
            }
          : item,
      ),
    );
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleReceiptPicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library', 'Choose Document'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleTakePhoto();
          } else if (buttonIndex === 2) {
            handleChooseFromLibrary();
          } else if (buttonIndex === 3) {
            handleChooseDocument();
          }
        },
      );
    } else {
      Alert.alert(
        'Select Receipt',
        'Choose an option',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Take Photo', onPress: handleTakePhoto},
          {text: 'Choose from Library', onPress: handleChooseFromLibrary},
          {text: 'Choose Document', onPress: handleChooseDocument},
        ],
      );
    }
  };

  const handleTakePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 2048,
        maxHeight: 2048,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setReceiptUri(asset.uri || null);
          setReceiptType('image');
          setReceiptName(asset.fileName || 'receipt.jpg');
        }
      },
    );
  };

  const handleChooseFromLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 2048,
        maxHeight: 2048,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setReceiptUri(asset.uri || null);
          setReceiptType('image');
          setReceiptName(asset.fileName || asset.uri?.split('/').pop() || 'receipt.jpg');
        }
      },
    );
  };

  const handleChooseDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images, DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });

      if (result && result[0]) {
        const file = result[0];
        setReceiptUri(file.uri);
        setReceiptType('document');
        setReceiptName(file.name || 'document');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled
        return;
      }
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const removeReceipt = () => {
    setReceiptUri(null);
    setReceiptType(null);
    setReceiptName(null);
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
    } else if (splitType === 'reimbursement') {
      if (!reimbursedUserId) {
        Alert.alert('Error', 'Please select who is being reimbursed');
        return;
      }
    } else if (splitType === 'itemized') {
      if (items.length === 0) {
        Alert.alert('Error', 'Please add at least one item');
        return;
      }
      const hasInvalidItems = items.some(item => !item.name.trim() || item.amount <= 0);
      if (hasInvalidItems) {
        Alert.alert('Error', 'Please fill in all item names and amounts');
        return;
      }
    }

    setLoading(true);
    try {
      // Prepare split_data based on split type
      let splitData: Record<string, any> = {};
      if (splitType === 'reimbursement' && reimbursedUserId) {
        splitData = {reimbursed_user_id: reimbursedUserId};
      } else if (splitType === 'adjustment' || splitType === 'exact' || splitType === 'percentage' || splitType === 'shares') {
        participants.forEach(p => {
          if (splitType === 'exact' || splitType === 'adjustment') {
            splitData[p.user_id] = p.amount || 0;
          } else if (splitType === 'percentage') {
            splitData[p.user_id] = p.percentage || 0;
          } else if (splitType === 'shares') {
            splitData[p.user_id] = p.shares || 0;
          }
        });
      }

      // Prepare items for itemized expenses
      const expenseItems = splitType === 'itemized' && items.length > 0
        ? items.map(item => ({
            name: item.name,
            amount: item.amount,
            quantity: item.quantity,
          }))
        : undefined;

      const expense = await apiClient.createExpense({
        group_id: numericGroupId,
        description: description.trim(),
        amount: parseFloat(amount),
        currency,
        date,
        notes: notes.trim() || undefined,
        paid_by: paidBy,
        participants,
        split_type: splitType as 'equal' | 'exact' | 'percentage' | 'shares' | 'adjustment' | 'reimbursement' | 'itemized',
        split_data: Object.keys(splitData).length > 0 ? splitData : undefined,
        items: expenseItems,
        category_id: categoryId,
      });

      // Upload receipt if available
      if (receiptUri && expense.id) {
        try {
          const formData = new FormData();
          // Handle URI format for both platforms
          const fileUri = Platform.OS === 'android' && !receiptUri.startsWith('file://') 
            ? `file://${receiptUri}` 
            : receiptUri;
          
          // Determine MIME type
          let mimeType = 'image/jpeg';
          if (receiptType === 'document') {
            const extension = receiptName?.split('.').pop()?.toLowerCase();
            if (extension === 'pdf') {
              mimeType = 'application/pdf';
            } else if (['png', 'jpg', 'jpeg'].includes(extension || '')) {
              mimeType = `image/${extension === 'png' ? 'png' : 'jpeg'}`;
            }
          }

          formData.append('file', {
            uri: fileUri,
            type: mimeType,
            name: receiptName || (receiptType === 'image' ? 'receipt.jpg' : 'receipt.pdf'),
          } as any);
          
          await apiClient.uploadExpenseAttachment(expense.id, formData);
        } catch (error: any) {
          console.error('Failed to upload receipt:', error);
          // Don't block navigation if receipt upload fails
          Alert.alert('Warning', 'Expense created but receipt upload failed');
        }
      }

      // Reset form before navigating back
      resetForm();
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
          <View style={[styles.section, styles.participantsSection, {backgroundColor: cardBackground}]}>
            <Text style={[styles.sectionLabel, {color: secondaryTextColor}]}>
              {groupId ? 'Group Members' : 'With you and:'}
            </Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.searchInput, {backgroundColor: backgroundColor, color: textColor}]}
                placeholder={groupId ? 'Search group members' : 'Search friends by name or email'}
                placeholderTextColor={secondaryTextColor}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onLayout={(event) => {
                  const {x, y, width, height} = event.nativeEvent.layout;
                  setSearchInputLayout({x, y, width, height});
                }}
              />
              {searchResults.length > 0 && (
                <View style={[styles.searchResults, {backgroundColor: cardBackground}]}>
                  {searchResults.map(result => {
                    const isAlreadyAdded = participants.some(p => p.user_id === result.id);
                    return (
                      <TouchableOpacity
                        key={result.id}
                        style={[
                          styles.searchResultItem,
                          isAlreadyAdded && {opacity: 0.5},
                        ]}
                        onPress={() => !isAlreadyAdded && addParticipant(result)}
                        disabled={isAlreadyAdded}>
                          <View>
                            <Text style={[styles.searchResultText, {color: textColor}]}>{result.name}</Text>
                            <Text style={[styles.searchResultEmail, {color: secondaryTextColor}]}>{result.email}</Text>
                          </View>
                        {isAlreadyAdded && (
                          <MaterialIcons name="check-circle" size={20} color={primaryColor} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              {!searchQuery && availableUsers.length > 1 && (
                <View style={styles.availableFriendsContainer}>
                  <Text style={[styles.availableFriendsLabel, {color: secondaryTextColor}]}>
                    {groupId ? 'Group Members:' : 'Your Friends:'}
                  </Text>
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
              {receiptUri ? (
                <TouchableOpacity
                  style={styles.receiptPreviewContainer}
                  onPress={handleReceiptPicker}
                  activeOpacity={0.8}>
                  {receiptType === 'image' ? (
                    <Image source={{uri: receiptUri}} style={styles.receiptPreview} />
                  ) : (
                    <View style={[styles.receiptPreview, styles.receiptDocumentPreview]}>
                      <MaterialIcons name="description" size={32} color={primaryColor} />
                      <Text style={[styles.receiptDocumentName, {color: textColor}]} numberOfLines={1}>
                        {receiptName}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={[styles.removeReceiptButton, {backgroundColor: '#F44336'}]}
                    onPress={(e) => {
                      e.stopPropagation();
                      removeReceipt();
                    }}>
                    <MaterialIcons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.receiptArea, {borderColor: colors.border}]}
                  onPress={handleReceiptPicker}>
                  <MaterialIcons name="receipt" size={32} color={secondaryTextColor} />
                  <Text style={[styles.receiptText, {color: secondaryTextColor}]}>Receipt</Text>
                </TouchableOpacity>
              )}

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
                      {currency}
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

          {/* Split Inputs (for exact, percentage, shares, adjustment) */}
          {splitType !== 'equal' && splitType !== 'reimbursement' && splitType !== 'itemized' && participants.length > 0 && (
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
                        splitType === 'exact' || splitType === 'adjustment'
                          ? 'Amount'
                          : splitType === 'percentage'
                          ? '%'
                          : 'Shares'
                      }
                      placeholderTextColor={secondaryTextColor}
                      value={
                        splitType === 'exact' || splitType === 'adjustment'
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

          {/* Reimbursement Selection */}
          {splitType === 'reimbursement' && participants.length > 0 && (
            <View style={[styles.section, {backgroundColor: cardBackground}]}>
              <Text style={[styles.sectionLabel, {color: textColor}]}>Who is being reimbursed?</Text>
              <View style={styles.reimbursementSelect}>
                {participants.map((p, index) => {
                  const participantUser = getSelectedUser(p.user_id);
                  const isSelected = reimbursedUserId === p.user_id;
                  return (
                    <TouchableOpacity
                      key={`reimburse-${p.user_id}-${index}`}
                      style={[
                        styles.reimbursementOption,
                        isSelected && {backgroundColor: primaryColor + '20'},
                      ]}
                      onPress={() => setReimbursedUserId(p.user_id)}>
                      <Text style={[styles.reimbursementOptionText, {color: textColor}]}>
                        {p.user_id === user?.id ? 'You' : participantUser?.name || 'Unknown'}
                      </Text>
                      {isSelected && <MaterialIcons name="check" size={20} color={primaryColor} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Itemized Expenses */}
          {splitType === 'itemized' && (
            <View style={[styles.section, {backgroundColor: cardBackground}]}>
              <View style={styles.itemizedHeader}>
                <Text style={[styles.sectionLabel, {color: textColor}]}>Items</Text>
                <TouchableOpacity
                  style={[styles.addItemButton, {backgroundColor: primaryColor}]}
                  onPress={addItem}>
                  <MaterialIcons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.addItemText}>Add Item</Text>
                </TouchableOpacity>
              </View>
              {items.length === 0 ? (
                <Text style={[styles.emptyText, {color: secondaryTextColor}]}>
                  No items added. Click "Add Item" to start.
                </Text>
              ) : (
                <View style={styles.itemsList}>
                  {items.map((item, index) => (
                    <View key={item.id} style={[styles.itemCard, {backgroundColor: backgroundColor}]}>
                      <View style={styles.itemRow}>
                        <TextInput
                          style={[styles.itemNameInput, {color: textColor}]}
                          placeholder="Item name"
                          placeholderTextColor={secondaryTextColor}
                          value={item.name}
                          onChangeText={text => updateItem(item.id, 'name', text)}
                        />
                        <TextInput
                          style={[styles.itemAmountInput, {color: textColor}]}
                          placeholder="Amount"
                          placeholderTextColor={secondaryTextColor}
                          value={item.amount.toString()}
                          onChangeText={text => updateItem(item.id, 'amount', text)}
                          keyboardType="decimal-pad"
                        />
                      </View>
                      <View style={styles.itemRow}>
                        <TextInput
                          style={[styles.itemQuantityInput, {color: textColor}]}
                          placeholder="Qty"
                          placeholderTextColor={secondaryTextColor}
                          value={item.quantity.toString()}
                          onChangeText={text => updateItem(item.id, 'quantity', text)}
                          keyboardType="number-pad"
                        />
                        <TouchableOpacity
                          style={styles.removeItemButton}
                          onPress={() => removeItem(item.id)}>
                          <MaterialIcons name="delete" size={20} color="#F44336" />
                          <Text style={[styles.removeItemText, {color: '#F44336'}]}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
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
                style={[]}
                onPress={() => setShowCategoryModal(true)}>
                  <Text style={[styles.fieldLabel, {color: secondaryTextColor}]}>Category</Text>
                  <View style={[styles.categoryButton, {borderColor: colors.border}]}>

                    <MaterialIcons name="folder" size={20} color={secondaryTextColor} />
                    <Text style={[styles.categoryButtonText, {color: categoryId ? textColor : secondaryTextColor}]}>
                      {categoryName || 'Category (Optional)'}
                    </Text>
                  </View>
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

        {/* Modal Components */}
        <PaidByModal
          visible={showPaidByModal}
          participants={participants}
          selectedPaidBy={paidBy}
          currentUserId={user?.id}
          getParticipantName={(userId) => {
            if (userId === user?.id) return 'You';
            const participantUser = getSelectedUser(userId);
            return participantUser?.name || 'Unknown';
          }}
          onSelect={setPaidBy}
          onClose={() => setShowPaidByModal(false)}
        />

        <SplitTypeModal
          visible={showSplitModal}
          selectedSplitType={splitType}
          onSelect={setSplitType}
          onClose={() => setShowSplitModal(false)}
        />

        <CurrencyModal
          visible={showCurrencyModal}
          selectedCurrency={currency}
          onSelect={setCurrency}
          onClose={() => setShowCurrencyModal(false)}
        />

        <DatePickerModal
          visible={showDatePicker}
          selectedDate={date}
          onSelect={setDate}
          onClose={() => setShowDatePicker(false)}
        />

        <CategoryModal
          visible={showCategoryModal}
          selectedCategoryId={categoryId}
          onSelect={(id) => {
            setCategoryId(id);
            if (id) {
              // Fetch category name for display
              apiClient.getCategories().then(categories => {
                const cat = categories.find(c => c.id === id);
                setCategoryName(cat ? `${cat.icon} ${cat.name}` : undefined);
              }).catch(() => {
                setCategoryName(undefined);
              });
            } else {
              setCategoryName(undefined);
            }
          }}
          onClose={() => setShowCategoryModal(false)}
        />
      </ScreenWrapper>
    </View>
  );
}
