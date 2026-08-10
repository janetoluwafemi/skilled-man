import { io } from 'socket.io-client';
import { Platform } from 'react-native';


const DEV_URL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

const SOCKET_URL = __DEV__ ? DEV_URL : 'https://theskilledman.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});