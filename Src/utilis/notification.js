import { Platform } from 'react-native';
import NavigationService from '../MainNavigation/NavigationService';

// Firebase Messaging is not included in Expo Go (and has no web runtime).
// Loading it lazily keeps the app bootable on those platforms while preserving
// the existing behavior in a custom native build where it is linked.
const getMessaging = () => {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    return require('@react-native-firebase/messaging').default;
  } catch (error) {
    console.log('Firebase Messaging is unavailable in this runtime.');
    return null;
  }
};

export const requestUserPermission = async () => {
  try {
    const messaging = getMessaging();
    if (!messaging) return false;

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('FCM Authorization status:', authStatus);
    }
    return enabled;
  } catch (error) {
    console.log('Error requesting FCM permission:', error);
    return false;
  }
};

export const reqestUsrPermision = requestUserPermission;

export const getToken = async () => {
  try {
    const messaging = getMessaging();
    if (!messaging) return null;

    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
    }

    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.log('Error getting FCM token:', error);
    return null;
  }
};

export const notificationListener = () => {
  const messaging = getMessaging();
  if (!messaging) {
    return () => {};
  }

  const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
    console.log('Notification received in foreground:', remoteMessage);
  });

  const unsubscribeOnOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification opened app from background state:', remoteMessage?.notification);

    if (remoteMessage?.data?.redirect_to === 'RequestScreen') {
      setTimeout(() => {
        NavigationService.navigate('RequestScreen', { data: remoteMessage?.data });
      }, 800);
    }
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage?.notification);

        if (remoteMessage?.data?.redirect_to === 'RequestScreen') {
          setTimeout(() => {
            NavigationService.navigate('RequestScreen', { data: remoteMessage?.data });
          }, 1200);
        }
      }
    })
    .catch((error) => console.log('Error fetching initial notification:', error));

  return () => {
    unsubscribeOnMessage();
    unsubscribeOnOpened();
  };
};

export const notifiListener = notificationListener;
