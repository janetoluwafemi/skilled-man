import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainNavigateHub from './Src/MainNavigation/MainNavigationHub';
import { Store } from './Src/Redux/Store/store';
import { reqestUsrPermision, notifiListener } from './Src/utilis/notification';
import { AthProvidr } from './Src/context/AuthProvider';

const App = () => {
  useEffect(() => {
    const initNotifications = async () => {
      try {
        if (Platform.OS !== 'web') {
          await reqestUsrPermision();
          await notifiListener('bookservice');
          await AsyncStorage.removeItem('fcmtoken');
        }
      } catch (error) {
        console.log('App notification initialization error:', error);
      }
    };

    initNotifications();
  }, []);

  return (
    <Provider store={Store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <AthProvidr>
            <MainNavigateHub />
          </AthProvidr>
        </PaperProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;