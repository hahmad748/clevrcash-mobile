import {StyleSheet} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xxl,
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
    ...androidTextProps,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.xxxl,
    ...androidTextProps,
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
  hint: {
    ...typography.caption,
    marginTop: spacing.xs,
    ...androidTextProps,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    ...typography.button,
    ...androidTextProps,
  },
});
