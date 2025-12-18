import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../../contexts/ThemeContext';
import {useBrand} from '../../../contexts/BrandContext';
import {apiClient} from '../../../services/apiClient';
import {styles} from './styles';

interface ManageRelationshipModalProps {
  visible: boolean;
  friendName: string;
  friendId: number;
  onClose: () => void;
  onRemove: () => void;
  onBlock: () => void;
}

export function ManageRelationshipModal({
  visible,
  friendName,
  friendId,
  onClose,
  onRemove,
  onBlock,
}: ManageRelationshipModalProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const [loading, setLoading] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const primaryColor = brand?.primary_color || colors.primary;
  const cardBackground = isDark ? '#1A1F3A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';
  const dangerColor = '#F44336';
  const inputBackground = isDark ? '#0A0E27' : '#F5F5F5';

  const handleRemove = () => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friendName} from your friend list? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading('remove');
              await apiClient.removeFriend(friendId);
              Alert.alert('Success', `${friendName} has been removed from your friend list.`);
              onRemove();
              onClose();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to remove friend');
            } finally {
              setLoading(null);
            }
          },
        },
      ],
    );
  };

  const handleBlock = () => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${friendName}? You will no longer be able to see each other's activities or split expenses. This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading('block');
              await apiClient.blockFriend(friendId);
              Alert.alert('Success', `${friendName} has been blocked.`);
              onBlock();
              onClose();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to block user');
            } finally {
              setLoading(null);
            }
          },
        },
      ],
    );
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const submitReport = async () => {
    if (!reportReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for reporting');
      return;
    }
    try {
      setLoading('report');
      await apiClient.reportFriend(friendId, reportReason.trim());
      Alert.alert('Success', 'User has been reported. Our team will review your report.');
      setReportReason('');
      setShowReportModal(false);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to report user');
    } finally {
      setLoading(null);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: textColor}]}>Manage Relationship</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.optionsList}>
              <TouchableOpacity
                style={[styles.optionItem, {borderBottomColor: secondaryTextColor + '20'}]}
                onPress={handleRemove}
                disabled={loading !== null}>
                {loading === 'remove' ? (
                  <View style={styles.optionItemContent}>
                    <ActivityIndicator size="small" color={dangerColor} />
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionTitle, {color: textColor}]}>
                        Removing...
                      </Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <MaterialIcons name="person-off" size={24} color={dangerColor} />
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionTitle, {color: textColor}]}>
                        Remove from Friend List
                      </Text>
                      <Text style={[styles.optionDescription, {color: secondaryTextColor}]}>
                        Remove this person from your friend list. You can add them back later.
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionItem, {borderBottomColor: secondaryTextColor + '20'}]}
                onPress={handleBlock}
                disabled={loading !== null}>
                {loading === 'block' ? (
                  <View style={styles.optionItemContent}>
                    <ActivityIndicator size="small" color={dangerColor} />
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionTitle, {color: textColor}]}>
                        Blocking...
                      </Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <MaterialIcons name="block" size={24} color={dangerColor} />
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionTitle, {color: textColor}]}>Block User</Text>
                      <Text style={[styles.optionDescription, {color: secondaryTextColor}]}>
                        Block this user. You will no longer see each other's activities or split expenses. This action cannot be undone.
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionItem]}
                onPress={handleReport}
                disabled={loading !== null}>
                {loading === 'report' ? (
                  <View style={styles.optionItemContent}>
                    <ActivityIndicator size="small" color={dangerColor} />
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionTitle, {color: textColor}]}>
                        Reporting...
                      </Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <MaterialIcons name="flag" size={24} color={dangerColor} />
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionTitle, {color: textColor}]}>Report User</Text>
                      <Text style={[styles.optionDescription, {color: secondaryTextColor}]}>
                        Report this user for inappropriate behavior. Our team will review your report.
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Report Modal */}
      <Modal visible={showReportModal} transparent animationType="slide" onRequestClose={() => setShowReportModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {backgroundColor: cardBackground}]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: textColor}]}>Report User</Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <MaterialIcons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.reportContent}>
              <Text style={[styles.reportLabel, {color: textColor}]}>
                Please provide a reason for reporting {friendName}:
              </Text>
              <TextInput
                style={[styles.reportInput, {backgroundColor: inputBackground, color: textColor, borderColor: secondaryTextColor + '30'}]}
                placeholder="Enter reason..."
                placeholderTextColor={secondaryTextColor}
                value={reportReason}
                onChangeText={setReportReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <View style={styles.reportActions}>
                <TouchableOpacity
                  style={[styles.reportCancelButton, {borderColor: secondaryTextColor}]}
                  onPress={() => {
                    setReportReason('');
                    setShowReportModal(false);
                  }}>
                  <Text style={[styles.reportCancelText, {color: textColor}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.reportSubmitButton, {backgroundColor: dangerColor}]}
                  onPress={submitReport}
                  disabled={loading === 'report' || !reportReason.trim()}>
                  {loading === 'report' ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.reportSubmitText}>Report</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
