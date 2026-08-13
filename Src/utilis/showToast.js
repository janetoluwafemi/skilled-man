import { Platform, Alert, ToastAndroid } from 'react-native';

export const showToast = (message) => {
    if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.alert) {
            window.alert(message);
        } else {
            Alert.alert('Notice', message);
        }
    } else if (Platform.OS === 'android') {
        ToastAndroid.show(String(message), ToastAndroid.SHORT);
    } else {
        Alert.alert('Notice', String(message));
    }
};
