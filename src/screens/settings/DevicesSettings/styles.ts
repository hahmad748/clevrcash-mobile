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
  listContent: {
    padding: spacing.lg,
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  deviceInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  deviceName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  deviceDetails: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  deviceDate: {
    ...typography.caption,
    ...androidTextProps,
  },
  revokeButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  revokeButtonText: {
    color: '#FFFFFF',
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    ...androidTextProps,
  },
  revokeAllButton: {
    margin: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  revokeAllButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
});
