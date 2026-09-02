import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';
import { Icons } from '../../Components/Icons';

const OtpScren = props => {
  const navigation = useNavigation();
  const route = useRoute();

  const resultData = route.params?.result || {};
  const [currentOtp, setOtp] = useState(resultData.otp ? String(resultData.otp) : '');
  const [load, setLoad] = useState(false);

  const [firstDigit, setFirstDigit] = useState('');
  const [secondDigit, setSecondDigit] = useState('');
  const [thirdDigit, setThirdDigit] = useState('');
  const [fourthDigit, setFourthDigit] = useState('');

  const firstInput = useRef(null);
  const secondInput = useRef(null);
  const thirdInput = useRef(null);
  const fourthInput = useRef(null);

  const finalOtp = `${firstDigit}${secondDigit}${thirdDigit}${fourthDigit}`;

  const handleSubmit = () => {
    if (finalOtp.length < 4) {
      showToast('Please enter complete 4-digit OTP code');
      return;
    }

    if (String(finalOtp) === String(currentOtp)) {
      global.email = resultData.email;
      global.phone_number = resultData.phone_number;
      navigation.navigate('SetPassword');
    } else {
      showToast('Incorrect OTP. Please check and try again.');
    }
  };

  const resendOtp = async () => {
    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('email', resultData.email);

      const apiUrl = `${BASIC_URL}resend_otp.php`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoad(false);

      if (result && result.otp) {
        setOtp(String(result.otp));
        showToast('A new OTP has been sent to your email.');
      } else if (result?.error) {
        Alert.alert('Resend Failed', result.error);
      }
    } catch (error) {
      setLoad(false);
      Alert.alert('Error', error?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.navigation.goBack()}
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

          <Text style={styles.welcomeTitle}>Account Verification</Text>
          <Text style={styles.welcomeSubtitle}>
            We have sent a 4-digit verification code to{' '}
            <Text style={styles.highlightText}>
              {resultData.email || resultData.phone_number || 'your account'}
            </Text>
          </Text>

          <View style={styles.cardWrapper}>
            <View style={styles.otpInputRow}>
              <TextInput
                ref={firstInput}
                style={[
                  styles.otpBox,
                  firstDigit !== '' && styles.otpBoxActive,
                ]}
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
                style={[
                  styles.otpBox,
                  secondDigit !== '' && styles.otpBoxActive,
                ]}
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
                style={[
                  styles.otpBox,
                  thirdDigit !== '' && styles.otpBoxActive,
                ]}
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
                style={[
                  styles.otpBox,
                  fourthDigit !== '' && styles.otpBoxActive,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={fourthDigit}
                onChangeText={text => {
                  setFourthDigit(text);
                  if (!text) {
                    thirdInput.current?.focus();
                  }
                }}
              />
            </View>

            <BotonComp
              BtnStyle={styles.submitBtn}
              btnText="Verify Code"
              onPressFunc={handleSubmit}
            />

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive code? </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={resendOtp}
                disabled={load}>
                {load ? (
                  <ActivityIndicator color={color.defalt} size="small" />
                ) : (
                  <Text style={styles.resendLink}>Resend Code</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtpScren;

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
  badgeRow: {
    alignItems: 'center',
    marginBottom: 14,
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
    lineHeight: 20,
    paddingHorizontal: 12,
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
  otpInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 12,
  },
  otpBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
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
    color: '#64748B',
    fontSize: 14,
  },
  resendLink: {
    color: color.defalt,
    fontSize: 14,
    fontWeight: '700',
  },
});
