import React, {useState, useEffect} from 'react';
import {View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator, TextInput} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import type {Timezone} from '../../../types/api';
import {styles} from './styles';

interface TimezoneModalProps {
  visible: boolean;
  selectedTimezone: string;
  onSelect: (timezone: string) => void;
  onClose: () => void;
}

export function TimezoneModal({visible, selectedTimezone, onSelect, onClose}: TimezoneModalProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';
  const searchBackground = isDark ? '#252A4A' : '#F5F5F5';

  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [filteredTimezones, setFilteredTimezones] = useState<Timezone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (visible) {
      loadTimezones();
    } else {
      setSearchQuery('');
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = timezones.filter(tz => 
        tz.label.toLowerCase().includes(query) || 
        tz.value.toLowerCase().includes(query)
      );
      setFilteredTimezones(filtered);
    } else {
      setFilteredTimezones(timezones);
    }
  }, [searchQuery, timezones]);

  const loadTimezones = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTimezones();
      setTimezones(data);
      setFilteredTimezones(data);
    } catch (error) {
      console.error('Failed to load timezones:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: textColor}]}>Select Timezone</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            
            {/* Search Input */}
            <View style={[styles.searchContainer, {backgroundColor: searchBackground}]}>
              <MaterialIcons name="search" size={20} color={secondaryTextColor} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, {color: textColor}]}
                placeholder="Search timezone..."
                placeholderTextColor={secondaryTextColor}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
              />
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={primaryColor} />
              </View>
            ) : (
              <ScrollView 
                style={styles.modalScroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}>
                {filteredTimezones.map(tz => {
                  const isSelected = selectedTimezone === tz.value;
                  return (
                    <TouchableOpacity
                      key={tz.value}
                      style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                      onPress={() => {
                        onSelect(tz.value);
                        onClose();
                      }}>
                      <Text style={[styles.modalOptionText, {color: textColor}]}>
                        {tz.label}
                      </Text>
                      {isSelected && <MaterialIcons name="check" size={20} color={primaryColor} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

