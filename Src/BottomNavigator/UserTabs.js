import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon, {Icons} from '../Components/Icons';
import * as Animatable from 'react-native-animatable';
import color from '../Assets/colors/colors';
import LinearGradient from 'react-native-linear-gradient';
import UsrDshbord from '../Screens/DashBoard/UserDashboard';
import BokngScren from '../Screens/Booking/BookingScreen';
import SavScren from '../Screens/Save/SaveScreen';
import ChatScreen from '../Screens/Chat/ChatScreen';

const {width, height} = Dimensions.get('window');
const scale = width / 375; // base width = iPhone X

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
    color: color.drkgren,
    alphaClr: color.wite,
  },
  {
    route: 'SaveScreen',
    label: 'Save',
    type: Icons.FontAwesome5,
    icon: 'bookmark',
    component: SavScren,
    color: color.drkgren,
    alphaClr: color.wite,
  },
  {
    route: 'BookingScreen',
    label: 'Booking',
    type: Icons.MaterialCommunityIcons,
    icon: 'home-variant',
    component: BokngScren,
    color: color.drkgren,
    alphaClr: color.wite,
  },
  {
    route: 'ChatScreen',
    label: 'Chat',
    type: Icons.FontAwesome,
    icon: 'commenting',
    component: ChatScreen,
    color: color.drkgren,
    alphaClr: color.wite,
  },
];

const Tab = createBottomTabNavigator();

const TabButton = props => {
  const {item, onPress, accessibilityState} = props;
  const navigation = useNavigation();
  const focused = accessibilityState?.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);
  const [getChat, setALlChat] = useState([]);
  const [countunread, setCountUnread] = useState(0);

  useEffect(() => {
    if (focused) {
      viewRef.current?.animate({0: {scale: 0}, 1: {scale: 1}});
      textViewRef.current?.animate({0: {scale: 0}, 1: {scale: 1}});
    } else {
      viewRef.current?.animate({0: {scale: 1}, 1: {scale: 0}});
      textViewRef.current?.animate({0: {scale: 1}, 1: {scale: 0}});
    }
  }, [focused]);

  const getAllChat = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=634t4952888bd6bei50ea3d3aa');

      var formdata = new FormData();
      formdata.append('own_id', global.id);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      const API =
        'https://fisdemoprojects.com/skilledman/api/get_all_chats.php';

      const response = await fetch(API, requestOptions);
      const result = await response.json();
      if (result && result.chat) {
        setALlChat(result.chat);
      }
    } catch (error) {
      console.log('errorin get allchat');
    }
  };

  const totalunread = () => {
    let unread = getChat.reduce((total, item) => total + item.unread_count, 0);
    setCountUnread(unread);
    // console.log('unread count', unread);
  };

  useEffect(() => {
    getAllChat();
    totalunread();
  }, [focused]);

  // console.log('total unread', getChat);

  const handlePress = () => {
    // Use the default onPress handler which properly manages tab navigation
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={[styles.container, {flex: 1}]}>
      <View>
        <Animatable.View
          ref={viewRef}
          style={[StyleSheet.absoluteFillObject]}
        />
        <View
          style={[
            styles.btnStyle,
            {
              borderBottomWidth: focused ? 2 : 0,
              borderBottomColor: focused ? color.wite : 'transparent',
            },
          ]}>
          {/* Unread message badge */}
          {item.icon === 'commenting' && countunread > 0 ? (
            <>
              <View style={styles.noOfMsg}>
                <Text style={styles.noOfMsgText}>{countunread}</Text>
              </View>
              <Icon
                type={item.type}
                name={item.icon}
                color={color.wite}
                size={normalize(24)}
              />
            </>
          ) : (
            <Icon
              type={item.type}
              name={item.icon}
              color={color.wite}
              size={normalize(24)}
            />
          )}
          <Text style={[styles.labelStyle, {fontSize: normalize(11)}]}>
            {item.label}
          </Text>
          <Animatable.View ref={textViewRef}></Animatable.View>
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
            style={{flex: 1}}
          />
        ),
      }}
      backBehavior="none">
      {TabArr.map((item, index) => (
        <Tab.Screen
          key={item.route}
          name={item.route}
          component={item.component}
          getId={({params}) => item.route}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    alignItems: 'center',
    paddingVertical: height * 0.005,
    marginTop: height * 0.005,
    // backgroundColor: 'red',
  },
  labelStyle: {
    fontWeight: '500',
    color: color.wite,
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
});
