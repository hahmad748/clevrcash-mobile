import {StyleSheet, Platform, Dimensions} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    // backgroundColor will be set dynamically based on brand colors
    backgroundColor: 'rgba(46, 125, 50, 0.7)', // Fallback: Dark green overlay
  },
  fallbackBackground: {
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: spacing.xxl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  logoText: {
    ...typography.h2,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    ...androidTextProps,
  },
  welcomeText: {
    ...typography.h1,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
    ...androidTextProps,
  },
  subtitleText: {
    ...typography.body,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    ...androidTextProps,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    padding: spacing.xxl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  shieldContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  codeLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: spacing.lg,
    ...androidTextProps,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  codeDigitInput: {
    width: 50,
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    ...typography.h2,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    ...androidTextProps,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: spacing.lg,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    ...typography.medium,
    fontWeight: '700',
    letterSpacing: 0.5,
    ...androidTextProps,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  backButtonText: {
    ...typography.bodySmall,
    fontWeight: '600',
    ...androidTextProps,
  },
});
