import React from 'react';
import {View, Text, Modal, ScrollView, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import type {User} from '../../../types/api';
import {styles} from './styles';

interface PaidByModalProps {
  visible: boolean;
  participants: Array<{user_id: number}>;
  selectedPaidBy: number;
  currentUserId?: number;
  getParticipantName: (userId: number) => string;
  onSelect: (userId: number) => void;
  onClose: () => void;
}

export function PaidByModal({
  visible,
  participants,
  selectedPaidBy,
  currentUserId,
  getParticipantName,
  onSelect,
  onClose,
}: PaidByModalProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
          <Text style={[styles.modalTitle, {color: textColor}]}>Who paid?</Text>
          <ScrollView style={styles.modalScroll}>
            {participants.map((p, index) => {
              const isSelected = selectedPaidBy === p.user_id;
              const name = getParticipantName(p.user_id);
              return (
                <TouchableOpacity
                  key={`paidby-${p.user_id}-${index}`}
                  style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                  onPress={() => {
                    onSelect(p.user_id);
                    onClose();
                  }}>
                  <Text style={[styles.modalOptionText, {color: textColor}]}>{name}</Text>
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
