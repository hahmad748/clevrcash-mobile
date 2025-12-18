import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useBrand} from '../../contexts/BrandContext';
import type {Attachment} from '../../types/api';

interface AttachmentViewerProps {
  visible: boolean;
  attachment: Attachment | null;
  onClose: () => void;
}

export function AttachmentViewer({visible, attachment, onClose}: AttachmentViewerProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const primaryColor = brand?.primary_color || colors.primary;
  const backgroundColor = isDark ? '#0A0E27' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';

  if (!attachment) return null;

  const isImage = attachment.mime_type?.startsWith('image/');
  const isPdf = attachment.mime_type === 'application/pdf' || attachment.url?.endsWith('.pdf');
  const attachmentUrl = attachment.url;

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError('Failed to load attachment');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, {backgroundColor}]}>
        {/* Header */}
        <View style={[styles.header, {borderBottomColor: secondaryTextColor + '30'}]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, {color: textColor}]} numberOfLines={1}>
              {attachment.name}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={primaryColor} />
              <Text style={[styles.loadingText, {color: secondaryTextColor}]}>
                Loading attachment...
              </Text>
            </View>
          )}

          {error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color={secondaryTextColor} />
              <Text style={[styles.errorText, {color: textColor}]}>{error}</Text>
              <Text style={[styles.errorSubtext, {color: secondaryTextColor}]}>
                Unable to display this attachment
              </Text>
            </View>
          ) : (
            <WebView
              source={{uri: attachmentUrl}}
              style={styles.webview}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleError}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={primaryColor} />
                </View>
              )}
              scalesPageToFit={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
