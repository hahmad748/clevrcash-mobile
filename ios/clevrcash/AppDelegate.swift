import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore
import FirebaseMessaging
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Step 1: Configure Firebase FIRST, before React Native (using new modular API)
    // Using getApp() pattern recommended for v23+
    if FirebaseCore.FirebaseApp.app() == nil {
      FirebaseCore.FirebaseApp.configure()
    }
    
    // Step 2: Set Firebase Messaging delegate
    // This allows us to receive FCM token updates
    FirebaseMessaging.Messaging.messaging().delegate = self
    
    // Step 3: Set up notification delegate BEFORE requesting permissions
    UNUserNotificationCenter.current().delegate = self
    
    // Step 4: ALWAYS register for remote notifications synchronously
    // This must happen immediately, regardless of permission status
    // Apple will call didRegisterForRemoteNotificationsWithDeviceToken when token is available
    // This is critical - must be called before React Native initializes
    // NOTE: On iOS Simulator, this callback may not fire (APNs doesn't work on simulators)
    application.registerForRemoteNotifications()
    print("📱 Registered for remote notifications (callback will fire when APNs token is available)")
    
    // Step 5: Request notification permissions (independent of APNs registration)
    // This is asynchronous and doesn't block APNs registration
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
      if let error = error {
        print("Notification permission request error: \(error.localizedDescription)")
      } else if granted {
        print("Notification permissions granted")
      } else {
        print("Notification permissions denied")
      }
    }

    // Step 6: Initialize React Native
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "clevrcash",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
  
  // Handle device token registration - called by iOS when APNs token is available
  // This is called by iOS automatically after registerForRemoteNotifications()
  // NOTE: This callback may NOT fire on iOS Simulator (APNs doesn't work on simulators)
  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    // Forward APNs token to Firebase Messaging immediately
    // This is critical - Firebase needs this token before getToken() can work
    FirebaseMessaging.Messaging.messaging().apnsToken = deviceToken
    let tokenString = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
    print("✅ APNs token received and set on Firebase Messaging: \(tokenString)")
    
    // Log token length for verification
    print("APNs token length: \(deviceToken.count) bytes")
  }
  
  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register for remote notifications: \(error.localizedDescription)")
  }
  
  // MessagingDelegate method - called when FCM token is available or refreshed
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    if let fcmToken = fcmToken {
      print("FCM registration token received: \(fcmToken)")
    } else {
      print("FCM registration token is nil")
    }
  }
  
  // Handle foreground notifications
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    // Show notification even when app is in foreground
    completionHandler([.alert, .badge, .sound])
  }
  
  // Handle notification taps
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    // Handle notification tap
    completionHandler()
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
