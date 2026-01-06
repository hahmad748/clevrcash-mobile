# Google Sign-In Setup for Android

## Problem
If Google Sign-In is not working on Android, it's likely because the OAuth client is not configured in Firebase Console.

## Solution

### Step 1: Get Your SHA-1 Fingerprint

You need to get the SHA-1 fingerprint of your signing certificate(s):

#### For Debug Builds:
```bash
cd android
./gradlew signingReport
```

Look for the SHA-1 fingerprint under `Variant: debug` → `Config: debug` → `SHA1:`

Alternatively:
```bash
keytool -list -v -keystore app/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

#### For Release Builds:
```bash
keytool -list -v -keystore app/clevrcash-release.keystore -alias clevrcash-release-key
```

### Step 2: Register SHA-1 in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `clevrcash-3bad0`
3. Go to **Project Settings** (gear icon)
4. Scroll down to **Your apps** section
5. Click on your Android app (`com.devsfort.clevrcash`)
6. Click **Add fingerprint**
7. Add both your **debug** and **release** SHA-1 fingerprints
8. Click **Save**

### Step 3: Download Updated google-services.json

1. After adding SHA-1 fingerprints, Firebase will automatically generate OAuth client IDs
2. Download the updated `google-services.json` file:
   - In Firebase Console → Project Settings → Your apps
   - Click **Download google-services.json**
3. Replace `android/app/google-services.json` with the new file

### Step 4: Verify OAuth Client Configuration

After downloading the new `google-services.json`, check that it contains OAuth clients:

```json
{
  "client": [{
    "oauth_client": [
      {
        "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
        "client_type": 3
      }
    ]
  }]
}
```

The `oauth_client` array should NOT be empty.

### Step 5: Rebuild the App

```bash
cd android
./gradlew clean
cd ..
npm run android
```

## Troubleshooting

### Error: "10: " error code
- This usually means the SHA-1 fingerprint is not registered in Firebase Console
- Make sure you've added both debug and release SHA-1 fingerprints

### Error: "No ID token found"
- Check that `webClientId` is correctly configured
- Verify the OAuth client in `google-services.json` matches your Firebase project

### Error: "DEVELOPER_ERROR"
- SHA-1 fingerprint mismatch
- OAuth client not configured
- Wrong package name in Firebase Console

### Still Not Working?

1. Verify package name matches: `com.devsfort.clevrcash`
2. Check that Google Sign-In API is enabled in [Google Cloud Console](https://console.cloud.google.com/)
3. Ensure the OAuth consent screen is configured
4. Clear app data and try again: `adb shell pm clear com.devsfort.clevrcash`

