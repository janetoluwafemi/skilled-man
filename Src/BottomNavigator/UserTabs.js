import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import Icon, { Icons } from '../Components/Icons';
import color from '../Assets/colors/colors';
import UsrDshbord from '../Screens/DashBoard/UserDashboard';
import BokngScren from '../Screens/Booking/BookingScreen';
import SavScren from '../Screens/Save/SaveScreen';
import ChatScreen from '../Screens/Chat/ChatScreen';
import { BASIC_URL } from '../Screens/Signin/Signin';

const { width, height } = Dimensions.get('window');
const scale = width / 375;

function normalize(size) {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
}

const TabArr = [
  {
    route: 'DashBoard',
    label: 'Home',
    type: Icons.Ionicons,
    icon: 'home',
    component: UsrDshbord,
  },
  {
    route: 'SaveScreen',
    label: 'Save',
    type: Icons.FontAwesome5,
    icon: 'bookmark',
    component: SavScren,
  },
  {
    route: 'BookingScreen',
    label: 'Booking',
    type: Icons.MaterialCommunityIcons,
    icon: 'home-variant',
    component: BokngScren,
  },
  {
    route: 'ChatScreen',
    label: 'Chat',
    type: Icons.FontAwesome,
    icon: 'commenting',
    component: ChatScreen,
  },
];

const Tab = createBottomTabNavigator();

const TabButton = ({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState?.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);
  const [countUnread, setCountUnread] = useState(0);

  useEffect(() => {
    if (focused) {
      viewRef.current?.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
      textViewRef.current?.animate({ 0: { scale: 0 }, 1: { scale: 1 } });
    } else {
      viewRef.current?.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
      textViewRef.current?.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
    }
  }, [focused]);

  const fetchUnreadChats = async () => {
    try {
      const formdata = new FormData();
      formdata.append('own_id', global.id);

      const response = await fetch(`${BASIC_URL}get_all_chats.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.chat && Array.isArray(result.chat)) {
        const total = result.chat.reduce(
          (sum, chatItem) => sum + (chatItem.unread_count || 0),
          0
        );
        setCountUnread(total);
      }
    } catch (error) {
      console.log('Error fetching chat unread count:', error);
    }
  };

  useEffect(() => {
    if (focused) {
      fetchUnreadChats();
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.container}>
      <View style={styles.tabContent}>
        <Animatable.View ref={viewRef} style={StyleSheet.absoluteFillObject} />
        <View style={[styles.btnStyle, focused && styles.activeTabBorder]}>
          {item.icon === 'commenting' && countUnread > 0 && (
            <View style={styles.noOfMsg}>
              <Text style={styles.noOfMsgText}>{countUnread}</Text>
            </View>
          )}

          <Icon
            type={item.type}
            name={item.icon}
            color={color.wite}
            size={normalize(24)}
          />
          <Animatable.Text ref={textViewRef} style={styles.labelStyle}>
            {item.label}
          </Animatable.Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function UserTabs() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = height * 0.085;
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0);
  const totalTabHeight = tabBarHeight + bottomPadding;

  return (
    <Tab.Navigator
      initialRouteName="DashBoard"
      screenOptions={{
        headerShown: false,
        lazy: false,
        detachInactiveScreens: false,
        tabBarStyle: {
          height: totalTabHeight,
          position: 'absolute',
          bottom: 0,
          paddingBottom: bottomPadding,
          paddingTop: Platform.OS === 'android' ? 8 : 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[color.defalt, color.defalt]}
            style={styles.gradientFlex}
          />
        ),
      }}
      backBehavior="none">
      {TabArr.map(item => (
        <Tab.Screen
          key={item.route}
          name={item.route}
          component={item.component}
          getId={() => item.route}
          options={{
            tabBarShowLabel: false,
            tabBarButton: props => <TabButton {...props} item={item} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnStyle: {
    alignItems: 'center',
    paddingVertical: height * 0.005,
    marginTop: height * 0.005,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  activeTabBorder: {
    borderBottomWidth: 2,
    borderBottomColor: color.wite,
  },
  labelStyle: {
    fontWeight: '500',
    color: color.wite,
    fontSize: normalize(11),
  },
  noOfMsg: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    width: normalize(16),
    height: normalize(16),
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  noOfMsgText: {
    color: 'white',
    fontSize: normalize(9),
    fontWeight: '600',
  },
  gradientFlex: {
    flex: 1,
  },
});