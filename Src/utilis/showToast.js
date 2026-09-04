import { Platform, ToastAndroid } from 'react-native';

export const showToast = (message) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(String(message), ToastAndroid.SHORT);
    } else {
        console.log('Toast:', message);
    }
};
