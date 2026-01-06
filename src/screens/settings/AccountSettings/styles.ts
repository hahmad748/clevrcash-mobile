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
});
