import {StyleSheet} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    maxHeight: '80%',
  },
  modalTitle: {
    ...typography.h3,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    ...androidTextProps,
  },
  modalScroll: {
    paddingHorizontal: spacing.lg,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  modalOptionText: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  modalOptionDesc: {
    ...typography.bodySmall,
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
