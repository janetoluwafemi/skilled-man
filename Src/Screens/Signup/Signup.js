import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-simple-toast';
import { Country, State } from 'country-state-city';
import { Picker } from '@react-native-picker/picker';
import PhoneInput from 'react-native-phone-input';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import C_TxtInputNo from '../../Components/C_TExtinputno';
import BotonComp from '../../Components/BtnComp';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import { signInWGoogle } from '../../utilis/firbase';
import { BASIC_URL } from '../Signin/Signin';
import { Icons } from '../../Components/Icons';

const SignupValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Name is too short')
    .max(70, 'Name is too long')
    .required('Full Name is required'),
  email: yup
    .string()
    .required('Email address is required')
    .matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, 'Enter a valid email address'),
  phone_number: yup
    .string()
    .max(15, 'Phone number too long')
    .required('Phone number is required')
    .matches(/^\d+$/, 'Phone number must contain digits only'),
  address: yup
    .string()
    .min(3, 'Address is too short')
    .max(500, 'Address is too long')
    .required('Street Address is required'),
});

const Signup = props => {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const phoneInput = useRef(null);

  const [role, setRole] = useState(0);
  const [load, setLoad] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const countriesData = Country.getAllCountries();
    setCountries(countriesData);
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
    }
  }, [focus]);

  const handleGoogleSignInFlow = async () => {
    try {
      setLoad(true);
      const user = await signInWGoogle();
      if (user) {
        Toast.show('Google Sign-In successful', Toast.SHORT);
      }
      setLoad(false);
    } catch (error) {
      setLoad(false);
      Toast.show('Google Sign-In failed', Toast.SHORT);
    }
  };

  const initialValues = {
    name: '',
    email: '',
    phone_number: '',
    address: '',
    association: '',
  };

  const onCountryChange = countryCode => {
    setSelectedCountry(countryCode);
    setSelectedState('');
    const countryStates = State.getStatesOfCountry(countryCode);
    setStates(countryStates);
  };

  const isLocationSet = global.lat && global.long;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.headerBar}>
        <CstmHeaderIcon
          onPress={() => props.navigation.goBack()}
          headerIconStyle={styles.headerBackIcon}
        />
        <Text style={styles.headerTitle}>Create Account</Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupValidationSchema}
        onSubmit={async value => {
          try {
            setLoad(true);
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'multipart/form-data');

            const formdata = new FormData();
            formdata.append('name', value.name);
            const fullPhoneNumber =
              (phoneInput.current ? phoneInput.current.getValue() : '') +
              value.phone_number;
            formdata.append('phone_number', fullPhoneNumber);
            formdata.append('address', value.address);
            formdata.append('state', selectedState);
            formdata.append('role', role);
            formdata.append('email', value.email);
            formdata.append('account', 'Verified');
            formdata.append('country', selectedCountry);
            formdata.append('association', value.association);
            formdata.append('latitude', global.lat || '');
            formdata.append('longitude', global.long || '');

            const apiUrl = `${BASIC_URL}otp_register.php`;

            const requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formdata,
              redirect: 'follow',
            };

            const response = await fetch(apiUrl, requestOptions);
            const result = await response.json();

            if (result) {
              setLoad(false);
              global.id = result.id;
              global.name = result.name;
              global.role = result.role;
              global.email = result.email;
              global.address = result.address;
              global.phone_number = result.phone_number;

              if (!result.error) {
                navigation.navigate('OtpScreen', { result });
              } else {
                Toast.showWithGravity(result.error, Toast.LONG, Toast.CENTER);
              }
            } else {
              setLoad(false);
            }
          } catch (error) {
            setLoad(false);
            console.error('API error:', error);
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
            <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
              <Text style={styles.welcomeSubtitle}>
                Fill in your details below to get started
              </Text>

              <View style={styles.segmentContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setRole(0)}
                  style={[styles.segmentBtn, role === 0 && styles.segmentActive]}>
                  <Icons.FontAwesome5
                    name="user"
                    size={14}
                    color={role === 0 ? color.defalt : '#64748B'}
                    style={styles.segmentIcon}
                  />
                  <Text style={[styles.segmentText, role === 0 && styles.segmentTextActive]}>
                    User
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setRole(1)}
                  style={[styles.segmentBtn, role === 1 && styles.segmentActive]}>
                  <Icons.FontAwesome5
                    name="briefcase"
                    size={14}
                    color={role === 1 ? color.defalt : '#64748B'}
                    style={styles.segmentIcon}
                  />
                  <Text style={[styles.segmentText, role === 1 && styles.segmentTextActive]}>
                    Provider
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <C_TxtInput
                  placeholder="e.g. John Doe"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <C_TxtInput
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <View style={styles.phoneInputRow}>
                  <View style={styles.phonePickerCard}>
                    <PhoneInput
                      ref={phoneInput}
                      initialCountry="ng"
                      textStyle={styles.phoneTextStyle}
                      onPressFlag={() => {}}
                    />
                  </View>
                  <View style={styles.flexFill}>
                    <C_TxtInputNo
                      placeholder="8012345678"
                      keyboardType="phone-pad"
                      onChangeText={handleChange('phone_number')}
                      onBlur={handleBlur('phone_number')}
                      value={values.phone_number}
                    />
                  </View>
                </View>
                {touched.phone_number && errors.phone_number && (
                  <Text style={styles.errorText}>{errors.phone_number}</Text>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Country</Text>
                <View style={styles.pickerCard}>
                  <Picker
                    selectedValue={selectedCountry}
                    onValueChange={itemValue => onCountryChange(itemValue)}
                    style={styles.pickerStyle}
                    dropdownIconColor={color.defalt}>
                    <Picker.Item label="Select Country" value="" color="#94A3B8" />
                    {countries.map(country => (
                      <Picker.Item
                        key={country.isoCode}
                        label={country.name}
                        value={country.isoCode}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>State</Text>
                <View style={styles.pickerCard}>
                  <Picker
                    selectedValue={selectedState}
                    onValueChange={itemValue => setSelectedState(itemValue)}
                    style={styles.pickerStyle}
                    dropdownIconColor={color.defalt}>
                    <Picker.Item label="Select State" value="" color="#94A3B8" />
                    {states.map(state => (
                      <Picker.Item
                        key={state.isoCode}
                        label={state.name}
                        value={state.isoCode}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Street Address</Text>
                <C_TxtInput
                  placeholder="e.g. 123 Main Street"
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={values.address}
                />
                {touched.address && errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              {role === 1 && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Association / Trade Group</Text>
                  <C_TxtInput
                    placeholder="Enter association name"
                    onChangeText={handleChange('association')}
                    onBlur={handleBlur('association')}
                    value={values.association}
                  />
                </View>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.locationBtnCard,
                  isLocationSet && styles.locationBtnCardActive,
                ]}
                onPress={() => navigation.navigate('Maplatln')}>
                <View style={styles.locationBtnLeft}>
                  <Icons.Ionicons
                    name={isLocationSet ? 'location' : 'location-outline'}
                    size={22}
                    color={isLocationSet ? '#16A34A' : color.defalt}
                  />
                  <View style={styles.locationBtnTextCol}>
                    <Text
                      style={[
                        styles.locationBtnTitle,
                        isLocationSet && styles.locationBtnTitleActive,
                      ]}>
                      {isLocationSet ? 'Location Pinned' : 'Set Location on Map'}
                    </Text>
                    <Text style={styles.locationBtnSub}>
                      {isLocationSet
                        ? `${global.lat.toFixed(4)}, ${global.long.toFixed(4)}`
                        : 'Tap to select your coordinates'}
                    </Text>
                  </View>
                </View>
                <Icons.Feather
                  name="chevron-right"
                  size={20}
                  color={isLocationSet ? '#16A34A' : '#94A3B8'}
                />
              </TouchableOpacity>

              <BotonComp
                BtnStyle={styles.submitBtn}
                btnText={
                  load ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    'Create Account'
                  )
                }
                onPressFunc={handleSubmit}
              />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGoogleSignInFlow}
                style={styles.googleBtn}>
                <Icons.FontAwesome name="google" size={20} color="#DB4437" />
                <Text style={styles.googleBtnText}>Sign up with Google</Text>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                  <Text style={styles.footerLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Signup;

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
    paddingTop: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  segmentIcon: {
    marginRight: 6,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: color.defalt,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: 16,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phonePickerCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    marginRight: 10,
  },
  phoneTextStyle: {
    color: '#0F172A',
    fontSize: 14,
  },
  flexFill: {
    flex: 1,
  },
  pickerCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pickerStyle: {
    width: '100%',
    color: '#0F172A',
  },
  locationBtnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 6,
    marginBottom: 20,
  },
  locationBtnCardActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  locationBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationBtnTextCol: {
    marginLeft: 10,
  },
  locationBtnTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  locationBtnTitleActive: {
    color: '#15803D',
  },
  locationBtnSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 13,
    color: '#94A3B8',
    paddingHorizontal: 12,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  googleBtnText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
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