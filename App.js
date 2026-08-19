// import React, { useEffect } from 'react';
// import { Provider as PaperProvider } from 'react-native-paper';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Provider } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// import MainNavigateHub from './Src/MainNavigation/MainNavigationHub';
// import { Store } from './Src/Redux/Store/store';
// import { reqestUsrPermision, notifiListener } from './Src/utilis/notification';
// import { AthProvidr } from './Src/context/AuthProvider';
//
// const App = () => {
//   useEffect(() => {
//     const initNotifications = async () => {
//       try {
//         await reqestUsrPermision();
//         await notifiListener('bookservice');
//         await AsyncStorage.removeItem('fcmtoken');
//       } catch (error) {
//         console.log('App initialization error:', error);
//       }
//     };
//
//     initNotifications();
//   }, []);
//
//   return (
//     <Provider store={Store}>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <PaperProvider>
//           <AthProvidr>
//             <MainNavigateHub />
//           </AthProvidr>
//         </PaperProvider>
//       </GestureHandlerRootView>
//     </Provider>
//   );
// };
//
// export default App;

import React, { useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainNavigateHub from './Src/MainNavigation/MainNavigationHub';
import { Store } from './Src/Redux/Store/store';
import { reqestUsrPermision, notifiListener } from './Src/utilis/notification';
import { AthProvidr } from './Src/context/AuthProvider';

// Config required for React Native Web compatibility
const nativeBaseConfig = {
  dependencies: {
    'linear-gradient': require('expo-linear-gradient').LinearGradient,
  },
};

const nullInsets = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

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
        console.log('App initialization error:', error);
      }
    };

    initNotifications();
  }, []);

  return (
    <Provider store={Store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NativeBaseProvider
          config={nativeBaseConfig}
          initialWindowMetrics={nullInsets}
          isSSR={false}>
          <PaperProvider>
            <AthProvidr>
              <MainNavigateHub />
            </AthProvidr>
          </PaperProvider>
        </NativeBaseProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;