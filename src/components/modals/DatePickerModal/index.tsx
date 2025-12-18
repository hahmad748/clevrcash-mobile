import React from 'react';
import {View, Text, Modal, TouchableOpacity, TextInput} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {styles} from './styles';

interface DatePickerModalProps {
  visible: boolean;
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

export function DatePickerModal({visible, selectedDate, onSelect, onClose}: DatePickerModalProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';
  const backgroundColor = isDark ? '#0A0E27' : '#F5F5F5';

  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return 'Select date';
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return dateStr;
      return dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const setToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    onSelect(`${year}-${month}-${day}`);
    onClose();
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    onSelect(`${year}-${month}-${day}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: textColor}]}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>
          <View style={styles.datePickerContainer}>
            <TextInput
              style={[styles.datePickerInput, {backgroundColor: backgroundColor, color: textColor}]}
              value={selectedDate}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^\d-]/g, '');
                if (cleaned.length <= 10) {
                  onSelect(cleaned);
                }
              }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={secondaryTextColor}
              keyboardType="numeric"
            />
            <View style={styles.quickDateButtons}>
              <TouchableOpacity
                style={[styles.quickDateButton, {backgroundColor: primaryColor + '20'}]}
                onPress={setToday}>
                <Text style={[styles.quickDateText, {color: primaryColor}]}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickDateButton, {backgroundColor: primaryColor + '20'}]}
                onPress={setYesterday}>
                <Text style={[styles.quickDateText, {color: primaryColor}]}>Yesterday</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={[styles.modalCloseText, {color: textColor}]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
