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
  sectionLabel: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginBottom: spacing.md,
    ...androidTextProps,
  },
  input: {
    ...typography.medium,
    paddingBottom: spacing.sm,
    borderBottomWidth: 2,
    ...androidTextProps,
  },
  addDescriptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  addDescriptionText: {
    ...typography.body,
    fontWeight: '500',
    ...androidTextProps,
  },
  textArea: {
    minHeight: 100,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(0,0,0,0.02)',
    ...androidTextProps,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    minHeight: 48,
  },
  currencyText: {
    ...typography.body,
    fontWeight: '500',
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
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    ...typography.button,
    fontWeight: '500',
    ...androidTextProps,
  },
});
