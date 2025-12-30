import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import type {Expense} from '../../../types/api';
import {styles} from './styles';
import { showError } from '../../../utils/flashMessage';

export function ExpenseDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {user} = useAuth();
  const {expenseId} = route.params as {expenseId: string};
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpense();
  }, [expenseId]);

  const loadExpense = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getExpense(expenseId);
      setExpense(data);
    } catch (error) {
      console.error('Failed to load expense:', error);
      showError('Error', 'Failed to load expense details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.deleteExpense(expenseId);
              navigation.goBack();
            } catch (error: any) {
              showError('Error', error.message || 'Failed to delete expense');
            }
          },
        },
      ],
    );
  };

  const formatCurrency = (amount: number | undefined | null, currency: string = 'USD') => {
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return `${currency} 0.00`;
    }
    return `${currency} ${Number(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <Text style={[styles.errorText, {color: colors.text}]}>Expense not found</Text>
      </View>
    );
  }

  // Safety check: ensure amount exists
  if (expense.amount === undefined || expense.amount === null) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor: colors.background}]}>
        <Text style={[styles.errorText, {color: colors.text}]}>Invalid expense data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={[styles.header, {backgroundColor: colors.surface, borderColor: colors.border}]}>
          <Text style={[styles.description, {color: colors.text}]}>{expense.description}</Text>
          <Text style={[styles.amount, {color: colors.text}]}>
            {formatCurrency(expense.amount, expense.currency || 'USD')}
          </Text>
          <Text style={[styles.date, {color: colors.textSecondary}]}>
            {formatDate(expense.date)}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Details</Text>
          
          <View style={[styles.detailRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Text style={[styles.detailLabel, {color: colors.textSecondary}]}>Paid by</Text>
            <Text style={[styles.detailValue, {color: colors.text}]}>
              {expense.payer?.name || 'Unknown'}
            </Text>
          </View>

          <View style={[styles.detailRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            <Text style={[styles.detailLabel, {color: colors.textSecondary}]}>Created by</Text>
            <Text style={[styles.detailValue, {color: colors.text}]}>
              {expense.creator?.name || 'Unknown'}
            </Text>
          </View>

          {expense.category && (
            <View style={[styles.detailRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
              <Text style={[styles.detailLabel, {color: colors.textSecondary}]}>Category</Text>
              <Text style={[styles.detailValue, {color: colors.text}]}>
                {expense.category.name}
              </Text>
            </View>
          )}

          {expense.notes && (
            <View style={[styles.detailRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
              <Text style={[styles.detailLabel, {color: colors.textSecondary}]}>Notes</Text>
              <Text style={[styles.detailValue, {color: colors.text}]}>{expense.notes}</Text>
            </View>
          )}
        </View>

        {/* Splits */}
        {expense.splits && expense.splits.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Split Details</Text>
            {expense.splits.map(split => (
              <View
                key={split.id}
                style={[styles.splitRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
                <Text style={[styles.splitUserName, {color: colors.text}]}>
                  {split.user?.name || 'Unknown'}
                </Text>
                <Text style={[styles.splitAmount, {color: colors.text}]}>
                  {formatCurrency(split.amount, expense.currency || 'USD')}
                </Text>
                {split.percentage && (
                  <Text style={[styles.splitPercentage, {color: colors.textSecondary}]}>
                    ({split.percentage}%)
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Items */}
        {expense.items && expense.items.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Items</Text>
            {expense.items.map(item => (
              <View
                key={item.id}
                style={[styles.itemRow, {backgroundColor: colors.surface, borderColor: colors.border}]}>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, {color: colors.text}]}>{item.name}</Text>
                  {item.quantity && (
                    <Text style={[styles.itemQuantity, {color: colors.textSecondary}]}>
                      Qty: {item.quantity}
                    </Text>
                  )}
                </View>
                <Text style={[styles.itemAmount, {color: colors.text}]}>
                  {formatCurrency(item.amount, expense.currency || 'USD')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Attachments */}
        {expense.attachments && expense.attachments.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Attachments</Text>
            {expense.attachments.map(attachment => (
              <TouchableOpacity
                key={attachment.id}
                style={[styles.attachmentRow, {backgroundColor: colors.surface, borderColor: colors.border}]}
                onPress={() => {
                  // TODO: Open attachment viewer
                }}>
                {attachment.thumbnail_url ? (
                  <Image source={{uri: attachment.thumbnail_url}} style={styles.attachmentThumb} />
                ) : (
                  <View style={[styles.attachmentIcon, {backgroundColor: colors.primary}]}>
                    <Text style={styles.attachmentIconText}>📎</Text>
                  </View>
                )}
                <View style={styles.attachmentInfo}>
                  <Text style={[styles.attachmentName, {color: colors.text}]}>
                    {attachment.name}
                  </Text>
                  <Text style={[styles.attachmentSize, {color: colors.textSecondary}]}>
                    {(attachment.size / 1024).toFixed(2)} KB
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Actions */}
        {expense.created_by === user?.id && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.editButton, {backgroundColor: colors.primary}]}
              onPress={() =>
                navigation.navigate('EditExpense' as never, {
                  expenseId: expense.blockchain_hash || expense.id.toString(),
                } as never)
              }>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteButton, {backgroundColor: colors.error}]}
              onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
