import {StyleSheet} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  settingsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
  },
  optionItemBorder: {
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLabel: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginLeft: spacing.md,
    ...androidTextProps,
  },
  optionItemDisabled: {
    opacity: 0.5,
  },
  loaderIcon: {
    marginRight: 0,
  },
  infoCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    flex: 1,
    ...typography.bodySmall,
    ...androidTextProps,
  },
});
