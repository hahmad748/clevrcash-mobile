import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {apiClient} from '../../../services/apiClient';
import type {Expense, Category, Currency, User} from '../../../types/api';
import {styles} from './styles';
import { showError } from '../../../utils/flashMessage';

export function EditExpenseScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {expenseId} = route.params as {expenseId: string};
  const [expense, setExpense] = useState<Expense | null>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExpense();
    loadCategories();
    loadCurrencies();
  }, [expenseId]);

  const loadExpense = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getExpense(expenseId);
      setExpense(data);
      setDescription(data.description);
      setAmount(data.amount.toString());
      setCurrency(data.currency);
      setDate(data.date.split('T')[0]);
      setCategoryId(data.category?.id || null);
      setNotes(data.notes || '');
    } catch (error) {
      console.error('Failed to load expense:', error);
      showError('Error', 'Failed to load expense details');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadCurrencies = async () => {
    try {
      const data = await apiClient.getCurrencies();
      setCurrencies(data);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    }
  };

  const handleSave = async () => {
    if (!description.trim()) {
      showError('Error', 'Please enter a description');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showError('Error', 'Please enter a valid amount');
      return;
    }

    setSaving(true);
    try {
      await apiClient.updateExpense(expenseId, {
        description: description.trim(),
        amount: parseFloat(amount),
        currency,
        date,
        category_id: categoryId || undefined,
        notes: notes.trim() || undefined,
      });
      Alert.alert('Success', 'Expense updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      showError('Error', error.message || 'Failed to update expense');
    } finally {
      setSaving(false);
    }
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

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Description *</Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
              ]}
              placeholder="What was this expense for?"
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, {color: colors.text}]}>Amount *</Text>
              <TextInput
                style={[
                  styles.input,
                  {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
                ]}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, {color: colors.text}]}>Currency</Text>
              <View style={styles.currencyScroll}>
                {currencies.slice(0, 10).map(curr => (
                  <TouchableOpacity
                    key={curr.code}
                    style={[
                      styles.currencyButton,
                      {
                        backgroundColor: currency === curr.code ? colors.primary : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setCurrency(curr.code)}>
                    <Text
                      style={[
                        styles.currencyButtonText,
                        {color: currency === curr.code ? '#FFFFFF' : colors.text},
                      ]}>
                      {curr.code}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, {color: colors.text}]}>Date</Text>
              <TextInput
                style={[
                  styles.input,
                  {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
                ]}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, {color: colors.text}]}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor:
                          categoryId === cat.id ? colors.primary : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setCategoryId(categoryId === cat.id ? null : cat.id)}>
                    <Text
                      style={[
                        styles.categoryButtonText,
                        {color: categoryId === cat.id ? '#FFFFFF' : colors.text},
                      ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Notes</Text>
            <TextInput
              style={[
                styles.textArea,
                {backgroundColor: colors.surface, color: colors.text, borderColor: colors.border},
              ]}
              placeholder="Add notes (optional)"
              placeholderTextColor={colors.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, {backgroundColor: colors.primary}]}
            onPress={handleSave}
            disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
