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
  pageHeader: {
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xs,
  },
  pageTitle: {
    ...typography.h1,
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  groupName: {
    ...typography.body,
    fontWeight: '400',
    ...androidTextProps,
  },
  section: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.md,
    ...androidTextProps,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    marginBottom: spacing.md,
    ...androidTextProps,
  },
  description: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  inviteCodeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  inviteCodeInput: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    fontFamily: 'monospace',
    ...androidTextProps,
  },
  copyButton: {
    paddingHorizontal: spacing.lg,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  copyButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.button,
    fontWeight: '500',
    ...androidTextProps,
  },
  sendButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    fontWeight: '500',
    ...androidTextProps,
  },
});
