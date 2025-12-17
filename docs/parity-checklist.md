# Mobile App Parity Checklist

This checklist ensures all web features are implemented in the mobile app.

## ✅ Authentication & Security

- [ ] Register screen with validation
- [ ] Login screen with email/password
- [ ] Social login (Google - Android + iOS)
- [ ] Social login (Apple - iOS only)
- [ ] Forgot password flow
- [ ] Reset password with token
- [ ] 2FA enable/disable
- [ ] 2FA verification on login
- [ ] 2FA recovery codes
- [ ] Token storage (Keychain/Keystore)
- [ ] Token refresh on expiry
- [ ] Auto re-auth on token expiry
- [ ] Biometric unlock (optional)
- [ ] Secure screen capture prevention
- [ ] Logout / Logout all devices

## ✅ Navigation

- [ ] Bottom tabs (Groups, Friends, Transactions, Account)
- [ ] Side drawer with all routes
- [ ] Drawer accessible from all screens
- [ ] Deep link routing
- [ ] Universal links / App links
- [ ] Deep link handling when logged out (store intent)
- [ ] Navigation state persistence

## ✅ Dashboard

- [ ] Dashboard summary screen
- [ ] Total balance display
- [ ] Groups count
- [ ] Friends count
- [ ] Expenses this month
- [ ] Recent expenses list
- [ ] Quick actions

## ✅ Groups

- [ ] Groups list screen
- [ ] Group filters (search, currency, role)
- [ ] Create group screen
- [ ] Group detail screen
- [ ] Group members list
- [ ] Group expenses list
- [ ] Group balances view
- [ ] Group transactions view
- [ ] Edit group screen
- [ ] Delete group
- [ ] Join group by code
- [ ] Invite member by email
- [ ] Accept group invitation (token)
- [ ] Remove member
- [ ] Settle up in group
- [ ] Simplify debts
- [ ] Send reminder to group
- [ ] Group favorites

## ✅ Friends

- [ ] Friends list screen
- [ ] Friend filters (search)
- [ ] Search friends screen
- [ ] Send friend request
- [ ] Invite friend by email
- [ ] Accept friend invitation (token)
- [ ] Accept/decline friend request
- [ ] Pending requests screen
- [ ] Friend detail screen
- [ ] Friend balance display
- [ ] Friend transactions list
- [ ] Settle up with friend
- [ ] Send reminder to friend
- [ ] Remove friend

## ✅ Expenses

- [ ] Expenses list screen
- [ ] Expense filters (group, friend, date, currency, category, search, amount range)
- [ ] Create expense screen
- [ ] Participant selection (all/none)
- [ ] Split types: equal, exact, percentage, shares
- [ ] Split data input for each type
- [ ] Itemization (line items)
- [ ] Attachment upload (receipts)
- [ ] Category selection
- [ ] Multi-currency support
- [ ] FX rate display
- [ ] Reimbursement expense toggle
- [ ] Save default splits
- [ ] Expense detail screen
- [ ] Edit expense screen
- [ ] Delete expense
- [ ] Expense attachments view
- [ ] Expense items view

## ✅ Transactions

- [ ] Transactions list screen (combined expenses + payments)
- [ ] Transaction filters (group, friend, date, currency, category, search)
- [ ] Transaction detail view
- [ ] Transaction search
- [ ] Sort options (date, amount)

## ✅ Payments

- [ ] Payments list (part of transactions)
- [ ] Create payment screen
- [ ] Payment filters
- [ ] Payment detail view
- [ ] Edit payment
- [ ] Delete payment

## ✅ Charts & Statistics

- [ ] Charts screen
- [ ] Expenses by category chart
- [ ] Expenses by month chart
- [ ] Expenses by day chart
- [ ] Top expenses list
- [ ] Spending summary
- [ ] Balances by currency
- [ ] Chart filters (date range, group, currency)

## ✅ Balances

- [ ] Total balance display
- [ ] Friends balances list
- [ ] Groups balances list
- [ ] Balance by currency breakdown

