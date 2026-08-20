import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import color from '../Assets/colors/colors';
import OpningCrd from './OpeningCard';
import { BASIC_URL } from '../Screens/Signin/Signin';

const HomStakwithoutsarch = ({
                               onPress,
                               onPressnotification,
                               cardStyle,
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
      console.log('Error fetching profile data:', error);
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
          <Icon name="menu" size={35} color={color.wite} />
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
              style={styles.imgStyle}
              alt="User Avatar"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.userStyle}>
        Hi, {profileData?.name || 'User'}
      </Text>

      <OpningCrd cardStyle={[styles.openingBalanceCard, cardStyle]} />
    </View>
  );
};

export default HomStakwithoutsarch;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: color.defalt,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingBottom: 45,
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
    height: 50,
    width: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.wite,
  },
  userStyle: {
    fontSize: 15,
    fontWeight: '800',
    color: color.wite,
    marginBottom: 30,
    marginTop: 8,
  },
  openingBalanceCard: {
    position: 'absolute',
    top: '100%',
    alignSelf: 'center',
  },
});