import React, {useState} from 'react';
import {View, Text, Button, Image, BackHandler} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LndedScren from '../Screens/LandedScreen/LandedScreen';
import Signin from '../Screens/Signin/Signin';
import Signup from '../Screens/Signup/Signup';
import SplshScren from '../Screens/SplashScreen/SplashScreen';
import OtpScren from '../Screens/OtpScreen/OtpScreen';
import StPaswrd from '../Screens/SetPassword/SetPassword';
import AdBusines from '../Screens/AddBusiness/AddBusiness';
import AdBnk from '../Screens/AddBank/AddBank';
import AdTax from '../Screens/AddTax/AddTax';
import Congratulation from '../Screens/Congratulations/Congratulations';
import Prent from '../Screens/Parent';
import FrgtPaswrd from '../Screens/Forgot_Password/forgot_password';
import SetingFrgtPaswrd from '../Screens/SettingForgetPassword/SettingForgetPassword';
import PrivcyPlcy from '../Screens/Drawer/PrivacyPolicy';
import PrivatRout from './PrivateRoute';
import AdBnkGogl from '../Screens/AddBank/AddBankWithGoogle';
import Mapltln from '../Screens/Signup/Maps';
import GoglMap from '../Screens/Signup/Googlemap';
import {MyFrm} from '../Components/MyForm';
import Frgtpasword1 from '../Screens/Forgot_Password/emailforget';
import FrgtpaswrdOtpScren from '../Screens/Forgot_Password/forget_password_otp';
import Balance from '../Screens/DashBoard/Balance';
const Stack = createNativeStackNavigator();

const PblicRout = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="SplashScreen"
        component={SplshScren}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Forgetpassword1"
        component={Frgtpasword1}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgetpasswordOtpScreen"
        component={FrgtpaswrdOtpScren}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={({navigation}) => ({
          headerShown: false,
          headerLeft: null, // This will hide the back button
        })}
      />
      <Stack.Screen
        name="MyForm"
        component={MyFrm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GoogleMaps"
        component={GoglMap}
        options={({navigation}) => ({
          headerShown: false,
          headerLeft: null, // This will hide the back button
        })}
      />
      <Stack.Screen
        name="Maplatln"
        component={Mapltln}
        options={({navigation}) => ({
          headerShown: false,
          headerLeft: null, // This will hide the back button
        })}
      />
      <Stack.Screen
        name="PrivateRoute"
        component={PrivatRout}
        options={({navigation}) => ({
          headerShown: false,
          headerLeft: null, // This will hide the back button
        })}
      />
      <Stack.Screen
        name="LandedScreen"
        component={LndedScren}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignupScreen"
        component={Signup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OtpScreen"
        component={OtpScren}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SetPassword"
        component={StPaswrd}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AddBusiness"
        component={AdBusines}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddBank"
        component={AdBnk}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddBankGoogle"
        component={AdBnkGogl}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
                name="AddTax"
                component={AddTax}
                options={{ headerShown: false }}
            /> */}
      <Stack.Screen
        name="Congratulations"
        component={Congratulation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        options={{headerShown: false}}
        component={FrgtPaswrd}
      />
      <Stack.Screen
        name="SettingForgetPassword"
        options={{headerShown: false}}
        component={SetingFrgtPaswrd}
      />
      <Stack.Screen
        name="privacy_policy"
        options={{headerShown: false}}
        component={PrivcyPlcy}
      />
      <Stack.Screen
        name="Balance"
        options={{headerShown: false}}
        component={Balance}
      />
    </Stack.Navigator>
  );
};

export default PblicRout;
