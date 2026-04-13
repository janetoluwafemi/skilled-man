import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, Text} from 'react-native';
//import WebSocket from 'react-native-websocket';
import WebSocket from 'react-native-websocket';
const Socktdemo = () => {
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  console.log('socket not connect');
  useEffect(() => {
  console.log('ready to connect');

    const socket = new WebSocket('ws://localhost:8000');
    console.log(' connect');
    
    socket.onopen = () => {
      console.log('WebSocket connection opened');
      setSocketConnected(true);
    };

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      console.log('Received data from server:', data);
      setReceivedMessage(`${data.username}: ${data.content}`);
    };

    socket.onclose = event => {
      console.log('WebSocket connection closed:', event.reason);
      setSocketConnected(false);
    };

    socket.onerror = error => {
      console.error('WebSocket error:', error);
    };

    return () => {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          // Only close the WebSocket if it's open or in the process of connecting
          socket.close();
        }
    }
    }, []);

  const sndMsg = () => {
    // Replace 'YourUsername' with the sender's username
    const messageToSend = JSON.stringify({
      action: 'sendMessage',
      username: 'YourUsername',
      content: message,
    });
    setReceivedMessage(''); // Clear the received message
    socket.send(messageToSend);
  };
  return (
    <View>
           <Text>{socketConnected ? 'Connected' : 'Not connected'}</Text>
      <Text>{receivedMessage}</Text>
      <TextInput
        placeholder="Type your message..."
        value={message}
        onChangeText={text => setMessage(text)}
      />
      <Button
        title="Send Message"
        onPress={sndMsg}
        disabled={!socketConnected}
      />
    </View>
  );
};
export default Socktdemo;
