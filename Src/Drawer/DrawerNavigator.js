import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CstmDrar from './CustomDrawer';
import Man from '../Main/Main';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={props => <CstmDrar {...props} />}>
      <Drawer.Screen name="Main" component={Man} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;