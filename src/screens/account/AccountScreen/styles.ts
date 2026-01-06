import {StyleSheet, Platform} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  // Profile Card
  profileCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
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
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarText: {
    ...typography.h2,
    fontWeight: '700',
    ...androidTextProps,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.medium,
    fontWeight: '700',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  userEmail: {
    ...typography.bodySmall,
    fontWeight: '400',
    ...androidTextProps,
  },
  editButton: {
    padding: spacing.sm,
  },
  // Section Header
  sectionHeader: {
    ...typography.body,
    fontWeight: '700',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    ...androidTextProps,
  },
  // Settings Card
  settingsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginLeft: spacing.md,
    ...androidTextProps,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingRightText: {
    ...typography.bodySmall,
    fontWeight: '400',
    ...androidTextProps,
  },
  // PRO Banner
  proBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  proBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  proBannerTextContainer: {
    marginLeft: spacing.lg,
  },
  proBannerTitle: {
    ...typography.medium,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    ...androidTextProps,
  },
  proBannerSubtitle: {
    ...typography.bodySmall,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '400',
    ...androidTextProps,
  },
});
