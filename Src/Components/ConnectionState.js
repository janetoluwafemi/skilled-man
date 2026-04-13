import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function ConectionStates({ isConnected }) {
  return (
    <Text style={styles.text}>
      {isConnected ? 'Connected' : 'Disconnected'}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue', // You can customize the color
  },
});

// import React from 'react';
// import { View } from 'react-native-animatable';
// export function ConnectionState({ isConnected }) {
//   return <View>{ ''+isConnected }</View>;
// }