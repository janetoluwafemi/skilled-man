import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigateHub from './Src/MainNavigation/MainNavigationHub';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { Store } from './Src/Redux/Store/store';
import { reqestUsrPermision, notifiListener } from './Src/utilis/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AthProvidr } from './Src/context/AuthProvider';


const App = () => {

  useEffect(() => {
    try {
      reqestUsrPermision().catch(err => console.log('Permission request error:', err));
      notifiListener("bookservice").catch(err => console.log('Notification listener error:', err));
      AsyncStorage.removeItem("fcmtoken").catch(err => console.log('AsyncStorage error:', err));
    } catch (error) {
      console.log('App initialization error:', error);
    }
  }, [])
  
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
