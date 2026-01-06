import {StyleSheet, Platform} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        zIndex: 1000,
      },
    }),
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    ...typography.h3,
    ...androidTextProps,
  },
  datePickerContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  quickDateButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    width: '100%',
  },
  quickDateButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickDateText: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  modalCancelButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  modalCancelText: {
    ...typography.button,
    ...androidTextProps,
  },
  modalConfirmButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmText: {
    ...typography.button,
    color: '#FFFFFF',
    ...androidTextProps,
  },
  modalCloseButton: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    ...typography.button,
    ...androidTextProps,
  },
});
