import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProviderTabs from '../BottomNavigator/ProviderTabs';
import UserTabs from '../BottomNavigator/UserTabs';

const Man = () => {
  const isFocused = useIsFocused();
  const [value, setValue] = useState('');

  const getData = useCallback(async () => {
    try {
      const storedRole = await AsyncStorage.getItem('role');
      const role = global.role !== undefined && global.role !== null ? String(global.role) : storedRole;
      if (role !== null && role !== undefined) {
        setValue(String(role));
      }
    } catch (e) {
      console.log('Error fetching role:', e);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused, getData]);

  return (
    <View style={styles.container}>
      {value === '1' ? <UserTabs /> : value === '0' ? <ProviderTabs /> : null}
    </View>
  );
};

export default Man;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});