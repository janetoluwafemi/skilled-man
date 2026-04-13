import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Animated,
  ImageBackground,
  TextInput,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  Platform,
  
  ActivityIndicator,
} from 'react-native';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import Icon from '../../Components/Icons';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
//import NavigationDrawerHeader from '../../Header/Header';
import {APIS} from '../../Api_Urls/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotonComp from '../../Components/BtnComp';
import Toast from 'react-native-simple-toast';
import { BASIC_URL } from '../Signin/Signin';
import { configureLayoutAnimations } from 'react-native-reanimated/lib/typescript/reanimated2/core';
const {width, height} = Dimensions.get('window');
const FrgtPaswrd = ({navigation}) => {
  const [checked, setChecked] = React.useState(false);
  const [Email, setEmail] = useState('');
  const [EmailError, setEmailError] = useState('');
  const [verifyPhone, setVerifyPhone] = useState('');
  const [load, setLoad] = React.useState(false);

  const ResendOtp = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Cookie", "PHPSESSID=jdptf6vnbetn3of3n8fv6p28um");

      var formdata = new FormData();
      formdata.append("email", Email);
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      // const apiurl = "https://fisdemoprojects.com/skilledman/api/resend_otp.php"
      const apiurl =`${BASIC_URL}resend_otp.php`;

      const response = await fetch(apiurl, requestOptions)
      const result = await response.json();
      global.forgetemail=Email;
console.log('emailforgetpassword',global.forgetemail)
      console.log(result, 'resendotjghjgp')
      global.forgetotp=result.otp;
      console.log(' global.forgetotp',global.forgetotp);
      if (result) {
        setOtp(result.otp)
      } else if (result.error) {
        Alert.alert(result.error)
      }
    } catch (error) {
      Alert.alert(error)
    }
  }
  const frgtPas = async () => {
    if (Email == '') {
      Toast.show('Please Enter Your Email.');
      return;
    }
    try {
      setLoad(true);
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=jmv28htgkulr4v5gmt5n7us8go');

      var formdata = new FormData();
      formdata.append('email', Email);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // const response = await fetch('https://fisdemoprojects.com/skilledman/api/user/forget_password.php',requestOptions,);
      const response = await fetch(`${BASIC_URL}forget_password.php`,requestOptions,);


      const result = await response.json();

      if (result.success) {
        console.log("suceessforget")
        setLoad(false);
        navigation.navigate('ForgetpasswordOtpScreen', {Email: Email});
        //navigation.navigate('SettingForgetPassword', {Email: Email});
      } else if (result.error) {
        setLoad(false);
        Toast.show(result.error);
      }
    } catch (error) {
      setLoad(false);
      Alert.alert(error);
    }
  };

  return (
    <ImageBackground
      source={require('../../Assets/Images/bg.png')}
      resizeMode="stretch"
      style={styles.backgroundImg}>
      <CstmHeaderIcon
        onPress={() => {
          navigation.goBack();
        }}
        headerIcon={styles.headerIcon}
      />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.first_View}>
          <Text style={styles.Create_Account_Text}>Forgot Password</Text>
          <C_TxtInput
            style={{
              borderColor: EmailError ? color.rd : color.wite,
            }}
            placeholder="Email"
            placeholderTextColor={EmailError ? color.rd : color.drkGry}
            // keyboardType="numeric"
            onChangeText={val => setEmail(val)}
            onChange={() => setEmailError('')}
          />
          {EmailError ? (
            <View>
              <Text style={{color: color.rd}}>{EmailError}</Text>
            </View>
          ) : null}
          <View style={styles.Top_Height}>
            <Text style={styles.Common_Text_Size}>
              If you have forgotten your password you can enter your mail to get
              your password.
            </Text>
          </View>
          <BotonComp
            BtnStyle={styles.BtnStyle}
            btnText={
              load ? <ActivityIndicator size={28} color="#f8f8ff" /> : 'Next'
            }
            onPressFunc={() => {
             ResendOtp();
              // frgtPas();
             navigation.navigate('ForgetpasswordOtpScreen', {Email: Email});

            }}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default FrgtPaswrd;
styles;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  image_BackGround: {
    height: '100%',
    width: '100%',
  },
  logo: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  first_View: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  radio_button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  headerIcon: {
    paddingLeft: 20,
  },
  Create_Account_Text: {
    color: color.defalt,
    fontSize: 25,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  verifiction_Text: {
    textAlign: 'center',
    color: color.wite,
    fontWeight: 'bold',
    fontSize: 20,
  },
  Position_Text: {
    marginTop: 20,
    color: color.wite,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  radio_button_text: {
    color: color.wite,
    fontWeight: 'bold',
    fontSize: 14,
  },
  radio_button_View: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Common_Text_Size: {
    marginTop: 20,
    color: color.drkGry,
    fontWeight: 'bold',
    fontSize: 16,
  },
  Register_Now: {
    marginTop: 20,
    color: color.Gren,
    fontWeight: 'bold',
    fontSize: 16,
  },
  map_View: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  map_Text: {color: color.wite, fontWeight: 'bold'},
});
