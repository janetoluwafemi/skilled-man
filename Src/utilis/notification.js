import { Platform } from 'react-native';
import { app } from '../../firebase-config';
import NavigationService from '../MainNavigation/NavigationService';

const VAPID_KEY = 'YOUR_PUBLIC_VAPID_KEY_HERE';

const loadWebMessaging = () => {
    if (Platform.OS !== 'web') return null;
    return require('firebase/messaging');
};

const getWebMessaging = async () => {
    try {
        if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
        const messagingModule = loadWebMessaging();
        if (!messagingModule) return null;
        const supported = await messagingModule.isSupported();
        if (!supported) return null;
        return messagingModule.getMessaging(app);
    } catch (error) {
        console.log('Firebase messaging support check failed:', error);
        return null;
    }
};

export const requestUserPermission = async () => {
    try {
        if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.Notification) {
            return false;
        }
        const permission = await window.Notification.requestPermission();
        return permission === 'granted';
    } catch (error) {
        console.log('Error requesting FCM permission:', error);
        return false;
    }
};

export const reqestUsrPermision = requestUserPermission;

export const getToken = async () => {
  try {
    if (Platform.OS === 'web') {
      return null;
    }

    const messaging = await getWebMessaging();
    if (!messaging) return null;

    const tokenOptions = VAPID_KEY ? { vapidKey: VAPID_KEY } : undefined;

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        tokenOptions.serviceWorkerRegistration = registration;
      }
    }

    const { getToken: getMessagingToken } = loadWebMessaging();
    const token = await getMessagingToken(messaging, tokenOptions);
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.log('Error getting FCM token:', error);
    return null;
  }
};
export const notificationListener = () => {
    let unsubscribe;

    getWebMessaging()
        .then(messaging => {
            if (!messaging) return;

            const { onMessage } = loadWebMessaging();
            unsubscribe = onMessage(messaging, remoteMessage => {
                console.log('Foreground notification received:', remoteMessage);

                if (remoteMessage?.data?.redirect_to === 'RequestScreen') {
                    NavigationService.navigate('RequestScreen', {
                        data: remoteMessage.data,
                    });
                }
            });
        })
        .catch(error => console.log('Error starting Firebase Messaging:', error));

    return () => {
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
    };
};

export const notifiListener = notificationListener;