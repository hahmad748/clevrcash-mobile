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
    paddingTop: spacing.lg,
    paddingBottom: TOTAL_TAB_BAR_HEIGHT + spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  groupAvatarText: {
    ...typography.medium,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  groupName: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  groupDescription: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addExpenseText: {
    color: '#FFFFFF',
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  twoColumnLayout: {
    flexDirection: width > 768 ? 'row' : 'column',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  leftColumn: {
    flex: width > 768 ? 2 : 1,
    gap: spacing.lg,
  },
  rightColumn: {
    flex: width > 768 ? 1 : 1,
    gap: spacing.lg,
  },
  card: {
    borderRadius: 16,
    padding: spacing.lg,
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
    ...androidTextProps,
  },
  // Balances List
  balancesList: {
    marginTop: spacing.sm,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  balanceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  balanceItemRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  memberBalanceAmount: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  memberBalanceLabel: {
    ...typography.captionSmall,
    fontWeight: '500',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  settleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  settleButtonText: {
    color: '#FFFFFF',
    ...typography.caption,
    fontWeight: '600',
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
  // Members List
  membersList: {
    marginTop: spacing.sm,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  memberAvatarText: {
    ...typography.body,
    fontWeight: '600',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  memberRole: {
    ...typography.caption,
    ...androidTextProps,
  },
  // Group Info
  infoList: {
    marginTop: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  infoLabel: {
    ...typography.caption,
    fontWeight: '500',
    ...androidTextProps,
  },
  infoValue: {
    ...typography.caption,
    fontWeight: '600',
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
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
  },
});
