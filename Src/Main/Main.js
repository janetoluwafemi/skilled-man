import React, { useState, useEffect, useCallback } from 'react';
import {View, StyleSheet, ActivityIndicator ,
  Platform} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProviderTabs from '../BottomNavigator/ProviderTabs';
import UserTabs from '../BottomNavigator/UserTabs';

const Main = () => {
  const isFocused = useIsFocused();
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    try {
      const storedRole = await AsyncStorage.getItem('role');
      const role = global.role !== undefined && global.role !== null ? String(global.role) : storedRole;

      if (role !== null && role !== undefined) {
        setValue(String(role));
      } else {
        setValue('0');
      }
    } catch (e) {
      console.log('Error fetching role:', e);
      setValue('0');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused, getData]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {value === '1' ? <ProviderTabs /> : <UserTabs />}
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});