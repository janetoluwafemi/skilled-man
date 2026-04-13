import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import C_TxtInput from '../../Components/C_TextInput';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import {Checkbox} from 'react-native-paper';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import {useSelector, useDispatch} from 'react-redux';
const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');
import {setProviders} from '../../Redux/Actions/actions';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useAuth} from '../../context/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import C_InputScurEntry from '../../Components/C_InputSecureEntry';
import C_InputScurEntrylogin from '../../Components/C_InputSecureEntrylogin';
import {getToken} from '../../utilis/notification';
import GooglButon from '../../Components/GoogelBtn';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {CommonActions} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {tokens} from 'react-native-paper/lib/typescript/styles/themes/v3/tokens';
import UserTabs from '../../BottomNavigator/UserTabs';
import Modal from 'react-native-modal';
import NavigationService from '../../MainNavigation/NavigationService';




const SignupValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please Enter Your  Email')
    .matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, 'Please enter valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
    ),
});

const Frgtpasword1 = props => {
  // const dispatch = useDispatch();
  const initialValues = {
    email: '',
    password: '',
  };

  // const { providersa } = useSelector(state => state.ProvidersReducer);
  // console.log('🚀 ~ file: Main.js:9 ~ So ~ providersa:', providersa);
  const {state, dispatch} = useAuth();
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(false);
  const [userName, setuserName] = React.useState('');




 

  const handleNavigation = () => {
    navigation.navigate('ForgetpasswordOtpScreen', { userName });
  };



  return (
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
          <View style={styles.logoStyle}>
            <Image
              style={styles.logoImg}
              resizeMode="contain"
              source={require('../../Assets/Images/logo.png')}
            />
          </View>
          <View style={styles.inputContainer}>
            <C_TxtInput
              placeholder="Email"   
              placeholderTextColor={color.defalt}
              onChangeText={setuserName}
              value={userName}
            />

            {userName && !userName.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/) && (
              <Text style={styles.errorText}>Please enter a valid email</Text>
            )}
          </View>
        

          <BotonComp
                    BtnStyle={styles.acceptStyle}
                    btnTextStyle={{color: 'white'}}
                    btnText="Send Otp"
                    onPressFunc={ () => {
                     handleNavigation();
                      }}
                   
                  />
         

       </View>

     
      </ImageBackground>
    </>
  );
};

export default Frgtpasword1;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '100%',
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
    width: '80%',
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
    fontSize: 15,
    fontWeight: '500',
    color: color.drkGry,
  },
  forgot: {
    fontSize: 13,
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
    fontSize: 16,
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
  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 100,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '20%',
    height: '50%',
  },
  modalView: {
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: color.wite,
  },
  modalHeader: {
    backgroundColor: color.defalt,
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 19,
    color: color.wite,
    fontWeight: '600',
  },
  modalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: '90%',
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
});
