import {StyleSheet, Platform} from 'react-native';
import {typography, spacing, androidTextProps} from '../../theme/typography';

export const HEADER_HEIGHT = Platform.OS === 'ios' ? 100 : 75;
export const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 44;

export const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h3,
    textAlign: 'center',
    textTransform: 'capitalize',
    ...androidTextProps,
  },
  rightSection: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    ...typography.captionSmall,
    fontWeight: '700',
    ...androidTextProps,
  },
});
