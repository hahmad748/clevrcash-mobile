# Web-to-Mobile Feature Map

This document maps all web routes and features to their mobile screen equivalents and API endpoints.

## Authentication & Onboarding

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| `/register` | `POST /api/v1/register` | `screens/auth/Register/index.tsx` | email, password, name, default_currency |
| `/login` | `POST /api/v1/login` | `screens/auth/Login/index.tsx` | email, password |
| `/login` (2FA) | `POST /api/v1/verify-2fa-login` | `screens/auth/Verify2FA/index.tsx` | email, password, code |
| `/forgot-password` | `POST /api/v1/forgot-password` | `screens/auth/ForgotPassword/index.tsx` | email |
| `/reset-password` | `POST /api/v1/reset-password` | `screens/auth/ResetPassword/index.tsx` | token, email, password |
| Social Login | `POST /api/v1/social-login` | `screens/auth/SocialLogin/index.tsx` | provider, provider_id, email, name |
| Splash Screen | `GET /api/v1/user/brand` | `screens/Splash/index.tsx` | Load brand config after splash |

## Main Navigation

### Bottom Tabs (Primary Navigation)
- **Groups** → `screens/groups/GroupsList/index.tsx`
- **Friends** → `screens/friends/FriendsList/index.tsx`
- **Transactions** → `screens/transactions/TransactionsList/index.tsx`
- **Account** → `screens/account/AccountScreen/index.tsx`

### Side Drawer (All Routes)
- Dashboard/Overview → `screens/dashboard/Dashboard/index.tsx`
- Groups → `screens/groups/GroupsList/index.tsx`
- Friends → `screens/friends/FriendsList/index.tsx`
- Transactions/Activity → `screens/transactions/TransactionsList/index.tsx`
- Charts & Graphs → `screens/charts/ChartsScreen/index.tsx`
- Recurring Expenses → `screens/recurring/RecurringExpensesList/index.tsx`
- Imports → `screens/imports/ImportScreen/index.tsx`
- Notifications → `screens/notifications/NotificationsList/index.tsx`
- Settings → `screens/settings/SettingsScreen/index.tsx`
- Help/About → `screens/help/HelpScreen/index.tsx`

## Dashboard

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| `/dashboard` | `GET /api/v1/dashboard/summary` | `screens/dashboard/Dashboard/index.tsx` | user, balances, recent_expenses, groups_count, friends_count |

## Groups

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| `/groups` | `GET /api/v1/groups` | `screens/groups/GroupsList/index.tsx` | groups[], filters (search, currency, role) |
| `/groups/create` | `POST /api/v1/groups` | `screens/groups/CreateGroup/index.tsx` | name, description, currency |
| `/groups/{group}` | `GET /api/v1/groups/{group}` | `screens/groups/GroupDetail/index.tsx` | group, members[], expenses[], balances |
| `/groups/{group}/edit` | `PUT /api/v1/groups/{group}` | `screens/groups/EditGroup/index.tsx` | group data |
| `/groups/join` | `POST /api/v1/groups/join` | `screens/groups/JoinGroup/index.tsx` | invite_code |
| `/groups/{group}/invite` | `POST /api/v1/groups/{group}/invite` | `screens/groups/InviteMember/index.tsx` | email |
| `/groups/accept-invitation/{token}` | `GET /api/v1/groups/accept-invitation/{token}` | Deep link handler | token |
| `/groups/{group}/settle` | `POST /api/v1/groups/{group}/settle` | `screens/groups/SettleUp/index.tsx` | amount, currency, method, from_user_id, to_user_id |
| `/groups/{group}/remind` | `POST /api/v1/groups/{group}/remind` | Action in GroupDetail | message (optional) |
| `/groups/{group}/balances` | `GET /api/v1/groups/{group}/balances` | Tab in GroupDetail | balances[] |
| `/groups/{group}/transactions` | `GET /api/v1/groups/{group}/transactions` | Tab in GroupDetail | transactions[] |
| `/groups/{group}/simplify-debts` | `POST /api/v1/groups/{group}/simplify-debts` | Action in GroupDetail | simplified transfers[] |

## Friends

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| `/friends` | `GET /api/v1/friends` | `screens/friends/FriendsList/index.tsx` | friends[], filters (search) |
| `/friends/search` | `POST /api/v1/friends/search` | `screens/friends/SearchFriends/index.tsx` | query string |
| `/friends/request` | `POST /api/v1/friends/request` | Action in SearchFriends | friend_id |
| `/friends/invite-email` | `POST /api/v1/friends/invite-email` | `screens/friends/InviteFriend/index.tsx` | email |
| `/friends/accept-invitation/{token}` | `GET /api/v1/friends/accept-invitation/{token}` | Deep link handler | token |
| `/friends/{friend}` | `GET /api/v1/friends/{friend}/balance` | `screens/friends/FriendDetail/index.tsx` | friend, balance, transactions[] |
| `/friends/{friend}/settle` | `POST /api/v1/friends/{friend}/settle` | `screens/friends/SettleUp/index.tsx` | amount, currency, method |
| `/friends/{friend}/remind` | `POST /api/v1/friends/{friend}/remind` | Action in FriendDetail | message (optional) |
| `/friends/{friend}/transactions` | `GET /api/v1/friends/{friend}/transactions` | Tab in FriendDetail | transactions[] |
| `/friends/pending` | `GET /api/v1/friends/pending` | `screens/friends/PendingRequests/index.tsx` | pending_requests[] |

