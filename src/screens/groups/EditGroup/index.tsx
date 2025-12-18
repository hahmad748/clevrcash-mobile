import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import {CurrencyModal} from '../../../components/modals/CurrencyModal';
import type {Group} from '../../../types/api';
import {styles} from './styles';

export function EditGroupScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {groupId} = route.params as {groupId: string};
  const [group, setGroup] = useState<Group | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getGroup(groupId);
      setGroup(data);
      setName(data.name);
      setDescription(data.description || '');
      setCurrency(data.currency);
      // Show description field if there's existing description, otherwise keep it collapsed
      setShowDescription(!!data.description);
    } catch (error) {
      console.error('Failed to load group:', error);
      Alert.alert('Error', 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    setSaving(true);
    try {
      await apiClient.updateGroup(groupId, {
        name: name.trim(),
        description: description.trim() || undefined,
        currency,
      });
      Alert.alert('Success', 'Group updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update group');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, {backgroundColor}]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Page Heading */}
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, {color: textColor}]}>Edit Group</Text>
          </View>

          {/* Group Name Section */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            <Text style={[styles.sectionLabel, {color: secondaryTextColor}]}>Group Name</Text>
            <TextInput
              style={[styles.input, {color: textColor, borderBottomColor: secondaryTextColor + '30'}]}
              placeholder="e.g., Roommates, Vacation 2024"
              placeholderTextColor={secondaryTextColor}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Description Section */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            {!showDescription ? (
              <TouchableOpacity
                style={styles.addDescriptionButton}
                onPress={() => setShowDescription(true)}>
                <MaterialIcons name="add" size={20} color={primaryColor} />
                <Text style={[styles.addDescriptionText, {color: primaryColor}]}>
                  Description (Optional)
                </Text>
              </TouchableOpacity>
            ) : (
              <View>
                <Text style={[styles.sectionLabel, {color: secondaryTextColor}]}>
                  Description (Optional)
                </Text>
                <TextInput
                  style={[styles.textArea, {color: textColor}]}
                  placeholder="Add a description for this group"
                  placeholderTextColor={secondaryTextColor}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}
          </View>

          {/* Currency Section */}
          <View style={[styles.section, {backgroundColor: cardBackground}]}>
            <Text style={[styles.sectionLabel, {color: secondaryTextColor}]}>Default Currency</Text>
            <TouchableOpacity
              style={[styles.currencyButton, {backgroundColor: backgroundColor}]}
              onPress={() => setShowCurrencyModal(true)}>
              <Text style={[styles.currencyText, {color: textColor}]}>{currency}</Text>
              <MaterialIcons name="arrow-drop-down" size={20} color={textColor} />
            </TouchableOpacity>
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

        {/* Currency Modal */}
        <CurrencyModal
          visible={showCurrencyModal}
          selectedCurrency={currency}
          onSelect={setCurrency}
          onClose={() => setShowCurrencyModal(false)}
        />
    </View>
  );
}
