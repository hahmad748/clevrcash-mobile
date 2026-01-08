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
    paddingBottom: spacing.md,
  },
  heading: {
    ...typography.h2,
    fontWeight: '700',
    ...androidTextProps,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 44,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    height: '100%',
    ...androidTextProps,
  },
  clearButton: {
    padding: spacing.xs,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterBadge: {
    position: 'absolute',
    top: -(spacing.xs ?? 0),
    right: -(spacing.xs ?? 0),
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs ?? 0,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    ...typography.captionSmall,
    fontWeight: '700',
    ...androidTextProps,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: TOTAL_TAB_BAR_HEIGHT + (spacing.lg ?? 0),
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  transactionCard: {
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
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: spacing.md,
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
  transactionTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  paymentDescription: {
    marginBottom: spacing.xs,
  },
  paymentFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: (spacing.xs ?? 0) / 2,
  },
  paymentFromTo: {
    ...typography.bodySmall,
    fontWeight: '500',
    ...androidTextProps,
  },
  paymentArrow: {
    marginHorizontal: spacing.xs ?? 0,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  transactionMetaText: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  transactionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  transactionPayer: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  transactionDate: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...typography.medium,
    fontWeight: '700',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  transactionCurrency: {
    ...typography.caption,
    ...androidTextProps,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 16,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  deleteActionText: {
    color: '#FFFFFF',
    ...typography.caption,
    fontWeight: '600',
    marginTop: spacing.xs,
    ...androidTextProps,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: (spacing.xxxl ?? 0) * 2,
  },
  emptyText: {
    ...typography.medium,
    textAlign: 'center',
    marginTop: spacing.lg,
    ...androidTextProps,
  },
  footerLoader: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
