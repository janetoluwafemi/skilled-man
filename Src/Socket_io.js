// import { io } from 'socket.io-client';
// import { Platform } from 'react-native';
//
// const LOCAL_IP = '192.168.94.221';
//
// const DEV_URL = Platform.OS === 'web' ? 'http://localhost:4000' : `http://${LOCAL_IP}:4000`;
//
// const SOCKET_URL = __DEV__ ? DEV_URL : 'https://theskilledman.com';
//
// export const socket = io(SOCKET_URL, {
//     autoConnect: true,
//     transports: ['websocket', 'polling'],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
// });

import { io } from 'socket.io-client';
import { Platform } from 'react-native';

const LOCAL_IP = '192.168.94.221';

const DEV_URL =
  Platform.OS === 'web'
    ? 'http://localhost:4000'
    : `http://${LOCAL_IP}:4000`;

const SOCKET_URL = __DEV__ ? DEV_URL : 'https://theskilledman.com';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 2000,
  timeout: 5000,
});