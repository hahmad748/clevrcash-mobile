import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Platform, Dimensions, Text} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
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

  const activeIndex = useSharedValue(state.index);
  const tabPositions = useSharedValue<number[]>([]);
  const [displayedIconIndex, setDisplayedIconIndex] = useState(state.index);

  useEffect(() => {
    activeIndex.value = withTiming(state.index, {duration: 300});
    // Delay icon change until after animation completes
    const timer = setTimeout(() => {
      setDisplayedIconIndex(state.index);
    }, 400);
    return () => clearTimeout(timer);
  }, [state.index]);

  // Measure tab button positions
  const handleTabLayout = (index: number, event: any) => {
    const {x, width: buttonWidth} = event.nativeEvent.layout;
    const centerX = x + buttonWidth / 2;
    const newPositions = [...tabPositions.value];
    newPositions[index] = centerX;
    tabPositions.value = newPositions;
  };

  const routesCount = state.routes.length;

  // Animated style for the sliding circle
  const animatedCircleStyle = useAnimatedStyle(() => {
    const circleRadius = (ACTIVE_TAB_SIZE + 8 / 2);
    let leftPosition = 0;

    // If we have measured positions, use them
    const positions = tabPositions.value;
    const currentIndex = Math.round(activeIndex.value);
    if (positions.length === routesCount && positions[currentIndex] !== undefined && positions[currentIndex] > 0) {
      // Position is relative to tabBar, so use it directly
      leftPosition = positions[currentIndex] - circleRadius;
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
      bottom: withTiming(-ACTIVE_TAB_PROTRUSION * 3 , {
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
            <View style={[styles.activeTabCircle, {backgroundColor: "#ffffff"}]}>
              <MaterialIcons
                name={iconMap[state.routes[displayedIconIndex]?.name] || 'circle'}
                size={26}
                color={activeIconColor}
              />
            </View>
            <Text style={[styles.activeTabLabel, {color: primaryColor}]}>
              {state.routes[displayedIconIndex]?.name || ''}
            </Text>
          </View>
        </Animated.View>

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconName = iconMap[route.name] || 'circle';

          const animatedInactiveIconStyle = useAnimatedStyle(() => {
            const isActive = activeIndex.value === index;
            return {
              opacity: withTiming(isActive ? 0 : 1, {duration: 200}),
              transform: [
                {
                  scale: withTiming(isActive ? 0.8 : 1, {duration: 200}),
                },
              ],
            };
          });

          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
              onLayout={event => handleTabLayout(index, event)}>
              <Animated.View style={animatedInactiveIconStyle}>
                <MaterialIcons name={iconName} size={24} color={inactiveColor} />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
