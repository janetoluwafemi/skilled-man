import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import C_TxtInput from '../../Components/C_TextInput';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const ALL_BANKS = [
  { id: '1', name: 'Access Bank' },
  { id: '2', name: 'Access Bank (Diamond)' },
  { id: '3', name: 'Citibank Nigeria' },
  { id: '4', name: 'Coronation Merchant Bank' },
  { id: '5', name: 'Ecobank Nigeria' },
  { id: '6', name: 'Fidelity Bank' },
  { id: '7', name: 'First Bank of Nigeria' },
  { id: '8', name: 'First City Monument Bank (FCMB)' },
  { id: '9', name: 'FSDH Merchant Bank' },
  { id: '10', name: 'Globus Bank' },
  { id: '11', name: 'Guaranty Trust Bank (GTBank)' },
  { id: '12', name: 'Heritage Bank' },
  { id: '13', name: 'Jaiz Bank' },
  { id: '14', name: 'Keystone Bank' },
  { id: '15', name: 'Kuda Microfinance Bank' },
  { id: '16', name: 'Lotus Bank' },
  { id: '17', name: 'Moniepoint Microfinance Bank' },
  { id: '18', name: 'Nova Merchant Bank' },
  { id: '19', name: 'OPay' },
  { id: '20', name: 'Optimus Bank' },
  { id: '21', name: 'PalmPay' },
  { id: '22', name: 'Parallex Bank' },
  { id: '23', name: 'Polaris Bank' },
  { id: '24', name: 'PremiumTrust Bank' },
  { id: '25', name: 'Providus Bank' },
  { id: '26', name: 'Rand Merchant Bank' },
  { id: '27', name: 'Rubies Bank' },
  { id: '28', name: 'Signature Bank' },
  { id: '29', name: 'Stanbic IBTC Bank' },
  { id: '30', name: 'Standard Chartered Bank Nigeria' },
  { id: '31', name: 'Sterling Bank' },
  { id: '32', name: 'SunTrust Bank Nigeria' },
  { id: '33', name: 'Taj Bank' },
  { id: '34', name: 'Titan Trust Bank' },
  { id: '35', name: 'Union Bank of Nigeria' },
  { id: '36', name: 'United Bank for Africa (UBA)' },
  { id: '37', name: 'Unity Bank' },
  { id: '38', name: 'VFD Microfinance Bank' },
  { id: '39', name: 'Wema Bank (ALAT)' },
  { id: '40', name: 'Zenith Bank' },
  { id: '41', name: 'Absa Bank' },
  { id: '42', name: 'Bank of America' },
  { id: '43', name: 'Bank of China' },
  { id: '44', name: 'Barclays' },
  { id: '45', name: 'BNP Paribas' },
  { id: '46', name: 'Citigroup' },
  { id: '47', name: 'Commonwealth Bank' },
  { id: '48', name: 'Credit Agricole' },
  { id: '49', name: 'DBS Bank' },
  { id: '50', name: 'Deutsche Bank' },
  { id: '51', name: 'First National Bank (FNB)' },
  { id: '52', name: 'Goldman Sachs' },
  { id: '53', name: 'HDFC Bank' },
  { id: '54', name: 'HSBC' },
  { id: '55', name: 'Industrial and Commercial Bank of China (ICBC)' },
  { id: '56', name: 'ING Group' },
  { id: '57', name: 'JPMorgan Chase' },
  { id: '58', name: 'Lloyds Bank' },
  { id: '59', name: 'Mitsubishi UFJ Financial Group (MUFG)' },
  { id: '60', name: 'Morgan Stanley' },
  { id: '61', name: 'National Australia Bank' },
  { id: '62', name: 'Nedbank' },
  { id: '63', name: 'Revolut' },
  { id: '64', name: 'Royal Bank of Canada (RBC)' },
  { id: '65', name: 'Santander' },
  { id: '66', name: 'Scotiabank' },
  { id: '67', name: 'Societe Generale' },
  { id: '68', name: 'Standard Bank' },
  { id: '69', name: 'State Bank of India (SBI)' },
  { id: '70', name: 'TD Bank' },
  { id: '71', name: 'UBS Group' },
  { id: '72', name: 'Wells Fargo' },
  { id: '73', name: 'Wise' },
];

const AddBankWithGoogle = props => {
  const navigation = useNavigation();
  const [inputFields, setInputFields] = useState([
    { bank: '', accountNumber: '' },
  ]);
  const [load, setLoad] = useState(false);

  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [searchBankQuery, setSearchBankQuery] = useState('');

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

  const openBankPicker = index => {
    setActiveCardIndex(index);
    setSearchBankQuery('');
    setBankModalVisible(true);
  };

  const onBankSelect = bankItem => {
    handleInputChange(bankItem.name, activeCardIndex, 'bank');
    setBankModalVisible(false);
    setSearchBankQuery('');
  };

  const filteredBanks = ALL_BANKS.filter(b =>
    b.name.toLowerCase().includes(searchBankQuery.toLowerCase())
  );

  const addBankDetail = async () => {
    const isAnyBankEmpty = inputFields.some(field => !field.bank.trim());
    const isAnyAccountNumberEmpty = inputFields.some(
      field => !field.accountNumber.trim()
    );

    if (isAnyBankEmpty || isAnyAccountNumberEmpty) {
      showToast('Please select all bank names and enter account numbers.');
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
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.selectTile}
                  onPress={() => openBankPicker(index)}>
                  <Text
                    style={
                      field.bank ? styles.selectTileText : styles.selectTilePlaceholder
                    }>
                    {field.bank || 'Select Bank'}
                  </Text>
                  <Icons.Feather name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>
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

      <Modal
        visible={bankModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBankModalVisible(false)}>
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Bank</Text>
              <TouchableOpacity onPress={() => setBankModalVisible(false)}>
                <Icons.Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Icons.Feather name="search" size={18} color="#94A3B8" />
              <TextInput
                placeholder="Search bank..."
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
                value={searchBankQuery}
                onChangeText={setSearchBankQuery}
              />
            </View>

            <FlatList
              data={filteredBanks}
              keyExtractor={item => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => onBankSelect(item)}>
                  <View style={styles.dialOptionLeft}>
                    <Text style={styles.optionText}>{item.name}</Text>
                  </View>
                  {inputFields[activeCardIndex]?.bank === item.name && (
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

export default AddBankWithGoogle;

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
  selectTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 52,
    paddingHorizontal: 16,
  },
  selectTileText: {
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
  },
  selectTilePlaceholder: {
    fontSize: 14.5,
    color: '#94A3B8',
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
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 18,
    maxHeight: '75%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 -10px 30px rgba(15, 23, 42, 0.15)' }
      : {
        elevation: 10,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      }),
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    marginLeft: 8,
    padding: 0,
    ...(Platform.OS === 'web' && {
      outlineWidth: 0,
      outlineColor: 'transparent',
      outlineStyle: 'none',
      borderStyle: 'none',
    }),
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
});
