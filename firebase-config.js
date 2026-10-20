import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBjVZhyrRR4xylteac0hkGQldjrv8Km-eg",
  authDomain: "skileddev-a0194.firebaseapp.com",
  projectId: "skileddev-a0194",
  storageBucket: "skileddev-a0194.firebasestorage.app",
  messagingSenderId: "1072235202464",
  appId: "1:1072235202464:android:42951d5a222d728cb7c6c5"
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance;
try {
  if (Platform.OS === 'web') {
    const { browserLocalPersistence } = require('firebase/auth');
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
  try {
    authInstance = getAuth(app);
  } catch (fallbackError) {
    console.log('Firebase auth init failed:', fallbackError);
  }
}

export const auth = authInstance;

let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    useFetchStreams: false,
  });
} catch (e) {
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
export const storage = getStorage(app);