import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Alert,
} from 'react-native';
import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import ProfileInput from '../../Components/ProfileInput';
import MultiLineInput from '../../Components/MultiLineInput';

const CntctUs = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    Alert.alert('Success', 'Thank you for reaching out to us!');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CstmHeader
        title="Contact Us"
        onPressBack={() => props.navigation.goBack()}
      />
      <ImageBackground
        source={require('../../Assets/Images/background.jpeg')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <View style={styles.container}>
          <ProfileInput
            style={styles.inputStyle}
            placeholder="Name"
            placeholderTextColor={color.gry}
            value={name}
            onChangeText={setName}
            icon="user-circle"
          />
          <ProfileInput
            style={styles.inputStyle}
            placeholder="Email"
            placeholderTextColor={color.gry}
            value={email}
            onChangeText={setEmail}
            icon="envelope"
          />
          <MultiLineInput
            style={styles.inputStyle}
            placeholder="Message..."
            placeholderTextColor={color.gry}
            value={message}
            onChangeText={setMessage}
            numberOfLines={8}
            styles={styles.multiLineExtra}
          />
          <TouchableOpacity
            style={styles.loginBtn}
            activeOpacity={0.8}
            onPress={handleSubmit}>
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default CntctUs;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  inputStyle: {
    color: color.gry,
  },
  multiLineExtra: {
    marginTop: 18,
    textAlignVertical: 'top',
  },
  backgroundImg: {
    flex: 1,
  },
  loginBtn: {
    borderRadius: 5,
    backgroundColor: color.drkgren,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    marginTop: 35,
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
});