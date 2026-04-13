import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  Text,
  Animated,
  ImageBackground,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SafeAreaView} from 'react-native-safe-area-context';
import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import Icon, {Icons} from '../../Components/Icons';
import ChangPasInput from '../../Components/ChangePassInput';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
import { BASIC_URL } from '../Signin/Signin';

const {width, height} = Dimensions.get('window');

const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 900;
const isLargeDevice = height >= 900;

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
const ChangPaswrd = props => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [load, setLoad] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [checked, setChecked] = React.useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    currentPasswordError: '',
    newPasswordError: '',
    ConfirmPasswordError: '',
  });
  //console.log(password, confirmPassword)
  const HandlUpdat = async () => {
    try {
      if (!password || !newPassword || !confirmPassword) {
        // Check if any of the fields are empty
        Toast.show('All fields are required.');
        return;
      }

      if (newPassword !== confirmPassword) {
        // Check if the new password and confirm password match
        Toast.show('New password and confirm password do not match.');
        return;
      }
      setLoad(true);
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=2fv2c4id6b75rbqb9k3h157uh4');

      var formdata = new FormData();
      formdata.append('id', global.id);
      formdata.append('password', confirmPassword);
      formdata.append('old_password', password);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // const APiurl ='https://fisdemoprojects.com/skilledman/api/user/resetpassword.php';
      const APiurl =`${BASIC_URL}user/resetpassword.php`;


      const response = await fetch(APiurl, requestOptions);
      const result = await response.json(); // Assuming the response is JSON

      if (result.success === 'Password updated successfully.') {
        setLoad(false);
        // Successful update
        Toast.show('Password Updated successfully.');
        navigation.navigate('account_setting');
      } else {
        setLoad(false);
        // Handle other responses or errors
        Toast.show('Password Update Failed.');
      }
    } catch (error) {
      setLoad(false);
      Toast.show('Network Error.');
      console.log('error', error);
    }
  };
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 20;
  const iconSize = getResponsiveSize(22, 23, 24);
  const iconRight = getResponsiveSpacing(15, 18, 20);

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <CstmHeader
        title="Change Password"
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: bottomPadding}
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.first_View}>
          <View style={styles.textInputStyle}>
            <ChangPasInput
              style={{
                marginTop: 0,
              }}
              placeholder="Current Password"
              placeholderTextColor={
                errors.currentPasswordError ? color.rd : color.defalt
              }
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              value={password}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              activeOpacity={0.7}
              style={[styles.eyeIconContainer, {right: iconRight}]}>
              <Icons.FontAwesome
                name={showPassword ? 'eye' : 'eye-slash'}
                color={color.defalt}
                size={iconSize}
              />
            </TouchableOpacity>
          </View>
          {errors.currentPasswordError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {errors.currentPasswordError}
              </Text>
            </View>
          ) : null}
          <View style={styles.textInputStyle}>
            <ChangPasInput
              style={{
                marginTop: 0,
                borderColor: errors.newPasswordError ? color.rd : color.gry,
              }}
              secureTextEntry={!showNewPassword}
              placeholder="New Password"
              placeholderTextColor={
                errors.newPasswordError ? color.rd : color.defalt
              }
              onChangeText={val => setNewPassword(val)}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              activeOpacity={0.7}
              style={[styles.eyeIconContainer, {right: iconRight}]}>
              <Icons.FontAwesome
                name={showNewPassword ? 'eye' : 'eye-slash'}
                color={color.defalt}
                size={iconSize}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.textInputStyle}>
            <ChangPasInput
              style={{
                marginTop: 0,
                borderColor: errors.ConfirmPasswordError
                  ? color.rd
                  : color.wite,
              }}
              placeholder="Confirm Password"
              placeholderTextColor={
                errors.ConfirmPasswordError ? color.rd : color.defalt
              }
              secureTextEntry={!showConfirmPassword}
              onChangeText={val => setConfirmPassword(val)}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              activeOpacity={0.7}
              style={[styles.eyeIconContainer, {right: iconRight}]}>
              <Icons.FontAwesome
                name={showConfirmPassword ? 'eye' : 'eye-slash'}
                color={color.defalt}
                size={iconSize}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              HandlUpdat();
            }}
            activeOpacity={0.8}>
            <Text style={styles.btnText}>
              {load ? (
                <ActivityIndicator 
                  size={getResponsiveSize(24, 26, 28)} 
                  color="#f8f8ff" 
                />
              ) : (
                'Update Password'
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangPaswrd;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  first_View: {
    flex: 1,
    paddingHorizontal: getResponsiveSpacing(15, 18, 20),
    marginTop: getResponsiveSpacing(15, 18, 20),
  },
  textInputStyle: {
    justifyContent: 'center',
    marginTop: getResponsiveSpacing(15, 18, 20),
    position: 'relative',
  },
  eyeIconContainer: {
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -12}],
    padding: 8,
    zIndex: 1,
  },
  errorContainer: {
    marginTop: getResponsiveSpacing(4, 6, 8),
    marginBottom: getResponsiveSpacing(4, 6, 8),
  },
  errorText: {
    color: color.rd,
    fontSize: getResponsiveSize(12, 13, 14),
  },
  loginBtn: {
    borderRadius: getResponsiveSize(5, 6, 7),
    backgroundColor: color.defalt,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: getResponsiveSpacing(14, 16, 18),
    marginTop: getResponsiveSpacing(25, 30, 35),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  btnText: {
    color: 'white',
    fontSize: getResponsiveSize(16, 18, 20),
    fontWeight: '800',
  },
});
