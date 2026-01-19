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
import {pick, keepLocalCopy, types} from '@react-native-documents/picker';
import {useRoute, useNavigation} from '@react-navigation/native';
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
  const {colors} = useTheme();
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
  const [imageLoading, setImageLoading] = useState(false);

  // UI state
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);

  // Data state
  const [_group, setGroup] = useState<Group | null>(null);
  const [_balances, setBalances] = useState<Balance[]>([]);
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
    // Reset tracking flags
    userHasSetCurrency.current = false;
    userHasSetAmount.current = false;
    userHasSetFrom.current = false;
    userHasSetTo.current = false;
    hasLoadedInitialData.current = false;
  }, [defaultCurrency, prefillAmount]);

  const loadGroupData = useCallback(async () => {
    try {
      setLoading(true);
      const [groupData, balancesData] = await Promise.all([
        apiClient.getGroup(groupId),
        apiClient.getGroupBalances(groupId),
      ]);
      setGroup(groupData);
      setBalances(balancesData.balances || []);
      
      // Set group currency as default (only if user hasn't manually set it)
      // This prevents overwriting user-entered currency when returning from picker
      if (groupData.currency && !userHasSetCurrency.current) {
        setCurrency(groupData.currency);
      }

      // Get all group members for selection
      const groupMembers = groupData.members?.map(m => m.user!).filter(Boolean) || [];
      const uniqueMembers = groupMembers.filter(
        (m, index, self) => index === self.findIndex(mem => mem.id === m.id),
      );
      setAvailableUsers(uniqueMembers.filter(Boolean));

      // Pre-select users based on balance logic (only on initial load)
      // Only set from/to if user hasn't manually selected them
      if (!userHasSetFrom.current || !userHasSetTo.current) {
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
                if (!userHasSetFrom.current) setFromUserId(targetMemberId);
                if (!userHasSetTo.current) setToUserId(user?.id || null);
              } else if (balance < 0) {
                // User owes member (user owes) → User pays member
                if (!userHasSetFrom.current) setFromUserId(user?.id || null);
                if (!userHasSetTo.current) setToUserId(targetMemberId);
              }
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

  // Track if user has manually set currency/amount/from/to (to prevent overwriting)
  const userHasSetCurrency = React.useRef(false);
  const userHasSetAmount = React.useRef(false);
  const userHasSetFrom = React.useRef(false);
  const userHasSetTo = React.useRef(false);
  const hasLoadedInitialData = React.useRef(false);

  useEffect(() => {
    if (!hasLoadedInitialData.current) {
      hasLoadedInitialData.current = true;
      loadGroupData();
    }
  }, [loadGroupData]);

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
    setImageLoading(true);
    launchCamera(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 2048,
        maxHeight: 2048,
        saveToPhotos: false,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          setImageLoading(false);
          return;
        }
        if (response.errorMessage) {
          setImageLoading(false);
          showError('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          // Ensure proper URI format for Android
          let imageUri = asset.uri || null;
          if (imageUri && Platform.OS === 'android' && !imageUri.startsWith('file://')) {
            imageUri = `file://${imageUri}`;
          }
          setReceiptType('image');
          setReceiptName(asset.fileName || 'receipt.jpg');
          // Set URI last and reset loading after a small delay to allow image to render
          setReceiptUri(imageUri);
          // Reset loading state after a short delay as fallback if onLoadEnd doesn't fire
          setTimeout(() => {
            setImageLoading(false);
          }, 100);
        } else {
          setImageLoading(false);
        }
      },
    );
  };

  const handleChooseFromLibrary = () => {
    setImageLoading(true);
    launchImageLibrary(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 2048,
        maxHeight: 2048,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          setImageLoading(false);
          return;
        }
        if (response.errorMessage) {
          setImageLoading(false);
          showError('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          // Ensure proper URI format for Android
          let imageUri = asset.uri || null;
          if (imageUri && Platform.OS === 'android' && !imageUri.startsWith('file://')) {
            imageUri = `file://${imageUri}`;
          }
          setReceiptType('image');
          setReceiptName(asset.fileName || asset.uri?.split('/').pop() || 'receipt.jpg');
          // Set URI last and reset loading after a small delay to allow image to render
          setReceiptUri(imageUri);
          // Reset loading state after a short delay as fallback if onLoadEnd doesn't fire
          setTimeout(() => {
            setImageLoading(false);
          }, 100);
        } else {
          setImageLoading(false);
        }
      },
    );
  };

  const handleChooseDocument = async () => {
    try {
      const [file] = await pick({
        type: [types.pdf, types.images, types.allFiles],
      });

      if (file) {
        // Keep a local copy in caches directory
        const [localCopy] = await keepLocalCopy({
          files: [
            {
              uri: file.uri,
              fileName: file.name ?? 'document',
            },
          ],
          destination: 'cachesDirectory',
        });

        // Handle LocalCopyResponse which can be success or error
        if (localCopy.status === 'success') {
          setReceiptUri(localCopy.localUri);
          setReceiptType('document');
          setReceiptName(file.name || 'document');
        } else {
          // If copy failed, use original file URI
          setReceiptUri(file.uri);
          setReceiptType('document');
          setReceiptName(file.name || 'document');
        }
      }
    } catch (err: any) {
      // Check if user cancelled
      if (err?.message?.includes('cancel') || err?.code === 'DOCUMENT_PICKER_CANCELED') {
        return;
      }
      showError('Error', 'Failed to pick document');
    }
  };

  const removeReceipt = () => {
    setReceiptUri(null);
    setReceiptType(null);
    setReceiptName(null);
    setImageLoading(false);
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

      // Upload receipt if available
      if (receiptUri && payment.id) {
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
            } else if (extension === 'png') {
              mimeType = 'image/png';
            } else if (extension === 'jpg' || extension === 'jpeg') {
              mimeType = 'image/jpeg';
            }
          } else {
            // For images, try to determine from URI or default to jpeg
            if (receiptUri.toLowerCase().endsWith('.png')) {
              mimeType = 'image/png';
            } else if (receiptUri.toLowerCase().endsWith('.jpg') || receiptUri.toLowerCase().endsWith('.jpeg')) {
              mimeType = 'image/jpeg';
            }
          }

          formData.append('file', {
            uri: fileUri,
            type: mimeType,
            name: receiptName || (receiptType === 'image' ? 'receipt.jpg' : 'receipt.pdf'),
          } as any);

          console.log('Uploading receipt for payment:', payment.id, {fileUri, mimeType, name: receiptName});
          const attachment = await apiClient.uploadPaymentAttachment(payment.id, formData);
          console.log('Receipt uploaded successfully:', attachment);
        } catch (error: any) {
          console.error('Failed to upload receipt:', error);
          // Don't fail the entire operation if receipt upload fails
          showError('Warning', `Payment recorded but receipt upload failed: ${error.message || 'Unknown error'}`);
        }
      }

      // resetForm();
      navigation.goBack();
      showSuccess('Success', receiptUri ? 'Payment recorded with receipt successfully' : 'Payment recorded successfully');
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

  const backgroundColor = colors.background;
  const cardBackground = colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.textSecondary;

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
                onPress={() => {
                  userHasSetFrom.current = true;
                  setShowFromModal(true);
                }}>
                <Text style={[styles.paidByButtonText, {color: textColor}]}>{getUserName(fromUserId)}</Text>
                <MaterialIcons name="arrow-drop-down" size={20} color={textColor} />
              </TouchableOpacity>
              <Text style={[styles.paidByText, {color: textColor}]}>to</Text>
              <TouchableOpacity
                style={[styles.paidByButton, {backgroundColor: backgroundColor}]}
                onPress={() => {
                  userHasSetTo.current = true;
                  setShowToModal(true);
                }}>
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
                onPress={() => {
                  userHasSetCurrency.current = true;
                  setShowCurrencyModal(true);
                }}>
                <Text style={[styles.currencyText, {color: textColor}]}>{currency}</Text>
                <MaterialIcons name="arrow-drop-down" size={20} color={textColor} />
              </TouchableOpacity>
              <TextInput
                style={[styles.amountInput, {color: textColor, borderBottomColor: secondaryTextColor + '30'}]}
                placeholder="0.00"
                placeholderTextColor={secondaryTextColor}
                value={amount}
                onChangeText={(text) => {
                  userHasSetAmount.current = true;
                  setAmount(text);
                }}
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
            {receiptUri || imageLoading ? (
              <TouchableOpacity
                style={styles.receiptPreviewContainer}
                onPress={handleReceiptPicker}
                activeOpacity={0.8}>
                {imageLoading && !receiptUri ? (
                  <View style={[styles.receiptPreview, styles.receiptDocumentPreview, {justifyContent: 'center', alignItems: 'center'}]}>
                    <ActivityIndicator size="large" color={primaryColor} />
                    <Text style={[styles.receiptDocumentName, {color: textColor, marginTop: 8}]}>
                      Loading image...
                    </Text>
                  </View>
                ) : receiptUri && receiptType === 'image' ? (
                  <View style={styles.receiptPreview}>
                    {imageLoading && (
                      <View style={[styles.receiptPreview, {position: 'absolute', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 1}]}>
                        <ActivityIndicator size="small" color={primaryColor} />
                      </View>
                    )}
                    <Image
                      source={{uri: receiptUri}}
                      style={styles.receiptPreview}
                      resizeMode="contain"
                      onLoadStart={() => setImageLoading(true)}
                      onLoadEnd={() => {
                        setImageLoading(false);
                      }}
                      onError={(error) => {
                        setImageLoading(false);
                        console.error('Image load error:', error);
                        showError('Error', 'Failed to load image');
                      }}
                    />
                  </View>
                ) : receiptUri && receiptType === 'document' ? (
                  <View style={[styles.receiptPreview, styles.receiptDocumentPreview]}>
                    <MaterialIcons name="description" size={32} color={primaryColor} />
                    <Text style={[styles.receiptDocumentName, {color: textColor}]} numberOfLines={1}>
                      {receiptName}
                    </Text>
                  </View>
                ) : null}
                {receiptUri && (
                  <TouchableOpacity
                    style={[styles.removeReceiptButton, {backgroundColor: '#F44336'}]}
                    onPress={(e) => {
                      e.stopPropagation();
                      removeReceipt();
                    }}>
                    <MaterialIcons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
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
          onSelect={(userId) => {
            userHasSetFrom.current = true;
            setFromUserId(userId);
          }}
          onClose={() => setShowFromModal(false)}
          getParticipantName={(userId) => getUserName(userId)}
        />

        <FromToModal
          visible={showToModal}
          users={availableUsers}
          selectedUserId={toUserId}
          currentUserId={user?.id}
          title="To"
          onSelect={(userId) => {
            userHasSetTo.current = true;
            setToUserId(userId);
          }}
          onClose={() => setShowToModal(false)}
          getParticipantName={(userId) => getUserName(userId)}
        />

        <CurrencyModal
          visible={showCurrencyModal}
          selectedCurrency={currency}
          onSelect={(selectedCurrency) => {
            userHasSetCurrency.current = true;
            setCurrency(selectedCurrency);
          }}
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
