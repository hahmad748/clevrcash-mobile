import {StyleSheet} from 'react-native';
import {TOTAL_TAB_BAR_HEIGHT} from '../../../components/CustomTabBar/styles';

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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: TOTAL_TAB_BAR_HEIGHT + 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
    padding: 20,
    marginBottom: 16,
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
    marginRight: 16,
  },
  mainCardHeaderText: {
    flex: 1,
  },
  mainCardType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  mainCardAmountSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    marginBottom: 20,
  },
  mainCardAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  mainCardDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Payment Flow
  paymentFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  paymentParticipant: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentArrow: {
    paddingHorizontal: 12,
  },
  participantLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  participantName: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Verification Card
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  verificationContainer: {
    gap: 8,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hashContainer: {
    gap: 4,
  },
  hashLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  hashValue: {
    fontSize: 9,
    fontFamily: 'monospace',
    lineHeight: 12,
  },
  detailsList: {
    gap: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    minHeight: 32,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '400',
    flex: 1,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailIcon: {
    marginRight: 6,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  // Splits Card
  splitsList: {
    gap: 0,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  splitRowBorder: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  splitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  splitAvatar: {
    width: 32,
    height: 32,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  splitAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  splitInfo: {
    flex: 1,
  },
  splitUserName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  splitPercentage: {
    fontSize: 12,
  },
  splitShares: {
    fontSize: 12,
  },
  splitAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Participants Card
  participantsList: {
    gap: 0,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
    marginRight: 12,
  },
  participantAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  participantInfo: {
    flex: 1,
  },
  participantEmail: {
    fontSize: 10,
    fontWeight: '400',
  },
  paidByBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paidByBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  // Delete Button
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
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
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
  },
  // Attachments
  attachmentsList: {
    gap: 0,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  attachmentRowBorder: {
    borderBottomWidth: 1,
  },
  attachmentThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  attachmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
  },
});
