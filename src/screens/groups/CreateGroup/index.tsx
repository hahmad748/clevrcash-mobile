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
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {useAuth} from '../../../contexts/AuthContext';
import {apiClient} from '../../../services/apiClient';
import {CurrencyModal} from '../../../components/modals/CurrencyModal';
import {styles} from './styles';

export function CreateGroupScreen() {
  const navigation = useNavigation();
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const {user} = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState(user?.default_currency || 'USD');
  const [showDescription, setShowDescription] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = colors.background;
  const cardBackground = colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.textSecondary;

  const handleSubmit = async () => {
    if (!name.trim()) {
      showError('Error', 'Please enter a group name');
      return;
    }

    setLoading(true);
    try {
      const group = await apiClient.createGroup({
        name: name.trim(),
        description: description.trim() || undefined,
        currency,
      });
      Alert.alert('Success', 'Group created successfully', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('Groups' as never, {
              screen: 'GroupDetail',
              params: {groupId: group.hash || String(group.id)},
            } as never),
        },
      ]);
    } catch (error: any) {
      showError('Error', error.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
          {/* Page Heading */}
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, {color: textColor}]}>Create New Group</Text>
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
              style={[styles.createButton, {backgroundColor: primaryColor}]}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.createButtonText}>Create Group</Text>
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
