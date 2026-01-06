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
  content: {
    padding: spacing.lg,
  },
  statusCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  statusTitle: {
    ...typography.medium,
    fontWeight: '600',
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  statusText: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
  enableButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  enableButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  disableButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  disableButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  recoveryButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  recoveryButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  infoSection: {
    marginTop: spacing.xxl,
  },
  infoTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  infoText: {
    ...typography.bodySmall,
    ...androidTextProps,
  },
});
