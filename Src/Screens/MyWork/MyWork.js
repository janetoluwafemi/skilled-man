import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import HomStakWSarch from '../../Components/HomeStackWithSearch';
import MyWrkTab from './AllTabs';

const MyWrk = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HomStakWSarch
        onPress={() => navigation.openDrawer()}
        onPressnotification={() => navigation.navigate('edit_profile')}
        onChangeText={val => setSearchTerm(val)}
        value={searchTerm}
      />
      <View style={styles.tabWrapper}>
        <MyWrkTab value={searchTerm} />
      </View>
    </SafeAreaView>
  );
};

export default MyWrk;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  tabWrapper: {
    flex: 1,
    paddingTop: 10,
  },
});