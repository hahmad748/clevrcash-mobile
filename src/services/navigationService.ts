import {NavigationContainerRef} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';

class NavigationService {
  private navigationRef: NavigationContainerRef<any> | null = null;

  setNavigationRef(ref: NavigationContainerRef<any> | null) {
    this.navigationRef = ref;
  }

  navigateToAuth() {
    if (this.navigationRef?.isReady()) {
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
    }
  }
}

export const navigationService = new NavigationService();
