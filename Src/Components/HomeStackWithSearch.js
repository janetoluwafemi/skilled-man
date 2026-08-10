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
import SarchInpt from './SearchInput';
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

const HomStakWSarch = ({
                         onPress,
                         onPressnotification,
                         onChangeText,
                         value,
                       }) => {
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
      console.log('Error fetching search header profile data:', error);
    }
  };

  const imageUri = profileData?.profile
    ? `${BASIC_URL}uploads/${profileData.profile}`
    : null;

  const avatarSize = getResponsiveSize(45, 48, 50);

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

        <View style={styles.rightCont}>
          <TouchableOpacity onPress={onPressnotification} activeOpacity={0.7}>
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : require('../Assets/Images/user.jpg')
              }
              resizeMode="cover"
              style={[
                styles.imgStyle,
                {
                  width: avatarSize,
                  height: avatarSize,
                },
              ]}
              alt="User Avatar"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text
        style={[
          styles.userStyle,
          { fontSize: getResponsiveSize(14, 15, 16) },
        ]}
        numberOfLines={1}>
        Hi, {profileData?.name || 'User'}
      </Text>

      <View style={styles.searchStyle}>
        <SarchInpt onChangeText={onChangeText} value={value} />
      </View>
    </View>
  );
};

export default HomStakWSarch;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: color.defalt,
    paddingHorizontal: getResponsiveSpacing(12, 15, 18),
    paddingVertical: getResponsiveSpacing(6, 8, 10),
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
  },
  menuStyle: {
    padding: 4,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});