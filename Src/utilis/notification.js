import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import NavigationService from '../MainNavigation/NavigationService';

export const reqestUsrPermision = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}



export const getToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log("fcm token", token)
    return token;
};
export const notifiListener = async (navigation) => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    // Handle notification when the app is opened from the background state
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log('Notification caused app to open from the background state:', remoteMessage.notification);
        // navigation.navigate(remoteMessage.data.type);

        console.log(remoteMessage?.data, "remote messsage response")

        if (!!remoteMessage?.data && remoteMessage?.data?.redirect_to == "RequestScreen") {
            setTimeout(() => {
                NavigationService.navigate("RequestScreen", { data: remoteMessage?.data })
            }, 1200);
        }

    });

    // Handle foreground notifications
    messaging().onMessage(async (remoteMessage) => {
        console.log(remoteMessage, 'received in foreground');
        // You can use async/await here for additional asynchronous operations
    });

    // Handle notifications that caused the app to open from a quit state
    messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
            if (remoteMessage) {
                console.log('Notification caused app to open from a quit state:', remoteMessage.notification);
            }
        });
};