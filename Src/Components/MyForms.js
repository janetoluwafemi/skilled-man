import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, View } from 'react-native-paper';
import { socket } from '../Socket_io';

export function MyFrms() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);

    socket.timeout(5000).emit('create-something', value, () => {
      setIsLoading(false);
    });
  };

  return (
    <View>
      <TextInput
        label="Value"
        value={value}
        onChangeText={(text) => setValue(text)}
      />

      <TouchableOpacity
        style={{
          backgroundColor: isLoading ? 'gray' : 'blue',
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
          alignItems: 'center',
        }}
        onPress={onSubmit}
        disabled={isLoading}
      >
        <Text style={{ color: 'white' }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
