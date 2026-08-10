import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const Socktdemo = () => {
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.container}>
        <View style={styles.statusBadge}>
          <Text
            style={[
              styles.statusText,
              { color: socketConnected ? '#16A34A' : '#EF4444' },
            ]}>
            {socketConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>

        <View style={styles.displayBox}>
          <Text style={styles.receivedText}>{receivedMessage}</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
          />
          <Button
            title="Send"
            onPress={sndMsg}
            disabled={!socketConnected || message.trim() === ''}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Socktdemo;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  displayBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  receivedText: {
    fontSize: 15,
    color: '#0F172A',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    color: '#0F172A',
  },
});