import {StyleSheet, Platform} from 'react-native';
import {typography, spacing, androidTextProps} from '../../theme/typography';

export const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  // BlurView container for iOS liquid glass effect
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRightWidth: 1,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    // Additional depth
    shadowColor: '#000',
    shadowOffset: {
      width: -4,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
  safeContent: {
    flex: 1,
    paddingTop: 0,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 0,
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: spacing.sm,
  },
  // User Header - Glass Card
  userHeader: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxxl + 30,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    // iOS-style glass shadows
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginRight: 12,
  },
  avatarText: {
    ...typography.medium,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  userEmail: {
    ...typography.caption,
    fontWeight: '400',
    opacity: 0.8,
    ...androidTextProps,
  },
  // Menu Container
  menuContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginVertical: 2,
    borderRadius: 14,
    minHeight: 44,
  },
  menuItemActive: {
    // Pill-shaped active state like iOS
    borderRadius: 15,
  },
  menuIcon: {
    marginRight: spacing.lg,
    width: 24,
  },
  menuLabel: {
    ...typography.bodySmall,
    flex: 1,
    letterSpacing: 0.1,
    ...androidTextProps,
  },
  // Sticky Footer Container
  stickyFooter: {
    backgroundColor: 'transparent',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: spacing.md,
  },
  // Logout Button - Single Container
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
    // Subtle shadow
    shadowColor: '#F44336',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutIcon: {
    marginRight: spacing.sm,
  },
  logoutText: {
    ...typography.bodySmall,
    fontWeight: '600',
    letterSpacing: 0.2,
    ...androidTextProps,
  },
  // Footer
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    alignItems: 'center',
  },
  footerText: {
    ...typography.captionSmall,
    fontWeight: '400',
    letterSpacing: 0.5,
    opacity: 0.6,
    ...androidTextProps,
    marginBottom: spacing.xs,
  },
  versionText: {
    ...typography.captionSmall,
    fontWeight: '300',
    letterSpacing: 0.3,
    opacity: 0.5,
    marginTop: 2,
    ...androidTextProps,
  },
});
