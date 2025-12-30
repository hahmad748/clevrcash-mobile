import {NavigationContainerRef} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';

class NavigationService {
  private navigationRef: NavigationContainerRef<any> | null = null;

  setNavigationRef(ref: NavigationContainerRef<any> | null) {
    this.navigationRef = ref;
  }

  navigateToAuth() {
    if (!this.navigationRef?.isReady()) return;
    
    // When logout/401 happens, isAuthenticated becomes false
    // AppNavigator will re-render and add Auth route, but there's a timing issue
    // Use a retry mechanism to wait for the Auth route to appear
    const attemptNavigation = (retries = 10, delay = 50) => {
      if (retries === 0) {
        console.warn('navigateToAuth: Auth route not found after retries, navigating to Splash');
        // Fallback: navigate to Splash, which will handle navigation based on auth state
        try {
          if (!this.navigationRef?.isReady()) return;
          const state = this.navigationRef.getState();
          const hasSplashRoute = state?.routes?.some((route: any) => route.name === 'Splash');
          if (hasSplashRoute) {
            this.navigationRef.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Splash'}],
              }),
            );
          }
        } catch (error) {
          console.error('Navigation error in navigateToAuth fallback:', error);
        }
        return;
      }
      
      try {
        if (!this.navigationRef?.isReady()) return;
        const state = this.navigationRef.getState();
        const hasAuthRoute = state?.routes?.some((route: any) => route.name === 'Auth');
        
        if (hasAuthRoute) {
          this.navigationRef.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Auth',
                  params: {
                    screen: 'Welcome',
                  },
                },
              ],
            }),
          );
        } else {
          // Retry after a short delay
          setTimeout(() => attemptNavigation(retries - 1, delay), delay);
        }
      } catch (error) {
        console.error('Navigation error in navigateToAuth:', error);
        // Retry on error
        setTimeout(() => attemptNavigation(retries - 1, delay), delay);
      }
    };
    
    attemptNavigation();
  }
}

export const navigationService = new NavigationService();
