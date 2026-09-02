import React from 'react';
import {Text, StyleSheet ,
  Platform} from 'react-native';

export function ConnectionStates({ isConnected = false }) {
  return (
    <Text
      style={[
        styles.text,
        isConnected ? styles.connectedText : styles.disconnectedText,
      ]}>
      {isConnected ? 'Connected' : 'Disconnected'}
    </Text>
  );
}

export const ConectionStates = ConnectionStates;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  connectedText: {
    color: '#2e7d32',
  },
  disconnectedText: {
    color: '#d32f2f',
  },
});