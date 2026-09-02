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
  { id: '1', name: 'Access Bank', code: '044', country: 'Nigeria' },
  { id: '2', name: 'Access Bank (Diamond)', code: '063', country: 'Nigeria' },
  { id: '3', name: 'Citibank Nigeria', code: '023', country: 'Nigeria' },
  { id: '4', name: 'Coronation Merchant Bank', code: '559', country: 'Nigeria' },
  { id: '5', name: 'Ecobank Nigeria', code: '050', country: 'Nigeria' },
  { id: '6', name: 'Fidelity Bank', code: '070', country: 'Nigeria' },
  { id: '7', name: 'First Bank of Nigeria', code: '011', country: 'Nigeria' },
  { id: '8', name: 'First City Monument Bank (FCMB)', code: '214', country: 'Nigeria' },
  { id: '9', name: 'FSDH Merchant Bank', code: '501', country: 'Nigeria' },
  { id: '10', name: 'Globus Bank', code: '00103', country: 'Nigeria' },
  { id: '11', name: 'Guaranty Trust Bank (GTBank)', code: '058', country: 'Nigeria' },
  { id: '12', name: 'Heritage Bank', code: '030', country: 'Nigeria' },
  { id: '13', name: 'Jaiz Bank', code: '301', country: 'Nigeria' },
  { id: '14', name: 'Keystone Bank', code: '082', country: 'Nigeria' },
  { id: '15', name: 'Kuda Microfinance Bank', code: '50211', country: 'Nigeria' },
  { id: '16', name: 'Lotus Bank', code: '303', country: 'Nigeria' },
  { id: '17', name: 'Moniepoint Microfinance Bank', code: '50515', country: 'Nigeria' },
  { id: '18', name: 'Nova Merchant Bank', code: '561', country: 'Nigeria' },
  { id: '19', name: 'OPay', code: '999992', country: 'Nigeria' },
  { id: '20', name: 'Optimus Bank', code: '107', country: 'Nigeria' },
  { id: '21', name: 'PalmPay', code: '999991', country: 'Nigeria' },
  { id: '22', name: 'Parallex Bank', code: '104', country: 'Nigeria' },
  { id: '23', name: 'Polaris Bank', code: '076', country: 'Nigeria' },
  { id: '24', name: 'PremiumTrust Bank', code: '105', country: 'Nigeria' },
  { id: '25', name: 'Providus Bank', code: '101', country: 'Nigeria' },
  { id: '26', name: 'Rand Merchant Bank', code: '502', country: 'Nigeria' },
  { id: '27', name: 'Rubies Bank', code: '125', country: 'Nigeria' },
  { id: '28', name: 'Signature Bank', code: '106', country: 'Nigeria' },
  { id: '29', name: 'Stanbic IBTC Bank', code: '221', country: 'Nigeria' },
  { id: '30', name: 'Standard Chartered Bank Nigeria', code: '068', country: 'Nigeria' },
  { id: '31', name: 'Sterling Bank', code: '232', country: 'Nigeria' },
  { id: '32', name: 'SunTrust Bank Nigeria', code: '100', country: 'Nigeria' },
  { id: '33', name: 'Taj Bank', code: '302', country: 'Nigeria' },
  { id: '34', name: 'Titan Trust Bank', code: '102', country: 'Nigeria' },
  { id: '35', name: 'Union Bank of Nigeria', code: '032', country: 'Nigeria' },
  { id: '36', name: 'United Bank for Africa (UBA)', code: '033', country: 'Nigeria' },
  { id: '37', name: 'Unity Bank', code: '215', country: 'Nigeria' },
  { id: '38', name: 'VFD Microfinance Bank', code: '566', country: 'Nigeria' },
  { id: '39', name: 'Wema Bank (ALAT)', code: '035', country: 'Nigeria' },
  { id: '40', name: 'Zenith Bank', code: '057', country: 'Nigeria' },
  { id: '41', name: 'Absa Bank', code: 'ABSA', country: 'South Africa' },
  { id: '42', name: 'Bank of America', code: 'BOA', country: 'United States' },
  { id: '43', name: 'Bank of China', code: 'BOC', country: 'China' },
  { id: '44', name: 'Barclays', code: 'BARC', country: 'United Kingdom' },
  { id: '45', name: 'BNP Paribas', code: 'BNP', country: 'France' },
  { id: '46', name: 'Citigroup', code: 'CITI', country: 'United States' },
  { id: '47', name: 'Commonwealth Bank', code: 'CBA', country: 'Australia' },
  { id: '48', name: 'Credit Agricole', code: 'CA', country: 'France' },
  { id: '49', name: 'DBS Bank', code: 'DBS', country: 'Singapore' },
  { id: '50', name: 'Deutsche Bank', code: 'DB', country: 'Germany' },
  { id: '51', name: 'First National Bank (FNB)', code: 'FNB', country: 'South Africa' },
  { id: '52', name: 'Goldman Sachs', code: 'GS', country: 'United States' },
  { id: '53', name: 'HDFC Bank', code: 'HDFC', country: 'India' },
  { id: '54', name: 'HSBC', code: 'HSBC', country: 'United Kingdom' },
  { id: '55', name: 'Industrial and Commercial Bank of China (ICBC)', code: 'ICBC', country: 'China' },
  { id: '56', name: 'ING Group', code: 'ING', country: 'Netherlands' },
  { id: '57', name: 'JPMorgan Chase', code: 'JPMC', country: 'United States' },
  { id: '58', name: 'Lloyds Bank', code: 'LLOY', country: 'United Kingdom' },
  { id: '59', name: 'Mitsubishi UFJ Financial Group (MUFG)', code: 'MUFG', country: 'Japan' },
  { id: '60', name: 'Morgan Stanley', code: 'MS', country: 'United States' },
  { id: '61', name: 'National Australia Bank', code: 'NAB', country: 'Australia' },
  { id: '62', name: 'Nedbank', code: 'NED', country: 'South Africa' },
  { id: '63', name: 'Revolut', code: 'REV', country: 'United Kingdom' },
  { id: '64', name: 'Royal Bank of Canada (RBC)', code: 'RBC', country: 'Canada' },
  { id: '65', name: 'Santander', code: 'SAN', country: 'Spain' },
  { id: '66', name: 'Scotiabank', code: 'BNS', country: 'Canada' },
  { id: '67', name: 'Societe Generale', code: 'SOCGEN', country: 'France' },
  { id: '68', name: 'Standard Bank', code: 'SBG', country: 'South Africa' },
  { id: '69', name: 'State Bank of India (SBI)', code: 'SBI', country: 'India' },
  { id: '70', name: 'TD Bank', code: 'TD', country: 'Canada' },
  { id: '71', name: 'UBS Group', code: 'UBS', country: 'Switzerland' },
  { id: '72', name: 'Wells Fargo', code: 'WFB', country: 'United States' },
  { id: '73', name: 'Wise', code: 'WISE', country: 'Global' },
];

