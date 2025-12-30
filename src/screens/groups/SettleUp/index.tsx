import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
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
import {CurrencyModal} from '../../../components/modals/CurrencyModal';
import {PaymentMethodModal} from '../../../components/modals/PaymentMethodModal';
import {FromToModal} from '../../../components/modals/FromToModal';
import type {Group, Balance, User} from '../../../types/api';
import {styles} from './styles';
import { showError, showSuccess } from '../../../utils/flashMessage';

export function SettleUpGroupScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {user} = useAuth();
  const {groupId, friendId, amount: prefillAmount} = (route.params as any) || {};

  const primaryColor = brand?.primary_color || colors.primary;
  const defaultCurrency = user?.default_currency || 'USD';

  // Form state
  const [fromUserId, setFromUserId] = useState<number | null>(null);
  const [toUserId, setToUserId] = useState<number | null>(null);
  const [amount, setAmount] = useState(prefillAmount ? String(prefillAmount) : '');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [method, setMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [receiptType, setReceiptType] = useState<'image' | 'document' | null>(null);
  const [receiptName, setReceiptName] = useState<string | null>(null);

  // UI state
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);

  // Data state
  const [group, setGroup] = useState<Group | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState(false);

  // Reset form function
  const resetForm = useCallback(() => {
    setFromUserId(null);
    setToUserId(null);
    setAmount(prefillAmount ? String(prefillAmount) : '');
    setCurrency(defaultCurrency);
    setMethod('cash');
    setNotes('');
    setShowNotes(false);
    setReceiptUri(null);
    setReceiptType(null);
    setReceiptName(null);
  }, [defaultCurrency, prefillAmount]);

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  // Reset form when screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      loadGroupData();
      return () => {
        resetForm();
      };
    }, [resetForm]),
  );

  const loadGroupData = useCallback(async () => {
    try {
      setLoading(true);
      const [groupData, balancesData] = await Promise.all([
        apiClient.getGroup(groupId),
        apiClient.getGroupBalances(groupId),
      ]);
      setGroup(groupData);
      setBalances(balancesData.balances || []);
      
      // Set group currency as default
      if (groupData.currency) {
        setCurrency(groupData.currency);
      }

      // Get all group members for selection
      const groupMembers = groupData.members?.map(m => m.user!).filter(Boolean) || [];
      const uniqueMembers = groupMembers.filter(
        (m, index, self) => index === self.findIndex(mem => mem.id === m.id),
      );
      setAvailableUsers(uniqueMembers.filter(Boolean));

      // Pre-select users based on balance logic
      // If friendId is provided, use that specific member
      // Otherwise, find the first member with a non-zero balance
      const targetMemberId = friendId || (() => {
        const firstNonZeroBalance = balancesData.balances?.find((b: any) => 
          b.user_id !== user?.id && Math.abs(b.balance || 0) > 0.01
        );
        return firstNonZeroBalance?.user_id;
      })();

      if (targetMemberId) {
        const targetMember = uniqueMembers.find(m => m.id === targetMemberId);
        if (targetMember) {
          // Find the balance between current user and target member
          // Based on GroupDetail logic:
          // - balance > 0: Label says "owes you" → Member owes user → Member pays user
          // - balance < 0: Label says "you owe" → User owes member → User pays member
          const memberBalance = balancesData.balances?.find((b: any) => b.user_id === targetMemberId);
          
          if (memberBalance) {
            const balance = memberBalance.balance || 0;
            if (balance > 0) {
              // Member owes user (user is owed) → Member pays user
              setFromUserId(targetMemberId);
              setToUserId(user?.id || null);
            } else if (balance < 0) {
              // User owes member (user owes) → User pays member
              setFromUserId(user?.id || null);
              setToUserId(targetMemberId);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load group data:', error);
      showError('Error', 'Failed to load group data');
    } finally {
      setLoading(false);
    }
  }, [groupId, friendId, user?.id]);

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
        if (response.didCancel) return;
        if (response.errorMessage) {
          showError('Error', response.errorMessage);
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
        if (response.didCancel) return;
        if (response.errorMessage) {
          showError('Error', response.errorMessage);
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
        return;
      }
      showError('Error', 'Failed to pick document');
    }
  };

  const removeReceipt = () => {
    setReceiptUri(null);
    setReceiptType(null);
    setReceiptName(null);
  };

  const getUserName = (userId: number | null): string => {
    if (!userId) return 'Select';
    if (userId === user?.id) return 'You';
    const foundUser = availableUsers.find(u => u.id === userId);
    return foundUser?.name || 'Unknown';
  };

  const getMethodLabel = (methodValue: string): string => {
    const methodMap: Record<string, string> = {
      cash: 'Cash',
      bank_transfer: 'Bank Transfer',
      stripe: 'Stripe',
      paypal: 'PayPal',
      manual: 'Manual',
      other: 'Other',
    };
    return methodMap[methodValue] || methodValue;
  };

  const handleSettle = async () => {
    if (!fromUserId || !toUserId) {
      showError('Error', 'Please select who paid and who received');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      showError('Error', 'Please enter a valid amount');
      return;
    }
    if (fromUserId === toUserId) {
      showError('Error', 'From and To users must be different');
      return;
    }

    setSettling(true);
    try {
      const payment = await apiClient.settleUpInGroup(groupId, {
        amount: parseFloat(amount),
        currency,
        method,
        notes: notes.trim() || undefined,
        from_user_id: fromUserId,
        to_user_id: toUserId,
      });

      // TODO: Upload receipt if API endpoint is available
      // For now, receipt is stored but not uploaded
      // if (receiptUri && payment.id) {
      //   try {
      //     const formData = new FormData();
      //     const fileUri = Platform.OS === 'android' && !receiptUri.startsWith('file://') 
      //       ? `file://${receiptUri}` 
      //       : receiptUri;
      //     let mimeType = 'image/jpeg';
      //     if (receiptType === 'document') {
      //       const extension = receiptName?.split('.').pop()?.toLowerCase();
      //       if (extension === 'pdf') {
      //         mimeType = 'application/pdf';
      //       }
      //     }
      //     formData.append('file', {
      //       uri: fileUri,
      //       type: mimeType,
      //       name: receiptName || (receiptType === 'image' ? 'receipt.jpg' : 'receipt.pdf'),
      //     } as any);
      //     // await apiClient.uploadPaymentAttachment(payment.id, formData);
      //   } catch (error: any) {
      //     console.error('Failed to upload receipt:', error);
      //   }
      // }

      resetForm();
      navigation.goBack();
      showSuccess('Success', 'Payment recorded successfully');
    } catch (error: any) {
      showError('Error', error.message || 'Failed to record payment');
    } finally {
      setSettling(false);
    }
  };

  if (loading) {
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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Page Heading */}
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, {color: textColor}]}>Settle Payment</Text>
          </View>

          {/* Paid By and To Section */}
          <View style={[styles.section, styles.paidBySection, {backgroundColor: cardBackground}]}>
            <View style={styles.paidByRow}>
              <Text style={[styles.paidByText, {color: textColor}]}>Paid by</Text>
              <TouchableOpacity
                style={[styles.paidByButton, {backgroundColor: backgroundColor}]}
                onPress={() => setShowFromModal(true)}>
                <Text style={[styles.paidByButtonText, {color: textColor}]}>{getUserName(fromUserId)}</Text>
                <MaterialIcons name="arrow-drop-down" size={20} color={textColor} />
              </TouchableOpacity>
              <Text style={[styles.paidByText, {color: textColor}]}>to</Text>
              <TouchableOpacity
                style={[styles.paidByButton, {backgroundColor: backgroundColor}]}
                onPress={() => setShowToModal(true)}>
                <Text style={[styles.paidByButtonText, {color: textColor}]}>{getUserName(toUserId)}</Text>
                <MaterialIcons name="arrow-drop-down" size={20} color={textColor} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount and Currency Section */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            <Text style={[styles.sectionLabel, {color: secondaryTextColor}]}>Amount</Text>
            <View style={styles.amountRow}>
              <TouchableOpacity
                style={[styles.currencyButton, {backgroundColor: backgroundColor}]}
                onPress={() => setShowCurrencyModal(true)}>
                <Text style={[styles.currencyText, {color: textColor}]}>{currency}</Text>
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

          {/* Payment Method Section */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            <Text style={[styles.sectionLabel, {color: secondaryTextColor}]}>Payment Method</Text>
            <TouchableOpacity
              style={[styles.selectButton, {backgroundColor: backgroundColor}]}
              onPress={() => setShowMethodModal(true)}>
              <Text style={[styles.selectButtonText, {color: textColor}]}>{getMethodLabel(method)}</Text>
              <MaterialIcons name="arrow-drop-down" size={20} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Receipt Section */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            <Text style={[styles.sectionLabel, {color: secondaryTextColor}]}>Receipt/Invoice (Optional)</Text>
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
                <Text style={[styles.receiptText, {color: secondaryTextColor}]}>Choose File</Text>
                <Text style={[styles.receiptHint, {color: secondaryTextColor}]}>
                  JPG, PNG, or PDF (max 10MB)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Description Section */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            {!showNotes ? (
              <TouchableOpacity
                style={styles.addNotesButton}
                onPress={() => setShowNotes(true)}>
                <MaterialIcons name="add" size={20} color={primaryColor} />
                <Text style={[styles.addNotesText, {color: primaryColor}]}>Description (Optional)</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <Text style={[styles.sectionLabel, {color: secondaryTextColor}]}>Description (Optional)</Text>
                <TextInput
                  style={[styles.notesInput, {color: textColor}]}
                  placeholder="Add a note about this payment"
                  placeholderTextColor={secondaryTextColor}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, {borderColor: secondaryTextColor}]}
              onPress={() => navigation.goBack()}>
              <Text style={[styles.cancelButtonText, {color: textColor}]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, {backgroundColor: primaryColor}]}
              onPress={handleSettle}
              disabled={settling}>
              {settling ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Record Payment</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal Components */}
        <FromToModal
          visible={showFromModal}
          users={availableUsers}
          selectedUserId={fromUserId}
          currentUserId={user?.id}
          title="Paid by"
          onSelect={setFromUserId}
          onClose={() => setShowFromModal(false)}
          getParticipantName={(userId) => getUserName(userId)}
        />

        <FromToModal
          visible={showToModal}
          users={availableUsers}
          selectedUserId={toUserId}
          currentUserId={user?.id}
          title="To"
          onSelect={setToUserId}
          onClose={() => setShowToModal(false)}
          getParticipantName={(userId) => getUserName(userId)}
        />

        <CurrencyModal
          visible={showCurrencyModal}
          selectedCurrency={currency}
          onSelect={setCurrency}
          onClose={() => setShowCurrencyModal(false)}
        />

        <PaymentMethodModal
          visible={showMethodModal}
          selectedMethod={method}
          onSelect={setMethod}
          onClose={() => setShowMethodModal(false)}
        />
    </View>
  );
}
