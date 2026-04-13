import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { socket } from '../Socket_io';

export function ConectionMnager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={connect}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={disconnect}>
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = {
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
};
