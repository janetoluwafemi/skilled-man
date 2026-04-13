import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');
import {Formik} from 'formik';
import * as yup from 'yup';
import {configureLayoutAnimations} from 'react-native-reanimated/lib/typescript/reanimated2/core';
import C_InputScurEntry from '../../Components/C_InputSecureEntry';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import BotonComp from '../../Components/BtnComp';
import color from '../../Assets/colors/colors';
import { BASIC_URL } from '../Signin/Signin';
const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(10, 'Password must be at least 10 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must contain at least one uppercase letter and one lowercase letter',
    ),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const SetingFrgtPaswrd = props => {
  const navigation = useNavigation();

  const [checked, setChecked] = React.useState(false);
  const [hide, setHide] = React.useState(true);
  const [confirmhide, seConfirmtHide] = React.useState(true);
  const [load, setLoad] = React.useState(false);
  const route = useRoute();
  const email = route.params?.Email;
  console.log('email global',  global.forgetemail);
  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={async values => {
        // Add your navigation logic here

        try {
          setLoad(true);
          var myHeaders = new Headers();
          myHeaders.append('Cookie', 'PHPSESSID=jmv28htgkulr4v5gmt5n7us8go');
          var formdata = new FormData();
          formdata.append('email',  global.forgetemail);
          console.log('emailforgetpassword111',global.forgetemail)
        

          formdata.append('password', values.password);
          formdata.append('confirm_password', values.confirmPassword);

          const apiUrl =
            // 'https://fisdemoprojects.com/skilledman/api/user/resetpassword.php';
            `${BASIC_URL}user/resetpassword.php`;


          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow',
          };
          const response = await fetch(apiUrl, requestOptions);
          const result = await response.json();
          console.log('confirm rresponse:', result);

          if (result.success) {
            setLoad(false);
            Toast.show(result.success);
            navigation.navigate('Signin');
          } else if (result.error) {
            setLoad(false);
            Alert.alert(result.error);
          }
        } catch (error) {
          setLoad(false);
          Alert.alert(error);
        }
        //
      }}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <>
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
              <Text style={styles.accountVer}>Set Password</Text>
              <View style={styles.inputContainer}>
                <C_InputScurEntry
                  placeholder="Password"
                  placeholderTextColor={color.defalt}
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
              <View style={styles.inputContainer}>
                <C_InputScurEntry
                  placeholder="Confirm Password"
                  placeholderTextColor={color.defalt}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  icon="eye-off"
                  secureTextEntry={confirmhide}
                  onPress={() => seConfirmtHide(!confirmhide)}
                />

                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>
              <BotonComp
                BtnStyle={styles.BtnStyle}
                btnText={
                  load ? (
                    <ActivityIndicator size={28} color="#f8f8ff" />
                  ) : (
                    'Submit'
                  )
                }
                onPressFunc={() => {
                  handleSubmit(values);
                }}
              />
            </View>
          </ImageBackground>
        </>
      )}
    </Formik>
  );
};

export default SetingFrgtPaswrd;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '80%',
    flex: 0.6,
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
    marginTop: 70,
    marginBottom: 25,
  },
  logoImg: {
    width: width / 2,
    height: height / 4.6,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  signinText: {
    fontSize: 16,
    fontWeight: '400',
    color: color.wite,
    textAlign: 'center',
    marginTop: 8,
  },
  BtnStyle: {
    marginTop: 25,
    width: '100%',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
  },
  rememberStyle: {
    fontSize: 13,
    fontWeight: '500',
    color: color.drkGry,
    lineHeight: 25,
  },
  termsStyle: {
    fontSize: 13,
    fontWeight: '500',
    color: color.defalt,
    flexWrap: 'wrap',
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '85%',
    paddingVertical: 10,
    flexWrap: 'wrap',
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
    width: '80%',
  },
  headerIcon: {
    paddingLeft: 20,
  },
  accountVer: {
    color: color.defalt,
    fontSize: 25,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
