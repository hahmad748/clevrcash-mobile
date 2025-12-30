import {StyleSheet, Platform, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor will be set dynamically based on brand colors
    backgroundColor: 'rgba(46, 125, 50, 0.7)', // Fallback: Dark green overlay (Green 800 with 70% opacity)
  },
  fallbackBackground: {
    backgroundColor: '#ffffff', // Dark green solid color as fallback (Green 800)
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 60,
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 12,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  getStartedButton: {
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
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
