import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "skilledman-firebase-app.firebaseapp.com",
    projectId: "skilledman-firebase-app",
    storageBucket: "skilledman-firebase-app.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:android:abcdef123456"
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance;
try {
    if (Platform.OS === 'web') {
        authInstance = initializeAuth(app, {
            persistence: browserLocalPersistence,
        });
    } else {
        const { getReactNativePersistence } = require('firebase/auth');
        authInstance = initializeAuth(app, {
            persistence: getReactNativePersistence(ReactNativeAsyncStorage),
        });
    }
} catch (e) {
    authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
export const storage = getStorage(app);
