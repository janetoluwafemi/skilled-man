import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import C_InputScurEntry from '../../Components/C_InputSecureEntry';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';
import { Icons } from '../../Components/Icons';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(10, 'Password must be at least 10 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit'
    ),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const StPaswrd = props => {
  const navigation = useNavigation();

  const [checked, setChecked] = useState(false);
  const [hide, setHide] = useState(true);
  const [confirmHide, setConfirmHide] = useState(true);
  const [load, setLoad] = useState(false);

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

      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async values => {
          if (!checked) {
            Alert.alert('Terms & Conditions', 'Please agree with terms of use & privacy policy to continue.');
            return;
          }

          try {
            setLoad(true);

            const formdata = new FormData();
            formdata.append('email', global.email);
            formdata.append('password', values.password);

            const apiUrl = `${BASIC_URL}register.php`;

            const requestOptions = {
              method: 'POST',
              body: formdata,
            };

            const response = await fetch(apiUrl, requestOptions);
            const result = await response.json();

            setLoad(false);

            if (result && !result.error) {
              global.id = result.id;
              if (result.role === 0 || result.role === '0') {
                navigation.navigate('AddBusiness');
              } else if (result.role === 1 || result.role === '1') {
                navigation.navigate('Congratulations');
              } else {
                navigation.navigate('Congratulations');
              }
            } else {
              Alert.alert('Registration Failed', result?.error || 'Something went wrong. Please try again.');
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

              <View style={styles.logoRow}>
                <View style={styles.logoCircle}>
                  <Image
                    source={require('../../Assets/Images/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <Text style={styles.welcomeTitle}>Create Your Password</Text>
              <Text style={styles.welcomeSubtitle}>
                Choose a strong password with at least 10 characters, including an uppercase letter, lowercase letter, and a digit.
              </Text>

              <View style={styles.cardWrapper}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <C_InputScurEntry
                    placeholder="Enter password"
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
                  <Text style={styles.fieldLabel}>Confirm Password</Text>
                  <C_InputScurEntry
                    placeholder="Confirm password"
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

                <View style={styles.termsWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.checkboxWrapper}
                    onPress={() => setChecked(!checked)}>
                    <View style={[styles.customCheckbox, checked && styles.customCheckboxActive]}>
                      {checked && <Icons.Feather name="check" size={12} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.termsTextBtn}
                    onPress={() => navigation.navigate('privacy_policy')}>
                    <Text style={styles.termsText}>
                      I agree with{' '}
                      <Text style={styles.termsHighlight}>
                        terms of use & privacy policy
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>

                <BotonComp
                  BtnStyle={styles.submitBtn}
                  btnText={
                    load ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      'Submit'
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

export default StPaswrd;

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
    lineHeight: 20,
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
  termsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  checkboxWrapper: {
    paddingRight: 4,
  },
  customCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  customCheckboxActive: {
    backgroundColor: color.defalt,
    borderColor: color.defalt,
  },
  termsTextBtn: {
    flex: 1,
    marginLeft: 6,
  },
  termsText: {
    fontSize: 13,
    color: '#475569',
  },
  termsHighlight: {
    color: color.defalt,
    fontWeight: '700',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 6,
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