const AddBank = props => {
  const navigation = useNavigation();
  const [inputFields, setInputFields] = useState([
    {
      bank: '',
      bankCode: '',
      accountNumber: '',
      accountName: '',
      verifying: false,
      isVerified: false,
      error: '',
    },
  ]);
  const [load, setLoad] = useState(false);

  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [searchBankQuery, setSearchBankQuery] = useState('');

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        bank: '',
        bankCode: '',
        accountNumber: '',
        accountName: '',
        verifying: false,
        isVerified: false,
        error: '',
      },
    ]);
  };

  const removeInputField = index => {
    if (index !== 0) {
      const updatedFields = [...inputFields];
      updatedFields.splice(index, 1);
      setInputFields(updatedFields);
    }
  };

  const verifyBankAccount = async (accountNumber, bankCode, index) => {
    if (!accountNumber || accountNumber.length !== 10 || !bankCode) {
      return;
    }

    const updatedFields = [...inputFields];
    updatedFields[index].verifying = true;
    updatedFields[index].error = '';
    updatedFields[index].accountName = '';
    updatedFields[index].isVerified = false;
    setInputFields([...updatedFields]);

    try {
      const response = await fetch(`${BASIC_URL}verify_bank_account.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_number: accountNumber,
          bank_code: bankCode,
        }),
      });

      const result = await response.json();
      const currentFields = [...inputFields];
      currentFields[index].verifying = false;

      if (result && (result.status === true || result.account_name || result.data?.account_name)) {
        const resolvedName =
            result.account_name ||
            result.data?.account_name ||
            result.accountName ||
            'Verified Account';
        currentFields[index].accountName = resolvedName;
        currentFields[index].isVerified = true;
        currentFields[index].error = '';
      } else {
        currentFields[index].isVerified = false;
        currentFields[index].accountName = '';
        currentFields[index].error = result?.message || 'Could not verify account name';
      }
      setInputFields([...currentFields]);
    } catch (err) {
      const currentFields = [...inputFields];
      currentFields[index].verifying = false;
      currentFields[index].isVerified = false;
      currentFields[index].error = 'Verification failed. Check network.';
      setInputFields([...currentFields]);
    }
  };

  const handleInputChange = (text, index, fieldName) => {
    const updatedFields = [...inputFields];

    if (fieldName === 'accountNumber') {
      const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
      updatedFields[index][fieldName] = numericText;
      updatedFields[index].accountName = '';
      updatedFields[index].isVerified = false;
      updatedFields[index].error = '';
      setInputFields(updatedFields);

      if (numericText.length === 10 && updatedFields[index].bankCode) {
        verifyBankAccount(numericText, updatedFields[index].bankCode, index);
      }
    } else {
      updatedFields[index][fieldName] = text;
      setInputFields(updatedFields);
    }
  };

  const openBankPicker = index => {
    setActiveCardIndex(index);
    setSearchBankQuery('');
    setBankModalVisible(true);
  };

  const onBankSelect = bankItem => {
    const updatedFields = [...inputFields];
    updatedFields[activeCardIndex].bank = bankItem.name;
    updatedFields[activeCardIndex].bankCode = bankItem.code;
    updatedFields[activeCardIndex].accountName = '';
    updatedFields[activeCardIndex].isVerified = false;
    updatedFields[activeCardIndex].error = '';
    setInputFields(updatedFields);
    setBankModalVisible(false);
    setSearchBankQuery('');

    if (updatedFields[activeCardIndex].accountNumber.length === 10) {
      verifyBankAccount(
          updatedFields[activeCardIndex].accountNumber,
          bankItem.code,
          activeCardIndex
      );
    }
  };

  const filteredBanks = ALL_BANKS.filter(b =>
      b.name.toLowerCase().includes(searchBankQuery.toLowerCase())
  );

  const addBankDetails = async () => {
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

    const unverifiedField = inputFields.find(field => !field.isVerified);
    if (unverifiedField) {
      showToast('Please wait for account name verification to succeed.');
      return;
    }

    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('user_id', global.id);

      inputFields.forEach((field, index) => {
        formdata.append(`bank_${index}`, field.bank);
        formdata.append(`bank_code_${index}`, field.bankCode);
        formdata.append(`account_number_${index}`, field.accountNumber);
        formdata.append(`account_name_${index}`, field.accountName);
      });

      const response = await fetch(`${BASIC_URL}add_bank.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoad(false);

      if (result) {
        showToast('Bank details added successfully.');
        navigation.navigate('Congratulations');
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
                    size={36}
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
                    <View style={styles.accountInputWrapper}>
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
                      {field.verifying && (
                          <View style={styles.inputEndLoader}>
                            <ActivityIndicator size="small" color={color.defalt} />
                          </View>
                      )}
                    </View>

                    {field.isVerified && field.accountName.length > 0 && (
                        <Animatable.View animation="fadeIn" duration={400} style={styles.verifiedBanner}>
                          <Icons.Feather name="check-circle" size={16} color="#16A34A" />
                          <Text style={styles.verifiedNameText}>{field.accountName}</Text>
                        </Animatable.View>
                    )}

                    {field.error.length > 0 && (
                        <Animatable.View animation="fadeIn" duration={400} style={styles.errorBanner}>
                          <Icons.Feather name="alert-circle" size={16} color="#EF4444" />
                          <Text style={styles.errorText}>{field.error}</Text>
                        </Animatable.View>
                    )}
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
                onPressFunc={addBankDetails}
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
                  keyExtractor={(item, index) => `bank_${item.code}_${item.id}_${index}`}
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

export default AddBank;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 12,
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
    width: 80,
    height: 80,
    borderRadius: 40,
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
    marginBottom: 18,
    marginTop: 4,
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
    marginBottom: 14,
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
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 50,
    paddingHorizontal: 14,
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
  accountInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputEndLoader: {
    position: 'absolute',
    right: 14,
    top: 16,
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  verifiedNameText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
    letterSpacing: 0.2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#DC2626',
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
    marginBottom: 10,
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
    marginTop: 10,
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

