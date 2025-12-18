import React, {useEffect} from 'react';
import {NavigationContainer, Linking, NavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CommonActions} from '@react-navigation/native';
import type {NavigatorScreenParams} from '@react-navigation/native';
import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';
import {useBrand} from '../contexts/BrandContext';
import {useDeepLinking} from './DeepLinkHandler';
import {SplashScreen} from '../screens/Splash';
import {WelcomeScreen} from '../screens/auth/Welcome';
import {LoginScreen} from '../screens/auth/Login';
import {RegisterScreen} from '../screens/auth/Register';
import {ForgotPasswordScreen} from '../screens/auth/ForgotPassword';
import {ResetPasswordScreen} from '../screens/auth/ResetPassword';
import {Verify2FAScreen} from '../screens/auth/Verify2FA';
import {GroupsListScreen} from '../screens/groups/GroupsList';
import {GroupDetailScreen} from '../screens/groups/GroupDetail';
import {FriendsListScreen} from '../screens/friends/FriendsList';
import {FriendDetailScreen} from '../screens/friends/FriendDetail';
import {TransactionsListScreen} from '../screens/transactions/TransactionsList';
import {TransactionDetailScreen} from '../screens/transactions/TransactionDetail';
import {AccountScreen} from '../screens/account/AccountScreen';
import {DashboardScreen} from '../screens/dashboard/Dashboard';
import {CreateExpenseScreen} from '../screens/expenses/CreateExpense';
import {SettleUpFriendScreen} from '../screens/friends/SettleUp';
import {CreateGroupScreen} from '../screens/groups/CreateGroup';
import {JoinGroupScreen} from '../screens/groups/JoinGroup';
import {InviteMemberScreen} from '../screens/groups/InviteMember';
import {SettleUpGroupScreen} from '../screens/groups/SettleUp';
import {ExpenseDetailScreen} from '../screens/expenses/ExpenseDetail';
import {ExpensesListScreen} from '../screens/expenses/ExpensesList';
import {SearchFriendsScreen} from '../screens/friends/SearchFriends';
import {InviteFriendScreen} from '../screens/friends/InviteFriend';
import {PendingRequestsScreen} from '../screens/friends/PendingRequests';
import {EditGroupScreen} from '../screens/groups/EditGroup';
import {EditExpenseScreen} from '../screens/expenses/EditExpense';
import {SettingsScreen} from '../screens/settings/Settings';
import {AccountSettingsScreen} from '../screens/settings/AccountSettings';
import {PasswordSettingsScreen} from '../screens/settings/PasswordSettings';
import {NotificationSettingsScreen} from '../screens/settings/NotificationSettings';
import {PrivacySettingsScreen} from '../screens/settings/PrivacySettings';
import {DevicesSettingsScreen} from '../screens/settings/DevicesSettings';
import {TwoFactorSettingsScreen} from '../screens/settings/TwoFactorSettings';
import {DrawerContent} from '../components/DrawerContent/index';
import {CustomTabBar} from '../components/CustomTabBar';
import {CustomHeader} from '../components/CustomHeader';
import type {RootStackParamList, AuthStackParamList, MainTabParamList, DrawerParamList} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();
const GroupsStack = createNativeStackNavigator();
const FriendsStack = createNativeStackNavigator();
const ExpensesStack = createNativeStackNavigator();

function CustomDetailHeader() {
  const {colors} = useTheme();
  const {brand} = useBrand();
  const primaryColor = brand?.primary_color || colors.primary;

  return (
    <CustomHeader
      title=""
      showBack={true}
      showDrawer={false}
      showNotifications={false}
      backgroundColor={primaryColor}
    />
  );
}



function AuthNavigator() {
  const {colors} = useTheme();
  const {brand} = useBrand();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <AuthStack.Screen name="Verify2FA" component={Verify2FAScreen} />
    </AuthStack.Navigator>
  );
}

function GroupsStackNavigator() {
  return (
    <GroupsStack.Navigator screenOptions={{headerShown: false}}>
      <GroupsStack.Screen name="GroupsList" component={GroupsListScreen} />
      <GroupsStack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{
          header: () => <CustomDetailHeader />,
          headerShown: true,
        }}
      />
      <GroupsStack.Screen name="SettleUpGroup" component={SettleUpGroupScreen} />
    </GroupsStack.Navigator>
  );
}

function FriendsStackNavigator() {
  return (
    <FriendsStack.Navigator screenOptions={{headerShown: false}}>
      <FriendsStack.Screen name="FriendsList" component={FriendsListScreen} />
      <FriendsStack.Screen
        name="FriendDetail"
        component={FriendDetailScreen}
        options={{
          header: () => <CustomDetailHeader />,
          headerShown: true,
        }}
      />
    </FriendsStack.Navigator>
  );
}

