import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../Assets/colors/colors';
import InputSarchFiltr from './InputSearchFilter';
import { Icons } from './Icons';
import { BASIC_URL } from '../Screens/Signin/Signin';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DrarTitlProfilHeader = ({
                                onPress,
                                onPressNotifiction,
                                onPressProfile,
                                bellIcon = 'bell',
                                titleText = 'Booked Services',
                                onChangeText,
                                value,
                                toggleModal,
                                screen,
                              }) => {
  const navigation = useNavigation();
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
      console.log('Error fetching profile data:', error);
    }
  }, []);

  useEffect(() => {
    if (focus) {
      getProfileData();
    }
  }, [focus, getProfileData]);

  const imageUri =
    profileData?.profile &&
    typeof profileData.profile === 'string' &&
    profileData.profile.trim() !== ''
      ? `${BASIC_URL}uploads/${profileData.profile}`
      : null;

  const handleNotificationPress = () => {
    if (onPressNotifiction) {
      onPressNotifiction();
    } else {
      navigation.navigate('notification_screen');
    }
  };

  const handleProfilePress = () => {
    if (onPressProfile) {
      onPressProfile();
    } else {
      navigation.navigate('editUserProfile');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(
            insets.top,
            Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 4 : 8
          ),
        },
      ]}>
      <StatusBar barStyle="light-content" backgroundColor={color.defalt} />

      <View style={styles.topRow}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.iconBtn}>
          <Icon name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity
            onPress={handleNotificationPress}
            activeOpacity={0.7}
            style={styles.iconBtn}>
            <Icons.Feather name={bellIcon || 'bell'} size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleProfilePress}
            activeOpacity={0.8}
            style={styles.avatarWrap}>
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
      </View>

      <Text style={styles.titleText}>{titleText}</Text>

      <View style={styles.searchWrapper}>
        <InputSarchFiltr
          onChangeText={onChangeText}
          value={value}
          toggleModal={toggleModal}
          screen={screen}
        />
      </View>
    </View>
  );
};

export default DrarTitlProfilHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.defalt,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 4,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  searchWrapper: {
    width: '100%',
  },
});