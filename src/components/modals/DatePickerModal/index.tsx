import React, {useState, useEffect} from 'react';
import {View, Text, Modal, TouchableOpacity, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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

  // Parse the selected date string to Date object
  const getDateFromString = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return new Date();
      return date;
    } catch {
      return new Date();
    }
  };

  const [currentDate, setCurrentDate] = useState<Date>(getDateFromString(selectedDate));

  // Sync currentDate with selectedDate when modal opens
  useEffect(() => {
    if (visible) {
      setCurrentDate(getDateFromString(selectedDate));
    }
  }, [visible, selectedDate]);

  // Format date to YYYY-MM-DD string
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      onClose();
      if (event.type === 'set' && date) {
        onSelect(formatDateToString(date));
      }
    } else {
      // iOS - update the date but keep modal open
      if (date) {
        setCurrentDate(date);
      }
    }
  };

  const handleConfirm = () => {
    onSelect(formatDateToString(currentDate));
    onClose();
  };

  const setToday = () => {
    const today = new Date();
    setCurrentDate(today);
    if (Platform.OS === 'android') {
      onSelect(formatDateToString(today));
      onClose();
    }
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setCurrentDate(yesterday);
    if (Platform.OS === 'android') {
      onSelect(formatDateToString(yesterday));
      onClose();
    }
  };

  // On Android, show the native picker directly
  if (Platform.OS === 'android' && visible) {
    return (
      <DateTimePicker
        value={getDateFromString(selectedDate)}
        mode="date"
        display="default"
        onChange={handleDateChange}
        maximumDate={new Date()}
      />
    );
  }

  // On iOS, show in a modal with controls
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={[styles.modalContent, {backgroundColor: cardBackground}]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: textColor}]}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={currentDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
              textColor={isDark ? '#FFFFFF' : '#000000'}
              themeVariant={isDark ? 'dark' : 'light'}
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
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
              <Text style={[styles.modalCancelText, {color: secondaryTextColor}]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalConfirmButton, {backgroundColor: primaryColor}]}
              onPress={handleConfirm}>
              <Text style={styles.modalConfirmText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
