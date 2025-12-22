import {StyleSheet, Platform} from 'react-native';

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
  },
  contentWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  // User Header - Glass Card
  userHeader: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    padding: 14,
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
    marginRight: 12,
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
    fontSize: 20,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  userEmail: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.8,
  },
  // Menu Container
  menuContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 3,
    borderRadius: 14,
    minHeight: 44,
  },
  menuItemActive: {
    // Pill-shaped active state like iOS
    borderRadius: 20,
  },
  menuIcon: {
    marginRight: 14,
    width: 24,
  },
  menuLabel: {
    fontSize: 15,
    flex: 1,
    letterSpacing: 0.1,
  },
  // Sticky Footer Container
  stickyFooter: {
    backgroundColor: 'transparent',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 8,
  },
  // Logout Section - Glass Card
  logoutSection: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(244, 67, 54, 0.08)',
  },
  logoutIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
});
