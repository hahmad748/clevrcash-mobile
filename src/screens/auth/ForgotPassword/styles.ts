import {StyleSheet, Platform, Dimensions} from 'react-native';
import {typography, spacing, androidTextProps} from '../../../theme/typography';

const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
    textAlign: 'center',
    ...androidTextProps,
  },
  subtitleText: {
    ...typography.body,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
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
    marginBottom: spacing.xxxl,
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
  primaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  backButtonText: {
    ...typography.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
    ...androidTextProps,
  },
});
