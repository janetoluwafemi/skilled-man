import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import C_TxtInput from '../../Components/C_TextInput';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const { width } = Dimensions.get('window');

const AdBnkGogl = props => {
  const navigation = useNavigation();
  const [inputFields, setInputFields] = useState([
    { bank: '', accountNumber: '' },
  ]);
  const [load, setLoad] = useState(false);

  const addInputField = () => {
    setInputFields([...inputFields, { bank: '', accountNumber: '' }]);
  };

  const removeInputField = index => {
    if (index !== 0) {
      const updatedFields = [...inputFields];
      updatedFields.splice(index, 1);
      setInputFields(updatedFields);
    }
  };

  const handleInputChange = (text, index, fieldName) => {
    const updatedFields = [...inputFields];

    if (fieldName === 'accountNumber') {
      const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
      updatedFields[index][fieldName] = numericText;
    } else {
      updatedFields[index][fieldName] = text;
    }

    setInputFields(updatedFields);
  };

  const addBankDetail = async () => {
    const isAnyBankEmpty = inputFields.some(field => !field.bank.trim());
    const isAnyAccountNumberEmpty = inputFields.some(
      field => !field.accountNumber.trim()
    );

    if (isAnyBankEmpty || isAnyAccountNumberEmpty) {
      Toast.showWithGravity(
        'Please fill all bank names and account numbers.',
        Toast.LONG,
        Toast.CENTER
      );
      return;
    }

    const invalidAccountNumber = inputFields.find(
      field => field.accountNumber.length !== 10
    );

    if (invalidAccountNumber) {
      Toast.showWithGravity(
        'Account numbers should have exactly 10 digits.',
        Toast.LONG,
        Toast.CENTER
      );
      return;
    }

    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('user_id', global.gid || global.id);

      inputFields.forEach((field, index) => {
        formdata.append(`bank_${index}`, field.bank);
        formdata.append(`account_number_${index}`, field.accountNumber);
      });

      const response = await fetch(`${BASIC_URL}add_bank.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoad(false);

      if (result) {
        Toast.show('Bank details added successfully.');
        navigation.goBack();
      }
    } catch (error) {
      setLoad(false);
      Toast.show('Failed to add bank details.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../Assets/Images/bg.png')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <CstmHeaderIcon
          onPress={() => props.navigation.goBack()}
          headerIcon={styles.headerIcon}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.accountVer}>Add Bank</Text>

            {inputFields.map((field, index) => (
              <View key={index} style={styles.fieldRow}>
                <View style={styles.dropdownContainer}>
                  <C_TxtInput
                    placeholder="Bank Name"
                    placeholderTextColor={color.defalt}
                    value={field.bank}
                    onChangeText={text => handleInputChange(text, index, 'bank')}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <C_TxtInput
                    placeholder="Account Number (10 digits)"
                    placeholderTextColor={color.defalt}
                    value={field.accountNumber}
                    keyboardType="numeric"
                    onChangeText={text =>
                      handleInputChange(text, index, 'accountNumber')
                    }
                  />
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
                load ? <ActivityIndicator size="small" color="#f8f8ff" /> : 'Next'
              }
              onPressFunc={addBankDetail}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AdBnkGogl;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '80%',
  },
  headerIcon: {
    paddingLeft: 20,
  },
  accountVer: {
    color: color.defalt,
    fontSize: 25,
    marginBottom: 25,
    fontWeight: 'bold',
  },
  fieldRow: {
    width: '100%',
    marginBottom: 10,
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 8,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  removeButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addMore: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  moreStyle: {
    color: color.defalt,
    fontSize: 15,
    fontWeight: '600',
  },
  BtnStyle: {
    marginTop: 20,
    width: '100%',
  },
});