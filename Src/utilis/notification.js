import { Platform } from 'react-native';
import { getMessaging, getToken as getMessagingToken, isSupported, onMessage } from 'firebase/messaging';
import { app } from '../../firebase-config';
import NavigationService from '../MainNavigation/NavigationService';

const getWebMessaging = async () => {
  if (Platform.OS !== 'web' || !(await isSupported())) return null;
  return getMessaging(app);
};

export const requestUserPermission = async () => {
  try {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.Notification) return false;
    return (await window.Notification.requestPermission()) === 'granted';
  } catch (error) {
    console.log('Error requesting FCM permission:', error);
    return false;
  }
};

export const reqestUsrPermision = requestUserPermission;

export const getToken = async () => {
  try {
    const messaging = await getWebMessaging();
    if (!messaging) return null;
    const token = await getMessagingToken(messaging);
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.log('Error getting FCM token:', error);
    return null;
  }
};

export const notificationListener = () => {
  let unsubscribe = () => {};

  getWebMessaging()
    .then(messaging => {
      if (!messaging) return;
      unsubscribe = onMessage(messaging, remoteMessage => {
        console.log('Notification received in foreground:', remoteMessage);
        if (remoteMessage?.data?.redirect_to === 'RequestScreen') {
          NavigationService.navigate('RequestScreen', { data: remoteMessage.data });
        }
      });
    })
    .catch(error => console.log('Error starting Firebase Messaging:', error));

  return () => unsubscribe();
};

export const notifiListener = notificationListener;
