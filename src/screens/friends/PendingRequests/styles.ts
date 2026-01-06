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
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  tabText: {
    ...typography.body,
    fontWeight: '600',
    ...androidTextProps,
  },
  listContent: {
    padding: spacing.lg,
  },
  requestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    ...typography.medium,
    fontWeight: '600',
  },
  requestDetails: {
    flex: 1,
  },
  requestName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  requestEmail: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  acceptButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  declineButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  declineButtonText: {
    color: '#FFFFFF',
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  pendingText: {
    ...typography.bodySmall,
    fontWeight: '500',
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
});
