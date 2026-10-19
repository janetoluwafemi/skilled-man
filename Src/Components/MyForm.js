import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity, Text, View } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { socket } from '../Socket_io';

export function MyFrm() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);

    socket.timeout(5000).emit('create-something', value, () => {
      setIsLoading(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TextInput
          label="Value"
          value={value}
          onChangeText={text => setValue(text)}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={onSubmit}
          disabled={isLoading}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: 'gray',
  },
  submitText: {
    color: 'white',
  },
});
