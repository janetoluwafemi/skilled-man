import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Image } from 'native-base';
import { useIsFocused } from '@react-navigation/native';

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
    ? `${BASIC_URL}uploads/${profileData.profile}`
    : null;

  return (
    <View
      style={[
        styles.containerStyle,
        {
          paddingTop: Math.max(
            insets.top,
            Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0
          ),
        },
      ]}>
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

        <Text
          style={[
            styles.userStyle,
            { fontSize: getResponsiveSize(14, 15, 16) },
          ]}
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
            style={[
              styles.imgStyle,
              {
                width: getResponsiveSize(45, 48, 50),
                height: getResponsiveSize(45, 48, 50),
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DrarTitlProfilHeader;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: color.defalt,
    paddingHorizontal: getResponsiveSpacing(12, 15, 18),
    paddingVertical: getResponsiveSpacing(10, 12, 15),
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  topCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 8 : 4,
  },
  userStyle: {
    fontWeight: '800',
    color: color.wite,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: getResponsiveSpacing(10, 15, 20),
  },
  imgStyle: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.wite,
  },
  menuStyle: {
    padding: 4,
  },
});