## ✅ Notifications

- [ ] Notifications list screen
- [ ] Read/unread status
- [ ] Mark as read
- [ ] Mark all as read
- [ ] Notification detail view
- [ ] Navigate from notification to related screen
- [ ] Push notifications setup (FCM/APNs)
- [ ] Push notification handling
- [ ] In-app notification badges
- [ ] Notification preferences

## ✅ Reminders

- [ ] Send reminder to friend
- [ ] Send reminder to group
- [ ] Reminder message input (optional)

## ✅ Settings

- [ ] Settings main screen
- [ ] Account settings (name, email, phone, currency, timezone, language)
- [ ] Password change
- [ ] Notification preferences
- [ ] Privacy settings
- [ ] Theme selection (light/dark/system)
- [ ] Language selection (7+ languages + RTL)
- [ ] Avatar upload
- [ ] Devices management
- [ ] Revoke device
- [ ] Revoke all devices
- [ ] Two-factor authentication settings
- [ ] Help/About screen

## ✅ Branding & Theming

- [ ] Brand config loading (build-time + runtime)
- [ ] Logo display
- [ ] Splash screen with brand logo
- [ ] Primary color application
- [ ] Secondary color application
- [ ] Font family application
- [ ] Theme tokens (light/dark)
- [ ] Feature flags enforcement
- [ ] Supported languages/currencies from brand

## ✅ Deep Linking

- [ ] `clevrcash://invite/{token}` handler
- [ ] `clevrcash://group/{groupId}` handler
- [ ] `clevrcash://expense/{expenseId}` handler
- [ ] `clevrcash://settle/{id}` handler
- [ ] `clevrcash://notification/{id}` handler
- [ ] Universal links handler
- [ ] App links handler (Android)
- [ ] Deep link routing when logged out
- [ ] Deep link routing when logged in

## ✅ Offline Mode

- [ ] SQLite local database
- [ ] Outbox queue for actions
- [ ] Background sync when online
- [ ] Conflict resolution (last-write-wins)
- [ ] Offline banner indicator
- [ ] Sync pending indicators
- [ ] Local data caching

## ✅ Responsive Design

- [ ] Phone layouts (360px+)
- [ ] Small phone support
- [ ] Tablet layouts
- [ ] Landscape orientation support
- [ ] Dynamic type font scaling
- [ ] Safe area handling
- [ ] Consistent spacing scale
- [ ] Consistent typography scale
- [ ] Layout grids

## ✅ Recurring Expenses

- [ ] Recurring expenses list
- [ ] Create recurring expense
- [ ] Edit recurring expense
- [ ] Pause recurring expense
- [ ] Resume recurring expense
- [ ] Delete recurring expense
- [ ] Recurrence pattern selection

## ✅ Imports

- [ ] Import screen
- [ ] Splitwise CSV upload
- [ ] Import mapping configuration
- [ ] Import progress tracking
- [ ] Import results view

## ✅ Subscriptions (PRO)

- [ ] Subscription status display
- [ ] Upgrade screen
- [ ] Feature gating
- [ ] PRO badge/indicator

## ✅ Utilities

- [ ] Currency list
- [ ] Category list
- [ ] Timezone list
- [ ] Language list

## ✅ Currency Conversion

- [ ] Currency conversion in expense creation
- [ ] FX rate display
- [ ] Multi-currency rate fetching

## ✅ Error Handling

- [ ] Network error handling
- [ ] API error handling
- [ ] Validation error display
- [ ] Retry mechanisms
- [ ] Error boundaries

## ✅ Performance

- [ ] Image optimization
- [ ] List virtualization
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Memory optimization

## ✅ Testing

- [ ] Split calculation tests
- [ ] Simplify debt algorithm tests
- [ ] Deep link routing tests
- [ ] Navigation tests
- [ ] API integration tests

## ✅ Documentation

- [ ] README.md with setup instructions
- [ ] Environment configuration
- [ ] Deep link testing commands
- [ ] FCM setup steps
- [ ] Build instructions (Android/iOS)
