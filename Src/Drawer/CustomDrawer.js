import {View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Platform} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import color from '../Assets/colors/colors';
import LinearGradient from 'react-native-linear-gradient';
import DrarCstmBtn from '../Components/DrawerCustomBtn';
import DrarUsr from '../Components/DrawerUser';
import {useAuth} from '../context/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;
const isLargeDevice = SCREEN_HEIGHT >= 900;

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

const CstmDrar = () => {
  const {state, dispatch} = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const logOut = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('role');
    dispatch({type: 'LOGOUT'});
    signOutGoogle();
    //navigation.closeDrawer();
    navigation.navigate('Signin');
  };
  const signOutGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('🧹 Signed out and access revoked');
    } catch (error) {
      console.error('❌ Sign-out error', error);
    }
  };
  //const [userInfo, setUserInfo] = useState(null);
  // const _signOut = async () => {
  //   try {
  //     const isSignedIn = await GoogleSignin.isSignedIn();

  //     if (isSignedIn) {
  //       await GoogleSignin.revokeAccess();
  //       await GoogleSignin.signOut();
  //       setUserInfo(null); // Reset the user info state
  //       // Add any additional cleanup or logout logic here
  //     } else {
  //       console.log('User is not signed in.');
  //     }
  //   } catch (error) {
  //     console.error('Error signing out', error);
  //   }
  // };

  return (
    <LinearGradient
      colors={['#c07a50', '#bc7950', '#f3a260']}
      style={[
        styles.linearGradientStyle,
        {paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 0 : 0)}
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

          {global.role == 0 ? (
            <DrarCstmBtn
              DrawerBtnPress={() => navigation.navigate('HistoryScreen')}
              title="History"
              drawerIcon="history"
            />
          ) : (
            <DrarCstmBtn
              DrawerBtnPress={() => navigation.navigate('UserHistory')}
              title="History"
              drawerIcon="history"
            />
          )}

          <DrarCstmBtn
            DrawerBtnPress={() => navigation.navigate('account_setting')}
            title="Setting"
            drawerIcon="cog"
          />
        </View>
      </ScrollView>

      <View style={[
        styles.logoutStyle,
        {paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0)}
      ]}>
        <DrarCstmBtn
          title="Logout"
          drawerIcon="sign-out"
          DrawerBtnPress={() => {
            logOut();
          }}
        />
      </View>
    </LinearGradient>
  );
};

export default CstmDrar;

const styles = StyleSheet.create({
  containerStyle: {},
  contStyle: {
    color: color.wite,
  },
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
  accSet: {
    borderTopWidth: 0.4,
    borderTopColor: color.wite,
    borderBottomColor: color.wite,
    borderBottomWidth: 0.4,
    width: '100%',
    marginVertical: getResponsiveSpacing(8, 10, 12),
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
