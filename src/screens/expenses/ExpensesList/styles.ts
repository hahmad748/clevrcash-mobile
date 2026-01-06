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
  searchContainer: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    ...androidTextProps,
  },
  listContent: {
    padding: spacing.lg,
  },
  expenseCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  expenseDescription: {
    flex: 1,
    ...typography.body,
    fontWeight: '600',
    marginRight: spacing.md,
    ...androidTextProps,
  },
  expenseAmount: {
    ...typography.medium,
    ...androidTextProps,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseDate: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  expensePayer: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  expenseGroup: {
    ...typography.caption,
    fontWeight: '600',
    marginTop: spacing.sm,
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
    marginBottom: spacing.xxl,
    ...androidTextProps,
  },
  createButton: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#FFFFFF',
    ...typography.h2,
    fontWeight: 'bold',
    ...androidTextProps,
  },
});
