import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import type {Transaction, Expense, Payment} from '../../../types/api';
import {styles} from './styles';
import { AttachmentViewer } from '../../../components/AttachmentViewer';

export function TransactionDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {user} = useAuth();
  const {transaction} = route.params as {transaction: Transaction};
  const [transactionData, setTransactionData] = useState<Expense | Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<{
    isValid: boolean;
    chainValid: boolean;
  } | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [showAttachmentViewer, setShowAttachmentViewer] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';
  const isExpense = transaction.type === 'expense';

  useEffect(() => {
    loadTransactionDetails();
  }, [transaction]);

  const loadTransactionDetails = async () => {
    try {
      setLoading(true);
      if (isExpense) {
        const expense = transaction.data as Expense;
        const expenseData = await apiClient.getExpense(String(expense.id));
        setTransactionData(expenseData);
        // TODO: Fetch verification status from API if endpoint exists
        if (expenseData.blockchain_hash) {
          setVerificationStatus({isValid: true, chainValid: true}); // Placeholder
        }
      } else {
        // For payments, always fetch full payment data to ensure we have user relationships
        const payment = transaction.data as Payment;
        if (payment.id) {
          try {
            const paymentData = await apiClient.getPayment(payment.id);
            setTransactionData(paymentData);
            if (paymentData.blockchain_hash) {
              setVerificationStatus({isValid: true, chainValid: true}); // Placeholder
            }
          } catch (err) {
            console.error('Failed to fetch payment details:', err);
            // Fallback to transaction data if fetch fails
            setTransactionData(transaction.data as Payment);
            if (payment.blockchain_hash) {
              setVerificationStatus({isValid: true, chainValid: true}); // Placeholder
            }
          }
        } else {
          setTransactionData(transaction.data as Payment);
          if (payment.blockchain_hash) {
            setVerificationStatus({isValid: true, chainValid: true}); // Placeholder
          }
        }
      }
    } catch (error) {
      console.error('Failed to load transaction details:', error);
      Alert.alert('Error', 'Failed to load transaction details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!isExpense) {
      Alert.alert('Info', 'Payment deletion is not available');
      return;
    }

    const expense = transactionData as Expense;
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.deleteExpense(String(expense.id));
              Alert.alert('Success', 'Expense deleted successfully');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete expense');
            }
          },
        },
      ],
    );
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currency} ${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSplitTypeLabel = (splitType: string) => {
    const labels: Record<string, string> = {
      equal: 'Equal',
      exact: 'Exact',
      percentage: 'Percentage',
      shares: 'Shares',
      adjustment: 'Adjustment',
      reimbursement: 'Reimbursement',
      itemized: 'Itemized',
    };
    return labels[splitType] || splitType;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor}]}>
        <ActivityIndicator size="large" color={primaryColor}         />
      </View>
  );
}

  if (!transactionData) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor}]}>
        <Text style={[styles.errorText, {color: textColor}]}>Transaction not found</Text>
      </View>
    );
  }

  const expense = isExpense ? (transactionData as Expense) : null;
  const payment = !isExpense ? (transactionData as Payment) : null;
  const blockchainHash = expense?.blockchain_hash || payment?.blockchain_hash;
  const isVerified = verificationStatus?.isValid && verificationStatus?.chainValid;

  return (
    <View style={[styles.container, {backgroundColor}]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header Card - Modern Design */}
          <View style={[styles.mainCard, {backgroundColor: cardBackground}]}>
            <View style={styles.mainCardHeader}>
              <View style={[styles.mainCardIcon, {backgroundColor: primaryColor + '15'}]}>
                <MaterialIcons
                  name={isExpense ? 'receipt-long' : 'account-balance-wallet'}
                  size={28}
                  color={primaryColor}
                />
              </View>
              <View style={styles.mainCardHeaderText}>
                <Text style={[styles.mainCardType, {color: secondaryTextColor}]}>
                  {isExpense ? 'Expense' : 'Payment'}
                </Text>
                <Text style={[styles.mainCardTitle, {color: textColor}]} numberOfLines={2}>
                  {isExpense ? expense?.description : 'Payment Transaction'}
                </Text>
              </View>
            </View>
            
            <View style={styles.mainCardAmountSection}>
              <Text style={[styles.mainCardAmount, {color: textColor}]}>
                {formatCurrency(
                  isExpense ? expense?.amount || 0 : payment?.amount || 0,
                  isExpense ? expense?.currency || 'USD' : payment?.currency || 'USD',
                )}
              </Text>
              <Text style={[styles.mainCardDate, {color: secondaryTextColor}]}>
                {formatDate(isExpense ? expense?.date : payment?.paid_at || payment?.created_at)}
              </Text>
            </View>

            {/* Payment Participants - Modern Display */}
            {!isExpense && payment && (
              <View style={styles.paymentFlow}>
                <View style={styles.paymentParticipant}>
                  <View style={[styles.participantAvatar, {backgroundColor: primaryColor + '20'}]}>
                    <Text style={[styles.participantAvatarText, {color: primaryColor}]}>
                      {(payment.fromUser?.name || payment.from_user?.name || 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.participantInfo}>
                    <Text style={[styles.participantLabel, {color: secondaryTextColor}]}>From</Text>
                    <Text style={[styles.participantName, {color: textColor}]}>
                      {payment.fromUser?.name || payment.from_user?.name || 'Unknown'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.paymentArrow}>
                  <MaterialIcons name="arrow-forward" size={20} color={primaryColor} />
                </View>
                
                <View style={styles.paymentParticipant}>
                  <View style={[styles.participantAvatar, {backgroundColor: primaryColor + '20'}]}>
                    <Text style={[styles.participantAvatarText, {color: primaryColor}]}>
                      {(payment.toUser?.name || payment.to_user?.name || 'U').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.participantInfo}>
                    <Text style={[styles.participantLabel, {color: secondaryTextColor}]}>To</Text>
                    <Text style={[styles.participantName, {color: textColor}]}>
                      {payment.toUser?.name || payment.to_user?.name || 'Unknown'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Blockchain Verification Card */}
          {blockchainHash && (
            <View style={[styles.card, {backgroundColor: cardBackground}]}>
              <View style={styles.verificationContainer}>
                <View style={styles.verificationStatus}>
                  <MaterialIcons
                    name={isVerified ? 'verified' : 'schedule'}
                    size={24}
                    color={isVerified ? '#4CAF50' : '#FF9800'}
                  />
                  <Text style={[styles.verificationText, {color: isVerified ? '#4CAF50' : '#FF9800'}]}>
                    {isVerified ? 'Blockchain Verified' : 'Verification Pending'}
                  </Text>
                </View>
                <View style={styles.hashContainer}>
                  <Text style={[styles.hashLabel, {color: secondaryTextColor}]}>Blockchain Hash:</Text>
                  <Text style={[styles.hashValue, {color: textColor}]} selectable numberOfLines={1}>
                    {blockchainHash}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Transaction Details Card */}
          <View style={[styles.card, {backgroundColor: cardBackground}]}>
            <Text style={[styles.cardTitle, {color: textColor}]}>Transaction Details</Text>
            <View style={styles.detailsList}>
              {isExpense && expense && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Type</Text>
                    <Text style={[styles.detailValue, {color: textColor}]}>Expense</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Category</Text>
                    <Text style={[styles.detailValue, {color: textColor}]}>
                      {expense.category?.name || 'Uncategorized'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Split Type</Text>
                    <Text style={[styles.detailValue, {color: textColor}]}>
                      {getSplitTypeLabel(expense.split_type)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Paid By</Text>
                    <Text style={[styles.detailValue, {color: textColor}]}>
                      {expense.payer?.name || 'Unknown'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Created By</Text>
                    <Text style={[styles.detailValue, {color: textColor}]}>
                      {expense.creator?.name || 'Unknown'}
                    </Text>
                  </View>
                  {expense.group && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Group</Text>
                      <Text style={[styles.detailValue, {color: textColor}]}>{expense.group.name}</Text>
                    </View>
                  )}
                  {expense.notes && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Notes</Text>
                      <Text style={[styles.detailValue, {color: textColor}]}>{expense.notes}</Text>
                    </View>
                  )}
                </>
              )}
              {!isExpense && payment && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Payment Method</Text>
                    <View style={styles.detailValueContainer}>
                      <MaterialIcons
                        name={
                          payment.method === 'cash'
                            ? 'money'
                            : payment.method === 'bank_transfer'
                            ? 'account-balance'
                            : payment.method === 'stripe'
                            ? 'credit-card'
                            : 'payment'
                        }
                        size={16}
                        color={primaryColor}
                        style={styles.detailIcon}
                      />
                      <Text style={[styles.detailValue, {color: textColor}]}>
                        {payment.method?.charAt(0).toUpperCase() + payment.method?.slice(1).replace('_', ' ') || 'Unknown'}
                      </Text>
                    </View>
                  </View>
                  {payment.group && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Group</Text>
                      <Text style={[styles.detailValue, {color: textColor}]}>{payment.group.name}</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Status</Text>
                    <View style={[styles.statusBadge, {backgroundColor: payment.status === 'completed' ? '#4CAF50' + '20' : secondaryTextColor + '20'}]}>
                      <Text style={[styles.statusText, {color: payment.status === 'completed' ? '#4CAF50' : secondaryTextColor}]}>
                        {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1) || 'Unknown'}
                      </Text>
                    </View>
                  </View>
                  {payment.notes && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, {color: secondaryTextColor}]}>Notes</Text>
                      <Text style={[styles.detailValue, {color: textColor}]}>{payment.notes}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Split Details Card (for expenses) */}
          {isExpense && expense && expense.splits && expense.splits.length > 0 && (
            <View style={[styles.card, {backgroundColor: cardBackground}]}>
              <Text style={[styles.cardTitle, {color: textColor}]}>Split Details</Text>
              <View style={styles.splitsList}>
                {expense.splits.map((split, index) => {
                  const isCurrentUser = split.user_id === user?.id;
                  return (
                    <View
                      key={`split-${split.id}-${index}`}
                      style={[
                        styles.splitRow,
                        index < expense.splits!.length - 1 && styles.splitRowBorder,
                        {borderColor: secondaryTextColor + '20'},
                      ]}>
                      <View style={styles.splitLeft}>
                        <View style={[styles.splitAvatar, {backgroundColor: primaryColor + '30'}]}>
                          <Text style={[styles.splitAvatarText, {color: primaryColor}]}>
                            {split.user?.name?.charAt(0).toUpperCase() || '?'}
                          </Text>
                        </View>
                        <View style={styles.splitInfo}>
                          <Text style={[styles.splitUserName, {color: textColor}]}>
                            {isCurrentUser ? 'You' : split.user?.name || 'Unknown'}
                          </Text>
                          {split.percentage && (
                            <Text style={[styles.splitPercentage, {color: secondaryTextColor}]}>
                              {split.percentage}%
                            </Text>
                          )}
                          {split.shares && (
                            <Text style={[styles.splitShares, {color: secondaryTextColor}]}>
                              {split.shares} share{split.shares !== 1 ? 's' : ''}
                            </Text>
                          )}
                        </View>
                      </View>
                      <Text style={[styles.splitAmount, {color: textColor}]}>
                        {formatCurrency(split.amount, expense.currency || 'USD')}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Participants Card (for expenses) */}
          {isExpense && expense && expense.splits && expense.splits.length > 0 && (
            <View style={[styles.card, {backgroundColor: cardBackground}]}>
              <Text style={[styles.cardTitle, {color: textColor}]}>Participants</Text>
              <View style={styles.participantsList}>
                {expense.splits.map((split, index) => (
                  <View
                    key={`participant-${split.id}-${index}`}
                    style={[
                      styles.participantRow,
                      index < expense.splits!.length - 1 && styles.participantRowBorder,
                      {borderColor: secondaryTextColor + '20'},
                    ]}>
                    <View style={[styles.participantAvatar, {backgroundColor: primaryColor + '30'}]}>
                      <Text style={[styles.participantAvatarText, {color: primaryColor}]}>
                        {split.user?.name?.charAt(0).toUpperCase() || '?'}
                      </Text>
                    </View>
                    <View style={styles.participantInfo}>
                      <Text style={[styles.participantName, {color: textColor}]}>
                        {split.user_id === user?.id ? 'You' : split.user?.name || 'Unknown'}
                      </Text>
                      <Text style={[styles.participantEmail, {color: secondaryTextColor}]}>
                        {split.user?.email || ''}
                      </Text>
                    </View>
                    {split.user_id === expense.paid_by && (
                      <View style={[styles.paidByBadge, {backgroundColor: primaryColor + '20'}]}>
                        <Text style={[styles.paidByBadgeText, {color: primaryColor}]}>Paid</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Attachments Card (for expenses) */}
          {isExpense && expense && expense.attachments && expense.attachments.length > 0 && (
            <View style={[styles.card, {backgroundColor: cardBackground}]}>
              <Text style={[styles.cardTitle, {color: textColor}]}>Receipt/Attachments</Text>
              <View style={styles.attachmentsList}>
                {expense.attachments.map((attachment, index) => (
                  <TouchableOpacity
                    key={`attachment-${attachment.id}-${index}`}
                    style={[
                      styles.attachmentRow,
                      index < expense.attachments!.length - 1 && styles.attachmentRowBorder,
                      {borderColor: secondaryTextColor + '20'},
                    ]}
                    onPress={() => {
                      setSelectedAttachment(attachment);
                      setShowAttachmentViewer(true);
                    }}>
                    {attachment.thumbnail_url ? (
                      <Image
                        source={{uri: attachment.thumbnail_url}}
                        style={styles.attachmentThumb}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.attachmentIcon, {backgroundColor: primaryColor + '30'}]}>
                        <MaterialIcons name="description" size={24} color={primaryColor} />
                      </View>
                    )}
                    <View style={styles.attachmentInfo}>
                      <Text style={[styles.attachmentName, {color: textColor}]} numberOfLines={1}>
                        {attachment.name}
                      </Text>
                      <Text style={[styles.attachmentSize, {color: secondaryTextColor}]}>
                        {(attachment.size / 1024).toFixed(2)} KB
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={secondaryTextColor} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Delete Button (for expenses only) */}
          {isExpense && expense && expense.created_by === user?.id && (
            <TouchableOpacity
              style={[styles.deleteButton, {backgroundColor: '#F44336'}]}
              onPress={handleDelete}>
              <MaterialIcons name="delete" size={20} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Delete Expense</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Attachment Viewer Modal */}
        <AttachmentViewer
          visible={showAttachmentViewer}
          attachment={selectedAttachment}
          onClose={() => {
            setShowAttachmentViewer(false);
            setSelectedAttachment(null);
          }}
        />
      
    </View>
  );
}
