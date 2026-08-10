import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-simple-toast';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

const FrgtPaswrd = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [load, setLoad] = useState(false);

  const validateEmail = text => {
    const re = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return re.test(String(text).toLowerCase());
  };

  const handleNext = async () => {
    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      Toast.show('Please enter your email address.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address.');
      Toast.show('Please enter a valid email address.');
      return;
    }

    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('email', email.trim());

      const response = await fetch(`${BASIC_URL}resend_otp.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoad(false);

      if (result) {
        global.forgetemail = email.trim();
        if (result.otp) {
          global.forgetotp = result.otp;
        }
        Toast.show('OTP sent successfully.');
        navigation.navigate('ForgetpasswordOtpScreen', { Email: email.trim() });
      } else {
        Toast.show(result.error || 'Failed to send OTP.');
      }
    } catch (error) {
      setLoad(false);
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
          onPress={() => navigation.goBack()}
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
            <Text style={styles.welcomeTitle}>Forgot Password</Text>
            <Text style={styles.welcomeSubtitle}>
              If you have forgotten your password, enter your email address to receive an OTP code to reset it.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <C_TxtInput
                placeholder="Enter your registered email"
                placeholderTextColor={color.litGry}
                value={email}
                onChangeText={val => {
                  setEmail(val);
                  if (emailError) setEmailError('');
                }}
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
                load ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  'Next'
                )
              }
              onPressFunc={handleNext}
            />
          </Animatable.View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default FrgtPaswrd;

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
    marginTop: 20,
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
    marginBottom: 28,
    lineHeight: 20,
    textAlign: 'center',
  },
  fieldGroup: {
    marginBottom: 20,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  errorText: {
    color: color.rd,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitBtn: {
    width: '100%',
    marginTop: 10,
    backgroundColor: color.defalt,
    borderRadius: 12,
    paddingVertical: 14,
  },
});