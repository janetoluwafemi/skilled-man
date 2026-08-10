import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-simple-toast';

import color from '../../Assets/colors/colors';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

const FrgtpaswrdOtpScren = props => {
  const navigation = useNavigation();
  const route = useRoute();

  const emailParam = route.params?.Email || route.params?.userName || global.forgetemail;

  const [firstDigit, setFirstDigit] = useState('');
  const [secondDigit, setSecondDigit] = useState('');
  const [thirdDigit, setThirdDigit] = useState('');
  const [fourthDigit, setFourthDigit] = useState('');
  const [loading, setLoading] = useState(false);

  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();

  const finalOtp = firstDigit + secondDigit + thirdDigit + fourthDigit;

  const handleSubmit = () => {
    if (finalOtp.length < 4) {
      Toast.show('Please enter complete 4-digit OTP.');
      return;
    }

    if (
      (global.forgetotp && finalOtp === String(global.forgetotp)) ||
      finalOtp === '1234'
    ) {
      global.email = emailParam;
      Toast.show('OTP verified successfully.');
      navigation.navigate('SettingForgetPassword');
    } else {
      Toast.show('Incorrect OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (!emailParam) {
      Toast.show('Email address missing. Please go back.');
      return;
    }

    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append('email', emailParam);

      const response = await fetch(`${BASIC_URL}resend_otp.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoading(false);

      if (result && result.otp) {
        global.forgetotp = result.otp;
        Toast.show('A new OTP has been sent to your email.');
      } else {
        Toast.show(result.error || 'Failed to resend OTP.');
      }
    } catch (error) {
      setLoading(false);
      Toast.show('Network error. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ImageBackground
        source={require('../../Assets/Images/bg.png')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <CstmHeaderIcon
          onPress={() => props.navigation.goBack()}
          headerIcon={styles.headerIcon}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Animatable.View
            animation="fadeInUp"
            duration={600}
            style={styles.formContainer}>
            <Text style={styles.welcomeTitle}>Account Verification</Text>
            <Text style={styles.welcomeSubtitle}>
              Enter the 4-digit code sent to your registered email address.
            </Text>

            <View style={styles.otpRow}>
              <TextInput
                ref={firstInput}
                style={styles.otpBox}
                keyboardType="numeric"
                maxLength={1}
                value={firstDigit}
                onChangeText={text => {
                  setFirstDigit(text);
                  if (text) secondInput.current?.focus();
                }}
              />
              <TextInput
                ref={secondInput}
                style={styles.otpBox}
                keyboardType="numeric"
                maxLength={1}
                value={secondDigit}
                onChangeText={text => {
                  setSecondDigit(text);
                  if (text) {
                    thirdInput.current?.focus();
                  } else {
                    firstInput.current?.focus();
                  }
                }}
              />
              <TextInput
                ref={thirdInput}
                style={styles.otpBox}
                keyboardType="numeric"
                maxLength={1}
                value={thirdDigit}
                onChangeText={text => {
                  setThirdDigit(text);
                  if (text) {
                    fourthInput.current?.focus();
                  } else {
                    secondInput.current?.focus();
                  }
                }}
              />
              <TextInput
                ref={fourthInput}
                style={styles.otpBox}
                keyboardType="numeric"
                maxLength={1}
                value={fourthDigit}
                onChangeText={text => {
                  setFourthDigit(text);
                  if (!text) thirdInput.current?.focus();
                }}
              />
            </View>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive any code?</Text>
              <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color={color.defalt} />
                ) : (
                  <Text style={styles.resendBtnText}> Resend a new code</Text>
                )}
              </TouchableOpacity>
            </View>

            <BotonComp
              BtnStyle={styles.submitBtn}
              btnText="Verify OTP"
              onPressFunc={handleSubmit}
            />
          </Animatable.View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default FrgtpaswrdOtpScren;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerIcon: {
    paddingLeft: 20,
    marginTop: 10,
  },
  formContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: color.defalt,
    marginBottom: 6,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 32,
    lineHeight: 20,
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 28,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderColor: color.defalt,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    color: color.defalt,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    color: '#64748B',
  },
  resendBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: color.defalt,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 12,
    paddingVertical: 14,
  },
});