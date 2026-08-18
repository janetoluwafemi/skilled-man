import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';

const SocketDemo = () => {
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');
    socketRef.current = ws;

    ws.onopen = () => {
      setSocketConnected(true);
    };

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        setReceivedMessage(`${data.username}: ${data.content}`);
      } catch (e) {
        setReceivedMessage(event.data);
      }
    };

    ws.onclose = () => {
      setSocketConnected(false);
    };

    ws.onerror = error => {
      console.log('WebSocket error:', error);
      setSocketConnected(false);
    };

    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, []);

  const sndMsg = () => {
    if (!message.trim() || !socketRef.current) return;

    const messageToSend = JSON.stringify({
      action: 'sendMessage',
      username: global.name || 'User',
      content: message.trim(),
    });

    setReceivedMessage('');
    socketRef.current.send(messageToSend);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.container}>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: socketConnected ? '#10B981' : '#EF4444' },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: socketConnected ? '#065F46' : '#991B1B' },
            ]}>
            {socketConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>

        <View style={styles.displayBox}>
          <Text style={styles.boxTitle}>Live WebSocket Log</Text>
          <Text style={styles.receivedText}>
            {receivedMessage || 'Waiting for incoming socket messages...'}
          </Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sendBtn,
              (!socketConnected || message.trim() === '') && styles.sendBtnDisabled,
            ]}
            onPress={sndMsg}
            disabled={!socketConnected || message.trim() === ''}>
            <Icons.Feather name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SocketDemo;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  displayBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  boxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  receivedText: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 22,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    color: '#0F172A',
    fontSize: 14,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: color.defalt,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
    elevation: 0,
  },
});