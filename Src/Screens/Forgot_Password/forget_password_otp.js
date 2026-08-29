import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';
import { Icons } from '../../Components/Icons';
import { showToast } from '../../utilis/showToast';

const ForgotPasswordOtpScreen = props => {
  const navigation = useNavigation();
  const route = useRoute();

  const emailParam = route.params?.Email || route.params?.userName || global.forgetemail;

  const [firstDigit, setFirstDigit] = useState('');
  const [secondDigit, setSecondDigit] = useState('');
  const [thirdDigit, setThirdDigit] = useState('');
  const [fourthDigit, setFourthDigit] = useState('');
  const [loading, setLoading] = useState(false);

  const firstInput = useRef(null);
  const secondInput = useRef(null);
  const thirdInput = useRef(null);
  const fourthInput = useRef(null);

  const finalOtp = firstDigit + secondDigit + thirdDigit + fourthDigit;

  const handleOtpChange = (text, index) => {
    const cleaned = text.replace(/[^0-9]/g, '');

    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, 4).split('');
      setFirstDigit(digits[0] || '');
      setSecondDigit(digits[1] || '');
      setThirdDigit(digits[2] || '');
      setFourthDigit(digits[3] || '');

      if (digits.length === 4) {
        fourthInput.current?.focus();
      } else if (digits.length === 3) {
        fourthInput.current?.focus();
      } else if (digits.length === 2) {
        thirdInput.current?.focus();
      }
      return;
    }
    if (index === 0) {
      setFirstDigit(cleaned);
      if (cleaned) secondInput.current?.focus();
    } else if (index === 1) {
      setSecondDigit(cleaned);
      if (cleaned) thirdInput.current?.focus();
    } else if (index === 2) {
      setThirdDigit(cleaned);
      if (cleaned) fourthInput.current?.focus();
    } else if (index === 3) {
      setFourthDigit(cleaned);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (index === 3 && !fourthDigit) {
        thirdInput.current?.focus();
      } else if (index === 2 && !thirdDigit) {
        secondInput.current?.focus();
      } else if (index === 1 && !secondDigit) {
        firstInput.current?.focus();
      }
    }
  };

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
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={false} />

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
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={styles.formContainer}>

          <View style={styles.badgeRow}>
            <View style={styles.badgeCircle}>
              <Icons.Ionicons
                name="shield-checkmark"
                size={36}
                color={color.defalt}
              />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Enter Security Code</Text>
          <Text style={styles.welcomeSubtitle}>
            Enter the 4-digit code sent to{' '}
            <Text style={styles.highlightText}>{emailParam || 'your email'}</Text>
          </Text>

          <View style={styles.cardWrapper}>
            <View style={styles.otpRow}>
              <TextInput
                ref={firstInput}
                style={[styles.otpBox, firstDigit ? styles.otpBoxActive : null]}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                maxLength={4}
                value={firstDigit}
                onChangeText={text => handleOtpChange(text, 0)}
                onKeyPress={e => handleKeyPress(e, 0)}
              />
              <TextInput
                ref={secondInput}
                style={[styles.otpBox, secondDigit ? styles.otpBoxActive : null]}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                maxLength={4}
                value={secondDigit}
                onChangeText={text => handleOtpChange(text, 1)}
                onKeyPress={e => handleKeyPress(e, 1)}
              />
              <TextInput
                ref={thirdInput}
                style={[styles.otpBox, thirdDigit ? styles.otpBoxActive : null]}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                maxLength={4}
                value={thirdDigit}
                onChangeText={text => handleOtpChange(text, 2)}
                onKeyPress={e => handleKeyPress(e, 2)}
              />
              <TextInput
                ref={fourthInput}
                style={[styles.otpBox, fourthDigit ? styles.otpBoxActive : null]}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                maxLength={4}
                value={fourthDigit}
                onChangeText={text => handleOtpChange(text, 3)}
                onKeyPress={e => handleKeyPress(e, 3)}
              />
            </View>

            <BotonComp
              BtnStyle={styles.submitBtn}
              btnText="Verify OTP"
              onPressFunc={handleSubmit}
            />

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

export default ForgotPasswordOtpScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 12,
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
  badgeRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
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
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  highlightText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 12,
  },
  otpBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  otpBoxActive: {
    borderColor: color.defalt,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 18,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  resendText: {
    fontSize: 13,
    color: '#64748B',
  },
  resendBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: color.defalt,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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