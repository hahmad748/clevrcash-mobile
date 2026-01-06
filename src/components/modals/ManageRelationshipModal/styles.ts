import {StyleSheet} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 300,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    ...typography.h3,
    ...androidTextProps,
  },
  modalScroll: {
    flexGrow: 1,
  },
  modalScrollContent: {
    paddingBottom: spacing.lg,
  },
  optionsList: {
    paddingVertical: spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  optionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionContent: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  optionTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  optionDescription: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  reportContent: {
    padding: spacing.lg,
  },
  reportLabel: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginBottom: spacing.md,
    ...androidTextProps,
  },
  reportInput: {
    minHeight: 100,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    borderWidth: 1,
    marginBottom: spacing.lg,
    textAlignVertical: 'top',
    ...androidTextProps,
  },
  reportActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  reportCancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  reportCancelText: {
    ...typography.button,
    ...androidTextProps,
  },
  reportSubmitButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  reportSubmitText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
});
