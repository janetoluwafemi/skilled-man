import React, { useState } from 'react';
import { View, Text, Button, Image, BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import SplashScreen from '../Screens/SplashScreen/SplashScreen';
// import Parent from '../Screens/Parent';
// import IndividualChat from '../Screens/Chat/IndividualChat';
// import EditProfileScreen from '../Screens/Drawer/editProfile';
// import AddSkill from '../Screens/Drawer/AddSkill';
// import Main from '../Main/Main';
// import EditUserProfile from '../Screens/Drawer/editUserProfile';
// import NotificationScreen from '../Screens/Drawer/NotificationScreen';
// import AccountSetting from '../Screens/Drawer/AccountSetting';
// import ChangePassword from '../Screens/Drawer/ChangePassword';
// import HistoryScreen from '../Screens/Drawer/HistoryScreen';
// import PrivacyPolicy from '../Screens/Drawer/PrivacyPolicy';
// import TermsConditions from '../Screens/Drawer/TermsConditions';
// import AboutUs from '../Screens/Drawer/AboutUs';
// import FindExpert from '../Screens/Expert/FindExpert';
// import ExpertDetail from '../Screens/Expert/ExpertDetail';
// import SelectPaymentMethod from '../Screens/Payment/SelectPaymentMethod';
// import CardDetail from '../Screens/Payment/CardDetail';
// import PaymentCongratulations from '../Screens/Payment/Congratulations';
// import UserChat from '../Screens/Chat/UserChat';
import { AthProvidr, useAuth } from '../context/AuthProvider';
import FrgtPaswrd from '../Screens/Forgot_Password/forgot_password';
import SetingFrgtPaswrd from '../Screens/SettingForgetPassword/SettingForgetPassword';
import NavigationService from './NavigationService';
import PblicRout from './PublicRoutes';
import PrivatRout from './PrivateRoute';







// import UsersTab from '../Screens/UserDashboard';


const Stack = createNativeStackNavigator();

const MainNavigateHub = () => {
  const [isSplashScreenShown, setIsSplashScreenShown] = useState(false);



  const { state, dispatch } = useAuth();

  console.log("value in state in main navigation hub",state)

  return (
    <NativeBaseProvider>
      <NavigationContainer
        screenOptions={{
          headerLeft: ({ onPress }) => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={onPress}
            />
          ),
        }}
        ref={(ref) => NavigationService.setTopLevelNavigator(ref)}
      >



        {state.role ? (<PrivatRout />) : (<PblicRout />)}

      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default MainNavigateHub;
