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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    ...androidTextProps,
  },
  textArea: {
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    textAlignVertical: 'top',
    ...androidTextProps,
  },
  currencyScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  currencyButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  currencyButtonText: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  categoryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  categoryButtonText: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  saveButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
  errorText: {
    ...typography.body,
    ...androidTextProps,
  },
});
