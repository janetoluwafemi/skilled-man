import React, { useState, useRef, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  ToastAndroid,
  Alert
} from 'react-native';
import color from '../../Assets/colors/colors';
import OtpInpt from '../../Components/OtpInput';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import BotonComp from '../../Components/BtnComp';
import { configureLayoutAnimations } from 'react-native-reanimated/lib/typescript/reanimated2/core';
import { BASIC_URL } from '../Signin/Signin';
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');

const OtpScren = props => {
  const navigation = useNavigation();
  // otpinput end
  const route = useRoute();
  console.log('routes otp result', route.params.result);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // otpinputcode
  const [otp, setOTP] = useState('');
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();
  const [Otp, setOtp] = useState(route.params.result.otp);
  // const Otpstring = '' + Otp;
  // console.log("otptype", typeof (Otp), Otp)
  // console.log("otptype", typeof (Otpstring), Otpstring)

  const [firstDigit, setFirstDigit] = useState('');
  const [secondDigit, setSecondDigit] = useState('');
  const [thirdDigit, setThirdDigit] = useState('');
  const [fourthDigit, setFourthDigit] = useState('');


  const [visible, setVisible] = useState(false);
  const [textfield, setTextFieldCode] = useState([]);




  const FinalOtp = firstDigit + secondDigit + thirdDigit + fourthDigit;
  console.log(FinalOtp, 'final')


  const handleKeyPress = (text, nextRef) => {
    if (text.length === 1) {
      nextRef.current.focus();
    }
  };
  const { mode = 'outlined' } = props;
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // const handleSubmit = () => {
  //   console.log(FinalOtp, 'final')
  //   if (FinalOtp == Otp) {
  //     global.email = route.params.result.email
  //     navigation.navigate('SetPassword')

  //   } else {
  //     ToastAndroid.show('Incorrect OTP.', ToastAndroid.LONG);
  //   }
  // }
  const hndlSubmit = () => {
    console.log(FinalOtp, 'final')
   // mobile_sms_otp();
    if (FinalOtp == Otp) {

      global.email = route.params.result.email
      global.phone_number = route.params.result.phone_number
      navigation.navigate('SetPassword')

    } else {
      ToastAndroid.show('Incorrect OTP.', ToastAndroid.LONG);
    }
  }

  // const ResendOtp = async () => {
  //   try {
  //     var myHeaders = new Headers();
  //     myHeaders.append("Cookie", "PHPSESSID=jdptf6vnbetn3of3n8fv6p28um");

  //     var formdata = new FormData();
  //     formdata.append("email", route.params.result.email);

  //     var requestOptions = {
  //       method: 'POST',
  //       headers: myHeaders,
  //       body: formdata,
  //       redirect: 'follow'
  //     };
  //     const apiurl = "https://fisdemoprojects.com/skilledman/api/resend_otp.php"
  //     const response = await fetch(apiurl, requestOptions)
  //     const result = await response.json();
  //     console.log(result, 'resend otp')
  //     if (result) {
  //       setOtp(result.otp)
  //     } else if (result.error) {
  //       Alert.alert(result.error)
  //     }
  //   } catch (error) {
  //     Alert.alert(error)
  //   }
  // }
 
  const mobile_sms_otp = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      
      var formdata = new FormData();
      formdata.append("phone_number", route.params.result.phone_number);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      
      fetch("https://fisdemoprojects.com/skilledman/api/mobile_sms_otp.php", requestOptions)
        //.then(response => response.text())
        // .then(result => console.log(result))
        // .catch(error => console.log('error', error));
        const result = await response.json();
      console.log(result, ' otp')
    

      if (result) {
        setOtp(result.otp)
      } else if (result.error) {
        Alert.alert(result.error)
      }
    } catch (error) {
      Alert.alert(error)
    }
  }









  const Verifyotp = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      
      var formdata = new FormData();
      formdata.append("otp", FinalOtp);
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      
      fetch("https://fisdemoprojects.com/skilledman/api/verify-mobile-otp.php", requestOptions)
       // .then(response => response.text())
        // .then(result => console.log(result))
        // .catch(error => console.log('error', error));
      
    
      const result = await response.json();
      console.log(result, 'verify otp')
    
    } catch (error) {
      Alert.alert(error)
    }
  }
  // useEffect(() => {
  //  Verifyotp();
  // }, []);

  

  const ResendOtp = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Cookie", "PHPSESSID=jdptf6vnbetn3of3n8fv6p28um");

      var formdata = new FormData();
      formdata.append("email", route.params.result.email);
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      // const apiurl = "https://fisdemoprojects.com/skilledman/api/resend_otp.php"
      const apiurl = `${BASIC_URL}resend_otp.php`

      const response = await fetch(apiurl, requestOptions)
      const result = await response.json();
      console.log(result, 'resend otp')
      if (result) {
        setOtp(result.otp)
      } else if (result.error) {
        Alert.alert(result.error)
      }
    } catch (error) {
      Alert.alert(error)
    }
  }
  return (
    <>
      <ImageBackground
        source={require('../../Assets/Images/bg.png')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <CstmHeaderIcon
          onPress={() => {
            props.navigation.goBack();
          }}
          headerIcon={styles.headerIcon}
        />
        <View style={styles.container}>
          <Text style={styles.accountVer}>Account Verification</Text>
          <Text style={styles.signinText}>Enter your OTP here</Text>
          <View style={styles.inputContainer}>
            {/* <OtpInput /> */}
            <View style={styles.inputView}>
              <TextInput
                ref={firstInput}
                placeholder={props.placeholder}
                mode={mode}
                color={color.defalt}
                disabled={props.disabled}
                value={firstDigit}
                placeholderTextColor={props.placeholderTextColor}
                // editable={false}
                textAlign={props.textAlign}
                keyboardType="numeric"
                scrollEnabled={false}
                multiline={props.multiline}
                numberOfLines={props.numberOfLines}
                // onChangeText={props.onChangeText}
                onChange={props.onChange}
                secureTextEntry={props.secureTextEntry}
                // theme={{color: {primary: color.Green, underlineColor: color.red}}}
                outlineColor={props.outlineColor}
                underlineColor={props.underlineColor}
                editable={props?.editable}
                // onTouchMove
                style={[styles.inputstyle]}
                onChangeText={text => {
                  setFirstDigit(text), text && secondInput.current.focus();
                }}
                maxLength={1}
              />
              <TextInput
                ref={secondInput}
                placeholder={props.placeholder}
                mode={mode}
                color={color.defalt}
                disabled={props.disabled}
                placeholderTextColor={props.placeholderTextColor}
                // editable={false}
                textAlign={props.textAlign}
                keyboardType="numeric"
                scrollEnabled={false}
                multiline={props.multiline}
                numberOfLines={props.numberOfLines}
                // onChangeText={props.onChangeText}
                onChange={props.onChange}
                secureTextEntry={props.secureTextEntry}
                // theme={{color: {primary: color.Green, underlineColor: color.red}}}
                outlineColor={props.outlineColor}
                underlineColor={props.underlineColor}
                editable={props?.editable}
                // onTouchMove
                style={[styles.inputstyle]}
                maxLength={1}
                value={secondDigit}
                onChangeText={text => {
                  setSecondDigit(text),
                    text ? thirdInput.current.focus() : firstInput.current.focus();
                }}
              />

              <TextInput
                ref={thirdInput}
                placeholder={props.placeholder}
                mode={mode}
                color={color.defalt}
                disabled={props.disabled}
                value={thirdDigit}
                placeholderTextColor={props.placeholderTextColor}
                // editable={false}
                textAlign={props.textAlign}
                keyboardType="numeric"
                scrollEnabled={false}
                multiline={props.multiline}
                numberOfLines={props.numberOfLines}
                // onChangeText={props.onChangeText}
                onChange={props.onChange}
                secureTextEntry={props.secureTextEntry}
                maxLength={1}
                // theme={{color: {primary: color.Green, underlineColor: color.red}}}
                outlineColor={props.outlineColor}
                underlineColor={props.underlineColor}
                editable={props?.editable}
                // onTouchMove
                style={[styles.inputstyle]}
                onChangeText={text => {
                  setThirdDigit(text),
                    text ? fourthInput.current.focus() : secondInput.current.focus();
                }}
              />
              <TextInput
                ref={fourthInput}
                placeholder={props.placeholder}
                mode={mode}
                color={color.defalt}
                disabled={props.disabled}
                placeholderTextColor={props.placeholderTextColor}
                // editable={false}
                textAlign={props.textAlign}
                keyboardType="numeric"
                scrollEnabled={false}
                multiline={props.multiline}
                numberOfLines={props.numberOfLines}
                // onChangeText={props.onChangeText}
                onChange={props.onChange}
                secureTextEntry={props.secureTextEntry}
                maxLength={1}
                // theme={{color: {primary: color.Green, underlineColor: color.red}}}
                outlineColor={props.outlineColor}
                underlineColor={props.underlineColor}
                editable={props?.editable}
                // onTouchMove
                style={[styles.inputstyle]}
                value={fourthDigit}
                onChangeText={text => {
                  setFourthDigit(text);
                }}
              />
            </View>

          </View>

          <Text style={styles.signinText}>Don't receive any code?</Text>
          <TouchableOpacity onPress={() => { ResendOtp() }}>
            <Text style={styles.loginText}>Resend a new code</Text>
          </TouchableOpacity>

          <BotonComp
            BtnStyle={styles.BtnStyle}
            onPressFunc={() => {
              hndlSubmit()
            }
            }
            btnText="Verify"
          />
        </View>
      </ImageBackground>

      {/* navigation.navigate('Parent');
       */}
    </>
  );
};

