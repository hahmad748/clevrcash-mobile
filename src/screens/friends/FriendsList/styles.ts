import {StyleSheet} from 'react-native';
import {TOTAL_TAB_BAR_HEIGHT} from '../../../components/CustomTabBar/styles';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  heading: {
    ...typography.h2,
    ...androidTextProps,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    padding: 0,
    ...androidTextProps,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: TOTAL_TAB_BAR_HEIGHT + spacing.xxxl * 2,
  },
  friendCard: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  friendAvatarText: {
    ...typography.medium,
    fontWeight: '700',
    ...androidTextProps,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  friendEmail: {
    ...typography.caption,
    fontWeight: '400',
    ...androidTextProps,
  },
  friendRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  balanceLabel: {
    ...typography.captionSmall,
    fontWeight: '500',
    ...androidTextProps,
  },
  balanceStatus: {
    ...typography.caption,
    fontWeight: '600',
    marginTop: spacing.xs,
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
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    ...androidTextProps,
  },
  createButton: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  fabContainer: {
    position: 'absolute',
    right: spacing.lg,
    bottom: TOTAL_TAB_BAR_HEIGHT + spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pendingSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.medium,
    fontWeight: '700',
    marginBottom: spacing.md,
    ...androidTextProps,
  },
  pendingCard: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pendingActions: {
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
  cancelButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
});
