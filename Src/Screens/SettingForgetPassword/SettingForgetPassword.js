import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import C_InputScurEntry from '../../Components/C_InputSecureEntry';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(10, 'Password must be at least 10 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must contain at least one uppercase letter and one lowercase letter'
    ),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const SettingForgotPassword = props => {
  const navigation = useNavigation();
  const [hide, setHide] = useState(true);
  const [confirmHide, setConfirmHide] = useState(true);
  const [load, setLoad] = useState(false);

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
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async values => {
          try {
            setLoad(true);
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'multipart/form-data');

            const formdata = new FormData();
            formdata.append('email', global.forgetemail);
            formdata.append('password', values.password);
            formdata.append('confirm_password', values.confirmPassword);

            const apiUrl = `${BASIC_URL}user/resetpassword.php`;

            const requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formdata,
              redirect: 'follow',
            };

            const response = await fetch(apiUrl, requestOptions);
            const result = await response.json();

            setLoad(false);

            if (result.success) {
              showToast(result.success);
              navigation.navigate('Signin');
            } else if (result.error) {
              Alert.alert('Error', result.error);
            } else {
              Alert.alert('Error', 'Unable to reset password. Please try again.');
            }
          } catch (error) {
            setLoad(false);
            Alert.alert('Error', error?.message || String(error) || 'An error occurred');
          }
        }}>
        {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
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
                    name="lock"
                    size={34}
                    color={color.defalt}
                  />
                </View>
              </View>

              <Text style={styles.welcomeTitle}>Set New Password</Text>
              <Text style={styles.welcomeSubtitle}>
                Create a strong password with at least 10 characters, including uppercase and lowercase letters.
              </Text>

              <View style={styles.cardWrapper}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>New Password</Text>
                  <C_InputScurEntry
                    placeholder="Enter new password"
                    placeholderTextColor={color.litGry}
                    secureTextEntry={hide}
                    icon="eye-off"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    onPress={() => setHide(!hide)}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Confirm New Password</Text>
                  <C_InputScurEntry
                    placeholder="Confirm new password"
                    placeholderTextColor={color.litGry}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    icon="eye-off"
                    secureTextEntry={confirmHide}
                    onPress={() => setConfirmHide(!confirmHide)}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>

                <BotonComp
                  BtnStyle={styles.submitBtn}
                  btnText={
                    load ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      'Reset Password'
                    )
                  }
                  onPressFunc={handleSubmit}
                />
              </View>
            </Animatable.View>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default SettingForgotPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
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
    lineHeight: 20,
    paddingHorizontal: 12,
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
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
});