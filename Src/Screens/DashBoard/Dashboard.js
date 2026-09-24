import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
  StatusBar,
  TextInput,
  Image,
  FlatList } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import * as DocumentPicker from 'expo-document-picker';
import { Country } from 'country-state-city';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import HomStakwithoutsarch from '../../Components/HomeStackwithoutsearch';
import Two_Crd from '../../Components/Two_Card';
import { Icons } from '../../Components/Icons';
import { useAuth } from '../../context/AuthProvider';
import BotonComp from '../../Components/BtnComp';
import C_Dropdwn from '../../Components/C_Dropdown';
import UploadfilwIcon from '../../Components/UploadfilewithIcon';
import C_TxtInput from '../../Components/C_TextInput';
import { BASIC_URL } from '../Signin/Signin';

const { height, width } = Dimensions.get('window');

const Dashboard = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { state } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [signinmodal, setsigninmodal] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('Monthly');

  const [certficate, setCertficate] = useState(null);
  const [guarantor, setGuarantor] = useState(null);
  const [jobReferences, setJobReferences] = useState(null);

  const [selectedBusiness, setSelectedBusiness] = useState('Hairstylist');
  const [selectedExperience, setSelectedExperience] = useState('Year of experience');

  const [userProfession, setUserProfession] = useState('Hairstylist');

  const [load, setLoad] = useState(false);
  const [items, setItems] = useState([
    { id: '1', select_bussiness: 'Hairstylist' },
    { id: '2', select_bussiness: 'Makeup Artist' },
    { id: '3', select_bussiness: 'Barber' },
  ]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    isoCode: 'NG',
    name: 'Nigeria',
    phonecode: '234',
  });
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [association, setAssociation] = useState('');

  const [chartDataSets, setChartDataSets] = useState({
    Weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
    },
    Monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
    },
  });

  const experienceOptions = [
    {id: 1, select_bussiness: 'Year of experience'},
    {id: 2, select_bussiness: '0-1'},
    {id: 3, select_bussiness: '1-2'},
    {id: 4, select_bussiness: '2-3'},
    {id: 5, select_bussiness: '3-4'},
    {id: 6, select_bussiness: '4-5'},
  ];

  const getProviderAnalytics = useCallback(async () => {
    let providerId = String(global.id || '').trim();
    if (!providerId || ['251', '255', '256'].includes(providerId)) {
      try {
        const rawUser = await AsyncStorage.getItem('user');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          const possibleId = parsed?.id ?? parsed?.userId ?? parsed?.user_id ?? parsed?.data?.id ?? parsed?.data?.user_id;
          if (possibleId && !['251', '255', '256'].includes(String(possibleId))) {
            providerId = String(possibleId).trim();
            global.id = providerId;
          }
        }
      } catch (e) {
        console.log('Error fetching user for analytics:', e);
      }
    }

    if (!providerId || ['251', '255', '256'].includes(providerId)) {
      providerId = '251';
    }

    const token = encodeURIComponent('xees&skilledman');

    try {
      const response = await fetch(
        `${BASIC_URL}dashboard.php?token=${token}&provider_id=${providerId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) return;

      const result = await response.json();

      if (result && typeof result === 'object') {
        const monthKeys = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthlyValues = monthKeys.map(m => Number(result[m]) || 0);

        setChartDataSets(prev => ({
          ...prev,
          Monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{ data: monthlyValues }],
          },
        }));
      }
    } catch (error) {
      console.log('Analytics fetch error:', error);
    }
  }, []);

  useEffect(() => {
    getProviderAnalytics();
  }, [getProviderAnalytics]);

  useEffect(() => {
    if (isFocused) {
      const countriesData = Country.getAllCountries();
      setCountries(countriesData);
    }
  }, [isFocused]);

  useEffect(() => {
    if (state?.isAuth === true && !global.providerModalShown) {
      setModalVisible(true);
      global.providerModalShown = true;
    }
  }, [state?.isAuth]);

  const onCountrySelect = country => {
    setSelectedCountry(country);
    setCountryModalVisible(false);
    setSearchQuery('');
  };

  const filteredCountries = countries.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phonecode?.includes(searchQuery)
  );

  const handlFilPik = async value => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        if (value === 'Guarantor') setGuarantor(pickedFile);
        if (value === 'Job References') setJobReferences(pickedFile);
        if (value === 'Certificates') setCertficate(pickedFile);
      }
    } catch (error) {
      console.log('Document picking error:', error);
    }
  };

  const handleNavigateToAddBank = () => {
    setsigninmodal(false);
    setModalVisible(false);
    navigation.navigate('AddBankGoogle');
  };

  const handlADdetail = async () => {
    if (
      selectedBusiness === 'Select Business' ||
      selectedExperience === 'Year of experience' ||
      !certficate ||
      !guarantor ||
      !jobReferences
    ) {
      showToast('Please fill all required fields');
      return;
    }

    try {
      setLoad(true);
      const formdata = new FormData();

      let currentProviderId = String(global.id || '').trim();
      if (!currentProviderId || ['251', '255', '256'].includes(currentProviderId)) {
        const rawUser = await AsyncStorage.getItem('user');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          const possibleId = parsed?.id ?? parsed?.user_id ?? parsed?.userId ?? parsed?.data?.id ?? parsed?.data?.user_id;
          if (possibleId && !['251', '255', '256'].includes(String(possibleId))) {
            currentProviderId = String(possibleId).trim();
            global.id = currentProviderId;
          }
        }
      }

      formdata.append('provider_id', currentProviderId || '251');
      formdata.append('select_business', selectedBusiness);
      formdata.append('working_experience', selectedExperience);

      formdata.append('certificates', {
        uri: certficate?.uri,
        name: certficate?.name || 'certificate.png',
        type: certficate?.mimeType || 'image/png',
      });

      formdata.append('job_references', {
        uri: jobReferences?.uri,
        name: jobReferences?.name || 'references.png',
        type: jobReferences?.mimeType || 'image/png',
      });

      formdata.append('guarantor', {
        uri: guarantor?.uri,
        name: guarantor?.name || 'guarantor.png',
        type: guarantor?.mimeType || 'image/png',
      });

      const response = await fetch(`${BASIC_URL}add_business.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoad(false);

      if (result?.status === 'Record Inserted Successfully' || result?.success) {
        showToast('Business details saved successfully');
        setUserProfession(selectedBusiness);
        handleNavigateToAddBank();
      } else {
        showToast(result?.error || 'Failed to submit profile details');
      }
    } catch (error) {
      setLoad(false);
      console.log('Error submitting details:', error);
      showToast('Connection error. Please try again.');
    }
  };

  const bottomPadding =
    height * 0.085 + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 36;

  const scrollContentFlattened = StyleSheet.flatten([
    styles.scrollContent,
    { paddingBottom: bottomPadding },
  ]);

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={color.defalt} />

      <HomStakwithoutsarch
        title={userProfession}
        onPress={() => navigation.openDrawer()}
        onPressnotification={() => navigation.navigate('edit_profile')}
      />

      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={scrollContentFlattened}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>

          <View style={styles.headerGreetingRow}>
            <View style={styles.professionPill}>
              {Icons?.Feather && <Icons.Feather name="scissors" size={15} color={color.defalt} />}
              <Text style={styles.professionPillText}>Hairstylist Professional</Text>
            </View>
          </View>

          <Two_Crd />

          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionPill}
              onPress={handleNavigateToAddBank}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#F7ECE4' }]}>
                {Icons?.Feather && (
                  <Icons.Feather name="credit-card" size={20} color={color.defalt} />
                )}
              </View>
              <Text style={styles.actionText}>Add Bank</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionPill}
              onPress={() => navigation.navigate('Cash')}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#F7ECE4' }]}>
                {Icons?.Feather && (
                  <Icons.Feather name="dollar-sign" size={20} color={color.defalt} />
                )}
              </View>
              <Text style={styles.actionText}>Cash In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionPill}
              onPress={() => navigation.navigate('Balance')}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#F7ECE4' }]}>
                {Icons?.Feather && (
                  <Icons.Feather name="clock" size={20} color={color.defalt} />
                )}
              </View>
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.actionPill}
              onPress={() => setsigninmodal(true)}>
              <View style={[styles.actionIconCircle, { backgroundColor: '#F7ECE4' }]}>
                {Icons?.Feather && (
                  <Icons.Feather name="edit-3" size={20} color={color.defalt} />
                )}
              </View>
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.chartTitle}>Income Analytics</Text>

              <View style={styles.periodSwitch}>
                {['Weekly', 'Monthly'].map(p => (
                  <TouchableOpacity
                    key={p}
                    activeOpacity={0.7}
                    onPress={() => setChartPeriod(p)}
                    style={[
                      styles.periodTab,
                      chartPeriod === p && styles.periodTabActive,
                    ]}>
                    <Text
                      style={[
                        styles.periodTabText,
                        chartPeriod === p && styles.periodTabTextActive,
                      ]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chartScrollContent}>
              <BarChart
                key={chartPeriod}
                data={chartDataSets[chartPeriod]}
                width={chartPeriod === 'Monthly' ? Math.max(width * 1.35, 500) : width - 48}
                height={190}
                fromZero
                withInnerLines={false}
                showBarTops={false}
                chartConfig={{
                  backgroundColor: '#FFFFFF',
                  backgroundGradientFrom: '#FFFFFF',
                  backgroundGradientTo: '#FFFFFF',
                  decimalPlaces: 0,
                  barPercentage: chartPeriod === 'Weekly' ? 0.44 : 0.48,
                  fillShadowGradient: color.defalt,
                  fillShadowGradientOpacity: 1,
                  color: () => color.defalt,
                  labelColor: () => '#94A3B8',
                  propsForLabels: {
                    fontSize: 11,
                    fontWeight: '600',
                  },
                }}
                style={styles.chartStyle}
              />
            </ScrollView>
          </View>

          <View style={styles.statusNoticeBanner}>
            <View style={styles.noticeIconWrap}>
              {Icons?.Feather && (
                <Icons.Feather name="shield" size={22} color={color.defalt} />
              )}
            </View>
            <View style={styles.noticeTextCol}>
              <Text style={styles.noticeTitle}>Account Verified</Text>
              <Text style={styles.noticeSub}>Your Hairstylist profile is active and eligible for bookings.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.disclaimerModalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrapper}>
                {Icons?.Feather && (
                  <Icons.Feather name="shield" size={26} color={color.defalt} />
                )}
              </View>
              <Text style={styles.modalTitle}>Disclaimer Notice</Text>
              <Text style={styles.modalSubheading}>Please review before continuing</Text>
            </View>

            <View style={styles.disclaimerBody}>
              <ScrollView
                style={styles.disclaimerScroll}
                contentContainerStyle={styles.disclaimerScrollContent}
                showsVerticalScrollIndicator={true}>
                <Text style={styles.disclaimerText}>
                  The following disclaimer outlines the terms of use for the
                  Skilledman App, a platform designed to connect artisans and
                  users. By accessing or using the Skilledman application, you
                  agree to comply with the terms and conditions outlined below.
                  {'\n\n'}
                  The app serves as a medium for facilitating communication and
                  transactions between artisans and users. We do not take
                  responsibility for the quality, guarantee, pricing, delivery,
                  or any other aspect of the products or services offered by
                  artisans.
                </Text>
              </ScrollView>

              <View style={styles.modalBtnContainer}>
                <BotonComp
                  BtnStyle={styles.primaryModalBtn}
                  btnTextStyle={styles.primaryModalBtnText}
                  btnText="I Understand & Agree"
                  onPressFunc={() => setModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={signinmodal}
        onRequestClose={() => setsigninmodal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.formModalCard}>
            <View style={styles.modalTopBar}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setsigninmodal(false)}
                style={styles.backArrowBtn}>
                <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrapper}>
                {Icons?.Feather && (
                  <Icons.Feather name="user-check" size={26} color={color.defalt} />
                )}
              </View>
              <Text style={styles.modalTitle}>Complete Provider Profile</Text>
              <Text style={styles.modalSubheading}>
                Set up your trade qualification to verify account
              </Text>
            </View>

            <View style={styles.formModalBody}>
              <ScrollView
                style={styles.formScroll}
                contentContainerStyle={styles.formScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Trade Service</Text>
                  <C_Dropdwn
                    selectedValue={selectedBusiness}
                    options={items}
                    onValueChange={setSelectedBusiness}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Years of Experience</Text>
                  <C_Dropdwn
                    selectedValue={selectedExperience}
                    options={experienceOptions}
                    onValueChange={setSelectedExperience}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Certifications</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => handlFilPik('Certificates')}>
                    <UploadfilwIcon
                      placeholder="Upload Certificates"
                      icon="upload-cloud"
                      title={certficate ? certficate.name : ''}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Job References</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => handlFilPik('Job References')}>
                    <UploadfilwIcon
                      placeholder="Upload Job References"
                      icon="file-text"
                      title={jobReferences ? jobReferences.name : ''}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Guarantor Letter</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => handlFilPik('Guarantor')}>
                    <UploadfilwIcon
                      placeholder="Upload Guarantor Document"
                      icon="file"
                      title={guarantor ? guarantor.name : ''}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Phone Number</Text>
                  <C_TxtInput
                    placeholder="e.g. 08012345678"
                    placeholderTextColor="#94A3B8"
                    onChangeText={setNumber}
                    value={number}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Business Address</Text>
                  <C_TxtInput
                    placeholder="Enter full physical address"
                    placeholderTextColor="#94A3B8"
                    onChangeText={setAddress}
                    value={address}
                  />
                </View>
              </ScrollView>

              <View style={styles.actionButtonGroup}>
                <BotonComp
                  BtnStyle={styles.saveSubmitBtn}
                  btnTextStyle={styles.primaryModalBtnText}
                  btnText={
                    load ? <ActivityIndicator size="small" color="#FFFFFF" /> : 'Save Profile'
                  }
                  onPressFunc={handlADdetail}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.outlineAddBankBtn}
                  onPress={handleNavigateToAddBank}>
                  <Text style={styles.outlineAddBankText}>Add Bank</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  headerGreetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  professionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7ECE4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  professionPillText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: color.defalt,
    marginLeft: 8,
    letterSpacing: -0.2,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollStyle: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  contentWrapper: {
    paddingHorizontal: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 10,
  },
  actionPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }
      : {
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      }),
  },
  actionIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 18,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)' }
      : {
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 15.5,
    color: '#0F172A',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  periodSwitch: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 9,
    padding: 2.5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  periodTab: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
  },
  periodTabActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  periodTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  periodTabTextActive: {
    color: color.defalt,
    fontWeight: '700',
  },
  chartScrollContent: {
    paddingLeft: 0,
    paddingRight: 10,
  },
  chartStyle: {
    marginLeft: -16,
    borderRadius: 14,
  },
  statusNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderLeftWidth: 4,
    borderLeftColor: color.defalt,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)' }
      : {
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      }),
  },
  noticeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F7ECE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  noticeTextCol: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  noticeSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalTopBar: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  disclaimerModalCard: {
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    height: Math.min(height * 0.72, 540),
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  formModalCard: {
    borderRadius: 24,
    width: '100%',
    maxWidth: 440,
    height: Math.min(height * 0.84, 680),
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  modalIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#F7ECE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 21,
    color: '#0F172A',
    fontWeight: '800',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  modalSubheading: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  disclaimerBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
    flex: 1,
    justifyContent: 'space-between',
  },
  disclaimerScroll: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginVertical: 12,
  },
  disclaimerScrollContent: {
    padding: 14,
  },
  disclaimerText: {
    color: '#475569',
    textAlign: 'left',
    lineHeight: 21,
    fontSize: 13.5,
  },
  formModalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 6,
    justifyContent: 'space-between',
  },
  formScroll: {
    flex: 1,
    marginVertical: 6,
  },
  formScrollContent: {
    paddingBottom: 10,
  },
  modalBtnContainer: {
    width: '100%',
    paddingTop: 4,
  },
  primaryModalBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 0,
  },
  primaryModalBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  fieldGroup: {
    marginBottom: 14,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10,
    gap: 12,
  },
  saveSubmitBtn: {
    flex: 1,
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 0,
  },
  outlineAddBankBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineAddBankText: {
    color: color.defalt,
    fontSize: 15,
    fontWeight: '700',
  },
});