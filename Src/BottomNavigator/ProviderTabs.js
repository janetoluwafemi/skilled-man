import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import Icon, { Icons } from '../Components/Icons';
import color from '../Assets/colors/colors';
import Dshbord from '../Screens/DashBoard/Dashboard';
import MyWrk from '../Screens/MyWork/MyWork';
import ReqestScren from '../Screens/Request/Request';
import ChatScreen from '../Screens/Chat/ChatScreen';
import { BASIC_URL } from '../Screens/Signin/Signin';

const { height } = Dimensions.get('window');

const TabArr = [
  {
    route: 'DashBoard',
    label: 'Home',
    type: Icons.Ionicons,
    icon: 'home',
    component: Dshbord,
  },
  {
    route: 'MyWork',
    label: 'My Work',
    type: Icons.FontAwesome6,
    icon: 'clipboard-list',
    component: MyWrk,
  },
  {
    route: 'RequestScreen',
    label: 'Request',
    type: Icons.FontAwesome,
    icon: 'commenting-o',
    component: ReqestScren,
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

const TabBtn = ({ item, onPress, accessibilityState }) => {
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
          {(item.icon === 'commenting' || item.icon === 'commenting-o') && countUnread > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{countUnread}</Text>
            </View>
          )}

          <Icon
            type={item.type}
            name={item.icon}
            color={color.wite}
            size={27}
          />
          <Animatable.Text ref={textViewRef} style={styles.labelStyle}>
            {item.label}
          </Animatable.Text>
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
          left: 0,
          right: 0,
          paddingBottom: bottomPadding,
          paddingTop: Platform.OS === 'android' ? 8 : 0,
          backgroundColor: color.defalt,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}>
      {TabArr.map(item => (
        <Tab.Screen
          key={item.route}
          name={item.route}
          component={item.component}
          options={{
            tabBarShowLabel: false,
            tabBarButton: props => <TabBtn {...props} item={item} />,
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
    backgroundColor: color.defalt,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnStyle: {
    alignItems: 'center',
    paddingBottom: 3,
    marginTop: 5,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  activeTabBorder: {
    borderBottomWidth: 3,
    borderBottomColor: color.wite,
  },
  labelStyle: {
    fontSize: 11,
    fontWeight: '500',
    color: color.wite,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: 'red',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  badgeText: {
    color: color.wite,
    fontSize: 9,
    fontWeight: 'bold',
  },
});