## Expenses

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| `/expenses` | `GET /api/v1/expenses` | `screens/expenses/ExpensesList/index.tsx` | expenses[], filters (group_id, friend_id, date_from, date_to, currency, category, search) |
| `/expenses/create` | `POST /api/v1/expenses` | `screens/expenses/CreateExpense/index.tsx` | description, amount, currency, date, paid_by, participants[], split_type, split_data, category_id, items[], attachments[] |
| `/expenses/{hash}` | `GET /api/v1/expenses/{expense}` | `screens/expenses/ExpenseDetail/index.tsx` | expense, payer, creator, splits[], items[], attachments[] |
| `/expenses/{hash}` (edit) | `PUT /api/v1/expenses/{expense}` | `screens/expenses/EditExpense/index.tsx` | expense data |
| `/expenses/{hash}` (delete) | `DELETE /api/v1/expenses/{expense}` | Action in ExpenseDetail | - |
| `/expenses/{expense}/attachments` | `POST /api/v1/expenses/{expense}/attachments` | Action in ExpenseDetail | file |

## Transactions

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| `/transactions` | `GET /api/v1/transactions` | `screens/transactions/TransactionsList/index.tsx` | transactions[] (expenses + payments), filters |

## Payments

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| `/payments` | `GET /api/v1/payments` | Part of TransactionsList | payments[], filters |
| `/payments` | `POST /api/v1/payments` | `screens/payments/CreatePayment/index.tsx` | from_user_id, to_user_id, amount, currency, method, notes |

## Charts & Statistics

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| Charts | `GET /api/v1/charts/expenses-by-category` | `screens/charts/ChartsScreen/index.tsx` | chart data |
| Charts | `GET /api/v1/charts/expenses-by-month` | Tab in ChartsScreen | monthly data |
| Charts | `GET /api/v1/charts/expenses-by-day` | Tab in ChartsScreen | daily data |
| Charts | `GET /api/v1/charts/top-expenses` | Tab in ChartsScreen | top expenses[] |
| Charts | `GET /api/v1/charts/spending-summary` | Tab in ChartsScreen | summary data |
| Charts | `GET /api/v1/charts/balances-by-currency` | Tab in ChartsScreen | balances by currency[] |

## Balances

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| Balances | `GET /api/v1/balances/total` | Dashboard widget | total_balance |
| Balances | `GET /api/v1/balances/friends` | Dashboard widget | friends_balances[] |
| Balances | `GET /api/v1/balances/groups` | Dashboard widget | groups_balances[] |

## Notifications

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| Notifications | `GET /api/v1/notifications` (to be implemented) | `screens/notifications/NotificationsList/index.tsx` | notifications[], read/unread status |
| Notification types: | | | |
| - ExpenseAdded | Database notification | Notification item | expense, actor |
| - ExpenseEdited | Database notification | Notification item | expense, actor |
| - ExpenseDeleted | Database notification | Notification item | expense, actor |
| - PaymentReceived | Database notification | Notification item | payment, actor |
| - AddedAsFriend | Database notification | Notification item | friend, actor |
| - AddedToGroup | Database notification | Notification item | group, actor |
| - GroupInvitationAccepted | Database notification | Notification item | group, user |
| - RemindNotification | Database notification | Notification item | actor, group/friend, message |
| - WeeklySummary | Database notification | Notification item | summary data |
| - MonthlySummary | Database notification | Notification item | summary data |
| - ExpenseDue | Database notification | Notification item | expense, amount_owed |
| - WelcomeNotification | Database notification | Notification item | - |
| - SubscriptionSuccess | Database notification | Notification item | subscription |

## Reminders

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| `/friends/{friend}/remind` | `POST /api/v1/reminders/friend/{friend}` | Action in FriendDetail | message (optional) |
| `/groups/{group}/remind` | `POST /api/v1/reminders/group/{group}` | Action in GroupDetail | message (optional) |

