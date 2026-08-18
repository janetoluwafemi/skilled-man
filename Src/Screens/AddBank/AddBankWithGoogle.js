import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import C_TxtInput from '../../Components/C_TextInput';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const AddBankGoggle = props => {
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
      showToast('Please fill all bank names and account numbers.');
      return;
    }

    const invalidAccountNumber = inputFields.find(
      field => field.accountNumber.length !== 10
    );

    if (invalidAccountNumber) {
      showToast('Account numbers should have exactly 10 digits.');
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
        showToast('Bank details added successfully.');
        navigation.goBack();
      }
    } catch (error) {
      setLoad(false);
      showToast('Failed to add bank details.');
    }
  };

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
      </View>

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
              <Icons.Ionicons
                name="card-outline"
                size={34}
                color={color.defalt}
              />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Add Bank Details</Text>
          <Text style={styles.welcomeSubtitle}>
            Provide your payout account details to receive earnings directly.
          </Text>

          {inputFields.map((field, index) => (
            <View key={index} style={styles.cardWrapper}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardCountTitle}>
                  Bank Account #{index + 1}
                </Text>
                {index !== 0 && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.deleteBadge}
                    onPress={() => removeInputField(index)}>
                    <Icons.Feather name="trash-2" color="#EF4444" size={16} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Bank Name</Text>
                <C_TxtInput
                  placeholder="e.g. Access Bank"
                  placeholderTextColor={color.litGry}
                  value={field.bank}
                  onChangeText={text => handleInputChange(text, index, 'bank')}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Account Number (10 digits)</Text>
                <C_TxtInput
                  placeholder="0123456789"
                  placeholderTextColor={color.litGry}
                  value={field.accountNumber}
                  keyboardType="numeric"
                  maxLength={10}
                  onChangeText={text =>
                    handleInputChange(text, index, 'accountNumber')
                  }
                />
              </View>
            </View>
          ))}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.addMoreBtn}
            onPress={addInputField}>
            <Icons.Feather name="plus-circle" color={color.defalt} size={18} />
            <Text style={styles.addMoreText}>Add Another Account</Text>
          </TouchableOpacity>

          <BotonComp
            BtnStyle={styles.submitBtn}
            btnText={
              load ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                'Save & Continue'
              )
            }
            onPressFunc={addBankDetail}
          />
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddBankGoggle;

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
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardCountTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  deleteBadge: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  fieldGroup: {
    marginBottom: 12,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginVertical: 6,
  },
  addMoreText: {
    color: color.defalt,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 14,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});