import {StyleSheet, Platform} from 'react-native';

export const TAB_BAR_HEIGHT = 60;
export const ACTIVE_TAB_SIZE = 56;
export const INACTIVE_TAB_SIZE = 24;
export const BOTTOM_PADDING = Platform.OS === 'ios' ? 20 : 10;
export const ACTIVE_TAB_PROTRUSION = 16; 
export const TOTAL_TAB_BAR_HEIGHT = TAB_BAR_HEIGHT + BOTTOM_PADDING + ACTIVE_TAB_PROTRUSION;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TOTAL_TAB_BAR_HEIGHT,
    paddingBottom: BOTTOM_PADDING,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
    overflow: 'visible',
  },
  tabBar: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
    zIndex: 1,
  },
  activeTabContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    width: ACTIVE_TAB_SIZE + 8,
    height: ACTIVE_TAB_SIZE * 2 + 16,
    zIndex: 10,
  },
  activeTabContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  activeTabCircle: {
    width: ACTIVE_TAB_SIZE,
    height: ACTIVE_TAB_SIZE,
    borderRadius: ACTIVE_TAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 4,
  },
  activeTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginTop: 2,
  },
});
