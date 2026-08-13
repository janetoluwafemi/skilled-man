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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import C_InputScurEntry from '../../Components/C_InputSecureEntry';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import BotonComp from '../../Components/BtnComp';
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

const SetingFrgtPaswrd = props => {
  const navigation = useNavigation();
  const [hide, setHide] = useState(true);
  const [confirmHide, setConfirmHide] = useState(true);
  const [load, setLoad] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.headerBar}>
        <CstmHeaderIcon
          onPress={() => props.navigation.goBack()}
          headerIconStyle={styles.headerBackIcon}
        />
        <Text style={styles.headerTitle}>Reset Password</Text>
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
            showsVerticalScrollIndicator={false}>
            <Animatable.View
              animation="fadeInUp"
              duration={600}
              style={styles.formContainer}>
              <Text style={styles.welcomeTitle}>Set New Password</Text>
              <Text style={styles.welcomeSubtitle}>
                Create a strong password with at least 10 characters, including uppercase and lowercase letters.
              </Text>

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
            </Animatable.View>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default SetingFrgtPaswrd;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontSize: 22,
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
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 28,
    lineHeight: 20,
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
  submitBtn: {
    width: '100%',
    marginTop: 10,
    backgroundColor: color.defalt,
    borderRadius: 12,
    paddingVertical: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
});