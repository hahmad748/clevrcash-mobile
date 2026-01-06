import {StyleSheet} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.medium,
    fontWeight: '600',
    marginBottom: spacing.md,
    ...androidTextProps,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  settingTitle: {
    ...typography.body,
    fontWeight: '500',
    flex: 1,
    ...androidTextProps,
  },
});
