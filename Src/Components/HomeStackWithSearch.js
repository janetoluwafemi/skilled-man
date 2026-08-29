import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../Assets/colors/colors';
import SarchInpt from './SearchInput';
import { BASIC_URL } from '../Screens/Signin/Signin';

const HomeStackWithSearch = ({
                               onPress,
                               onPressnotification,
                               onChangeText,
                               value,
                               headerTitle = 'Dashboard',
                             }) => {
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [profileData, setProfileData] = useState(null);

  const getProfileData = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const userObj = storedUser ? JSON.parse(storedUser) : null;
      const userId = global.id || userObj?.id || '255';

      const response = await fetch(`${BASIC_URL}user/get_profile.php?id=${userId}`, {
        method: 'GET',
      });

      const result = await response.json();
      if (result) {
        setProfileData(result);
      }
    } catch (error) {
      console.log('Error fetching search header profile data:', error);
    }
  }, []);

  useEffect(() => {
    if (focus) {
      getProfileData();
    }
  }, [focus, getProfileData]);

  const imageUri = profileData?.profile
    ? `${BASIC_URL}uploads/${profileData.profile}`
    : null;

  return (
    <View
      style={[
        styles.headerWrapper,
        {
          paddingTop: Math.max(
            insets.top + 6,
            Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 14
          ),
        },
      ]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={color.defalt}
        translucent={false}
      />

      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={onPress}
          style={styles.iconCircleBtn}
          activeOpacity={0.7}>
          <Icon name="menu" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPressnotification}
          activeOpacity={0.8}
          style={styles.avatarBorderWrap}>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require('../Assets/Images/user.jpg')
            }
            resizeMode="cover"
            style={styles.avatarImg}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.greetingContainer}>
        <Text style={styles.userNameText} numberOfLines={1}>
          {headerTitle}
        </Text>
      </View>

      <View style={styles.searchCardContainer}>
        <SarchInpt onChangeText={onChangeText} value={value} />
      </View>
    </View>
  );
};

export default HomeStackWithSearch;

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: color.defalt,
    paddingHorizontal: 18,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }
      : {
        elevation: 4,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      }),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBorderWrap: {
    padding: 2,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  avatarImg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  greetingContainer: {
    marginTop: 12,
    marginBottom: 14,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  searchCardContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
});