import React, {useState, useEffect} from 'react';
import {View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import type {Category} from '../../../types/api';
import {styles} from './styles';

interface CategoryModalProps {
  visible: boolean;
  selectedCategoryId?: number;
  onSelect: (categoryId: number | undefined) => void;
  onClose: () => void;
}

export function CategoryModal({
  visible,
  selectedCategoryId,
  onSelect,
  onClose,
}: CategoryModalProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: textColor}]}>Select Category</Text>
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
              <TouchableOpacity
                style={[styles.modalOption, !selectedCategoryId && {backgroundColor: primaryColor + '20'}]}
                onPress={() => {
                  onSelect(undefined);
                  onClose();
                }}>
                <Text style={[styles.modalOptionText, {color: textColor}]}>None</Text>
                {!selectedCategoryId && <MaterialIcons name="check" size={20} color={primaryColor} />}
              </TouchableOpacity>
              {categories.map(cat => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.modalOption, isSelected && {backgroundColor: primaryColor + '20'}]}
                    onPress={() => {
                      onSelect(cat.id);
                      onClose();
                    }}>
                    <Text style={[styles.modalOptionText, {color: textColor}]}>
                      {cat.icon} {cat.name}
                    </Text>
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
