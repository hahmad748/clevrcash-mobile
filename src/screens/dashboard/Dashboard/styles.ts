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
  header: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: TOTAL_TAB_BAR_HEIGHT + 100,
  },
  profileCard: {
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: spacing.md,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.large,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    minWidth: 0, // Allow flex shrinking
  },
  profileName: {
    ...typography.h2,
    color: '#1A1A1A',
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.bodySmall,
    color: '#666',
    marginBottom: spacing.sm,
    flexShrink: 1, // Allow wrapping but take full space first
    flexWrap: 'wrap',
    ...androidTextProps,
  },
  followersRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  followersText: {
    ...typography.bodySmall,
    color: '#666',
  },
  addFriendButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  addFriendText: {
    color: '#FFFFFF',
    ...typography.buttonSmall,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    padding: 16,
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
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  recordButton: {
    position: 'absolute',
    right: 20,
    bottom: TOTAL_TAB_BAR_HEIGHT + 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20,
    zIndex: 10,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // You Are Owed / You Owe Row
  owedRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  owedCard: {
    flex: 1,
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
  owedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  owedLabel: {
    ...typography.caption,
    fontWeight: '500',
  },
  owedAmount: {
    ...typography.large,
    fontWeight: '700',
  },
  // Section Card
  sectionCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  seeAllText: {
    ...typography.caption,
    fontWeight: '500',
  },
  // Currency Grid
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  currencyGridView:{
    marginTop: spacing.md
  },
  currencyItem: {
    padding: spacing.md,
    borderRadius: 12,
    minWidth: (width - 64) / 3,
  },
  currencyLabel: {
    ...typography.captionSmall,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  currencyAmount: {
    ...typography.body,
    fontWeight: '600',
  },
  // Top Owed Row
  topOwedRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  topOwedCard: {
    flex: 1,
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
  topOwedItem: {
    marginTop: spacing.md,
  },
  topOwedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  topOwedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  topOwedAvatarText: {
    ...typography.body,
    fontWeight: '600',
  },
  topOwedInfo: {
    flex: 1,
  },
  topOwedName: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  topOwedSubtext: {
    ...typography.captionSmall,
  },
  topOwedBalance: {
    ...typography.bodySmall,
    fontWeight: '600',
    textAlign: 'right',
  },
  emptyText: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  // Transactions List
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
    alignItems: 'center',
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
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  transactionMetaText: {
    ...typography.captionSmall,
  },
  transactionAmount: {
    ...typography.bodySmall,
    fontWeight: '600',
    flexShrink: 0,
  },
});
