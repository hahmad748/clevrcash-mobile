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
  groupCard: {
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
  groupContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  groupAvatarText: {
    ...typography.medium,
    fontWeight: '700',
    ...androidTextProps,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  groupMetaText: {
    ...typography.caption,
    ...androidTextProps,
  },
  groupRight: {
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
  fabSecondary: {
    width: 'auto',
    paddingHorizontal: spacing.lg,
    borderRadius: 28,
  },
  fabText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
});
