import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import color from '../Assets/colors/colors';
import DrarCstmBtn from '../Components/DrawerCustomBtn';
import DrarUsr from '../Components/DrawerUser';
import { useAuth } from '../context/AuthProvider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;

const getGoogleSignin = () => {
  if (Platform.OS === 'web') return null;

  try {
    return require('@react-native-google-signin/google-signin').GoogleSignin;
  } catch (error) {
    return null;
  }
};

const getResponsiveSpacing = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const CstmDrar = () => {
  const { dispatch } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const signOutGoogle = async () => {
    try {
      const GoogleSignin = getGoogleSignin();
      if (!GoogleSignin) return;

      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.log('Google Sign-out error:', error);
    }
  };

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('role');
      dispatch({ type: 'LOGOUT' });
      await signOutGoogle();
      navigation.navigate('Signin');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const isArtisanRole = global.role === 0 || global.role === '0';

  return (
    <LinearGradient
      colors={['#c07a50', '#bc7950', '#f3a260']}
      style={[
        styles.linearGradientStyle,
        { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 0 : 0) },
      ]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <DrarUsr />
        <View style={styles.menuContainer}>
          <DrarCstmBtn
            DrawerBtnPress={() => navigation.navigate('Dshbord')}
            title="Dashboard"
            drawerIcon="th-large"
          />
          <DrarCstmBtn
            DrawerBtnPress={() => navigation.navigate('AboutUs')}
            title="About Us"
            drawerIcon="info-circle"
          />
          <DrarCstmBtn
            DrawerBtnPress={() => navigation.navigate('privacy_policy')}
            title="Privacy Policy"
            drawerIcon="file-powerpoint-o"
          />
          <DrarCstmBtn
            DrawerBtnPress={() => navigation.navigate('terms_condidtions')}
            title="Terms & Conditions"
            drawerIcon="file-powerpoint-o"
          />

          <DrarCstmBtn
            DrawerBtnPress={() =>
              navigation.navigate(isArtisanRole ? 'HistoryScreen' : 'UserHistory')
            }
            title="History"
            drawerIcon="history"
          />

          <DrarCstmBtn
            DrawerBtnPress={() => navigation.navigate('account_setting')}
            title="Setting"
            drawerIcon="cog"
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.logoutStyle,
          { paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) },
        ]}>
        <DrarCstmBtn
          title="Logout"
          drawerIcon="sign-out"
          DrawerBtnPress={logOut}
        />
      </View>
    </LinearGradient>
  );
};

export default CstmDrar;

const styles = StyleSheet.create({
  linearGradientStyle: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: getResponsiveSpacing(80, 90, 100),
  },
  menuContainer: {
    paddingTop: getResponsiveSpacing(5, 10, 15),
  },
  logoutStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    borderTopWidth: 0.4,
    borderTopColor: color.wite,
    backgroundColor: 'transparent',
  },
});
