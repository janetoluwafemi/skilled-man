import React, { useEffect, useState } from 'react';
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
import { useIsFocused } from '@react-navigation/native';

import color from '../Assets/colors/colors';
import { Icons } from './Icons';
import OpningCrd from './OpeningCard';
import { BASIC_URL } from '../Screens/Signin/Signin';

const HomStakwithoutsarch = ({
                               onPress,
                               onPressnotification,
                               cardStyle,
                               showOpeningCard = false,
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
      ? `${BASIC_URL}uploads/${profileData?.profile}`
      : null;

  const dynamicPaddingTop =
      Math.max(
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
            backgroundColor={color.defalt}
            translucent={false}
        />
        <View style={styles.topCont}>
          <View style={styles.leftSection}>
            <TouchableOpacity
                onPress={onPress}
                style={styles.menuStyle}
                activeOpacity={0.7}>
              {Icons?.Feather ? (
                  <Icons.Feather name="menu" size={20} color="#FFFFFF" />
              ) : (
                  <Text style={styles.fallbackIconText}>☰</Text>
              )}
            </TouchableOpacity>

            <View style={styles.userGreetingCol}>
              <Text style={styles.greetingSubtitle}>Welcome back</Text>
              <Text style={styles.userStyle} numberOfLines={1}>
                Hi, {profileData?.name || 'Janet Oluwafemi'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
              onPress={onPressnotification}
              activeOpacity={0.8}
              style={styles.avatarButton}>
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
            <View style={styles.onlineBadge} />
          </TouchableOpacity>
        </View>

        {showOpeningCard && (
            <OpningCrd
                cardStyle={StyleSheet.flatten([styles.openingBalanceCard, cardStyle])}
            />
        )}
      </View>
  );
};

export default HomStakwithoutsarch;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: color.defalt,
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    ...(Platform.OS === 'web'
        ? { boxShadow: '0 8px 24px rgba(192, 122, 80, 0.25)' }
        : {
          elevation: 5,
          shadowColor: color.defalt,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
        }),
  },
  topCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  menuStyle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userGreetingCol: {
    flex: 1,
  },
  greetingSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  userStyle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  avatarButton: {
    position: 'relative',
  },
  imgStyle: {
    height: 44,
    width: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#E2E8F0',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: color.defalt,
  },
  openingBalanceCard: {
    position: 'absolute',
    top: '100%',
    alignSelf: 'center',
  },
  fallbackIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});