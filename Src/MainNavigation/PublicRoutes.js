// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
//
// import SplashScreen from '../Screens/SplashScreen/SplashScreen';
// import Frgtpasword1 from '../Screens/Forgot_Password/emailforget';
// import FrgtpaswrdOtpScren from '../Screens/Forgot_Password/forget_password_otp';
// import Signin from '../Screens/Signin/Signin';
// import { MyFrm } from '../Components/MyForm';
// import GoglMap from '../Screens/Signup/Googlemap';
// import Mapltln from '../Screens/Signup/Maps';
// import PrivatRout from './PrivateRoute';
// import LndedScren from '../Screens/LandedScreen/LandedScreen';
// import Signup from '../Screens/Signup/Signup';
// import OtpScren from '../Screens/OtpScreen/OtpScreen';
// import StPaswrd from '../Screens/SetPassword/SetPassword';
// import AdBusines from '../Screens/AddBusiness/AddBusiness';
// import AdBnk from '../Screens/AddBank/AddBank';
// import AdBnkGogl from '../Screens/AddBank/AddBankWithGoogle';
// import Congratulation from '../Screens/Congratulations/Congratulations';
// import FrgtPaswrd from '../Screens/Forgot_Password/forgot_password';
// import SettingForgotPassword from '../Screens/SettingForgetPassword/SettingForgetPassword';
// import PrivcyPlcy from '../Screens/Drawer/PrivacyPolicy';
// import Balance from '../Screens/DashBoard/Balance';
//
// const Stack = createNativeStackNavigator();
//
// const PblicRout = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="SplashScreen"
//       screenOptions={{
//         headerShown: false,
//         animation: 'slide_from_right',
//         contentStyle: { backgroundColor: '#FFFFFF' },
//       }} id={''}>
//       <Stack.Screen name="SplashScreen" component={SplashScreen} />
//       <Stack.Screen name="Forgetpassword1" component={Frgtpasword1} />
//       <Stack.Screen name="ForgetpasswordOtpScreen" component={FrgtpaswrdOtpScren} />
//       <Stack.Screen name="Signin" component={Signin} />
//       <Stack.Screen name="MyForm" component={MyFrm} />
//       <Stack.Screen name="GoogleMaps" component={GoglMap} />
//       <Stack.Screen name="Maplatln" component={Mapltln} />
//       <Stack.Screen name="PrivateRoute" component={PrivatRout} />
//       <Stack.Screen name="LandedScreen" component={LndedScren} />
//       <Stack.Screen name="SignupScreen" component={Signup} />
//       <Stack.Screen name="OtpScreen" component={OtpScren} />
//       <Stack.Screen name="SetPassword" component={StPaswrd} />
//       <Stack.Screen name="AddBusiness" component={AdBusines} />
//       <Stack.Screen name="AddBank" component={AdBnk} />
//       <Stack.Screen name="AddBankGoogle" component={AdBnkGogl} />
//       <Stack.Screen name="Congratulations" component={Congratulation} />
//       <Stack.Screen name="ForgotPassword" component={FrgtPaswrd} />
//       <Stack.Screen name="SettingForgetPassword" component={SettingForgotPassword} />
//       <Stack.Screen name="privacy_policy" component={PrivcyPlcy} />
//       <Stack.Screen name="Balance" component={Balance} />
//     </Stack.Navigator>
//   );
// };
//
// export default PblicRout;


import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../Screens/SplashScreen/SplashScreen';
import Frgtpasword1 from '../Screens/Forgot_Password/emailforget';
import FrgtpaswrdOtpScren from '../Screens/Forgot_Password/forget_password_otp';
import Signin from '../Screens/Signin/Signin';
import { MyFrm } from '../Components/MyForm';
import GoglMap from '../Screens/Signup/Googlemap';
import Mapltln from '../Screens/Signup/Maps';
import LndedScren from '../Screens/LandedScreen/LandedScreen';
import Signup from '../Screens/Signup/Signup';
import OtpScren from '../Screens/OtpScreen/OtpScreen';
import StPaswrd from '../Screens/SetPassword/SetPassword';
import AdBusines from '../Screens/AddBusiness/AddBusiness';
import AdBnk from '../Screens/AddBank/AddBank';
import AdBnkGogl from '../Screens/AddBank/AddBankWithGoogle';
import Congratulation from '../Screens/Congratulations/Congratulations';
import FrgtPaswrd from '../Screens/Forgot_Password/forgot_password';
import SettingForgotPassword from '../Screens/SettingForgetPassword/SettingForgetPassword';
import PrivcyPlcy from '../Screens/Drawer/PrivacyPolicy';
import Balance from '../Screens/DashBoard/Balance';

const Stack = createNativeStackNavigator();

const PublicRoute = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Forgetpassword1" component={Frgtpasword1} />
      <Stack.Screen name="ForgetpasswordOtpScreen" component={FrgtpaswrdOtpScren} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="MyForm" component={MyFrm} />
      <Stack.Screen name="GoogleMaps" component={GoglMap} />
      <Stack.Screen name="Maplatln" component={Mapltln} />
      <Stack.Screen name="LandedScreen" component={LndedScren} />
      <Stack.Screen name="SignupScreen" component={Signup} />
      <Stack.Screen name="OtpScreen" component={OtpScren} />
      <Stack.Screen name="SetPassword" component={StPaswrd} />
      <Stack.Screen name="AddBusiness" component={AdBusines} />
      <Stack.Screen name="AddBank" component={AdBnk} />
      <Stack.Screen name="AddBankGoogle" component={AdBnkGogl} />
      <Stack.Screen name="Congratulations" component={Congratulation} />
      <Stack.Screen name="ForgotPassword" component={FrgtPaswrd} />
      <Stack.Screen name="SettingForgetPassword" component={SettingForgotPassword} />
      <Stack.Screen name="privacy_policy" component={PrivcyPlcy} />
      <Stack.Screen name="Balance" component={Balance} />
    </Stack.Navigator>
  );
};

export default PublicRoute;