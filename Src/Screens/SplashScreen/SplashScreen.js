import React, { useEffect } from 'react';
import { StyleSheet, View, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../../context/AuthProvider';
import { notifiListener, reqestUsrPermision, getToken } from '../../utilis/notification';

function SplashScreen({ navigation }) {
  const { dispatch } = useAuth();
  const isFocused = useIsFocused();

  const checkUserAuthAndRole = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const role = await AsyncStorage.getItem('role');

      if (user && role) {
        const data = JSON.parse(user);
        dispatch({ type: 'LOGIN', payload: { user: data, role } });

        global.email = data.email;
        global.id = data.id;
        global.name = data.name;
        global.phone_number = data.phone_number;
        global.address = data.address;
        global.state = data.state;
        global.whatsapp = data.whatsapp;
        global.role = role;
        global.working_experience = data.working_experience;
        global.profile = data.profile;

        if (role === '0' || role === '1') {
          navigation.navigate('Parent');
        } else {
          navigation.navigate('Signin');
        }
      } else {
        navigation.navigate('Signin');
      }
    } catch (error) {
      navigation.navigate('Signin');
    }
  };

  useEffect(() => {
    let timer;
    if (isFocused) {
      timer = setTimeout(async () => {
        await checkUserAuthAndRole();
        await reqestUsrPermision();
        await getToken();
        notifiListener();
      }, 2000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent />
      <Animatable.View
        animation="fadeIn"
        duration={1000}
        style={styles.imageWrapper}>
        <Image
          source={require('../../Assets/Images/splash.png')}
          style={styles.imgStyle}
          resizeMode="cover"
        />
      </Animatable.View>
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  imgStyle: {
    width: '100%',
    height: '100%',
  },
});