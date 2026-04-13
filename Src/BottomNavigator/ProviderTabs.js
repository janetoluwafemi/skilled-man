import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Dimensions, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon, {Icons} from '../Components/Icons';
import * as Animatable from 'react-native-animatable';
import color from '../Assets/colors/colors';
import Dshbord from '../Screens/DashBoard/Dashboard';
import LinearGradient from 'react-native-linear-gradient';
import MyWrk from '../Screens/MyWork/MyWork';
import ReqestScren from '../Screens/Request/Request';
import ChatScreen from '../Screens/Chat/ChatScreen';

const {height} = Dimensions.get('window');

const TabArr = [
  {
    route: 'DashBoard',
    label: 'Home',
    type: Icons.Ionicons,
    icon: 'home',
    component: Dshbord,
    color: color.drkgren,
    alphaClr: color.wite,
  },
  {
    route: 'MyWork',
    label: 'My Work',
    type: Icons.FontAwesome6,
    icon: 'clipboard-list',
    component: MyWrk,
    color: color.drkgren,
    alphaClr: color.wite,
  },

  {
    route: 'RequestScreen',
    label: 'Request',
    type: Icons.FontAwesome,
    icon: 'commenting-o',
    component: ReqestScren,
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

const TabBtn = props => {
  const {item, onPress, accessibilityState} = props;
  const focused = accessibilityState?.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);
  const [getChat, setALlChat] = useState([]);
  const [countunread, setCountUnread] = useState(0);

  useEffect(() => {
    if (focused) {
      // 0.3: { scale: .7 }, 0.5: { scale: .3 }, 0.8: { scale: .7 },
      viewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
      textViewRef.current.animate({0: {scale: 0}, 1: {scale: 1}});
    } else {
      viewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
      textViewRef.current.animate({0: {scale: 1}, 1: {scale: 0}});
    }
  }, [focused]);

  const gellAllChat = async () => {
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
      console.log('error in get allchat');
    }
  };

  const totalunread = () => {
    let unread = getChat.reduce((total, item) => total + item.unread_count, 0);
    setCountUnread(unread);
    console.log('unread count', unread);
  };
  console.log('Final Unread Count', countunread);
  useEffect(() => {
    gellAllChat();
    totalunread();
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, {flex: focused ? 1 : 1}]}>
      <View>
        <Animatable.View
          ref={viewRef}
          style={[StyleSheet.absoluteFillObject]}
        />
        <View
          style={[
            styles.btnStyle,
            {backgroundColor: focused ? 'transparent' : item.white},
            {borderBottomWidth: focused ? 3 : 0},
            {borderBottomColor: focused ? color.wite : 'transparent'},
          ]}>
          {item.icon == 'commenting-o' && countunread > 0 ? (
            <>
              <View
                style={[
                  styles.noOfMsg,
                  {
                    position: 'absolute',
                    bottom: 31,
                    zIndex: 99,
                    right: -5,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <Text>{countunread}</Text>
              </View>

              <Icon
                type={item.type}
                name={item.icon}
                color={focused ? color.wite : color.wite}
                size={27}
              />
            </>
          ) : (
            <Icon
              type={item.type}
              name={item.icon}
              color={focused ? color.wite : color.wite}
              size={27}
            />
          )}
          <Text style={styles.labelStyle}>{item.label}</Text>
          <Animatable.View ref={textViewRef}></Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ProviderTabs() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = height * 0.085;
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0);
  const totalTabHeight = tabBarHeight + bottomPadding;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
            colors={[color.lnTpClr, color.lnMdClr]}
            style={{flex: 1}}></LinearGradient>
        ),
      }}>
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => <TabBtn {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.defalt,
    width: '100%',
  },
  btnStyle: {
    alignItems: 'center',
    paddingBottom: 3,
    marginTop: 5,
  },
  labelStyle: {
    fontSize: 11,
    fontWeight: '500',
    color: color.wite,
  },
  noOfMsg: {
    backgroundColor: 'red',
    color: color.wite,
    // position: "absolute",
    fontSize: 7,
  },
});
