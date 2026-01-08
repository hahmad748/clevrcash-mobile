import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Platform, Dimensions, Text} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '../../contexts/ThemeContext';
import {useBrand} from '../../contexts/BrandContext';
import {styles, ACTIVE_TAB_PROTRUSION, ACTIVE_TAB_SIZE} from './styles';

const {width} = Dimensions.get('window');

// Separate component for tab button to properly use hooks
interface TabButtonProps {
  route: any;
  visibleIndex: number;
  isFocused: boolean;
  iconName: string;
  activeIndex: ReturnType<typeof useSharedValue<number>>;
  inactiveColor: string;
  onPress: () => void;
  onLayout: (index: number, event: any) => void;
}

function TabButton({
  route,
  visibleIndex,
  iconName,
  activeIndex,
  inactiveColor,
  onPress,
  onLayout,
}: TabButtonProps) {
  const animatedInactiveIconStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === visibleIndex;
    return {
      opacity: withTiming(isActive ? 0 : 1, {duration: 320}),
      transform: [
        {
          scale: withTiming(isActive ? 0.8 : 1, {duration: 320}),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      key={route.key}
      onPress={onPress}
      style={styles.tabButton}
      activeOpacity={0.8}
      onLayout={event => onLayout(visibleIndex, event)}>
      <Animated.View style={animatedInactiveIconStyle}>
        <MaterialIcons name={iconName as any} size={24} color={inactiveColor} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const {colors, isDark} = useTheme();
  const {brand} = useBrand();

  const primaryColor = brand?.primary_color || colors.primary;
  const inactiveColor = "#ffffff";
  const barBackgroundColor = isDark ? primaryColor: primaryColor
  const activeIconColor = primaryColor;

  // Material Icons use hyphens in names
  const iconMap: Record<string, string> = {
    Home: 'home',
    Groups: 'groups',
    Friends: 'person',
    Transactions: 'account-balance-wallet',
    Account: 'account-circle',
  };

  // Filter out hidden routes (like Expenses) - must be defined first
  const visibleRoutes = state.routes.filter((route) => {
    const descriptor = descriptors[route.key];
    const options = descriptor?.options;
    return options?.tabBarButton !== null && route.name !== 'Expenses';
  });
  const routesCount = visibleRoutes.length;

  // Calculate the visible index from the actual state index
  const getVisibleIndex = (actualIndex: number): number => {
    const actualRoute = state.routes[actualIndex];
    if (!actualRoute) return 0;
    const visibleIdx = visibleRoutes.findIndex(r => r.key === actualRoute.key);
    return visibleIdx >= 0 ? visibleIdx : 0;
  };

  const activeIndex = useSharedValue(getVisibleIndex(state.index));
  const tabPositions = useSharedValue<number[]>([]);
  const [displayedIconIndex, setDisplayedIconIndex] = useState(getVisibleIndex(state.index));

  useEffect(() => {
    const visibleIdx = getVisibleIndex(state.index);
    activeIndex.value = withTiming(visibleIdx, {duration: 300});
    // Delay icon change until after animation completes
    const timer = setTimeout(() => {
      setDisplayedIconIndex(visibleIdx);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index]);

  // Measure tab button positions
  const handleTabLayout = (index: number, event: any) => {
    const {x, width: buttonWidth} = event.nativeEvent.layout;
    const centerX = x + buttonWidth / 2;
    const newPositions = [...tabPositions.value];
    newPositions[index] = centerX;
    tabPositions.value = newPositions;
  };

  // Animated style for the sliding circle
  const animatedCircleStyle = useAnimatedStyle(() => {
    const circleRadius = (ACTIVE_TAB_SIZE + 8 / 2);
    let leftPosition = 0;

    // If we have measured positions, use them
    const positions = tabPositions.value;
    const currentIndex = Math.round(activeIndex.value);
    if (positions.length === routesCount && positions[currentIndex] !== undefined && positions[currentIndex] > 0) {
      // Position is relative to tabBar, so use it directly
      leftPosition = positions[currentIndex] - (circleRadius -20);
    } else {
      // Fallback calculation: tabs use flex: 1, so each takes equal space
      // Tab bar has paddingHorizontal: 12, so available width is width - 24
      const tabBarPadding = 12; // padding on left side
      const availableWidth = width - (tabBarPadding * 3);
      const tabButtonWidth = availableWidth / routesCount;
      const buttonCenterX = tabBarPadding + (activeIndex.value + 1) * tabButtonWidth;
      leftPosition = buttonCenterX - circleRadius;
    }

    return {
      left: withTiming(leftPosition, {
        duration: 300,
      }),
      bottom: withTiming(Platform.OS === 'android' ? -ACTIVE_TAB_PROTRUSION * 2.5 : -ACTIVE_TAB_PROTRUSION * 3, {
        duration: 300,
      }),
    };
  });

  return (
    <View style={[styles.container, {backgroundColor: barBackgroundColor}]}>
      <View style={styles.tabBar}>
        {/* Single animated circle that slides between tabs */}
        <Animated.View
          style={[
            styles.activeTabContainer,
            animatedCircleStyle,
          ]}>
          <View style={styles.activeTabContent}>
            <View style={[styles.activeTabCircle, {backgroundColor: '#ffffff'}]}>
              <MaterialIcons
                name={iconMap[visibleRoutes[displayedIconIndex]?.name] || 'circle' as any}
                size={26}
                color={activeIconColor}
              />
            </View>
            <Text 
              style={[styles.activeTabLabel, {color: '#ffffff'}]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {visibleRoutes[displayedIconIndex]?.name || ''}
            </Text>
          </View>
        </Animated.View>

        {visibleRoutes.map((route, visibleIndex) => {
            const actualStateIndex = state.routes.findIndex(r => r.key === route.key);
            const isFocused = state.index === actualStateIndex;
            const iconName = iconMap[route.name] || 'circle';

            const onPress = () => {
              if (!isFocused) {
                // When switching to Groups or Friends tab from another tab, reset to list if needed
                if (route.name === 'Groups' || route.name === 'Friends') {
                  const navState = navigation.getState();
                  const targetRoute = navState.routes.find(r => r.name === route.name);
                  if (targetRoute?.state && typeof targetRoute.state.index === 'number' && targetRoute.state.index > 0) {
                    // Reset to list screen before navigating
                    const listScreenName = route.name === 'Groups' ? 'GroupsList' : 'FriendsList';
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          {
                            name: route.name,
                            state: {
                              routes: [{name: listScreenName}],
                              index: 0,
                            },
                          },
                        ],
                      }),
                    );
                  } else {
                    navigation.navigate(route.name);
                  }
                } else {
                  navigation.navigate(route.name);
                }
              } else {
                // If already focused, reset to root screen for Groups or Friends tab
                if (route.name === 'Groups' || route.name === 'Friends') {
                  const navState = navigation.getState();
                  const targetRoute = navState.routes.find(r => r.name === route.name);
                  if (targetRoute?.state && typeof targetRoute.state.index === 'number' && targetRoute.state.index > 0) {
                    const listScreenName = route.name === 'Groups' ? 'GroupsList' : 'FriendsList';
                    navigation.dispatch(
                      CommonActions.reset({
                        index: navState.routes.findIndex(r => r.name === route.name),
                        routes: navState.routes.map((r: any) => {
                          if (r.name === route.name) {
                            return {
                              ...r,
                              state: {
                                routes: [{name: listScreenName}],
                                index: 0,
                              },
                            };
                          }
                          return r;
                        }),
                      }),
                    );
                  }
                }
              }
            };

            return (
              <TabButton
                key={route.key}
                route={route}
                visibleIndex={visibleIndex}
                isFocused={isFocused}
                iconName={iconName}
                activeIndex={activeIndex}
                inactiveColor={inactiveColor}
                onPress={onPress}
                onLayout={handleTabLayout}
              />
            );
          })}
      </View>
    </View>
  );
}
