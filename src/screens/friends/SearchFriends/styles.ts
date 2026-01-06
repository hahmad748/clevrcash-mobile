import {StyleSheet} from 'react-native';
import {TOTAL_TAB_BAR_HEIGHT} from '../../../components/CustomTabBar/styles';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Enough to cover status bar and header area
    zIndex: -1, // Behind everything
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: TOTAL_TAB_BAR_HEIGHT + spacing.lg,
  },
  pageHeader: {
    
  },
  pageTitle: {
    ...typography.h1,
    marginBottom: spacing.md,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  infoIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    ...typography.bodySmall,
    ...androidTextProps,
  },
  centeredInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    minHeight: 300,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
    opacity: 0.5,
  },
  noResultsText: {
    ...typography.body,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.md,
    ...androidTextProps,
  },
  globalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.xxl,
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
  globalSearchInput: {
    flex: 1,
    ...typography.body,
    padding: 0,
    ...androidTextProps,
  },
  searchButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    marginLeft: spacing.md,
  },
  searchButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  cardsContainer: {
    gap: spacing.lg,
    marginBottom: spacing.xxl,
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
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  cardDescription: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginBottom: spacing.lg,
    ...androidTextProps,
  },
  radioContainer: {
    gap: spacing.md,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    ...typography.body,
    fontWeight: '500',
    ...androidTextProps,
  },
  emailInputContainer: {
    marginBottom: spacing.lg,
  },
  emailLabel: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  emailInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    ...androidTextProps,
  },
  sendInviteButton: {
    paddingVertical: spacing.md,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendInviteButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  resultsContainer: {
    marginTop: spacing.sm,
  },
  resultsTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
    ...androidTextProps,
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  resultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
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
    ...typography.medium,
    fontWeight: '700',
  },
  resultDetails: {
    flex: 1,
  },
  resultName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  resultEmail: {
    ...typography.caption,
    fontWeight: '400',
    ...androidTextProps,
  },
  inviteButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  inviteButtonText: {
    color: '#FFFFFF',
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  // Main Tabs
  mainTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mainTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    marginHorizontal: spacing.xs,
    gap: spacing.sm,
  },
  mainTabText: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  // Pending Tab Styles
  pendingContainer: {
    flex: 1,
  },
  pendingTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pendingTab: {
    flex: 1,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  pendingTabText: {
    ...typography.body,
    fontWeight: '600',
    ...androidTextProps,
  },
  pendingListContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: TOTAL_TAB_BAR_HEIGHT + spacing.lg,
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
  pendingText: {
    ...typography.bodySmall,
    fontWeight: '500',
    paddingHorizontal: spacing.md,
    ...androidTextProps,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    ...androidTextProps,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
