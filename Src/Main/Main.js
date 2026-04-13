import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import ProviderTabs from '../BottomNavigator/ProviderTabs';
import UserTabs from '../BottomNavigator/UserTabs';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Man = () => {
  const isFocused = useIsFocused();
  const [value, setValue] = useState('');

  const gettData = async () => {
    try {
      const role = global.role || await AsyncStorage.getItem('role');
      if (role !== null) {
        setValue(role);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    gettData();
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      {value === '1' ? <UserTabs /> : value === '0' ? <ProviderTabs /> : null}
    </View>
  );
};

export default Man;