function ExpensesStackNavigator() {
  return (
    <ExpensesStack.Navigator screenOptions={{headerShown: false}}>
      <ExpensesStack.Screen name="ExpensesList" component={ExpensesListScreen} />
      <ExpensesStack.Screen name="CreateExpense" component={CreateExpenseScreen} />
      <ExpensesStack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
    </ExpensesStack.Navigator>
  );
}

function MainTabNavigator() {
  const {colors} = useTheme();
  const {brand} = useBrand();

  return (
    <MainTab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false, 
        tabBarShowLabel: false, 
        tabBarStyle: {
          display: 'none', 
        },
      }}>
      <MainTab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <MainTab.Screen
        name="Groups"
        component={GroupsStackNavigator}
        options={{
          tabBarLabel: 'Groups',
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            // Get the current navigation state
            const state = navigation.getState();
            const currentTabIndex = state.index;
            const groupsRoute = state.routes.find((r: any) => r.name === 'Groups');
            const currentRoute = state.routes[currentTabIndex];

            // Check if we're switching TO Groups tab from another tab
            // OR if Groups stack has nested screens (index > 0 means we're not on GroupsList)
            const isSwitchingToGroups = currentRoute?.name !== 'Groups';
            const hasNestedScreens = groupsRoute?.state && groupsRoute.state.index > 0;

            // Always reset if we have nested screens OR if we're switching tabs
            if (isSwitchingToGroups || hasNestedScreens) {
              e.preventDefault();
              const groupsTabIndex = state.routes.findIndex((r: any) => r.name === 'Groups');
              navigation.dispatch(
                CommonActions.reset({
                  index: groupsTabIndex,
                  routes: state.routes.map((route: any) => {
                    if (route.name === 'Groups') {
                      return {
                        ...route,
                        state: {
                          routes: [{name: 'GroupsList'}],
                          index: 0,
                        },
                      };
                    }
                    return route;
                  }),
                }),
              );
            }
          },
        })}
      />
      <MainTab.Screen
        name="Friends"
        component={FriendsStackNavigator}
        options={{
          tabBarLabel: 'Friends',
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const friendsRoute = state.routes.find((r: any) => r.name === 'Friends');
            const hasNestedScreens = friendsRoute?.state && friendsRoute.state.index > 0;

            // Always reset to FriendsList if we have nested screens
            if (hasNestedScreens) {
              e.preventDefault();
              const friendsTabIndex = state.routes.findIndex((r: any) => r.name === 'Friends');
              navigation.dispatch(
                CommonActions.reset({
                  index: friendsTabIndex,
                  routes: state.routes.map((route: any) => {
                    if (route.name === 'Friends') {
                      return {
                        ...route,
                        state: {
                          routes: [{name: 'FriendsList'}],
                          index: 0,
                        },
                      };
                    }
                    return route;
                  }),
                }),
              );
            }
          },
        })}
      />
      <MainTab.Screen
        name="Transactions"
        component={TransactionsListScreen}
        options={{
          tabBarLabel: 'Transactions',
        }}
      />
      {/* Add ExpensesStack as a hidden tab for CreateExpense to have bottom tabs */}
      <MainTab.Screen
        name="Expenses"
        component={ExpensesStackNavigator}
        options={{
          tabBarLabel: 'Expenses',
          tabBarButton: () => null, // Hide from tab bar
        }}
      />
      <MainTab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
        }}
      />
    </MainTab.Navigator>
  );
}

