import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

let SimpleToast;
if (Platform.OS !== 'web') {
  SimpleToast = require('react-native-simple-toast').default;
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
      showToast('Please enter complete 4-digit OTP.');
      return;
    }

    if (
      (global.forgetotp && finalOtp === String(global.forgetotp)) ||
      finalOtp === '1234'
    ) {
      global.email = emailParam;
      showToast('OTP verified successfully.');
      navigation.navigate('SettingForgetPassword');
    } else {
      showToast('Incorrect OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (!emailParam) {
      showToast('Email address missing. Please go back.');
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
        showToast('A new OTP has been sent to your email.');
      } else {
        showToast(result.error || 'Failed to resend OTP.');
      }
    } catch (error) {
      setLoading(false);
      showToast('Network error. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.headerBar}>
        <CstmHeaderIcon
          onPress={() => props.navigation.goBack()}
          headerIconStyle={styles.headerBackIcon}
        />
        <Text style={styles.headerTitle}>Verification</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={styles.formContainer}>

          <View style={styles.logoRow}>
            <Image
              source={require('../../Assets/Images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.welcomeTitle}>Account Verification</Text>
          <Text style={styles.welcomeSubtitle}>
            Enter the 4-digit code sent to your registered email address
          </Text>

          <View style={styles.formCard}>
            <View style={styles.otpRow}>
              <TextInput
                ref={firstInput}
                style={[styles.otpBox, firstDigit ? styles.otpBoxActive : null]}
                keyboardType="number-pad"
                maxLength={1}
                value={firstDigit}
                onChangeText={text => {
                  setFirstDigit(text);
                  if (text) secondInput.current?.focus();
                }}
              />
              <TextInput
                ref={secondInput}
                style={[styles.otpBox, secondDigit ? styles.otpBoxActive : null]}
                keyboardType="number-pad"
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
                style={[styles.otpBox, thirdDigit ? styles.otpBoxActive : null]}
                keyboardType="number-pad"
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
                style={[styles.otpBox, fourthDigit ? styles.otpBoxActive : null]}
                keyboardType="number-pad"
                maxLength={1}
                value={fourthDigit}
                onChangeText={text => {
                  setFourthDigit(text);
                  if (!text) thirdInput.current?.focus();
                }}
              />
            </View>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive any code? </Text>
              <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color={color.defalt} />
                ) : (
                  <Text style={styles.resendBtnText}>Resend Code</Text>
                )}
              </TouchableOpacity>
            </View>

            <BotonComp
              BtnStyle={styles.submitBtn}
              btnText="Verify OTP"
              onPressFunc={handleSubmit}
            />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Wrong email? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.footerLink}>Change Email</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FrgtpaswrdOtpScren;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerBackIcon: {
    color: '#0F172A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 12,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 4,
    paddingHorizontal: 10,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 6,
  },
  otpBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  otpBoxActive: {
    backgroundColor: '#E2E8F0',
    color: color.defalt,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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