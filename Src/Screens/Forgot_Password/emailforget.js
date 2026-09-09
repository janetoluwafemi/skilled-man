import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';
import { showToast } from '../../utilis/showToast';

const ForgotPasword1 = props => {
  const navigation = useNavigation();

  const [userName, setUserName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = email => {
    const re = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendOtp = async () => {
    if (!userName.trim()) {
      setEmailError('Please enter your email address.');
      showToast('Please enter your email address.');
      return;
    }

    if (!validateEmail(userName.trim())) {
      setEmailError('Please enter a valid email address.');
      showToast('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append('email', userName.trim());

      const response = await fetch(`${BASIC_URL}forget_password.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoading(false);

      if (result.success || result.status) {
        global.forgetemail = userName.trim();
        if (result.otp) {
          global.forgetotp = result.otp;
        }
        showToast('OTP sent to your email.');
        navigation.navigate('ForgetpasswordOtpScreen', { Email: userName.trim() });
      } else {
        showToast(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      showToast('Network error. Please try again.');
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
              <Icons.Feather
                name="key"
                size={34}
                color={color.defalt}
              />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Forgot Password</Text>
          <Text style={styles.welcomeSubtitle}>
            Enter your registered email address to receive an OTP verification code.
          </Text>

          <View style={styles.cardWrapper}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <C_TxtInput
                placeholder="name@example.com"
                placeholderTextColor={color.litGry}
                onChangeText={val => {
                  setUserName(val);
                  if (emailError) setEmailError('');
                }}
                value={userName}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <BotonComp
              BtnStyle={styles.submitBtn}
              btnText={
                loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  'Send OTP'
                )
              }
              onPressFunc={handleSendOtp}
            />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasword1;

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
    boxShadow: '0px 1px 2px rgba(15, 23, 42, 0.05)',
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
    boxShadow: '0px 2px 6px rgba(15, 23, 42, 0.06)',
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
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    boxShadow: '0px 4px 10px rgba(15, 23, 42, 0.04)',
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
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  submitBtn: {
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 6,
    elevation: 3,
    boxShadow: '0px 3px 6px rgba(255, 107, 0, 0.25)',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
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
