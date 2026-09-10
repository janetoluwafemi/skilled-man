import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Prent from '../Screens/Parent';
import Dashboard from '../Screens/DashBoard/Dashboard';
import UserDashboard from '../Screens/DashBoard/UserDashboard';
import ConversationScreen from '../utilis/Firebasechat';
import SocketDemo from '../Screens/Chat/socketiodemo';
import UsrCht from '../Screens/Chat/UserChat';
import { MyFrm } from '../Components/MyForm';
import IndividualChat from '../Screens/Chat/IndividualChat';
import EdtProfileScreen from '../Screens/Drawer/editProfile';
import EditUserProfile from '../Screens/Drawer/editUserProfile';
import AdSkil from '../Screens/Drawer/AddSkill';
import FndExprt from '../Screens/Expert/FindExpert';
import ExprtDetails from '../Screens/Expert/ExpertDetail';
import UserProfile from '../Screens/Chat/UserProfile';
import Mapltln from '../Screens/Signup/Maps';
import SlctPaymentMethd from '../Screens/Payment/SelectPaymentMethod';
import PaymentCongrats from '../Screens/Payment/Congratulations';
import CrdDetails from '../Screens/Payment/CardDetail';
import NotificationScreen from '../Screens/Drawer/NotificationScreen';
import AccSetting from '../Screens/Drawer/AccountSetting';
import ChangePassword from '../Screens/Drawer/ChangePassword';
import HistryScren from '../Screens/Drawer/HistoryScreen';
import PrivacyPolicy from '../Screens/Drawer/PrivacyPolicy';
import Term_Condition from '../Screens/Drawer/TermsConditions';
import AbutUs from '../Screens/Drawer/AboutUs';
import ContactUs from '../Screens/Drawer/ContactUs';
import UsrHstry from '../Screens/UserHistory/UserHistory';
import Balance from '../Screens/DashBoard/Balance';
import Cash from '../Screens/DashBoard/Cash';

import AdBnk from '../Screens/AddBank/AddBank';
import AdBnkGogl from '../Screens/AddBank/AddBankWithGoogle';
import Congratulation from '../Screens/Congratulations/Congratulations';

const Stack = createNativeStackNavigator();

const PrivateRoute = () => {
  return (
    <Stack.Navigator
      initialRouteName="Parent"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Parent" component={Prent} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="UserDashboard" component={UserDashboard} />
      <Stack.Screen name="ConversationScreen" component={ConversationScreen} />
      <Stack.Screen name="Socketdemo" component={SocketDemo} />
      <Stack.Screen name="UserChat" component={UsrCht} />
      <Stack.Screen name="MyForm" component={MyFrm} />
      <Stack.Screen name="IndividualChat" component={IndividualChat} />
      <Stack.Screen name="edit_profile" component={EdtProfileScreen} />
      <Stack.Screen name="editUserProfile" component={EditUserProfile} />
      <Stack.Screen name="AddSkill" component={AdSkil} />
      <Stack.Screen name="FindExpert" component={FndExprt} />
      <Stack.Screen name="ExpertDetail" component={ExprtDetails} />
      <Stack.Screen name="Maplatln" component={Mapltln} />
      <Stack.Screen name="SelectPaymentMethod" component={SlctPaymentMethd} />
      <Stack.Screen name="PaymentCongratulations" component={PaymentCongrats} />
      <Stack.Screen name="CardDetail" component={CrdDetails} />
      <Stack.Screen name="notification_screen" component={NotificationScreen} />
      <Stack.Screen name="account_setting" component={AccSetting} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="HistoryScreen" component={HistryScren} />
      <Stack.Screen name="privacy_policy" component={PrivacyPolicy} />
      <Stack.Screen name="terms_condidtions" component={Term_Condition} />
      <Stack.Screen name="AboutUs" component={AbutUs} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="UserHistory" component={UsrHstry} />
      <Stack.Screen name="Balance" component={Balance} />
      <Stack.Screen name="Cash" component={Cash} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="AddBank" component={AdBnk} />
      <Stack.Screen name="AddBankGoogle" component={AdBnkGogl} />
      <Stack.Screen name="Congratulations" component={Congratulation} />
    </Stack.Navigator>
  );
};

export default PrivateRoute;