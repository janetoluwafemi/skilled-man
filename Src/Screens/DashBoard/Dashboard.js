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
  FlatList,
} from 'react-native';
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

  const [selectedBusiness, setSelectedBusiness] = useState('Select Business');
  const [selectedExperience, setSelectedExperience] = useState('year of experience');

  const [load, setLoad] = useState(false);
  const [items, setItems] = useState([]);
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

  const chartDataSets = {
    Weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [15, 30, 25, 60, 45, 80, 50] }],
    },
    Monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{ data: [20, 45, 28, 80, 99, 43, 110] }],
    },
  };

  const experienceOptions = [
    { id: 1, select_bussiness: 'Year of experience' },
    { id: 2, select_bussiness: '0-1' },
    { id: 3, select_bussiness: '1-2' },
    { id: 4, select_bussiness: '2-3' },
    { id: 5, select_bussiness: '3-4' },
    { id: 6, select_bussiness: '4-5' },
  ];

  const getOverallServices = useCallback(async () => {
    try {
      const response = await fetch(`${BASIC_URL}get_services.php`, {
        method: 'POST',
      });
      const result = await response.json();
      if (result && result.add_skills) {
        setItems(result.add_skills);
      }
    } catch (error) {
      console.log('Error fetching services:', error);
    }
  }, []);

  useEffect(() => {
    getOverallServices();
  }, [getOverallServices]);

  useEffect(() => {
    if (isFocused) {
      const countriesData = Country.getAllCountries();
      setCountries(countriesData);
    }
  }, [isFocused]);

  useEffect(() => {
    if (state?.isAuth === true) {
      setModalVisible(true);
    }
  }, [state?.isAuth]);

  useEffect(() => {
    const fetchUserDataAndCheckModal = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          if (parsedUserData?.working_experience && state?.isAuth === true) {
            setsigninmodal(true);
          }
        }
      } catch (error) {
        console.log('AsyncStorage fetch error:', error);
      }
    };

    fetchUserDataAndCheckModal();
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
      showToast('Please fill the required fields');
      return;
    }

    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('provider_id', global.id);
      formdata.append('phone_number', number);
      formdata.append('country', selectedCountry ? selectedCountry.name : 'Nigeria');
      formdata.append('address', address);
      formdata.append('association', association);
      formdata.append('select_bussiness', selectedBusiness);
      formdata.append('working_experience', selectedExperience);

      formdata.append('certificates', {
        uri: certficate?.uri,
        name: certficate?.name || 'certificate',
        type: certficate?.mimeType || 'application/octet-stream',
      });

      formdata.append('job_references', {
        uri: jobReferences?.uri,
        name: jobReferences?.name || 'reference',
        type: jobReferences?.mimeType || 'application/octet-stream',
      });

      formdata.append('gurantor', {
        uri: guarantor?.uri,
        name: guarantor?.name || 'guarantor',
        type: guarantor?.mimeType || 'application/octet-stream',
      });

      formdata.append('type', global.role || '1');

      await fetch(`${BASIC_URL}add_users_detail.php`, {
        method: 'POST',
        body: formdata,
      });

      setLoad(false);
      handleNavigateToAddBank();
    } catch (error) {
      setLoad(false);
      console.log('Error submitting details:', error);
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
            onPress={() => navigation.openDrawer()}
            onPressnotification={() => navigation.navigate('edit_profile')}
        />

        <ScrollView
            style={styles.scrollStyle}
            contentContainerStyle={scrollContentFlattened}
            showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
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
                <View style={styles.headerTextGroup}>
                  <Text style={styles.chartTitle}>Income Analytics</Text>
                  <Text style={styles.chartSubtitle}>
                    {chartPeriod === 'Weekly'
                        ? 'Daily earnings for this week'
                        : 'Monthly revenue overview'}
                  </Text>
                </View>

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

              <BarChart
                  key={chartPeriod}
                  data={chartDataSets[chartPeriod]}
                  width={Math.min(width - 56, 540)}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#FFFFFF',
                    backgroundGradientFrom: '#FFFFFF',
                    backgroundGradientTo: '#FFFFFF',
                    decimalPlaces: 0,
                    barPercentage: chartPeriod === 'Weekly' ? 0.44 : 0.52,
                    verticalLabelRotation: 0,
                    backgroundGradientToOpacity: 0,
                    showBarTops: false,
                    fillShadowGradient: color.defalt,
                    fillShadowGradientOpacity: 1,
                    strokeWidth: 2,
                    color: () => color.defalt,
                    labelColor: () => '#94A3B8',
                    propsForLabels: {
                      fontSize: 12,
                      fontWeight: '600',
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: '4',
                      stroke: '#F1F5F9',
                    },
                  }}
                  style={StyleSheet.flatten(styles.chartStyle)}
              />
            </View>

            <View style={styles.statusNoticeBanner}>
              <View style={styles.noticeIconWrap}>
                {Icons?.Feather && (
                    <Icons.Feather name="shield" size={22} color={color.defalt} />
                )}
              </View>
              <View style={styles.noticeTextCol}>
                <Text style={styles.noticeTitle}>Account Verified</Text>
                <Text style={styles.noticeSub}>Your provider profile is active and eligible for bookings.</Text>
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
                    {'\n\n'}
                    Users are responsible for conducting their own due diligence
                    before engaging in any business transactions. By using the
                    Skilledman App, you acknowledge that you have read and
                    understood this disclaimer.
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
              <View style={styles.modalHeader}>
                <View style={styles.modalIconWrapper}>
                  {Icons?.Feather && (
                      <Icons.Feather name="user-check" size={26} color={color.defalt} />
                  )}
                </View>
                <Text style={styles.modalTitle}>Complete Provider Profile</Text>
                <Text style={styles.modalSubheading}>
                  Set up your service details to receive client bookings
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
                      <Icons.Feather name="chevron-down" size={18} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Trade Association (Optional)</Text>
                    <C_TxtInput
                        placeholder="e.g. Nigerian Artisan Association"
                        placeholderTextColor="#94A3B8"
                        onChangeText={setAssociation}
                        value={association}
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

        <Modal
            visible={countryModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setCountryModalVisible(false)}>
          <View style={styles.bottomSheetOverlay}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Select Country</Text>
                <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
                  <Icons.Ionicons name="close-circle" size={24} color="#94A3B8" />
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
      </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
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
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...(Platform.OS === 'web'
        ? { boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' }
        : {
          elevation: 2,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
        }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTextGroup: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 17,
    color: '#0F172A',
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  periodSwitch: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
  },
  periodTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodTabActive: {
    backgroundColor: '#FFFFFF',
  },
  periodTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  periodTabTextActive: {
    color: color.defalt,
    fontWeight: '700',
  },
  chartStyle: {
    marginVertical: 4,
    borderRadius: 16,
    alignSelf: 'center',
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
  disclaimerModalCard: {
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    height: Math.min(height * 0.72, 540),
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...(Platform.OS === 'web'
        ? { boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)' }
        : {
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.18,
          shadowRadius: 20,
        }),
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
    ...(Platform.OS === 'web'
        ? { boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)' }
        : {
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.18,
          shadowRadius: 20,
        }),
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
    ...(Platform.OS === 'web'
        ? { boxShadow: '0 4px 14px rgba(192, 122, 80, 0.25)' }
        : {
          elevation: 3,
          shadowColor: color.defalt,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
        }),
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
  tileSelectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  flagImageSmall: {
    width: 24,
    height: 16,
    borderRadius: 3,
    marginRight: 10,
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
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
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
  flagImageOption: {
    width: 24,
    height: 16,
    borderRadius: 3,
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
});