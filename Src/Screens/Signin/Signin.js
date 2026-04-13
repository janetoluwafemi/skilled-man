import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  ScrollView,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import C_TxtInput from '../../Components/C_TextInput';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import {Checkbox} from 'react-native-paper';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import {useSelector, useDispatch} from 'react-redux';

// Responsive dimensions
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;
const isLargeDevice = SCREEN_HEIGHT >= 900;

// Responsive font sizes
const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

// Responsive spacing
const getResponsiveSpacing = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

import * as yup from 'yup';
import {useAuth} from '../../context/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import C_InputScurEntrylogin from '../../Components/C_InputSecureEntrylogin';
import {getToken} from '../../utilis/notification';
import GooglButon from '../../Components/GoogelBtn';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// import Modal from 'react-native-modal';

export const BASIC_URL = 'https://theskilledman.com/api/';
//export const BASE_URL='https://fisdemoprojects.com/skilledman/api/';

const SignupValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please Enter Your  Email')
    .matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, 'Please enter valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(10, 'Password must be at least 10 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
    ),
});

const Signin = props => {
  const {state, dispatch, signinGoogle} = useAuth();
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(false);
  const [userName, setuserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [hide, setHide] = React.useState(true);
  const [load, setLoad] = React.useState(false);
  const [isSwitchOn, setIsEnabled] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);
  const [userInfo, setuserInfo] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userRole, setUserRole] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const isValidEmail = text =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i.test(text);

  const isValidPhone = text => /^\d{10,15}$/.test(text); // no "+" required

  const isValidInput = text => isValidEmail(text) || isValidPhone(text);

  const isPossiblyPhone = text => /^\d+$/.test(text); // all digits

  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo, 'userinfo');
      setuserInfo(userInfo); // Store userInfo
      return userInfo; // Return userInfo
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Google Sign-In Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Google Sign-In in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        Alert.alert('Google Sign-In Error', error.message);
      }
      return null; // Return null to indicate failure
    }
  };

  const _signOut = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();

      if (isSignedIn) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setuserInfo(null);
        console.log('User signed out.');
      } else {
        console.log('User is not signed in.');
      }
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const handleGoogleSignInFlow = async selectedRole => {
    await setUserRole(selectedRole);
    console.log('UserRole set to:', selectedRole);
    setModalVisible(false);

    const googleUserInfo = await _signIn();
    if (googleUserInfo) {
      const googleUserName = googleUserInfo?.user?.name;
      const googleUserEmail = googleUserInfo?.user?.email;
      const googleUserPhoto = googleUserInfo?.user?.photo;

      console.log('Google User Name:', googleUserName);
      console.log('Google User Email:', googleUserEmail);
      console.log('Google User Photo:', googleUserPhoto);

      if (googleUserName && googleUserEmail && googleUserPhoto) {
        global.Firstname = googleUserName;
        global.email = googleUserEmail;
        global.profile = googleUserPhoto;
        console.log('Global Firstname set to:', global.Firstname);
      }

      await SigninGoogle(googleUserInfo, selectedRole);
    } else {
      console.log('Google Sign-In failed, not calling SigninGoogle');
    }
    // Importantly, we don't automatically sign out here.
    // The user initiated a sign-in, and we've processed it.
  };

  const SigninGoogle = async (userInfo, role) => {
    try {
      const token = await getToken(); // 🔸 Get device token
      const {idToken} = await GoogleSignin.getTokens();
      const {name, email, id, photo} = userInfo.user;

      // ✅ Prepare form data
      const formdata = new FormData();
      formdata.append('identifier', email);
      formdata.append('google_id', id);
      formdata.append('google_token', idToken);
      formdata.append('name', name);
      formdata.append('photo', photo);
      formdata.append('role', role); // '0' = provider, '1' = user
      formdata.append('password', 'googleuser');
      formdata.append('token', token);

      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${BASIC_URL}google_login.php`, {
        method: 'POST',
        body: formdata,
        signal: controller.signal,
        // Don't set Content-Type header - FormData will set it automatically with boundary
      }).finally(() => {
        clearTimeout(timeoutId);
      });

      const rawText = await response.text();
      console.log('📦 Raw server response:', rawText);

      let result;
      try {
        result = rawText ? JSON.parse(rawText) : {};
      } catch (err) {
        console.error('❌ JSON Parse Error:', err);
        Alert.alert('Server Error', 'Invalid response from server.');

        // 🔁 Force sign-out on bad server response
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        return;
      }

      console.log('✅ Backend Login Result:', result);

      if (result.success && (result.role === '0' || result.role === '1')) {
        // ✅ Valid login
        await AsyncStorage.setItem('user', JSON.stringify(result));
        await AsyncStorage.setItem('role', role);

        dispatch({type: 'LOGIN', payload: {user: result, role}});

        // Set global vars
        global.email = result.email;
        global.id = result.id;
        global.name = result.name;
        global.phone_number = result.phone_number;
        global.address = result.address;
        global.state = result.state;
        global.whatsapp = result.whatsapp;
        global.role = result.role;
        global.working_experience = result.working_experience;
        global.profile = result.profile;

        navigation.navigate('Parent');
      } else {
        Alert.alert('Login Failed', result.error || 'Unknown error');

        // 🔁 Sign out of Google so user can pick a different account next time
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          console.log('🔁 Google account revoked & signed out after failure.');
        } catch (signOutError) {
          console.error('❌ Error signing out of Google:', signOutError);
        }
      }
    } catch (error) {
      console.error('❌ Google Sign-In Error:', error);
      
      // Handle different types of errors
      let errorMessage = 'An unexpected error occurred';
      
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (error.message?.includes('Network request failed') || error.message?.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'Unable to connect to server. Please try again later.';
      }

      Alert.alert('Google Sign-In Error', errorMessage);

      // 🔁 Also revoke access on unexpected sign-in error
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (signOutError) {
        console.error('❌ Error signing out of Google:', signOutError);
      }
    }
  };

  const handleSignIn = async values => {
    const token = await getToken();

    try {
      setLoad(true);

      const myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=repq4egpdnsd7ikh50kjova7jd');

      const formdata = new FormData();

      const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i.test(
        values.emailOrPhone,
      );
      const isPhone = /^\d{10,15}$/.test(values.emailOrPhone);

      if (isEmail || isPhone) {
        formdata.append('identifier', values.emailOrPhone); // ✅ unified key
      } else {
        Toast.show('Please enter a valid email or phone number');
        setLoad(false);
        return;
      }

      formdata.append('password', values.password);
      formdata.append('token', token);

      const apiUrl = `${BASIC_URL}google_login.php`;

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();
      console.log('API response:', result);

      if (result && !result.error) {
        setLoad(false);

        await AsyncStorage.setItem('user', JSON.stringify(result));
        await AsyncStorage.setItem('role', result.role);

        dispatch({
          type: 'LOGIN',
          payload: {user: result, role: result.role},
        });

        global.email = result.email;
        global.id = result.id;
        global.name = result.name;
        global.phone_number = result.phone_number;
        global.address = result.address;
        global.state = result.state;
        global.whatsapp = result.whatsapp;
        global.role = result.role;
        global.working_experience = result.working_experience;
        global.profile = result.profile;

        if (result.role == 1 || result.role == 0) {
          navigation.navigate('Parent');
        }
      } else {
        setLoad(false);
        Toast.show('Email or Password does not match');
      }
    } catch (error) {
      setLoad(false);
      console.error('API error:', error);
      Toast.show('Something went wrong');
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '336016778121-qiriu75af7hvitlu9g67naf6hqnl7dsi.apps.googleusercontent.com', // Replace with your actual web client ID
    });
  }, []);

  const {width: windowWidth, height: windowHeight} = useWindowDimensions();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require('../../Assets/Images/bg.png')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <CstmHeaderIcon
            onPress={() => {
              props.navigation.goBack();
            }}
            headerIcon={styles.headerIcon}
          />
          <ScrollView 
            contentContainerStyle={[
              styles.container,
              {paddingBottom: getResponsiveSpacing(20, 30, 40)}
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
          <View style={[
            styles.logoStyle,
            {marginTop: getResponsiveSpacing(0, 0, 0)}
          ]}>
            <Image
              style={[
                styles.logoImg,
                {
                  width: windowWidth * 0.45,
                  height: windowHeight * 0.18,
                  maxWidth: 200,
                  maxHeight: 200,
                }
              ]}
              resizeMode="contain"
              source={require('../../Assets/Images/logo.png')}
            />
          </View>
          <View style={styles.inputContainer}>
            <C_TxtInput
              placeholder="Email or Phone-number"
              placeholderTextColor={color.defalt}
              onChangeText={setuserName}
              value={userName}
            />

            {userName && !isValidInput(userName) && (
              <Text style={[
                styles.errorText,
                {fontSize: getResponsiveSize(10, 11, 12)}
              ]}>
                {isPossiblyPhone(userName)
                  ? 'Please enter a valid phone number'
                  : 'Please enter a valid email'}
              </Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <C_InputScurEntrylogin
              placeholder="Password"
              placeholderTextColor={color.defalt}
              secureTextEntry={hide}
              icon="eye-off"
              onChangeText={setPassword}
              value={password}
              onPress={() => setHide(!hide)}
            />
            {password && password.length < 6 && (
              <Text style={[
                styles.errorText,
                {fontSize: getResponsiveSize(10, 11, 12)}
              ]}>
                Password must be at least 6 characters
              </Text>
            )}
          </View>
          <View style={[
            styles.checkContainer,
            {marginTop: getResponsiveSpacing(8, 12, 16)}
          ]}>
            <View style={styles.checkboxStyle}>
              <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);
                }}
              />
              <Text style={[
                styles.rememberStyle,
                {fontSize: getResponsiveSize(13, 14, 15)}
              ]}>
                Remember me
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
              activeOpacity={0.7}>
              <Text style={[
                styles.forgot,
                {fontSize: getResponsiveSize(12, 13, 14)}
              ]}>
                Forgot your Password?
              </Text>
            </TouchableOpacity>
          </View>

          <BotonComp
            BtnStyle={[
              styles.BtnStyle,
              {marginTop: getResponsiveSpacing(12, 18, 24)}
            ]}
            btnText={
              load ? <ActivityIndicator size={28} color="#f8f8ff" /> : 'Sign In'
            }
            onPressFunc={async () => {
              try {
                console.log('userName:', userName);
                console.log('password:', password);
                if (userName && password) {
                  await handleSignIn({emailOrPhone: userName, password});
                } else {
                  Toast.show('Please enter valid email and password');
                }
              } catch (error) {
                console.error('Error during sign in:', error);
              }
            }}
          />
          <TouchableOpacity
            style={[
              styles.haveAccount,
              {marginTop: getResponsiveSpacing(15, 20, 25)}
            ]}
            onPress={() => navigation.navigate('SignupScreen')}
            activeOpacity={0.7}>
            <Text style={[
              styles.rememberStyle,
              {fontSize: getResponsiveSize(13, 14, 15)}
            ]}>
              Don't have an account?{' '}
            </Text>
            <Text style={[
              styles.registerNow,
              {fontSize: getResponsiveSize(14, 15, 16)}
            ]}>
              Register Now
            </Text>
          </TouchableOpacity>
          <View style={[
            styles.modalBody,
            {marginTop: getResponsiveSpacing(15, 20, 25)}
          ]}>
            <View style={[
              styles.btnContainer,
              {marginBottom: getResponsiveSpacing(8, 12, 16)}
            ]}>
              <BotonComp
                BtnStyle={styles.acceptStyle}
                btnTextStyle={{
                  color: 'white',
                  fontSize: getResponsiveSize(14, 15, 16)
                }}
                btnText="Continue as Provider"
                icon={<FontAwesome name="google" size={getResponsiveSize(16, 18, 20)} color="white" />}
                onPressFunc={async () => {
                  await handleGoogleSignInFlow('0');
                }}
              />
            </View>
            <View style={styles.btnContainer}>
              <BotonComp
                BtnStyle={styles.acceptStyle}
                btnTextStyle={{
                  color: 'white',
                  fontSize: getResponsiveSize(14, 15, 16)
                }}
                btnText="Continue as User"
                icon={<FontAwesome name="google" size={getResponsiveSize(16, 18, 20)} color="white" />}
                onPressFunc={async () => {
                  await handleGoogleSignInFlow('1');
                }}
              />
            </View>
          </View>
          {/* {isSwitchOn ? null : (
            <GooglButon
              BtnStyle={styles.googleBtn}
              btnText="Sign In with Google"
              onPressFunc={() => {
                toggleModal();
              }}
              // iconName="google"
              btnTextStyle={styles.btnTextStyle}
            />
          )} */}
          </ScrollView>
        </SafeAreaView>

        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible()}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sign in as</Text>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.btnContainer}>
                  <BotonComp
                    BtnStyle={styles.acceptStyle}
                    btnTextStyle={{color: 'white'}}
                    btnText="Sign In as Provider"
                    onPressFunc={async () => {
                      await handleGoogleSignInFlow('0');
                    }}
                  />
                </View>
                <View style={styles.btnContainer}>
                  <BotonComp
                    BtnStyle={styles.acceptStyle}
                    btnTextStyle={{color: 'white'}}
                    btnText="Sign In as User"
                    onPressFunc={async () => {
                      await handleGoogleSignInFlow('1');
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal> */}
      </ImageBackground>
    </>
  );
};

export default Signin;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '100%',
    flexGrow: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 4,
    alignSelf: 'flex-start',
    fontWeight: '400',
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  googleBtn: {
    backgroundColor: color.wite,
    borderWidth: 2,
    borderColor: color.wite,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btnTextStyle: {
    color: color.defalt,
  },
  logoStyle: {
    // justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: getResponsiveSpacing(20, 30, 40),
  },
  logoImg: {
    // Responsive sizing handled inline
  },
  inputContainer: {
    width: '90%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: getResponsiveSpacing(8, 12, 16),
  },
  signinText: {
    fontSize: getResponsiveSize(14, 16, 18),
    fontWeight: '400',
    color: color.wite,
    textAlign: 'center',
    marginTop: 8,
  },
  BtnStyle: {
    width: '90%',
    maxWidth: 400,
    minHeight: getResponsiveSpacing(48, 52, 56),
  },
  fieldRequired: {
    color: color.drkRd,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    fontWeight: '600',
  },
  checkboxStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberStyle: {
    fontWeight: '500',
    color: color.drkGry,
  },
  forgot: {
    fontWeight: '500',
    color: color.drkGry,
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: 400,
    paddingVertical: getResponsiveSpacing(8, 12, 16),
  },
  registerNow: {
    color: color.defalt,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  haveAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  headerIcon: {
    paddingLeft: getResponsiveSpacing(16, 20, 24),
    paddingTop: Platform.OS === 'android' ? 8 : 0,
  },
  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 100,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.2,
    height: SCREEN_HEIGHT * 0.5,
  },
  modalView: {
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: color.wite,
  },
  modalHeader: {
    backgroundColor: color.defalt,
    alignItems: 'center',
    paddingVertical: getResponsiveSpacing(12, 15, 18),
    paddingHorizontal: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: getResponsiveSize(17, 19, 21),
    color: color.wite,
    fontWeight: '600',
  },
  modalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: getResponsiveSpacing(10, 15, 20),
    paddingHorizontal: getResponsiveSpacing(15, 20, 25),
    marginBottom: getResponsiveSpacing(15, 20, 25),
  },
  btnContainer: {
    width: '90%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  acceptStyle: {
    width: '100%',
    minHeight: getResponsiveSpacing(48, 52, 56),
  },
});
