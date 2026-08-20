// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
//
// import Prent from '../Screens/Parent';
// import ConversationScreen from '../utilis/Firebasechat';
// import Socktdemo from '../Screens/Chat/socketiodemo';
// import UsrCht from '../Screens/Chat/UserChat';
// import { MyFrm } from '../Components/MyForm';
// import PblicRout from './PublicRoutes';
// import IndvidualCht from '../Screens/Chat/IndividualChat';
// import EdtProfilScren from '../Screens/Drawer/editProfile';
// import EdtUsrProfil from '../Screens/Drawer/editUserProfile';
// import AdSkil from '../Screens/Drawer/AddSkill';
// import FndExprt from '../Screens/Expert/FindExpert';
// import ExprtDetails from '../Screens/Expert/ExpertDetail';
// import Mapltln from '../Screens/Signup/Maps';
// import SlctPaymentMethd from '../Screens/Payment/SelectPaymentMethod';
// import PaymentCongrats from '../Screens/Payment/Congratulations';
// import CrdDetails from '../Screens/Payment/CardDetail';
// import NotifiScreen from '../Screens/Drawer/NotificationScreen';
// import AccSetting from '../Screens/Drawer/AccountSetting';
// import ChangPaswrd from '../Screens/Drawer/ChangePassword';
// import HistryScren from '../Screens/Drawer/HistoryScreen';
// import PrivcyPlcy from '../Screens/Drawer/PrivacyPolicy';
// import Term_Condition from '../Screens/Drawer/TermsConditions';
// import AbutUs from '../Screens/Drawer/AboutUs';
// import UsrHstry from '../Screens/UserHistory/UserHistory';
// import Balance from '../Screens/DashBoard/Balance';
// import Cash from '../Screens/DashBoard/Cash';
//
// const Stack = createNativeStackNavigator();
//
// const PrivatRout = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="Parent"
//       screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Parent" component={Prent} />
//       <Stack.Screen name="ConversationScreen" component={ConversationScreen} />
//       <Stack.Screen name="Socketdemo" component={Socktdemo} />
//       <Stack.Screen name="UserChat" component={UsrCht} />
//       <Stack.Screen name="MyForm" component={MyFrm} />
//       <Stack.Screen name="PublicRoutes" component={PblicRout} />
//       <Stack.Screen name="IndividualChat" component={IndvidualCht} />
//       <Stack.Screen name="edit_profile" component={EdtProfilScren} />
//       <Stack.Screen name="editUserProfile" component={EdtUsrProfil} />
//       <Stack.Screen name="AddSkill" component={AdSkil} />
//       <Stack.Screen name="FindExpert" component={FndExprt} />
//       <Stack.Screen name="ExpertDetail" component={ExprtDetails} />
//       <Stack.Screen name="Maplatln" component={Mapltln} />
//       <Stack.Screen name="SelectPaymentMethod" component={SlctPaymentMethd} />
//       <Stack.Screen name="PaymentCongratulations" component={PaymentCongrats} />
//       <Stack.Screen name="CardDetail" component={CrdDetails} />
//       <Stack.Screen name="notification_screen" component={NotifiScreen} />
//       <Stack.Screen name="account_setting" component={AccSetting} />
//       <Stack.Screen name="ChangePassword" component={ChangPaswrd} />
//       <Stack.Screen name="HistoryScreen" component={HistryScren} />
//       <Stack.Screen name="privacy_policy" component={PrivcyPlcy} />
//       <Stack.Screen name="terms_condidtions" component={Term_Condition} />
//       <Stack.Screen name="AboutUs" component={AbutUs} />
//       <Stack.Screen name="UserHistory" component={UsrHstry} />
//       <Stack.Screen name="Balance" component={Balance} />
//       <Stack.Screen name="Cash" component={Cash} />
//     </Stack.Navigator>
//   );
// };
//
// export default PrivatRout;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Prent from '../Screens/Parent';
import ConversationScreen from '../utilis/Firebasechat';
import Socktdemo from '../Screens/Chat/socketiodemo';
import UsrCht from '../Screens/Chat/UserChat';
import { MyFrm } from '../Components/MyForm';
import IndvidualCht from '../Screens/Chat/IndividualChat';
import EdtProfilScren from '../Screens/Drawer/editProfile';
import EdtUsrProfil from '../Screens/Drawer/editUserProfile';
import AdSkil from '../Screens/Drawer/AddSkill';
import FndExprt from '../Screens/Expert/FindExpert';
import ExprtDetails from '../Screens/Expert/ExpertDetail';
import Mapltln from '../Screens/Signup/Maps';
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
import UsrHstry from '../Screens/UserHistory/UserHistory';
import Balance from '../Screens/DashBoard/Balance';
import Cash from '../Screens/DashBoard/Cash';

const Stack = createNativeStackNavigator();

const PrivatRout = () => {
  return (
    <Stack.Navigator
      initialRouteName="Parent"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Parent" component={Prent} />
      <Stack.Screen name="ConversationScreen" component={ConversationScreen} />
      <Stack.Screen name="Socketdemo" component={Socktdemo} />
      <Stack.Screen name="UserChat" component={UsrCht} />
      <Stack.Screen name="MyForm" component={MyFrm} />
      <Stack.Screen name="IndividualChat" component={IndvidualCht} />
      <Stack.Screen name="edit_profile" component={EdtProfilScren} />
      <Stack.Screen name="editUserProfile" component={EdtUsrProfil} />
      <Stack.Screen name="AddSkill" component={AdSkil} />
      <Stack.Screen name="FindExpert" component={FndExprt} />
      <Stack.Screen name="ExpertDetail" component={ExprtDetails} />
      <Stack.Screen name="Maplatln" component={Mapltln} />
      <Stack.Screen name="SelectPaymentMethod" component={SlctPaymentMethd} />
      <Stack.Screen name="PaymentCongratulations" component={PaymentCongrats} />
      <Stack.Screen name="CardDetail" component={CrdDetails} />
      <Stack.Screen name="notification_screen" component={NotifiScreen} />
      <Stack.Screen name="account_setting" component={AccSetting} />
      <Stack.Screen name="ChangePassword" component={ChangPaswrd} />
      <Stack.Screen name="HistoryScreen" component={HistryScren} />
      <Stack.Screen name="privacy_policy" component={PrivcyPlcy} />
      <Stack.Screen name="terms_condidtions" component={Term_Condition} />
      <Stack.Screen name="AboutUs" component={AbutUs} />
      <Stack.Screen name="UserHistory" component={UsrHstry} />
      <Stack.Screen name="Balance" component={Balance} />
      <Stack.Screen name="Cash" component={Cash} />
    </Stack.Navigator>
  );
};

export default PrivatRout;