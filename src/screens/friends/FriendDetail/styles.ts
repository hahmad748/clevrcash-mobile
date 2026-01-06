import {StyleSheet, Dimensions} from 'react-native';
import {TOTAL_TAB_BAR_HEIGHT} from '../../../components/CustomTabBar/styles';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: TOTAL_TAB_BAR_HEIGHT + spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  friendAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  friendAvatarText: {
    ...typography.h2,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  friendName: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  friendEmail: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  card: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.body,
    fontWeight: '600',
    ...androidTextProps,
  },
  cardSubtitle: {
    ...typography.caption,
    fontWeight: '500',
    ...androidTextProps,
  },
  // Your Balance Card
  balanceAmount: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  balanceLabel: {
    ...typography.caption,
    fontWeight: '500',
    marginBottom: spacing.md,
    ...androidTextProps,
  },
  settleButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  settleButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  // Transaction History
  transactionsList: {
    marginTop: spacing.sm,
  },
  transactionItem: {
    paddingVertical: spacing.md,
  },
  transactionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  transactionDescription: {
    ...typography.bodySmall,
    fontWeight: '500',
    flex: 1,
    marginRight: spacing.md,
    ...androidTextProps,
  },
  transactionAmount: {
    ...typography.bodySmall,
    fontWeight: '600',
    flexShrink: 0,
    ...androidTextProps,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  transactionMetaText: {
    ...typography.captionSmall,
    ...androidTextProps,
  },
  transactionMethod: {
    ...typography.captionSmall,
    fontStyle: 'italic',
    ...androidTextProps,
  },
  emptyText: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.md,
    fontStyle: 'italic',
    ...androidTextProps,
  },
  errorText: {
    ...typography.body,
    ...androidTextProps,
  },
  fabContainer: {
    position: 'absolute',
    right: spacing.lg,
    bottom: TOTAL_TAB_BAR_HEIGHT + spacing.lg,
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
  // Balances by Currency
  currencyBalancesList: {
    marginTop: spacing.sm,
  },
  currencyBalanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  currencyBalanceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  currencyLabel: {
    ...typography.bodySmall,
    fontWeight: '500',
    ...androidTextProps,
  },
  currencyAmount: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  // Shared Groups
  groupsList: {
    marginTop: spacing.sm,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  groupItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  groupAvatarText: {
    ...typography.body,
    fontWeight: '700',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  groupDescription: {
    ...typography.caption,
    ...androidTextProps,
  },
  // Actions
  actionsList: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  actionButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
  },
});
