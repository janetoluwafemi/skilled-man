// import React, { useEffect } from 'react';
// import { Platform } from 'react-native';
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
//         if (Platform.OS !== 'web') {
//           await reqestUsrPermision();
//           await notifiListener('bookservice');
//           await AsyncStorage.removeItem('fcmtoken');
//         }
//       } catch (error) {
//         console.log('App notification initialization error:', error);
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
import { Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainNavigateHub from './Src/MainNavigation/MainNavigationHub';
import { Store } from './Src/Redux/Store/store';
import { reqestUsrPermision, notifiListener } from './Src/utilis/notification';
import { AthProvidr } from './Src/context/AuthProvider';

// ============================================================================
// WEB FIX: Aggressive Focus Manager
// ============================================================================
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const forceDropFocus = () => {
    const active = document.activeElement;
    if (active && active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA') {
      // 1. Force focus completely outside the React Navigation DOM tree
      document.body.focus();
      // 2. Clear the active element
      active.blur();
    }
  };

  // React Native Web relies on mousedown/touchstart, not click.
  // The "true" argument forces this to run in the capture phase (first),
  // before React Navigation updates the drawer state and triggers the warning.
  window.addEventListener('mousedown', forceDropFocus, true);
  window.addEventListener('touchstart', forceDropFocus, true);
}

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