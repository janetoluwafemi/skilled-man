import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Dimensions} from 'react-native';
import ComplteTab from './CompleteTab';
import OngoingTabs from './OngoingTab';
import AlTabs from './AllTab';
import color from '../../Assets/colors/colors';

const {height} = Dimensions.get('window');
const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 900;
const isLargeDevice = height >= 900;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const Tab = createMaterialTopTabNavigator();

const MyWrkTab = props => {
  const Complete = () => <ComplteTab {...props} />;
  const Ongoing = () => <OngoingTabs {...props} />;
  const All = () => <AlTabs {...props} />;
  //console.log(props.value, 'on my work tabs')
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: color.ylow,
        tabBarInactiveTintColor: color.defalt,

        tabBarLabelStyle: {
          fontSize: getResponsiveSize(12, 13, 14),
          fontWeight: '500',
          textTransform: 'capitalize',
        },

        tabBarStyle: {
          backgroundColor: color.bdyClr,
          elevation: 0,
          marginTop: getResponsiveSize(30, 35, 40),
          paddingVertical: getResponsiveSize(4, 6, 8),
        },

        tabBarIndicatorStyle: {
          height: 3,
          backgroundColor: color.ylow,
        },
      }}>
      <Tab.Screen
        name="Complete"
        component={Complete}
        options={{
          header: () => null,
          title: 'Complete',
          headerTitleStyle: {
            color: color.Gren,
            fontSize: 30,
            textTransform: 'lowercase',
          },
          // headerTintColor: color.Green,
        }}
      />
      <Tab.Screen
        name="Ongoing"
        component={Ongoing}
        options={{
          header: () => null,
          title: 'Ongoing',
          headerTitleStyle: {
            color: color.btnClr,
            fontSize: 30,
            textTransform: 'lowercase',
          },
          // headerTintColor: color.Green,
        }}
      />
      <Tab.Screen
        name="AllTab"
        component={All}
        options={{
          header: () => null,
          title: 'All',
          headerTitleStyle: {
            color: color.btnClr,
            fontSize: 30,
            textTransform: 'lowercase',
          },
          // headerTintColor: color.Green,
        }}
      />
    </Tab.Navigator>
  );
};

export default MyWrkTab;
