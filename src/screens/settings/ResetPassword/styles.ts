import {StyleSheet, Platform} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  card: {
    marginHorizontal: spacing.lg,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  subtitle: {
    ...typography.bodySmall,
    marginBottom: spacing.xxl,
    ...androidTextProps,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
  },
  passwordInput: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.md,
    ...androidTextProps,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  hint: {
    ...typography.caption,
    marginTop: spacing.xs,
    ...androidTextProps,
  },
  saveButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  saveButtonText: {
    ...typography.button,
    color: '#FFFFFF',
    ...androidTextProps,
  },
});
