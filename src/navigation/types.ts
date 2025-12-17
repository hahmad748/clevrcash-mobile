import type {NavigatorScreenParams} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {DrawerScreenProps} from '@react-navigation/drawer';

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  GroupDetail: {groupId: string};
  FriendDetail: {friendId: number};
  ExpenseDetail: {expenseId: string};
  CreateExpense: {groupId?: string; friendId?: number} | undefined;
  SettleUpFriend: {friendId: number};
  SettleUpGroup: {groupId: string};
  EditExpense: {expenseId: string};
  CreateGroup: undefined;
  EditGroup: {groupId: string};
  JoinGroup: undefined;
  InviteFriend: undefined;
  InviteMember: {groupId: string};
  SearchFriends: undefined;
  PendingRequests: undefined;
  ExpensesList: undefined;
  CreatePayment: undefined;
  Charts: undefined;
  RecurringExpenses: undefined;
  Import: undefined;
  Notifications: undefined;
  Settings: undefined;
  AccountSettings: undefined;
  PasswordSettings: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  DevicesSettings: undefined;
  TwoFactorSettings: undefined;
  Verify2FA: undefined;
  ForgotPassword: undefined;
  ResetPassword: {token?: string};
  Help: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: {token?: string};
  Verify2FA: {email: string; password: string} | undefined;
};

export type GroupsStackParamList = {
  GroupsList: undefined;
  GroupDetail: {groupId: string};
};

export type FriendsStackParamList = {
  FriendsList: undefined;
  FriendDetail: {friendId: number};
};

export type ExpensesStackParamList = {
  ExpensesList: undefined;
  CreateExpense: {groupId?: string; friendId?: number} | undefined;
  ExpenseDetail: {expenseId: string};
};

export type MainTabParamList = {
  Home: undefined;
  Groups: NavigatorScreenParams<GroupsStackParamList>;
  Friends: NavigatorScreenParams<FriendsStackParamList>;
  Transactions: undefined;
  Expenses: NavigatorScreenParams<ExpensesStackParamList>;
  Account: undefined;
};

export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Charts: undefined;
  RecurringExpenses: undefined;
  Import: undefined;
  Notifications: undefined;
  Settings: undefined;
  Help: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type DrawerScreenProps<T extends keyof DrawerParamList> = DrawerScreenProps<
  DrawerParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
