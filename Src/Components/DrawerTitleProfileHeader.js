import React, { useEffect, useState } from 'react';
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
import { useIsFocused } from '@react-navigation/native';

import color from '../Assets/colors/colors';
import { Icons } from './Icons';
import { BASIC_URL } from '../Screens/Signin/Signin';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
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

const DrarTitlProfilHeader = ({ screenTitle, onPress, userProfile }) => {
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (focus) {
      getProfileData();
    }
  }, [focus]);

  const getProfileData = async () => {
    try {
      const formdata = new FormData();
      formdata.append('id', global.id);

      const response = await fetch(`${BASIC_URL}user/get_profile.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result) {
        setProfileData(result);
      }
    } catch (error) {
      console.log('Error fetching header profile data:', error);
    }
  };

  const imageUri = profileData?.profile
    ? `${BASIC_URL}uploads/${profileData?.profile}`
    : null;

  const dynamicPaddingTop = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0
  ) + (Platform.OS === 'ios' ? 8 : 12);

  return (
    <View
      style={StyleSheet.flatten([
        styles.containerStyle,
        { paddingTop: dynamicPaddingTop },
      ])}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={color.btnClr}
        translucent={false}
      />
      <View style={styles.topCont}>
        <TouchableOpacity
          onPress={onPress}
          style={styles.menuStyle}
          activeOpacity={0.7}>
          {Icons?.Feather ? (
            <Icons.Feather
              name="menu"
              size={getResponsiveSize(20, 22, 24)}
              color={color.wite}
            />
          ) : (
            <Text style={styles.fallbackIconText}>☰</Text>
          )}
        </TouchableOpacity>

        <Text
          style={StyleSheet.flatten([
            styles.userStyle,
            { fontSize: getResponsiveSize(15, 16, 17) },
          ])}
          numberOfLines={1}>
          {screenTitle}
        </Text>

        <TouchableOpacity onPress={userProfile} activeOpacity={0.7}>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require('../Assets/Images/user.jpg')
            }
            resizeMode="cover"
            alt="User Avatar"
            style={StyleSheet.flatten([
              styles.imgStyle,
              {
                width: getResponsiveSize(40, 44, 46),
                height: getResponsiveSize(40, 44, 46),
              },
            ])}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DrarTitlProfilHeader;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: color.btnClr,
    paddingHorizontal: getResponsiveSpacing(14, 18, 20),
    paddingBottom: getResponsiveSpacing(14, 16, 18),
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 6px 20px rgba(32, 30, 82, 0.12)' }
      : {
        elevation: 5,
        shadowColor: color.btnClr,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      }),
  },
  topCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 6 : 4,
  },
  menuStyle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userStyle: {
    fontWeight: '800',
    color: color.wite,
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginHorizontal: getResponsiveSpacing(10, 14, 18),
  },
  imgStyle: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: color.ylow,
    backgroundColor: '#FFFFFF',
  },
  fallbackIconText: {
    color: color.wite,
    fontSize: 18,
    fontWeight: '700',
  },
});