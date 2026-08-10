import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';

import ComplteTab from './CompleteTab';
import OngoingTabs from './OngoingTab';
import AlTabs from './AllTab';
import color from '../../Assets/colors/colors';

const { height } = Dimensions.get('window');
const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 900;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const Tab = createMaterialTopTabNavigator();

const MyWrkTab = props => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: color.ylow,
        tabBarInactiveTintColor: color.defalt,
        tabBarLabelStyle: {
          fontSize: getResponsiveSize(12, 13, 14),
          fontWeight: '600',
          textTransform: 'capitalize',
        },
        tabBarStyle: {
          backgroundColor: color.bdyClr,
          elevation: 0,
          marginTop: getResponsiveSize(20, 25, 30),
          paddingVertical: getResponsiveSize(4, 6, 8),
        },
        tabBarIndicatorStyle: {
          height: 3,
          backgroundColor: color.ylow,
        },
      }}>
      <Tab.Screen name="Complete" options={{ title: 'Complete' }}>
        {() => <ComplteTab {...props} />}
      </Tab.Screen>

      <Tab.Screen name="Ongoing" options={{ title: 'Ongoing' }}>
        {() => <OngoingTabs {...props} />}
      </Tab.Screen>

      <Tab.Screen name="AllTab" options={{ title: 'All' }}>
        {() => <AlTabs {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MyWrkTab;