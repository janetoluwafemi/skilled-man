import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import HomStakWSarch from '../../Components/HomeStackWithSearch';
import MyWrkTab from './AllTabs';

const MyWork = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <HomStakWSarch
        onPress={() => navigation.openDrawer()}
        onPressnotification={() => navigation.navigate('edit_profile')}
        onChangeText={val => setSearchTerm(val)}
        value={searchTerm}
        headerTitle="Lists Of Jobs"
      />
      <View style={styles.tabWrapper}>
        <MyWrkTab value={searchTerm} />
      </View>
    </SafeAreaView>
  );
};

export default MyWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabWrapper: {
    flex: 1,
    paddingTop: 6,
  },
});