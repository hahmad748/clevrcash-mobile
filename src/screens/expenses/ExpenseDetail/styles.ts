import {StyleSheet} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.xxl,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  description: {
    ...typography.h2,
    marginBottom: spacing.md,
    textAlign: 'center',
    ...androidTextProps,
  },
  amount: {
    ...typography.h1,
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  date: {
    ...typography.body,
    ...androidTextProps,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.medium,
    fontWeight: '600',
    marginBottom: spacing.md,
    ...androidTextProps,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '500',
    ...androidTextProps,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  splitUserName: {
    flex: 1,
    ...typography.body,
    fontWeight: '500',
    ...androidTextProps,
  },
  splitAmount: {
    ...typography.body,
    fontWeight: '600',
    marginRight: spacing.sm,
    ...androidTextProps,
  },
  splitPercentage: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  itemQuantity: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  itemAmount: {
    ...typography.body,
    fontWeight: '600',
    ...androidTextProps,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
  },
  attachmentThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  attachmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attachmentIconText: {
    ...typography.h2,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  attachmentSize: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  editButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  errorText: {
    ...typography.body,
    ...androidTextProps,
  },
});
