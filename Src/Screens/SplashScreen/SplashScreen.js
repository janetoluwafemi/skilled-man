import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  ImageBackground,
  Image,
} from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthProvider';
import { useIsFocused } from '@react-navigation/native';
import { notifiListener, reqestUsrPermision, getToken } from '../../utilis/notification';


function SplshScren({ navigation }) {
  const { state, dispatch } = useAuth()
  const Focus = useIsFocused()

  const checkUserAuthAndRole = () => {

    navigation.navigate("Signin")
    // const user = await AsyncStorage.getItem('user');
    // const role = await AsyncStorage.getItem('role');

    // if (user && role) {
    //   const data = JSON.parse(user)
    //   console.log("data in global store splash", data)
    //   dispatch({ type: 'LOGIN', payload: { user: JSON.parse(user), role } });
    //   global.email = data.email
    //   global.id = data.id
    //   global.name = data.name
    //   global.phone_number = data.phone_number
    //   global.address = data.address
    //   global.state = data.state
    //   global.whatsapp = data.whatsapp
    //   global.role = role
    //   global.working_experience = data.working_experience
    //   global.profile = data.profile

    //   if (role == '0' || role == '1') {
    //     navigation.navigate('Parent');
    //   }
    // } else {
    //   navigation.navigate('Signin');
    // }
  }

  useEffect(() => {
    setTimeout(() => {
      checkUserAuthAndRole()
      reqestUsrPermision()
      notifiListener()
      getToken()

    }, 2000);
  }, [Focus]);
  return (
    <View style={styles.container}>
      <Image
        source={require('../../Assets/Images/splash.png')}
        style={styles.imgStyle}
        resizeMode="stretch"
      />
    </View>
  );
}

export default SplshScren;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyle: {
    width: '100%',
    height: '100%',
  },
});
