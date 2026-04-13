import {View, Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();
import CstmDrar from './CustomDrawer';
import Man from '../Main/Main';
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <CstmDrar {...props} />}>
      <Drawer.Screen
        name="Main"
        component={Man}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
