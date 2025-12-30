import React from 'react';
import {View, Text, Modal, ScrollView, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {styles} from './styles';

interface PaymentMethodModalProps {
  visible: boolean;
  selectedMethod: string;
  onSelect: (method: string) => void;
  onClose: () => void;
}

const paymentMethods = [
  {value: 'cash', label: 'Cash'},
  {value: 'bank_transfer', label: 'Bank Transfer'},
  {value: 'stripe', label: 'Stripe'},
  {value: 'paypal', label: 'PayPal'},
  {value: 'manual', label: 'Manual'},
  {value: 'other', label: 'Other'},
];

export function PaymentMethodModal({visible, selectedMethod, onSelect, onClose}: PaymentMethodModalProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.textSecondary;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: textColor}]}>Select Payment Method</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {paymentMethods.map(method => {
              const isSelected = selectedMethod === method.value;
              return (
                <TouchableOpacity
                  key={method.value}
                  style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                  onPress={() => {
                    onSelect(method.value);
                    onClose();
                  }}>
                  <Text style={[styles.modalOptionText, {color: textColor}]}>{method.label}</Text>
                  {isSelected && <MaterialIcons name="check" size={20} color={primaryColor} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
