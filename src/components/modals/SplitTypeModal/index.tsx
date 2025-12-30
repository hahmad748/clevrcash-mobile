import React from 'react';
import {View, Text, Modal, ScrollView, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {styles} from './styles';

export type SplitType = 'equal' | 'exact' | 'percentage' | 'shares' | 'adjustment' | 'reimbursement' | 'itemized';

interface SplitTypeModalProps {
  visible: boolean;
  selectedSplitType: SplitType;
  onSelect: (splitType: SplitType) => void;
  onClose: () => void;
}

const splitTypeLabels: Record<SplitType, {title: string; description: string}> = {
  equal: {title: 'Equally', description: 'Split the total equally'},
  exact: {title: 'Exact amounts', description: 'Enter exact amounts for each person'},
  percentage: {title: 'By percentage', description: 'Split by percentage'},
  shares: {title: 'By shares', description: 'Split by shares (e.g., 1:2:3)'},
  adjustment: {title: 'By adjustment', description: 'Manually adjust amounts for each person'},
  reimbursement: {title: 'Reimbursement', description: 'One person is being reimbursed'},
  itemized: {title: 'Itemized expense', description: 'Split by individual items'},
};

export function SplitTypeModal({visible, selectedSplitType, onSelect, onClose}: SplitTypeModalProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = colors.surface;
  const textColor = colors.text;
  const secondaryTextColor = colors.textSecondary;

  const splitTypes: SplitType[] = ['equal', 'exact', 'percentage', 'shares', 'adjustment', 'reimbursement', 'itemized'];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
          <Text style={[styles.modalTitle, {color: textColor}]}>How to split</Text>
          <ScrollView style={styles.modalScroll}>
            {splitTypes.map(type => {
              const isSelected = selectedSplitType === type;
              const label = splitTypeLabels[type];
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                  onPress={() => {
                    onSelect(type);
                    onClose();
                  }}>
                  <View>
                    <Text style={[styles.modalOptionText, {color: textColor}]}>{label.title}</Text>
                    <Text style={[styles.modalOptionDesc, {color: secondaryTextColor}]}>
                      {label.description}
                    </Text>
                  </View>
                  {isSelected && <MaterialIcons name="check" size={20} color={primaryColor} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={[styles.modalCloseText, {color: textColor}]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
