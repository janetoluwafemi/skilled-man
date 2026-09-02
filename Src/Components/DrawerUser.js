import React, { useEffect, useState } from 'react';
import {Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,

  Platform} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import color from '../Assets/colors/colors';
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

const DrawerUser = () => {
  const navigation = useNavigation();
  const focus = useIsFocused();
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
      console.log('Error fetching drawer user data:', error);
    }
  };

  const imageUri = profileData?.profile
    ? `${BASIC_URL}uploads/${profileData?.profile}`
    : null;

  const combinedTextStyle = StyleSheet.flatten([
    styles.userName,
    { fontSize: getResponsiveSize(18, 19, 20) },
  ]);

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('account_setting')}>
      <Image
        source={
          imageUri
            ? { uri: imageUri }
            : require('../Assets/Images/user.jpg')
        }
        resizeMode="cover"
        style={styles.imgStyle}
      />
      <Text style={combinedTextStyle} numberOfLines={1}>
        {profileData?.name || 'User'}
      </Text>
    </TouchableOpacity>
  );
};

export default DrawerUser;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: color.wite,
    borderBottomWidth: 0.4,
    width: '100%',
    paddingBottom: getResponsiveSpacing(12, 14, 15),
    marginBottom: getResponsiveSpacing(8, 10, 12),
    paddingTop: getResponsiveSpacing(10, 12, 15),
  },
  userName: {
    color: color.wite,
    fontWeight: '700',
    marginTop: getResponsiveSpacing(8, 10, 12),
    textAlign: 'center',
    paddingHorizontal: getResponsiveSpacing(15, 20, 25),
  },
  imgStyle: {
    width: getResponsiveSize(80, 90, 100),
    height: getResponsiveSize(80, 90, 100),
    alignSelf: 'center',
    borderRadius: getResponsiveSize(40, 45, 50),
    borderColor: color.orng,
    borderWidth: getResponsiveSize(2.5, 3, 3.5),
  },
});