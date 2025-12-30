import React, {useState, useEffect} from 'react';
import {View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import type {Currency} from '../../../types/api';
import {styles} from './styles';

interface CurrencyModalProps {
  visible: boolean;
  selectedCurrency: string;
  onSelect: (currency: string) => void;
  onClose: () => void;
}

export function CurrencyModal({visible, selectedCurrency, onSelect, onClose}: CurrencyModalProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.textSecondary;

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadCurrencies();
    }
  }, [visible]);

  const loadCurrencies = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getCurrencies();
      setCurrencies(data);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: textColor}]}>Select Currency</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={primaryColor} />
            </View>
          ) : (
            <ScrollView style={styles.modalScroll}>
              {currencies.map(curr => {
                const isSelected = selectedCurrency === curr.code;
                return (
                  <TouchableOpacity
                    key={curr.code}
                    style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                    onPress={() => {
                      onSelect(curr.code);
                      onClose();
                    }}>
                    <View>
                      <Text style={[styles.modalOptionText, {color: textColor}]}>
                        {curr.code} ({curr.symbol})
                      </Text>
                      <Text style={[styles.modalOptionDesc, {color: secondaryTextColor}]}>
                        {curr.name}
                      </Text>
                    </View>
                    {isSelected && <MaterialIcons name="check" size={20} color={primaryColor} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
