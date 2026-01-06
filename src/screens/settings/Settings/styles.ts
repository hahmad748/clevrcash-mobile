import {StyleSheet} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: spacing.lg,
  },
  menuTitle: {
    flex: 1,
    ...typography.body,
    fontWeight: '500',
    ...androidTextProps,
  },
  menuArrow: {
    fontSize: 24,
    color: '#999',
  },
});