## Settings

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| `/settings` | `GET /api/v1/user` | `screens/settings/SettingsScreen/index.tsx` | user data |
| `/settings/account` | `PUT /api/v1/user/account` | `screens/settings/AccountSettings/index.tsx` | name, email, phone, default_currency, timezone, language |
| `/settings/password` | `PUT /api/v1/user/password` | `screens/settings/PasswordSettings/index.tsx` | current_password, password |
| `/settings/notifications` | `PUT /api/v1/user/notifications` | `screens/settings/NotificationSettings/index.tsx` | email_notifications, push_notifications, notification_preferences |
| `/settings/privacy` | `PUT /api/v1/user/privacy` | `screens/settings/PrivacySettings/index.tsx` | allow_friend_suggestions, settings |
| `/settings/devices` | `GET /api/v1/user/devices` | `screens/settings/DevicesSettings/index.tsx` | devices[] |
| Avatar upload | `POST /api/v1/user/avatar` | Action in AccountSettings | file |
| 2FA Enable | `POST /api/v1/2fa/enable` | `screens/settings/TwoFactorSettings/index.tsx` | - |
| 2FA Verify | `POST /api/v1/2fa/verify` | `screens/settings/Verify2FA/index.tsx` | code |
| 2FA Disable | `POST /api/v1/2fa/disable` | Action in TwoFactorSettings | password |

## Utilities

| Web Route | API Endpoint | Mobile Screen | Usage |
|-----------|--------------|---------------|-------|
| Currencies | `GET /api/v1/utilities/currencies` | Dropdowns, selectors | currency list |
| Categories | `GET /api/v1/utilities/categories` | Expense creation | category list |
| Timezones | `GET /api/v1/utilities/timezones` | Settings | timezone list |
| Languages | `GET /api/v1/utilities/languages` | Settings | language list |

## Currency Conversion

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| Convert | `POST /api/v1/currency/convert` | Expense creation, conversion | amount, from, to |
| Rate | `GET /api/v1/currency/rate` | Expense creation | from, to |
| Rates | `POST /api/v1/currency/rates` | Multi-currency views | from_currency, to_currencies[] |

## Subscriptions (PRO Features)

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| `/subscriptions` | Web only (Stripe checkout) | `screens/subscriptions/SubscriptionScreen/index.tsx` | Show subscription status, upgrade button |
| Feature gating | Check user subscription | Throughout app | Check `user.subscription_status` |

## Deep Linking

| Deep Link Pattern | Mobile Handler | Action |
|-------------------|----------------|--------|
| `clevrcash://invite/{token}` | `navigation/DeepLinkHandler.tsx` | Accept friend/group invitation |
| `clevrcash://group/{groupId}` | DeepLinkHandler | Navigate to group detail |
| `clevrcash://expense/{expenseId}` | DeepLinkHandler | Navigate to expense detail |
| `clevrcash://settle/{groupId or friendId}` | DeepLinkHandler | Navigate to settle screen |
| `clevrcash://notification/{id}` | DeepLinkHandler | Navigate to notification/related screen |
| `https://{brand-domain}/invite/{token}` | Universal link handler | Accept invitation |
| `https://{brand-domain}/g/{groupId}` | Universal link handler | Navigate to group |
| `https://{brand-domain}/e/{expenseId}` | Universal link handler | Navigate to expense |

## Brand Configuration

| Source | API Endpoint | Mobile Usage |
|--------|--------------|-------------|
| Build-time config | `config/brand.json` | Default brand |
| Runtime config | `GET /api/v1/user/brand` | Override with user's brand |
| Theme tokens | From brand config | Apply colors, fonts, logos |

## Feature Flags

Feature flags come from brand config (`feature_flags`):
- `receipt_scanning` - Enable receipt scanning in expense creation
- `currency_conversion` - Enable multi-currency support
- `itemization` - Enable line items in expenses
- `charts` - Enable charts & statistics
- `search` - Enable search functionality

## Recurring Expenses

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| Recurring list | To be implemented | `screens/recurring/RecurringExpensesList/index.tsx` | recurring_expenses[] |
| Create recurring | To be implemented | `screens/recurring/CreateRecurring/index.tsx` | expense data + recurrence pattern |
| Edit recurring | To be implemented | `screens/recurring/EditRecurring/index.tsx` | recurring expense data |
| Pause/Resume | To be implemented | Action in list | recurring_expense_id |

## Imports

| Web Route | API Endpoint | Mobile Screen | State Requirements |
|-----------|--------------|---------------|-------------------|
| Import Splitwise | To be implemented | `screens/imports/ImportScreen/index.tsx` | CSV file, mapping config |
| Import progress | To be implemented | `screens/imports/ImportProgress/index.tsx` | import_id, progress, status |

## Notes

- All API endpoints require Bearer token authentication except public routes
- Expense splits support: equal, exact amounts, percentages, shares
- Expenses support itemization (line items)
- Expenses support attachments (receipts)
- Multi-currency support with FX rate snapshots
- All screens should support offline mode with local SQLite storage
- Push notifications via FCM for Android and APNs for iOS
