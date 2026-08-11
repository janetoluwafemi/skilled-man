import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import C_InputScurEntrylogin from '../../Components/C_InputSecureEntrylogin';
import BotonComp from '../../Components/BtnComp';
import { useAuth } from '../../context/AuthProvider';
import { getToken } from '../../utilis/notification';
import { Icons } from '../../Components/Icons';

let SimpleToast;
if (Platform.OS !== 'web') {
  SimpleToast = require('react-native-simple-toast').default;
}

let GoogleSignin;
if (Platform.OS !== 'web') {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
}

const showToast = msg => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(msg);
    }
  } else if (SimpleToast) {
    SimpleToast.show(msg, SimpleToast.SHORT);
  }
};

export const BASIC_URL = 'https://theskilledman.com/api/';

const Signin = props => {
  const { dispatch } = useAuth();
  const navigation = useNavigation();

  const [checked, setChecked] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [hide, setHide] = useState(true);
  const [load, setLoad] = useState(false);
  const [googleRole, setGoogleRole] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'web' && GoogleSignin) {
      GoogleSignin.configure({
        webClientId:
          '336016778121-qiriu75af7hvitlu9g67naf6hqnl7dsi.apps.googleusercontent.com',
      });
    }
  }, []);

  const handleGoogleSignInFlow = async role => {
    if (Platform.OS === 'web' || !GoogleSignin) {
      showToast('Google Sign-In is configured for Mobile devices.');
      return;
    }

    try {
      setLoad(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      const token = await getToken();

      const formdata = new FormData();
      formdata.append('identifier', userInfo.user.email);
      formdata.append('google_id', userInfo.user.id);
      formdata.append('google_token', idToken);
      formdata.append('name', userInfo.user.name);
      formdata.append('photo', userInfo.user.photo);
      formdata.append('role', role);
      formdata.append('password', 'googleuser');
      formdata.append('token', token);

      const response = await fetch(`${BASIC_URL}google_login.php`, {
        method: 'POST',
        body: formdata,
      });
      const result = await response.json();

      if (result.success) {
        await AsyncStorage.setItem('user', JSON.stringify(result));
        await AsyncStorage.setItem('role', role.toString());
        dispatch({ type: 'LOGIN', payload: { user: result, role } });
        navigation.navigate('Parent');
      } else {
        showToast(result.error || 'Google Login Failed');
      }
    } catch (error) {
      showToast('Google Sign-In Error');
    } finally {
      setLoad(false);
    }
  };

  const handleSignIn = async () => {
    if (!userName.trim() || !password.trim()) {
      showToast('Please enter all required fields');
      return;
    }

    const token = await getToken();
    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('identifier', userName.trim());
      formdata.append('password', password);
      formdata.append('token', token);

      const response = await fetch(`${BASIC_URL}google_login.php`, {
        method: 'POST',
        body: formdata,
      });
      const result = await response.json();

      if (result && !result.error) {
        await AsyncStorage.setItem('user', JSON.stringify(result));
        await AsyncStorage.setItem('role', result.role.toString());
        dispatch({ type: 'LOGIN', payload: { user: result, role: result.role } });
        navigation.navigate('Parent');
      } else {
        showToast('Invalid credentials, please try again');
      }
    } catch (error) {
      showToast('Something went wrong. Check connection.');
    } finally {
      setLoad(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>

          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../Assets/Images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to access your account</Text>

          <View style={styles.cardWrapper}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email or Phone Number</Text>
              <C_TxtInput
                placeholder="name@example.com or phone"
                onChangeText={setUserName}
                value={userName}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <C_InputScurEntrylogin
                placeholder="••••••••"
                secureTextEntry={hide}
                onChangeText={setPassword}
                value={password}
                onPress={() => setHide(!hide)}
              />
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.checkboxWrapper}
                onPress={() => setChecked(!checked)}>
                <View style={[styles.customCheckbox, checked && styles.customCheckboxActive]}>
                  {checked && <Icons.Feather name="check" size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotLink}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <BotonComp
              BtnStyle={styles.submitBtn}
              btnText={
                load ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  'Sign In'
                )
              }
              onPressFunc={handleSignIn}
            />
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.googleRoleLabel}>Account Type for Google Sign-In</Text>
          <View style={styles.segmentContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setGoogleRole(0)}
              style={[styles.segmentBtn, googleRole === 0 && styles.segmentActive]}>
              <Icons.FontAwesome5
                name="user"
                size={13}
                color={googleRole === 0 ? color.defalt : '#64748B'}
                style={styles.segmentIcon}
              />
              <Text style={[styles.segmentText, googleRole === 0 && styles.segmentTextActive]}>
                User
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setGoogleRole(1)}
              style={[styles.segmentBtn, googleRole === 1 && styles.segmentActive]}>
              <Icons.FontAwesome5
                name="briefcase"
                size={13}
                color={googleRole === 1 ? color.defalt : '#64748B'}
                style={styles.segmentIcon}
              />
              <Text style={[styles.segmentText, googleRole === 1 && styles.segmentTextActive]}>
                Provider
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleGoogleSignInFlow(googleRole.toString())}
            style={styles.googleBtn}>
            <Icons.FontAwesome name="google" size={18} color="#DB4437" />
            <Text style={styles.googleBtnText}>
              Continue with Google ({googleRole === 0 ? 'User' : 'Provider'})
            </Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  backArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  logoImage: {
    width: 52,
    height: 52,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 4,
  },

  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  customCheckboxActive: {
    backgroundColor: color.defalt,
    borderColor: color.defalt,
  },
  checkboxText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: '700',
    color: color.defalt,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    paddingHorizontal: 12,
  },

  googleRoleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 3,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  segmentIcon: {
    marginRight: 6,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: color.defalt,
    fontWeight: '700',
  },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  googleBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  footerLink: {
    color: color.defalt,
    fontSize: 14,
    fontWeight: '700',
  },
});