function DrawerNavigator() {
  const {colors} = useTheme();
  const {brand} = useBrand();

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        header: ({route, options}) => (
          <CustomHeader
            title={options.title || route.name}
            showDrawer={true}
            showBack={false}
            showNotifications={true}
          />
        ),
        drawerStyle: {
          backgroundColor: colors.surface,
          width: 280,
        },
        drawerActiveTintColor: brand?.primary_color || colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}>
      <Drawer.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{
          title: 'Home',
          drawerLabel: 'Home',
          headerShown: false,
        }}
      />
      {/* Removed duplicate Dashboard, Groups, Friends, Transactions screens - they're now accessed via MainTabs */}
      <Drawer.Screen
        name="Charts"
        component={DashboardScreen} // TODO: Replace with ChartsScreen
        options={{
          title: 'Charts & Graphs',
          drawerLabel: 'Charts & Graphs',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="RecurringExpenses"
        component={DashboardScreen} // TODO: Replace with RecurringExpensesScreen
        options={{
          title: 'Recurring Expenses',
          drawerLabel: 'Recurring Expenses',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Import"
        component={DashboardScreen} // TODO: Replace with ImportScreen
        options={{
          title: 'Imports',
          drawerLabel: 'Imports',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={DashboardScreen} // TODO: Replace with NotificationsScreen
        options={{
          title: 'Notifications',
          drawerLabel: 'Notifications',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerLabel: 'Settings',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Help"
        component={DashboardScreen} // TODO: Replace with HelpScreen
        options={{
          title: 'Help & About',
          drawerLabel: 'Help & About',
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}


export default function AppNavigator() {
  const {isAuthenticated, loading} = useAuth();
  const {loading: brandLoading} = useBrand();
  const navigationRef = React.useRef<NavigationContainerRef<any>>(null);
  
  // Component to handle deep linking inside NavigationContainer
  function DeepLinkHandler() {
    useDeepLinking();
    return null;
  }

  if (loading || brandLoading) {
    return (
      <NavigationContainer ref={navigationRef}>
        <DeepLinkHandler />
        <RootStack.Navigator screenOptions={{headerShown: false}} >
          <RootStack.Screen name="Splash" component={SplashScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <DeepLinkHandler />
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <RootStack.Screen
              name="Main"
              component={DrawerNavigator}
              options={{headerShown: false}}
            />
            {/* GroupDetail and FriendDetail are now in nested stacks within MainTabNavigator */}
            {/* CreateExpense is now in ExpensesStack within MainTabNavigator */}
            <RootStack.Screen
              name="SettleUpFriend"
              component={SettleUpFriendScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="CreateGroup"
              component={CreateGroupScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="SearchFriends"
              component={SearchFriendsScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="InviteFriend"
              component={InviteFriendScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="PendingRequests"
              component={PendingRequestsScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="JoinGroup"
              component={JoinGroupScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="ExpenseDetail"
              component={ExpenseDetailScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="TransactionDetail"
              component={TransactionDetailScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="ExpensesList"
              component={ExpensesListScreen}
              options={{
                header: ({options}) => (
                  <CustomHeader
                    title={options.title || 'Expenses'}
                    showNotifications={true}
                  />
                ),
              }}
            />
            <RootStack.Screen
              name="InviteMember"
              component={InviteMemberScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="SettleUpGroup"
              component={SettleUpGroupScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="EditGroup"
              component={EditGroupScreen}
              options={{
                header: () => <CustomDetailHeader />, 
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="EditExpense"
              component={EditExpenseScreen}
              options={{
                header: () => <CustomDetailHeader />,
                headerShown: true,
              }}
            />
            <RootStack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                header: ({options}) => (
                  <CustomHeader
                    title={options.title || 'Settings'}
                    showNotifications={true}
                  />
                ),
              }}
            />
            <RootStack.Screen
              name="AccountSettings"
              component={AccountSettingsScreen}
              options={{
                header: ({options}) => (
                  <CustomHeader
                    title={options.title || 'Account Settings'}
                    showNotifications={true}
                  />
                ),
              }}
            />
            <RootStack.Screen
              name="PasswordSettings"
              component={PasswordSettingsScreen}
              options={{
                header: ({options}) => (
                  <CustomHeader
                    title={options.title || 'Change Password'}
                    showNotifications={true}
                  />
                ),
              }}
            />
            <RootStack.Screen
              name="NotificationSettings"
              component={NotificationSettingsScreen}
              options={{
                header: ({options}) => (
                  <CustomHeader
                    title={options.title || 'Notification Settings'}
                    showNotifications={true}
                  />
                ),
              }}
            />
            <RootStack.Screen
              name="PrivacySettings"
              component={PrivacySettingsScreen}
              options={{
                header: ({options}) => (
                  <CustomHeader
                    title={options.title || 'Privacy Settings'}
                    showNotifications={true}
                  />
                ),
              }}
            />
            <RootStack.Screen
              name="DevicesSettings"
              component={DevicesSettingsScreen}
              options={{
                header: ({options}) => (
                  <CustomHeader
                    title={options.title || 'Devices'}
                    showNotifications={true}
                  />
                ),
              }}
            />
            <RootStack.Screen
              name="TwoFactorSettings"
              component={TwoFactorSettingsScreen}
              options={{
                header: ({options}) => (
                  <CustomHeader
                    title={options.title || 'Two-Factor Authentication'}
                    showNotifications={true}
                  />
                ),
              }}
            />
            {/* Add more modal screens here */}
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
