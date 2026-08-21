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
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../Assets/colors/colors';
import InputSarchFiltr from './InputSearchFilter';
import { Icons } from './Icons';
import { BASIC_URL } from '../Screens/Signin/Signin';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const getResponsiveSpacing = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const HeaderWSarchFiltr = ({
                             onPress,
                             onPressNotifiction,
                             onPressProfile,
                             bellIcon = 'bell-outline',
                             titleText,
                             onChangeText,
                             value,
                             toggleModal,
                             screen,
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
      console.log('Error fetching profile data:', error);
    }
  }, []);

  useEffect(() => {
    if (focus) {
      getProfileData();
    }
  }, [focus, getProfileData]);

  const imageUri =
    profileData?.profile && typeof profileData.profile === 'string' && profileData.profile.trim() !== ''
      ? `${BASIC_URL}uploads/${profileData.profile}`
      : null;

  const avatarSize = getResponsiveSize(45, 48, 50);

  const containerStyleCombined = StyleSheet.flatten([
    styles.containerStyle,
    {
      paddingTop: Math.max(
        insets.top,
        Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0
      ),
    },
  ]);

  const imageStyleCombined = StyleSheet.flatten([
    styles.imgStyle,
    {
      width: avatarSize,
      height: avatarSize,
    },
  ]);

  const titleStyleCombined = StyleSheet.flatten([
    styles.userStyle,
    { fontSize: getResponsiveSize(15, 16, 17) },
  ]);

  const BellIconComponent = Icons?.MaterialCommunityIcons;

  return (
    <View style={containerStyleCombined}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={color.defalt}
        translucent={false}
      />

      <View style={styles.topCont}>
        <TouchableOpacity
          onPress={onPress}
          style={styles.menuStyle}
          activeOpacity={0.7}>
          <Icon
            name="menu"
            size={getResponsiveSize(30, 33, 35)}
            color={color.wite}
          />
        </TouchableOpacity>

        <View style={styles.rightCont}>
          {bellIcon && BellIconComponent ? (
            <TouchableOpacity
              onPress={onPressNotifiction}
              style={styles.menuStyle}
              activeOpacity={0.7}>
              <BellIconComponent
                name={bellIcon}
                size={getResponsiveSize(26, 28, 30)}
                color={color.wite}
                style={styles.bellStyle}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={onPressProfile} activeOpacity={0.7}>
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : require('../Assets/Images/user.jpg')
              }
              resizeMode="cover"
              style={imageStyleCombined}
            />
          </TouchableOpacity>
        </View>
      </View>

      {titleText ? (
        <Text style={titleStyleCombined} numberOfLines={1}>
          {titleText}
        </Text>
      ) : null}

      <View style={styles.searchStyle}>
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

export default HeaderWSarchFiltr;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: color.defalt,
    paddingHorizontal: getResponsiveSpacing(12, 15, 18),
    paddingVertical: getResponsiveSpacing(10, 12, 15),
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingBottom: getResponsiveSpacing(25, 30, 35),
    minHeight: getResponsiveSpacing(140, 160, 180),
  },
  topCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 8 : 4,
  },
  rightCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  menuStyle: {
    padding: 4,
  },
  bellStyle: {
    marginRight: getResponsiveSpacing(8, 10, 12),
  },
  imgStyle: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.wite,
  },
  userStyle: {
    fontWeight: '800',
    color: color.wite,
    marginTop: getResponsiveSpacing(8, 10, 12),
    marginBottom: getResponsiveSpacing(15, 20, 25),
  },
  searchStyle: {
    position: 'absolute',
    bottom: getResponsiveSpacing(-20, -25, -30),
    alignSelf: 'center',
    width: '95%',
    maxWidth: SCREEN_WIDTH - 30,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }
      : {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }),
  },
});