export default OtpScren;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.8,
    width: '100%',
  },

  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  logoStyle: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImg: {
    width: width / 2,
    height: height / 4.5,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 5,
  },
  forgotStyle: {
    width: '100%',
    textAlign: 'right',
    color: color.drkgren,
    fontSize: 18,
    marginTop: 7,
    fontWeight: '800',
  },
  contentStyle: {
    paddingHorizontal: 20,
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.defalt,
    textAlign: 'center',
  },
  signinText: {
    fontSize: 18,
    fontWeight: '600',
    color: color.drkGry,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  orLoginCont: {
    marginVertical: 20,
  },
  orLoginStyle: {
    width: '100%',
    textAlign: 'center',
    color: '#646464',
    fontSize: 18,
  },
  accStyle: {
    fontSize: 20,
    color: color.defalt,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  registerNow: {
    fontSize: 15,
    color: color.prpl,
    textDecorationColor: color.prpl,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  iconContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  haveAcc: {
    color: color.defalt,
    fontSize: 15,
  },
  inputStyle: {
    width: '20%',
  },
  BtnStyle: {
    marginTop: 30,
    width: '85%',
  },
  headerIcon: {
    paddingLeft: 20,
    marginTop: 10,
  },
  accountVer: {
    color: color.defalt,
    fontSize: 25,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },


  // input style
  inputstyle: {
    width: '14%',
    paddingVertical: 15,
    fontSize: 25,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    borderColor: color.defalt,
    borderWidth: 1,
    borderBottomColor: color.defalt,
    backgroundColor: 'transparent',
    borderRadius: 1,
    textAlign: 'center',
  },
  inputView: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
    elevation: 0,
  },
  inputFocused: {
    borderBottomWidth: 1.7,
  },
});