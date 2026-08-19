// import {View, Text} from 'react-native';
// import React from 'react';
// import DrawerNavigator from '../Drawer/DrawerNavigator';
//
// const Parent = () => {
//   return (
//     <View style={{flex: 1}}>
//       <DrawerNavigator />
//     </View>
//   );
// };
//
// export default Parent;


import { View, StyleSheet } from 'react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigator from '../Drawer/DrawerNavigator';

const Parent = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <DrawerNavigator />
    </GestureHandlerRootView>
  );
};

export default Parent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});