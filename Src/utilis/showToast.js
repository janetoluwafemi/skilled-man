import { Platform, Alert } from 'react-native';

let SimpleToast;
if (Platform.OS !== 'web') {
    SimpleToast = require('react-native-simple-toast').default;
}

export const showToast = (message) => {
    if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.alert) {
            window.alert(message);
        } else {
            Alert.alert('Notice', message);
        }
    } else if (SimpleToast) {
        SimpleToast.show(message, SimpleToast.SHORT);
    }
};