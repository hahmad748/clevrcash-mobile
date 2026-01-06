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
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: '#333333',
    ...androidTextProps,
  },
  input: {
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    color: '#333333',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...androidTextProps,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  passwordInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    color: '#333333',
    ...androidTextProps,
  },
  eyeButton: {
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    ...typography.medium,
    fontWeight: '700',
    letterSpacing: 0.5,
    ...androidTextProps,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    ...typography.bodySmall,
    color: '#666666',
    ...androidTextProps,
  },
  signInLink: {
    ...typography.bodySmall,
    fontWeight: '700',
    ...androidTextProps,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: spacing.lg,
    ...typography.bodySmall,
    fontWeight: '600',
    color: '#999999',
    ...androidTextProps,
  },
  socialButtonsContainer: {
    flexDirection: 'column',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  socialButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: spacing.sm,
  },
  socialButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: '#333333',
    ...androidTextProps,
  },
});
