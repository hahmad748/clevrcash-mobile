# ClevrCash Mobile App

React Native CLI mobile application for ClevrCash - a Splitwise-like expense tracking app with white-label support.

**Package:** `com.devsfort.clevecash`  
**Powered by:** devsfort

## Features

- ✅ Complete API integration with Laravel backend
- ✅ Authentication (Email/Password, Social Login, 2FA)
- ✅ Groups management (Create, Join, Invite, Settle)
- ✅ Friends management (Add, Invite, Settle, Remind)
- ✅ Expense tracking (Create, Edit, Delete, Splits, Itemization, Attachments)
- ✅ Transaction history
- ✅ Charts & Statistics
- ✅ Notifications (In-app + Push)
- ✅ Deep linking support
- ✅ White-label branding
- ✅ Offline mode with sync
- ✅ Responsive design (Phone, Tablet, Landscape)

## Prerequisites

- Node.js >= 20
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)
- CocoaPods (for iOS)

## Installation

### 1. Install Dependencies

```bash
cd clevrcash-mobile
npm install
```

### 2. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:8000/api/v1
API_TIMEOUT=30000
```

For production:

```env
API_BASE_URL=https://api.clevrcash.com/api/v1
API_TIMEOUT=30000
```

## Running the App

### Android

```bash
npm run android
```

Or:

```bash
npx react-native run-android
```

### iOS

```bash
npm run ios
```

Or:

```bash
npx react-native run-ios
```

## Development

### Start Metro Bundler

```bash
npm start
```

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DrawerContent/
│   │   ├── index.tsx
│   │   └── styles.ts
│   └── ...
├── config/             # Configuration files
│   ├── api.ts          # API base URL
│   └── brand.ts        # Brand configuration
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   ├── BrandContext.tsx
│   └── ThemeContext.tsx
├── navigation/         # Navigation setup
│   ├── AppNavigator.tsx
│   └── types.ts
├── screens/           # Screen components
│   ├── auth/          # Authentication screens
│   │   ├── Login/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   └── Register/
│   ├── groups/        # Group screens
│   ├── friends/       # Friend screens
│   ├── expenses/      # Expense screens
│   └── ...
├── services/          # API and storage services
│   ├── api.ts        # Base API service
│   ├── apiClient.ts  # Typed API client
│   └── storage.ts    # AsyncStorage helpers
├── theme/            # Theme system
│   └── theme.ts
└── types/           # TypeScript types
    └── api.ts       # API response types
```

## Deep Linking

### Custom URL Scheme

- `clevrcash://invite/{token}` - Accept friend/group invitation
- `clevrcash://group/{groupId}` - Open group detail
- `clevrcash://expense/{expenseId}` - Open expense detail
- `clevrcash://settle/{groupId or friendId}` - Open settle screen
- `clevrcash://notification/{id}` - Open notification

### Universal Links / App Links

- `https://{brand-domain}/invite/{token}`
- `https://{brand-domain}/g/{groupId}`
- `https://{brand-domain}/e/{expenseId}`

### Testing Deep Links

#### Android

```bash
adb shell am start -W -a android.intent.action.VIEW -d "clevrcash://group/ABC123" com.devsfort.clevecash
```

#### iOS

```bash
xcrun simctl openurl booted "clevrcash://group/ABC123"
```

## Push Notifications

### Firebase Cloud Messaging (FCM) Setup

1. Create a Firebase project
2. Add Android app with package name: `com.devsfort.clevecash`
3. Download `google-services.json` and place in `android/app/`
4. Add iOS app and download `GoogleService-Info.plist` to `ios/clevrcash/`
5. Configure FCM in the app

### Apple Push Notification Service (APNs) Setup

1. Create APNs key in Apple Developer Portal
2. Configure in Firebase Console
3. Update `ios/clevrcash/Info.plist` with APNs configuration

## Offline Mode

The app uses SQLite for local storage and implements an outbox pattern for offline actions:

- All actions are queued locally when offline
- Background sync when connection is restored
- Conflict resolution: last-write-wins

## Branding

Brand configuration is loaded from:
1. Build-time config: `src/config/brand.ts`
2. Runtime API: `GET /api/v1/user/brand`

Brand properties:
- Logo, Splash screen, Favicon
- Primary/Secondary colors
- Font family
- Theme tokens (light/dark)
- Feature flags
- Supported languages/currencies

## Building for Production

### Android

```bash
cd android
./gradlew assembleRelease
```

APK will be in: `android/app/build/outputs/apk/release/`

### iOS

1. Open `ios/clevrcash.xcworkspace` in Xcode
2. Select "Any iOS Device" as target
3. Product → Archive
4. Distribute App

## Environment Variables

Update `src/config/api.ts` for different environments:

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://localhost:8000/api/v1'
  : 'https://api.clevrcash.com/api/v1';
```

## Troubleshooting

### iOS Build Issues

#### rsync.samba Sandbox Error

If you encounter errors like:
```
Sandbox: rsync.samba(XXXXX) deny(1) file-write-create
```

This is a macOS sandbox permission issue with rsync. Try these solutions:

1. **Build from Xcode GUI** (Recommended):
   - Open `ios/clevrcash.xcworkspace` in Xcode
   - Product → Clean Build Folder (Shift+Cmd+K)
   - Product → Build (Cmd+B)
   - The error may appear but the build often succeeds

2. **Use Custom DerivedData Path**:
   ```bash
   # Already configured in ios/.xcode.env
   # Or set manually:
   export IDEDerivedDataPathOverride=~/Library/Developer/Xcode/DerivedData-custom
   ```

3. **Fix Permissions**:
   ```bash
   chmod -R 755 ~/Library/Developer/Xcode/DerivedData/
   ```

4. **Clean Everything**:
   ```bash
   cd ios
   rm -rf ~/Library/Developer/Xcode/DerivedData/clevrcash-*
   pod deintegrate
   pod install
   cd ..
   ```

5. **If build still fails**, the error might be harmless - check if the app actually builds successfully despite the warning.

## Troubleshooting

### Metro Bundler Issues

```bash
npm start -- --reset-cache
```

### iOS Build Issues

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android Build Issues

```bash
cd android
./gradlew clean
cd ..
```

## API Documentation

See `/docs/API_DOCUMENTATION.md` for complete API reference.

## Feature Parity

See `/docs/parity-checklist.md` for feature implementation status.

## License

Proprietary - devsfort
