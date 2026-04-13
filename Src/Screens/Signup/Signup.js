import React, {useState, useEffect, useRef} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  ActivityIndicator,
} from 'react-native';
import C_TxtInput from '../../Components/C_TextInput';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import {Checkbox, TextInput} from 'react-native-paper';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import GooglButon from '../../Components/GoogelBtn';
const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');
import {Formik} from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-simple-toast';
import {Country, State, City, getAllCountries} from 'country-state-city';
import {Picker} from '@react-native-picker/picker';
//import PhoneInput, {getCountryCallingCode} from 'react-native-phone-input';
import PhoneInput from 'react-native-phone-input';
import {_signInwithGoogle} from '../../utilis/firbase';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '';
// import Modal from 'react-native-modal';
import Mapltln from './Maps';
import C_TxtInputNo from '../../Components/C_TExtinputno';
import {BASIC_URL} from '../Signin/Signin';

const SignupValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Too Short')
    .max(70, 'Too Long')
    .required('Please Enter Your First Name'),
  email: yup
    .string()
    .required('Please Enter Your  Email')
    .matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, 'Please enter valid email'),
  phone_number: yup
    .string()
    .max(15)
    .required('Phone Number is Required')
    .matches(/^\d+$/, 'Phone Number must be integer'),
  // whatsapp: yup
  //   .string()
  //   .max(15)
  //   .required('Phone Number is Required')
  //   .matches(/^\d+$/, 'whatsapp Number must be integer'),
  address: yup
    .string()
    .min(3, 'Too Short')
    .max(500, 'Too Long')
    .required('Please Enter Street Name'),
});

