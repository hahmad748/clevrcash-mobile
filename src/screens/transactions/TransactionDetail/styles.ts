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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: TOTAL_TAB_BAR_HEIGHT + spacing.lg,
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
  // Main Card - Modern Design
  mainCard: {
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  mainCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  mainCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  mainCardHeaderText: {
    flex: 1,
  },
  mainCardType: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  mainCardTitle: {
    ...typography.medium,
    fontWeight: '700',
    ...androidTextProps,
  },
  mainCardAmountSection: {
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    marginBottom: spacing.lg,
  },
  mainCardAmount: {
    ...typography.h1,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
    ...androidTextProps,
  },
  mainCardDate: {
    ...typography.bodySmall,
    fontWeight: '500',
    ...androidTextProps,
  },
  // Payment Flow
  paymentFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  paymentParticipant: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentArrow: {
    paddingHorizontal: spacing.md,
  },
  participantLabel: {
    ...typography.captionSmall,
    fontWeight: '500',
    ...androidTextProps,
  },
  participantName: {
    ...typography.caption,
    fontWeight: '500',
    ...androidTextProps,
  },
  // Verification Card
  cardTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  verificationContainer: {
    gap: spacing.sm,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  verificationText: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  hashContainer: {
    gap: spacing.xs,
  },
  hashLabel: {
    ...typography.caption,
    fontWeight: '500',
    ...androidTextProps,
  },
  hashValue: {
    ...typography.captionSmall,
    fontFamily: 'monospace',
    ...androidTextProps,
  },
  detailsList: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    minHeight: 32,
  },
  detailLabel: {
    ...typography.caption,
    fontWeight: '400',
    flex: 1,
    ...androidTextProps,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailIcon: {
    marginRight: spacing.xs,
  },
  detailValue: {
    ...typography.caption,
    fontWeight: '500',
    textAlign: 'right',
    ...androidTextProps,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  statusText: {
    ...typography.captionSmall,
    fontWeight: '500',
    textTransform: 'uppercase',
    ...androidTextProps,
  },
  // Splits Card
  splitsList: {
    gap: 0,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  splitRowBorder: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  splitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  splitAvatar: {
    width: 32,
    height: 32,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  splitAvatarText: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
  splitInfo: {
    flex: 1,
  },
  splitUserName: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  splitPercentage: {
    ...typography.caption,
    ...androidTextProps,
  },
  splitShares: {
    ...typography.caption,
    ...androidTextProps,
  },
  splitAmount: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  // Participants Card
  participantsList: {
    gap: 0,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  participantRowBorder: {
    borderBottomWidth: 1,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  participantAvatarText: {
    ...typography.body,
    fontWeight: '700',
  },
  participantInfo: {
    flex: 1,
  },
  participantEmail: {
    ...typography.captionSmall,
    fontWeight: '400',
    ...androidTextProps,
  },
  paidByBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  paidByBadgeText: {
    ...typography.captionSmall,
    fontWeight: '700',
    ...androidTextProps,
  },
  // Items List (for itemized expenses)
  itemsList: {
    gap: 0,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  itemDetails: {
    ...typography.caption,
    ...androidTextProps,
  },
  itemTotal: {
    ...typography.body,
    fontWeight: '600',
    ...androidTextProps,
  },
  // Delete Button
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: 12,
    gap: spacing.sm,
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
  deleteButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  errorText: {
    ...typography.body,
    ...androidTextProps,
  },
  // Attachments
  attachmentsList: {
    gap: 0,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  attachmentRowBorder: {
    borderBottomWidth: 1,
  },
  attachmentThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  attachmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  attachmentSize: {
    ...typography.caption,
    ...androidTextProps,
  },
});
