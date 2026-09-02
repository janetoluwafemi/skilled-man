import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View ,
  Platform} from 'react-native';
import { socket } from '../Socket_io';

export function ConnectionManager() {
  const connect = () => {
    socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={connect} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={disconnect} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});