const Signup = props => {
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(false);
  const [isSwitchOn, setIsEnabled] = useState(false);
  const [role, setRole] = useState(0);
  const [load, setLoad] = React.useState(false);
  // const [selectedCountry, setSelectedCountry] = useState('');
  // const [selectedState, setSelectedState] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryError, setCountryError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const pickerRef = useRef();
  const stateRef = useRef();
  const defaultStateIsoCode = 'LA';

  // Use React.useState to manage the selected state
  const [selectedState, setSelectedState] = React.useState(defaultStateIsoCode);

  useEffect(() => {
    console.log('Selected State:', selectedState);
  }, [selectedState]);

  const defaultCountryIsoCode = 'NG';

  // Use React.useState to manage the selected country state
  const [selectedCountry, setSelectedCountry] = React.useState(
    defaultCountryIsoCode,
  );

  // console.log('State values ', State.getAllStates());

  const [phoneNumber, setPhoneNumber] = React.useState('');
  const phoneInput = useRef(null);
  const [CountryCodeValue, setCountryCode] = useState('ng');
  const [CountryId, setCountryId] = useState('1');

  const focus = useIsFocused();
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    if (role === 1) {
      setRole(0);
    } else {
      setRole(1);
    }
  };
  console.log('role value and type', typeof role);
  const initialValues = {
    name: '',
    email: '',
    phone_number: '',
    // whatsapp: '',
    address: '',
    association: '',
  };

  useEffect(() => {
    const fetchState = async () => {
      try {
        var myHeaders = new Headers();
        myHeaders.append(
          'Cookie',
          'PHPSESSID=2a1286fffb4c2a53ccfdd18329031f71',
        );

        var formdata = new FormData();

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow',
        };
        apiUrl =
          'https://koboautos.com/shipafrika/member/ajaxfiles/state_code.php?id=3811';

        const response = await fetch(apiUrl, requestOptions);
        const result = await response.json();
        if (result) {
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchState();
  }, []);

  useEffect(() => {
    // Load the list of countries when the component mounts
    const countriesData = Country.getAllCountries();
    setCountries(countriesData);
  }, [focus]);

  const onCountryChange = countryCode => {
    setSelectedCountry(countryCode);
    setSelectedState('');
    const countryStates = State.getStatesOfCountry(countryCode);
    setStates(countryStates);
    // setCountryError(false);
  };

  const handleStateChange = stateCode => {
    console.log('Selected state:', stateCode);
    setSelectedState(stateCode); // Update the state with the selected value
    // ...
  };

  // async function googleSignIn() {
  //   _signInwithGoogle().then(data => {
  //     if (!data) {
  //       console.log('=>Error:', 'No Data');
  //       return;
  //     }
  //     console.log('=>Success', data);
  //   });
  // }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupValidationSchema}
      onSubmit={async value => {
        // Handle form submission here
        console.log('Form data submitted:', states);
        console.log('Form data selectedStatesubmitted:', selectedState);
        console.log('Form data selectedCountrysubmitted:', selectedCountry);
        // navigation.navigate('OtpScreen');
        try {
          setLoad(true);
          var myHeaders = new Headers();

          // if (selectedCountry == '' || selectedState == '') {
          //   return;
          // }
          myHeaders.append('Cookie', 'PHPSESSID=repq4egpdnsd7ikh50kjova7jd');

          const formdata = new FormData();

          formdata.append('name', value.name);
          formdata.append('phone_number', value.phone_number);
          // formdata.append('whatsapp', value.whatsapp);
          formdata.append('address', value.address);
          formdata.append('state', selectedState);
          formdata.append('role', role);
          formdata.append('email', value.email);
          formdata.append('account', 'Verified');
          formdata.append('country', selectedCountry);
          formdata.append('association', value.association);
          formdata.append('latitude', global.lat);
          formdata.append('longitude', global.long);

          // Define the API endpoint
          // const apiUrl ='https://fisdemoprojects.com/skilledman/api/otp_register.php';
          const apiUrl = `${BASIC_URL}otp_register.php`;

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow',
          };
          const response = await fetch(apiUrl, requestOptions);

          const result = await response.json();
          console.log('API response:', result);
          if (result) {
            setLoad(false);
            global.id = result.id;
            global.name = result.name;
            global.role = result.role;
            global.name = result.name;
            global.email = result.email;
            global.address = result.address;
            global.phone_number = result.phone_number;
            if (!result.error) {
              navigation.navigate('OtpScreen', {result});
            } else if (result.error) {
              Toast.showWithGravity(result.error, Toast.LONG, Toast.CENTER);
            }
          } else {
            setLoad(false);
            // Handle the case where status is not true (e.g., show an error message)
            console.error('API response indicates an error.');
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
        isValid,
      }) => (
        <ScrollView>
          <ImageBackground
            source={require('../../Assets/Images/bg.png')}
            resizeMode="cover"
            style={styles.backgroundImg}>
            <CstmHeaderIcon
              onPress={() => {
                props.navigation.goBack();
              }}
              headerIcon={styles.headerIcon}
            />
            <View style={styles.container}>
              <TouchableOpacity
                onPress={toggleSwitch}
                style={styles.switchContainer}>
                <Text
                  style={
                    isSwitchOn ? styles.selectedText : styles.unselectedText
                  }>
                  User
                </Text>
                <Switch
                  value={isSwitchOn}
                  onValueChange={toggleSwitch}
                  style={styles.switch}
                />
                <Text
                  style={
                    isSwitchOn ? styles.unselectedText : styles.selectedText
                  }>
                  Provider
                </Text>
              </TouchableOpacity>
              <View style={styles.logoStyle}>
                <Image
                  style={styles.logoImg}
                  resizeMode="contain"
                  source={require('../../Assets/Images/logo.png')}
                />
              </View>
              <View style={styles.inputContainer}>
                <C_TxtInput
                  placeholder="Full Name"
                  placeholderTextColor={color.defalt}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {touched.name && errors.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}
              </View>
              <View style={styles.inputContainer}>
                <C_TxtInput
                  placeholder="Email"
                  placeholderTextColor={color.defalt}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {touched.email && errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.numberinputContainer}>
                <View style={{marginLeft: '30%', width: '30%', height: '50%'}}>
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={phoneNumber}
                    onSelectCountry={values => {
                      setCountryId(phoneInput.current.getCountryCode());
                      setCountryCode(values);
                    }}
                    containerStyle={styles.phoneContainer}
                    textContainerStyle={styles.textInput}
                    onPressConfirm={v => {
                      console.log(v);
                    }}
                    textStyle={{color: 'black'}}
                    flagStyle={styles.flagImg}
                    //defaultCountry="NG"
                    defaultCode="DM"
                    layout="second"
                    withShadow
                    initialCountry="ng"
                    // autoFocus
                  />
                </View>

                {/* <TextInput
                
                  placeholder="Phone Number"
                  placeholderTextColor={color.default}
                  onChangeText={handleChange('phone_number')}
                  //  onChangeText={setPhoneNumber}

                  onBlur={handleBlur('phone_number')}
                  value={values.phone_number}
                  style={{
                    backgroundColor: 'transparent',
                    marginBottom: -10,
                    flex: 1, // Allow the TextInput to take the remaining space
                    marginLeft: '1%', // 
                  }}
                />
                {touched.phone_number && errors.phone_number ? (
                  <Text style={styles.errorText}>{errors.phone_number}</Text>
                ) : null} */}

                <C_TxtInputNo
                  placeholder="Phone Number"
                  placeholderTextColor={color.defalt}
                  onChangeText={handleChange('phone_number')}
                  //  onChangeText={setPhoneNumber}

                  onBlur={handleBlur('phone_number')}
                  value={values.phone_number}
                  style={{color: 'black'}}
                />
                {touched.phone_number && errors.phone_number ? (
                  <Text style={styles.errorText}>{errors.phone_number}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.DropDownContainer}>
                  <Picker
                    ref={pickerRef}
                    selectedValue={selectedCountry}
                    onValueChange={itemValue => onCountryChange(itemValue)}
                    enabled={true}
                    mode={'dialog'}
                    dropdownIconColor={color.defalt}
                    selectionColor={color.ylow}
                    itemStyle={styles.itemsStyle}>
                    <Picker.Item
                      label="Select Country"
                      value=""
                      color={color.defalt}
                      fontWeight="bold"
                      fontSize={17}
                    />
                    {countries.map((country, index) => (
                      <Picker.Item
                        key={country.isoCode}
                        label={country.name}
                        value={country.isoCode}
                        color={color.defalt}
                        style={{
                          fontWeight: 'bold',
                          fontSize: 17,
                          backgroundColor: 'white',
                        }}
                      />
                    ))}
                  </Picker>
                </View>
                {countryError && (
                  <Text style={styles.errorText}>Please select a country.</Text>
                )}
              </View>

              {selectedCountry && (
                <View style={styles.inputContainer}>
                  <View style={styles.DropDownContainer}>
                    <Picker
                      ref={pickerRef}
                      selectedValue={selectedState}
                      onValueChange={itemValue => handleStateChange(itemValue)}
                      enabled={true}
                      mode={'dialog'}
                      //  dropdownIconColor={color.default}
                      //  selectionColor={color.yellow}
                      // itemStyle={styles.itemsStyle}
                    >
                      <Picker.Item
                        label="Lagos"
                        value=""
                        color={color.defalt}
                        style={{fontWeight: 'bold', fontSize: 17}}
                      />
                      {states?.map((state, index) => (
                        <Picker.Item
                          key={state.isoCode}
                          label={state.name}
                          value={state.isoCode}
                          color={color.defalt}
                          style={{
                            fontWeight: 'bold',
                            fontSize: 17,
                            backgroundColor: 'white',
                          }}
                        />
                      ))}
                    </Picker>
                  </View>
                  {stateError && (
                    <Text style={styles.errorText}>Please select a state</Text>
                  )}
                </View>
              )}
              <View style={styles.inputContainer}>
                <C_TxtInput
                  placeholder="Address"
                  placeholderTextColor={color.defalt}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={values.address}
                />
                {touched.address && errors.address ? (
                  <Text style={styles.errorText}>{errors.address}</Text>
                ) : null}
              </View>
              {role === 0 ? (
                <View style={styles.inputContainer}>
                  <C_TxtInput
                    placeholder="Association"
                    placeholderTextColor={color.defalt}
                    onChangeText={handleChange('association')}
                    onBlur={handleBlur('association')}
                    value={values.association}
                  />
                  {touched.association && errors.association ? (
                    <Text style={styles.errorText}>{errors.association}</Text>
                  ) : null}
                </View>
              ) : null}

              <BotonComp
                BtnStyle={styles.BtnStyle}
                btnText={
                  load ? (
                    <ActivityIndicator size={28} color="#f8f8ff" />
                  ) : (
                    'Get Current Location'
                  )
                }
                onPressFunc={() => {
                  navigation.navigate('Maplatln');
                }}
                isValid={isValid}
              />
              <BotonComp
                BtnStyle={styles.BtnStyle}
                btnText={
                  load ? (
                    <ActivityIndicator size={28} color="#f8f8ff" />
                  ) : (
                    'Next'
                  )
                }
                onPressFunc={() => {
                  handleSubmit(values);
                  // navigation.navigate('OtpScreen')
                }}
                isValid={isValid}
              />
              <TouchableOpacity
                style={styles.haveAccount}
                onPress={() => navigation.navigate('Signin')}>
                <Text style={styles.rememberStyle}>Already have account? </Text>
                <Text style={styles.registerNow}>Sign In</Text>
              </TouchableOpacity>
              {/* {isSwitchOn ? null : (
                <GoogleBtn
                  BtnStyle={styles.googleBtn}
                  btnText="Sign In with"
                  onPressFunc={() => {
                    googleSignIn();
                  }}
                  iconName="google"
                  btnTextStyle={styles.btnTextStyle}
                />
              )} */}
            </View>
          </ImageBackground>
        </ScrollView>
      )}
    </Formik>
  );
};

export default Signup;

const styles = StyleSheet.create({
  phoneContainer: {
    width: '100%',
    height: 10,
  },

  textInput: {
    fontSize: 12,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '90%',
    paddingVertical: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 10, // Adjust the font size
    marginTop: 3,
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  logoStyle: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  logoImg: {
    width: width / 2,
    height: height / 5,
  },
  inputContainer: {
    width: '80%',

    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  numberinputContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    height: '5.5%',
    paddingVertical: 10,
    fontSize: 17,
    paddingHorizontal: 20,
    borderColor: color.defalt,
    borderWidth: 1,
    // borderBottomColor: color.default,
    backgroundColor: 'transparent',
    borderRadius: 6,
  },
  signinText: {
    fontSize: 16,
    fontWeight: '400',
    color: color.wite,
    textAlign: 'center',
    marginTop: 8,
  },
  BtnStyle: {
    marginTop: 15,
    width: '80%',
  },
  fieldRequired: {
    color: color.drkRd,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    fontWeight: '600',
  },
  checkboxStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: color.drkGry,
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: 10,
  },
  registerNow: {
    color: color.defalt,
    fontWeight: '500',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  haveAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  headerIcon: {
    paddingLeft: 20,
  },
  googleBtn: {
    backgroundColor: color.wite,
    borderWidth: 2,
    borderColor: color.wite,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnTextStyle: {
    color: color.defalt,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.defalt,
    borderRadius: 8,
  },
  switch: {
    opacity: 0,
    width: 0,
  },
  selectedText: {
    color: color.wite,
    fontWeight: 'bold',
    fontSize: 19,
    backgroundColor: color.defalt,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: '30%',
    textAlign: 'center',
    borderRadius: 6,
  },
  unselectedText: {
    color: color.defalt,
    fontWeight: 'bold',
    fontSize: 19,
    backgroundColor: 'transparent',
    width: '30%',
    textAlign: 'center',
  },

  //
  DropDownContainer: {
    borderColor: color.defalt,
    borderWidth: 1,
    paddingHorizontal: 5,
    width: '100%',
    borderRadius: 6,
    marginTop: 6,
    height: 57,
    backgroundColor: 'white',
  },
  itemsStyle: {
    color: color.rd,
    fontWeight: '400',
  },
  containerStyle: {
    zIndex: 100,
  },
});
