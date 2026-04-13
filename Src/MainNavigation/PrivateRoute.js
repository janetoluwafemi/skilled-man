import React from 'react';
import {View, Text, Button, Image, BackHandler} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplshScren from '../Screens/SplashScreen/SplashScreen';
import Prent from '../Screens/Parent';
import UsrCht from '../Screens/Chat/UserChat';
import IndvidualCht from '../Screens/Chat/IndividualChat';
import EdtProfilScren from '../Screens/Drawer/editProfile';
import EdtUsrProfil from '../Screens/Drawer/editUserProfile';
import AdSkil from '../Screens/Drawer/AddSkill';
import FndExprt from '../Screens/Expert/FindExpert';
import ExprtDetails from '../Screens/Expert/ExpertDetail';
import SlctPaymentMethd from '../Screens/Payment/SelectPaymentMethod';
import PaymentCongrats from '../Screens/Payment/Congratulations';
import CrdDetails from '../Screens/Payment/CardDetail';
import NotifiScreen from '../Screens/Drawer/NotificationScreen';
import AccSetting from '../Screens/Drawer/AccountSetting';
import ChangPaswrd from '../Screens/Drawer/ChangePassword';
import HistryScren from '../Screens/Drawer/HistoryScreen';
import PrivcyPlcy from '../Screens/Drawer/PrivacyPolicy';
import Term_Condition from '../Screens/Drawer/TermsConditions';
import AbutUs from '../Screens/Drawer/AboutUs';
import FrgtPaswrd from '../Screens/Forgot_Password/forgot_password';
import SetingFrgtPaswrd from '../Screens/SettingForgetPassword/SettingForgetPassword';
import UsrHstry from '../Screens/UserHistory/UserHistory';
import PblicRout from './PublicRoutes';
import {MyFrm} from '../Components/MyForm';
import Socktdemo from '../Screens/Chat/socketiodemo';
import ConversationScreen from '../utilis/Firebasechat';
import Balance from '../Screens/DashBoard/Balance';
import Cash from '../Screens/DashBoard/Cash';
import Mapltln from '../Screens/Signup/Maps';

const Stack = createNativeStackNavigator();

const PrivatRout = () => {
  return (
    <Stack.Navigator initialRouteName="Parent">
      <Stack.Screen
        name="Parent"
        component={Prent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ConversationScreen"
        component={ConversationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Socketdemo"
        component={Socktdemo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserChat"
        component={UsrCht}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyForm"
        component={MyFrm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PublicRoutes"
        component={PblicRout}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="IndividualChat"
        component={IndvidualCht}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="edit_profile"
        options={{headerShown: false}}
        component={EdtProfilScren}
      />
      <Stack.Screen
        name="editUserProfile"
        options={{headerShown: false}}
        component={EdtUsrProfil}
      />
      <Stack.Screen
        name="AddSkill"
        component={AdSkil}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="FindExpert"
        component={FndExprt}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ExpertDetail"
        component={ExprtDetails}
        options={{headerShown: false}}
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
        name="SelectPaymentMethod"
        component={SlctPaymentMethd}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PaymentCongratulations"
        component={PaymentCongrats}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="CardDetail"
        component={CrdDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="notification_screen"
        options={{headerShown: false}}
        component={NotifiScreen}
      />

      <Stack.Screen
        name="account_setting"
        options={{headerShown: false}}
        component={AccSetting}
      />

      <Stack.Screen
        name="ChangePassword"
        options={{headerShown: false}}
        component={ChangPaswrd}
      />

      <Stack.Screen
        name="HistoryScreen"
        options={{headerShown: false}}
        component={HistryScren}
      />

      <Stack.Screen
        name="privacy_policy"
        options={{headerShown: false}}
        component={PrivcyPlcy}
      />

      <Stack.Screen
        name="terms_condidtions"
        options={{headerShown: false}}
        component={Term_Condition}
      />

      <Stack.Screen
        name="AboutUs"
        options={{headerShown: false}}
        component={AbutUs}
      />
      <Stack.Screen
        name="UserHistory"
        options={{headerShown: false}}
        component={UsrHstry}
      />
      <Stack.Screen
        name="Balance"
        options={{headerShown: false}}
        component={Balance}
      />
      <Stack.Screen
        name="Cash"
        options={{headerShown: false}}
        component={Cash}
      />
    </Stack.Navigator>
  );
};

export default PrivatRout;
