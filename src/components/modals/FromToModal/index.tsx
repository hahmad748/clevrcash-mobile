import React from 'react';
import {View, Text, Modal, ScrollView, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import type {User} from '../../../types/api';
import {styles} from './styles';

interface FromToModalProps {
  visible: boolean;
  users: User[];
  selectedUserId: number | null;
  currentUserId?: number;
  title: string;
  onSelect: (userId: number) => void;
  onClose: () => void;
  getParticipantName?: (userId: number) => string;
}

export function FromToModal({
  visible,
  users,
  selectedUserId,
  currentUserId,
  title,
  onSelect,
  onClose,
  getParticipantName,
}: FromToModalProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';

  const getUserName = (userId: number): string => {
    if (getParticipantName) {
      return getParticipantName(userId);
    }
    if (userId === currentUserId) {
      return 'You';
    }
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown';
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: textColor}]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {users.map(user => {
              const isSelected = selectedUserId === user.id;
              return (
                <TouchableOpacity
                  key={user.id}
                  style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                  onPress={() => {
                    onSelect(user.id);
                    onClose();
                  }}>
                  <Text style={[styles.modalOptionText, {color: textColor}]}>
                    {getUserName(user.id)}
                  </Text>
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
