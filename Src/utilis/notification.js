import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import NavigationService from '../MainNavigation/NavigationService';

export const requestUserPermission = async () => {
  try {
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