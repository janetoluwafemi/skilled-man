import React, {useState, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import C_TxtInput from '../../Components/C_TextInput';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import {Checkbox} from 'react-native-paper';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import C_Dropdwn from '../../Components/C_Dropdown';
import InputWIcon from '../../Components/InputWithIcon';
import {Icon} from 'native-base';
import {Icons} from '../../Components/Icons';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
import {Picker} from '@react-native-picker/picker';
import {configureLayoutAnimations} from 'react-native-reanimated/lib/typescript/reanimated2/core';
import {Bnkdatatype} from '../../constants/Banktypes';
import Toast from 'react-native-simple-toast';
import C_InputScurEntry from '../../Components/C_InputSecureEntry';
import Dsablbtn from '../../Components/Disablebtn';
import C_TaxInput from '../../Components/C_Taxinput';
import { BASIC_URL } from '../Signin/Signin';

const AdBnkGogl = props => {
  const navigation = useNavigation();
  const pickerRef = useRef();
  const [inputFields, setInputFields] = useState([
    {bank: 'Select Bank', accountNumber: ''}, // Initial item
  ]);
  const [hide, setHide] = React.useState(false);
  // const [bankdata, setBankdata] = useState(null);

  const [bankdata, setBankdata] = useState([]);
  const [bank, setBank] = useState([]);

  const [load, setLoad] = React.useState(false);
  const addInputField = () => {
    setInputFields([...inputFields, {bank: '', accountNumber: ''}]);
  };

  const removeInputField = index => {
    if (index !== 0) {
      const updatedFields = [...inputFields];
      updatedFields.splice(index, 1);
      setInputFields(updatedFields);
    }
  };

  const handleBankChange = (value, index) => {
    console.log('value u selected', value);
    if (index >= 0 && index < inputFields.length) {
      const updatedFields = [...inputFields];
      updatedFields[index].bank = value;
      setInputFields(updatedFields);
    }
  };

  const handleInputChange = (text, index, fieldName) => {
    const numericText = text.replace(/[^0-9]/g, '');

    // Limit to 10 digits
    const limitedText = numericText.slice(0, 10);
    const updatedFields = [...inputFields];
    updatedFields[index][fieldName] = limitedText;
    setInputFields(updatedFields);
  };



  
  const addBankdetail = async () => {
    console.log('selected inputFields', inputFields);

    // navigation.navigate('AddTax')
    // Check if any account number is empty
    const isAnyAccountNumberEmpty = inputFields.some(
      field => field.accountNumber === '',
    );

    if (isAnyAccountNumberEmpty) {
      // Toast.show('Please fill all account numbers.');
      Toast.showWithGravity(
        'Please fill all account numbers.',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    const invalidAccountNumber = inputFields.find(
      field => field.accountNumber.length !== 10,
    );

    if (invalidAccountNumber) {
      Toast.show(
        'Account numbers should have exactly 10 characters.',
        Toast.LONG,
        {
          backgroundColor: 'blue',
        },
      );

      return;
    }

    try {
      setLoad(true);
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=eddcih6nlqteh4o8jvflmsa5vn');

      var formdata = new FormData();
      formdata.append('user_id', global.gid);
      inputFields.forEach((field, index) => {
        //formdata.append(`bank_${index}`, field.bank);
        formdata.append(`bank_`, bank);

        formdata.append(`account_number_${index}`, field.accountNumber);
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // fetch(
      //   'https://fisdemoprojects.com/skilledman/api/add_bank.php',
      //   requestOptions,
      // )
      fetch(
        `${BASIC_URL}add_bank.php`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          if (result) {
            setLoad(false);
            console.log(
              'response comming from backend add bank',
              result.status,
            );
            navigation.goBack();
            // navigation.navigate('AddTax', props.route.params)
          }
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      setLoad(false);
      console.log(error);
    }
  };
  const handleBankSelect = selectedValue => {
    // You can do something with the selected value here, like set it in the state or use it in an API call.
    // console.log("Selected Business:", selectedValue);
    setBankdata(selectedValue);
  };

  useEffect(() => {
    const bankdetail = async () => {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=eddcih6nlqteh4o8jvflmsa5vn');

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      // fetch(
      //   'https://fisdemoprojects.com/skilledman/api/get_bank.php',
      //   requestOptions,
      // )
      fetch(
        `${BASIC_URL}get_bank.php`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          if (result && result.bankdetail) {
            console.log(
              'result to set in bank',
              typeof result.bankdetail,
              result.bankdetail,
            );
            setBankdata(result.bankdetail);
          }
        })
        .catch(error => console.log('error', error));
    };
    bankdetail();
  }, []);

  // useEffect(() => {
  //   const checkAccountNumbersValidity = () => {
  //     const allValid = inputFields.every(field => field.accountNumber.length === 14);
  //     setAreAccountNumbersValid(allValid);
  //   };

  //   checkAccountNumbersValidity();
  // }, [inputFields]);
  console.log('bank data', bankdata);
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
        {/* <Picker
          selectedValue={bank}
          onValueChange={(itemValue, itemIndex) => {
            setBank(itemValue); 
          
          }}>
          {bankdata?.map((bank, index) => (
            <Picker.Item
              key={index}
              label={bank.banks}
              value={bank.banks} 
            />
          ))}
        </Picker> */}

       
        <View style={styles.container}>
          <Text style={styles.accountVer}>Add Bank</Text>
          {inputFields.map((field, index) => (
            <View key={index} style={[styles.fieldRow]}>
              <View style={styles.dropdownContainer}>
                <C_TxtInput
                  placeholder="Bank"
                  placeholderTextColor={color.defalt}
                  onChangeText={text => handleInputChange(text, index, 'bank')}
                />
              </View>
              {/* <View style={styles.DropDownContainer}>
            <Picker
          selectedValue={bank} 
          onValueChange={(itemValue, itemIndex) => {
            setBank(itemValue);
          
          }}>
          {bankdata?.map((bank, index) => (
            <Picker.Item
              key={index}
              label={bank.banks}
              value={bank.banks} 
            />
          ))}
        </Picker>
          </View> */}
              <View style={styles.inputContainer}>
                 <C_TxtInput
                                  placeholder="Account Number"
                                  placeholderTextColor={color.defalt}
                                  onChangeText={text => handleInputChange(text, index, 'accountNumber')}
                                />
                {/* <C_InputScurEntry
                  placeholder="Account Number"
                  secureTextEntry={hide}
                  // icon="eye-off"
                  placeholderTextColor={color.defalt}
                  onChangeText={text =>
                    handleInputChange(text, index, 'accountNumber')
                  }
                  onPress={() => setHide(!hide)}
                /> */}
              </View>
              {index !== 0 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeInputField(index)}>
                  <Icons.FontAwesome5
                    name="trash"
                    color={color.rd}
                    size={15}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addMore} onPress={addInputField}>
            <Icons.FontAwesome5 name="plus" color={color.defalt} size={15} />
            <Text style={styles.moreStyle}> Add More</Text>
          </TouchableOpacity>
          <BotonComp
            BtnStyle={styles.BtnStyle}
            btnText={
              load ? <ActivityIndicator size={28} color="#f8f8ff" /> : 'Next'
            }
            onPressFunc={() => {
              addBankdetail();
            }}
          />
        </View>
      </ImageBackground>
    </>
  );
};

export default AdBnkGogl;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '80%',
    flex: 0.7,
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
  // DropDownContainer: {
  //   borderColor: color.default,
  //   borderWidth: 1,
  //   paddingHorizontal: 5,
  //   width: '100%',
  //   borderRadius: 6,
  //   marginTop: 6,
  //   height: 53,
  // },
  dropdownContainer: {
    // justifyContent: 'center',
    // alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
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
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 12,
  },
  rememberStyle: {
    fontSize: 17,
    fontWeight: '500',
    color: color.drkGry,
    lineHeight: 25,
  },
  termsStyle: {
    fontSize: 17,
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
  addMore: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 7,
  },
  moreStyle: {
    color: color.defalt,
    fontSize: 16,
    textAlign: 'left',
  },
  fieldRow: {
    width: '100%',
  },
  removeButton: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
  },

  DropDownContainer: {
    borderColor: color.defalt,
    borderWidth: 1,
    paddingHorizontal: 5,
    width: '100%',
    borderRadius: 6,
    marginTop: 6,
    height: 53,
    marginBottom:15
  },
  itemsStyle: {
    color: color.wite,
    fontWeight: '400',
  },
  containerStyle: {
    zIndex: 100,
  },
});
