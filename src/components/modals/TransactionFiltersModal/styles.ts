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
    minHeight: 500,
    width: '100%',
    paddingBottom: 20,
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 2,
    minWidth: 100,
  },
  tabText: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  contentContainer: {
    flex: 1,
    minHeight: 300,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.lg,
  },
  filterItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  filterItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterItemInfo: {
    flex: 1,
  },
  filterItemText: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  filterItemSubtext: {
    ...typography.caption,
    ...androidTextProps,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  clearButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    ...typography.button,
    ...androidTextProps,
  },
  applyButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: spacing.md,
    ...androidTextProps,
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  dateRangeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dateRangeInfo: {
    flexDirection: 'column',
  },
  dateRangeLabel: {
    ...typography.caption,
    marginBottom: spacing.xs / 2,
    ...androidTextProps,
  },
  dateRangeValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  clearDateButton: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  clearDateText: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  datePresetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  datePresetItem: {
    flexBasis: '31%',
    minWidth: '31%',
    maxWidth: '31%',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  datePresetText: {
    ...typography.bodySmall,
    fontWeight: '600',
    textAlign: 'center',
    ...androidTextProps,
  },
});
