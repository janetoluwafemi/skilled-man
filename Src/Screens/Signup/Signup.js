import React, { useState, useEffect } from 'react';
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
  Modal,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-simple-toast';
import { Country, State } from 'country-state-city';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
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

  const [role, setRole] = useState(0);
  const [load, setLoad] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    isoCode: 'NG',
    name: 'Nigeria',
    phonecode: '234',
  });
  const [selectedState, setSelectedState] = useState(null);

  const [selectedDialCode, setSelectedDialCode] = useState({
    isoCode: 'NG',
    name: 'Nigeria',
    phonecode: '234',
  });

  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [dialCodeModalVisible, setDialCodeModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const countriesData = Country.getAllCountries();
    setCountries(countriesData);

    if (selectedCountry?.isoCode) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
    }
  }, [focus, selectedCountry]);

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

  const onCountrySelect = country => {
    setSelectedCountry(country);
    setSelectedDialCode(country);
    setSelectedState(null);
    const countryStates = State.getStatesOfCountry(country.isoCode);
    setStates(countryStates);
    setCountryModalVisible(false);
    setSearchQuery('');
  };

  const onStateSelect = state => {
    setSelectedState(state);
    setStateModalVisible(false);
    setSearchQuery('');
  };

  const onDialCodeSelect = country => {
    setSelectedDialCode(country);
    setDialCodeModalVisible(false);
    setSearchQuery('');
  };

  const filteredCountries = countries.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phonecode?.includes(searchQuery)
  );

  const filteredStates = states.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLocationSet = global.lat && global.long;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.headerBar}>
        <CstmHeaderIcon
          onPress={() => props.navigation.goBack()}
          headerIconStyle={styles.headerBackIcon}
        />
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
            const fullPhoneNumber = `+${selectedDialCode.phonecode}${value.phone_number}`;
            formdata.append('phone_number', fullPhoneNumber);
            formdata.append('address', value.address);
            formdata.append('state', selectedState ? selectedState.isoCode : '');
            formdata.append('role', role);
            formdata.append('email', value.email);
            formdata.append('account', 'Verified');
            formdata.append('country', selectedCountry ? selectedCountry.isoCode : 'NG');
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

              <View style={styles.logoRow}>
                <Image
                  source={require('../../Assets/Images/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.welcomeTitle}>Get Started</Text>
              <Text style={styles.welcomeSubtitle}>
                Select your account type and fill in your details
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
                <View style={styles.adaloPhoneBox}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.adaloFlagSelector}
                    onPress={() => setDialCodeModalVisible(true)}>
                    <Image
                      source={{
                        uri: `https://flagcdn.com/w40/${selectedDialCode.isoCode.toLowerCase()}.png`,
                      }}
                      style={styles.flagImageSmall}
                    />
                    <Icons.Feather name="chevron-down" size={16} color="#475569" />
                  </TouchableOpacity>

                  <View style={styles.adaloInputCol}>
                    <Text style={styles.adaloInputLabel}>Phone number*</Text>
                    <View style={styles.adaloNumberRow}>
                      <Text style={styles.adaloDialCodePrefix}>
                        +{selectedDialCode.phonecode}
                      </Text>
                      <TextInput
                        style={styles.adaloTextInput}
                        placeholder=""
                        keyboardType="phone-pad"
                        onChangeText={handleChange('phone_number')}
                        onBlur={handleBlur('phone_number')}
                        value={values.phone_number}
                      />
                    </View>
                  </View>
                </View>
                {touched.phone_number && errors.phone_number && (
                  <Text style={styles.errorText}>{errors.phone_number}</Text>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Country</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.selectTile}
                  onPress={() => setCountryModalVisible(true)}>
                  {selectedCountry ? (
                    <View style={styles.tileSelectedRow}>
                      <Image
                        source={{
                          uri: `https://flagcdn.com/w40/${selectedCountry.isoCode.toLowerCase()}.png`,
                        }}
                        style={styles.flagImageSmall}
                      />
                      <Text style={styles.selectTileText}>{selectedCountry.name}</Text>
                    </View>
                  ) : (
                    <Text style={styles.selectTilePlaceholder}>Select Country</Text>
                  )}
                  <Icons.Feather name="chevron-down" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>State</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.selectTile}
                  onPress={() => setStateModalVisible(true)}>
                  <Text style={selectedState ? styles.selectTileText : styles.selectTilePlaceholder}>
                    {selectedState ? selectedState.name : 'Select State'}
                  </Text>
                  <Icons.Feather name="chevron-down" size={20} color="#64748B" />
                </TouchableOpacity>
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
                        : 'Tap to select exact coordinates'}
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
                <Text style={styles.googleBtnText}>
                  Continue with Google ({role === 0 ? 'User' : 'Provider'})
                </Text>
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

      <Modal
        visible={dialCodeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDialCodeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Country Code</Text>
              <TouchableOpacity onPress={() => setDialCodeModalVisible(false)}>
                <Icons.Ionicons name="close-circle" size={26} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Icons.Feather name="search" size={18} color="#94A3B8" />
              <TextInput
                placeholder="Search country or country code..."
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={item => item.isoCode}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => onDialCodeSelect(item)}>
                  <View style={styles.dialOptionLeft}>
                    <Image
                      source={{
                        uri: `https://flagcdn.com/w40/${item.isoCode.toLowerCase()}.png`,
                      }}
                      style={styles.flagImageOption}
                    />
                    <Text style={styles.optionText}>{item.name}</Text>
                  </View>
                  <Text style={styles.dialCodeBadge}>+{item.phonecode}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={countryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCountryModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
                <Icons.Ionicons name="close-circle" size={26} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Icons.Feather name="search" size={18} color="#94A3B8" />
              <TextInput
                placeholder="Search country..."
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={item => item.isoCode}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => onCountrySelect(item)}>
                  <View style={styles.dialOptionLeft}>
                    <Image
                      source={{
                        uri: `https://flagcdn.com/w40/${item.isoCode.toLowerCase()}.png`,
                      }}
                      style={styles.flagImageOption}
                    />
                    <Text style={styles.optionText}>{item.name}</Text>
                  </View>
                  {selectedCountry?.isoCode === item.isoCode && (
                    <Icons.Feather name="check" size={18} color={color.defalt} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={stateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setStateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select State</Text>
              <TouchableOpacity onPress={() => setStateModalVisible(false)}>
                <Icons.Ionicons name="close-circle" size={26} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Icons.Feather name="search" size={18} color="#94A3B8" />
              <TextInput
                placeholder="Search state..."
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredStates}
              keyExtractor={item => item.isoCode}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => onStateSelect(item)}>
                  <Text style={styles.optionText}>{item.name}</Text>
                  {selectedState?.isoCode === item.isoCode && (
                    <Icons.Feather name="check" size={18} color={color.defalt} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  logoRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 90,
    height: 90,
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
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
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
    fontSize: 14,
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

  // Soft Phone Input Box
  adaloPhoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 52,
  },
  adaloFlagSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginRight: 10,
  },
  flagImageSmall: {
    width: 22,
    height: 15,
    borderRadius: 2,
    marginRight: 6,
  },
  flagImageOption: {
    width: 24,
    height: 16,
    borderRadius: 2,
    marginRight: 10,
  },
  adaloInputCol: {
    flex: 1,
    justifyContent: 'center',
  },
  adaloInputLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 1,
  },
  adaloNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adaloDialCodePrefix: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginRight: 4,
  },
  adaloTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    padding: 0,
    height: 24,
  },

  selectTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    height: 48,
    paddingHorizontal: 14,
  },
  tileSelectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectTileText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  selectTilePlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },
  locationBtnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  locationBtnCardActive: {
    backgroundColor: '#F0FDF4',
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

  // Modal Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    marginLeft: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  dialOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  dialCodeBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: color.defalt,
  },
});