import React, {useRef, useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  ToastAndroid,
  Image,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import color from '../../Assets/colors/colors';
// import Modal from 'react-native-modal';
import {useIsFocused, useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
// import LinearGradient from 'react-native-linear-linear-gradient';
import OpningCrd from '../../Components/OpeningCard';
import HomStakwithoutsarch from '../../Components/HomeStackwithoutsearch';
import Two_Crd from '../../Components/Two_Card';
import OpeningCard from '../../Components/OpeningCard';
import {BarChart} from 'react-native-chart-kit';
import {Icons} from '../../Components/Icons';
import {useAuth} from '../../context/AuthProvider';
import BotonComp from '../../Components/BtnComp';
import UserTabs from '../../BottomNavigator/UserTabs';
import DocumentPicker from 'react-native-document-picker';
import C_Dropdwn from '../../Components/C_Dropdown';
import UploadfilwIcon from '../../Components/UploadfilewithIcon';
import {Picker} from '@react-native-picker/picker';
import {Country, State, City, getAllCountries} from 'country-state-city';
import C_TxtInput from '../../Components/C_TextInput';
import Toast from 'react-native-simple-toast';
import {BASIC_URL} from '../Signin/Signin';

const Dshbord = () => {
  const navigation = useNavigation();
  const isfocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const {state} = useAuth();
  const [certficate, setCertficate] = React.useState();
  const [Guarantor, setGuarantor] = React.useState();
  const [jobReferences, setJobReferences] = React.useState();
  const [selectedBusiness, setSelectedBusiness] = useState('Select Business');
  const [load, setLoad] = React.useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState('year of experience');
  const [item, setItem] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryError, setCountryError] = useState(false);
  const [number, setnumber] = useState('');
  const [address, setaddress] = useState('');
  const [association, setassociation] = useState('');
  const pickerRef = useRef();
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const focus = useIsFocused();
  const [selectedState, setSelectedState] = useState('');
  const [hasBusiness, setHasBusiness] = useState(false);
  const [signinmodal, setsigninmodal] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState();
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [userDataFromStorage, setUserDataFromStorage] = useState(null);

  useEffect(() => {
    console.log('provider id', global.provider_id);
    console.log('user id', global.id);
  }, []);

  useEffect(() => {
    const getAllKeys = async () => {
      let keys = [];
      try {
        keys = await AsyncStorage.getAllKeys();
      } catch (e) {
        console.error('Error getting all keys from AsyncStorage:', e);
      }

      const allData = {};
      try {
        await AsyncStorage.multiGet(keys, (errors, stores) => {
          stores.map((result, i, store) => {
            let key = store[i][0];
            let value = store[i][1];
            allData[key] = value ? JSON.parse(value) : null; // Try to parse if it's JSON
          });
          console.log('All data from AsyncStorage:', allData);
        });
      } catch (e) {
        console.error('Error getting multiple values from AsyncStorage:', e);
      }
    };

    getAllKeys();
  }, []);

  useEffect(() => {
    const countriesData = Country.getAllCountries();
    setCountries(countriesData);
  }, [focus]);

  const onCountryChange = countryCode => {
    setSelectedCountry(countryCode);
    setSelectedState('');
    const countryStates = State.getStatesOfCountry(countryCode);
    setStates(countryStates);
  };

  const ExperienceOption = [
    {id: 1, select_bussiness: 'Year of experience'},
    {id: 2, select_bussiness: '0-1'},
    {id: 3, select_bussiness: '1-2'},
    {id: 4, select_bussiness: '2-3'},
    {id: 5, select_bussiness: '3-4'},
    {id: 6, select_bussiness: '3-4'},
    {id: 7, select_bussiness: '4-5'},
  ];

  const handlFilPik = async value => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('image picker result', result[0]);
      console.log('placeholdervalue', value);
      if (value === 'Guarantor') {
        setGuarantor(result[0]);
      }
      if (value == 'Job References') {
        setJobReferences(result[0]);
      }
      if (value == 'Certificates') {
        setCertficate(result[0]);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User canceled the document picker
      } else {
        console.log('error occur on document picking', error);
        throw error; // Throw the correct error
      }
    }
  };

  const handleBusinessSelect = selectedValue => {
    setSelectedBusiness(selectedValue);
  };

  const handleExperienceSelect = selectedValue => {
    setSelectedExperience(selectedValue);
  };

  useEffect(() => {
    if (state.isAuth == true) {
      setModalVisible(true);
    } else {
      setsigninmodal(true);
    }
  }, [state.isAuth]);
  console.log('globalstaus', global.states);

  useEffect(() => {
    const fetchUserDataAndCheckModal = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserDataFromStorage(parsedUserData);
          console.log(parsedUserData, 'user data from storage');

          const hasWorkingExperience = parsedUserData?.working_experience;

          if (hasWorkingExperience && state.isAuth === true) {
            setsigninmodal(true); // ✅ Show modal if working_experience exists
          } else {
            setsigninmodal(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchUserDataAndCheckModal();
  }, [state.isAuth]);

  useEffect(() => {
    // Check if the user has logged in for the first time (independent of user data)
    const checkFirstLogin = async () => {
      try {
        const hasLoggedBefore = await AsyncStorage.getItem('hasLoggedBefore');
        if (!hasLoggedBefore && state.isAuth === true) {
          setsigninmodal(true);
          setIsFirstLogin(true);
          await AsyncStorage.setItem('hasLoggedBefore', 'true');
        }
      } catch (error) {
        console.error('Error checking first login:', error);
      }
    };

    checkFirstLogin();
  }, [state.isAuth]);

  const closeModal = () => {
    setsigninmodal(false);
  };

  const HandlADdetial = async () => {
    if (
      selectedBusiness == 'Select Business' ||
      selectedExperience == 'Year of experience' ||
      !certficate ||
      !Guarantor ||
      !jobReferences
    ) {
      Toast.showWithGravity(
        'Please fill the required fields',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    try {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=evs4c146cvheh7fla9agaufmn3');

      var formdata = new FormData();
      formdata.append('provider_id', global.id);
      formdata.append('phone_number', number);
      formdata.append('country', selectedCountry);
      formdata.append('address', address);
      formdata.append('association', association);
      formdata.append('select_bussiness', selectedBusiness);
      formdata.append('working_experience', selectedExperience);
      formdata.append('certificates', certficate);
      formdata.append('job_references', jobReferences);
      formdata.append('gurantor', Guarantor);
      formdata.append('type', global.role);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      fetch(`${BASIC_URL}add_users_detail.php`, requestOptions)
        .then(response => response.text())
        .then(result => console.log('Handle Add details result', result));
      setLoad(false);
      navigation.navigate('AddBank');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getOverall = async () => {
      try {
        var myHeaders = new Headers();
        myHeaders.append('Cookie', 'PHPSESSID=0g4vvcrd3mg6h7pr1q0c26ns09');

        var urlencoded = new URLSearchParams();

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow',
        };
        const apiurl = `${BASIC_URL}get_services.php`;

        const response = await fetch(apiurl, requestOptions);
        const result = await response.json();
        if (result && result.add_skills) {
          console.log(
            'All services in  overall function in Dashboard',
            result.add_skills,
          );
          setItem(result.add_skills);
        } else if (result.error) {
          Alert.alert(
            'Error',
            typeof result.error === 'string'
              ? result.error
              : String(result.error),
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    getOverall();
  }, []);

  return (
    <>
      <HomStakwithoutsarch
        onPress={() => {
          navigation.openDrawer();
        }}
        onPressnotification={() => {
          navigation.navigate('edit_profile');
        }}
      />
      <ScrollView
        style={{paddingHorizontal: 15, paddingVertical: 20}}
        contentContainerStyle={{
          paddingBottom:
            height * 0.085 +
            Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) +
            20,
        }}
        showsVerticalScrollIndicator={false}>
        <Two_Crd />
        <View style={styles.chartContainer}>
          <View style={styles.filterCont}>
            <Text style={styles.incomeStyle}>Income</Text>
            <Icons.FontAwesome name="filter" size={20} color={color.defalt} />
          </View>

          <BarChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
              datasets: [
                {
                  data: [0, 16, 33, 50, 66, 83, 100],
                },
              ],
            }}
            width={Dimensions.get('window').width - 30}
            height={300}
            chartConfig={{
              backgroundGradientFrom: color.wite,
              backgroundGradientTo: color.gry,
              showBarTops: false,
              decimalPlaces: 0,
              barPercentage: 0.4,
              verticalLabelRotation: 90,
              withVerticalLabels: true,
              backgroundGradientToOpacity: 0,
              showBarTops: false,
              horizontalLines: false,
              withHorizontalLabels: false,
              fromZero: false,
              strokeWidth: 32,
              color: (opacity = 1) => color.ylow,
              style: {
                borderRadius: 16,
              },
              labelColor: (opacity = 1) => color.blak,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Disclaimer Notice</Text>
            </View>

            <View style={styles.modalBody}>
              <ScrollView>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'justify',
                    lineHeight: 22,
                  }}>
                  The following disclaimer outlines the terms of use for the
                  Skilledman App, a platform designed to connect artisans and
                  users. By accessing or using the Skilledman application, you
                  agree to comply with the terms and conditions outlined below.
                  The app serves as a medium for facilitating communication and
                  transactions between artisans and users.{'\n'}
                  We do not take responsibility for the quality, guarantee,
                  pricing, delivery, or any other aspect of the products or
                  services offered by artisans. We do not endorse or take
                  responsibility for the accuracy, reliability, or legality of
                  any content, products, or services provided by artisans on the
                  platform.{'\n'}
                  Users are advised to exercise their own discretion and
                  judgment before engaging in any transactions. Skilledman App
                  is not liable for any direct, indirect, incidental, special,
                  or consequential damages that may arise from the use of the
                  platform, including, but not limited to, losses incurred from
                  transactions with artisans.{'\n'}
                  Users are responsible for conducting their own due diligence,
                  including verifying the credentials, qualifications, and
                  background of artisans before engaging in any business
                  transactions.{'\n'}
                  We reserve the right to suspend, terminate, or modify any part
                  of the platform without prior notice. We are not liable for
                  any damages or losses resulting from such actions.{'\n'}
                  By using the Skilledman App, you acknowledge that you have
                  read and understood this disclaimer and agree to be bound by
                  its terms. If you do not agree with any part of this
                  disclaimer, please refrain from using the Skilledman
                  application.
                </Text>
              </ScrollView>
              <View style={styles.btnContainer}>
                <BotonComp
                  BtnStyle={styles.acceptStyle}
                  btnTextStyle={styles.btnTextStyle}
                  btnText="Agree"
                  onPressFunc={() => {
                    setModalVisible(false);
                  }}
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
        <View style={styles.modalContainertwo}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                If Already Add busineess then dont submitted,Press Ok{' '}
              </Text>
            </View>

            <View style={styles.modalBody}>
              <ScrollView>
                <View style={styles.dropdownContainer}>
                  <C_Dropdwn
                    selectedValue="Select Business"
                    options={item}
                    onValueChange={handleBusinessSelect}
                  />
                </View>
                <View style={styles.dropdownContainer}>
                  <C_Dropdwn
                    selectedValue="Working Experience"
                    options={ExperienceOption}
                    onValueChange={handleExperienceSelect}
                  />
                </View>
                <TouchableOpacity onPress={() => handlFilPik('Certificates')}>
                  <View style={styles.inputContainer}>
                    <UploadfilwIcon
                      placeholder="Certificates"
                      icon="upload"
                      title={certficate ? certficate.name : ''}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlFilPik('Job References')}>
                  <View style={styles.inputContainer}>
                    <UploadfilwIcon
                      placeholder="Job References"
                      icon="upload"
                      title={jobReferences ? jobReferences.name : ''}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlFilPik('Guarantor')}>
                  <View style={styles.inputContainer}>
                    <UploadfilwIcon
                      placeholder="Guarantor"
                      icon="upload"
                      // handleFilePick={handleFilePick}
                      title={Guarantor}
                    />
                  </View>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                  <C_TxtInput
                    placeholder="Phone Number"
                    placeholderTextColor={color.defalt}
                    onChangeText={setnumber}
                    //onBlur={handleBlur('phone_number')}
                    value={number}
                  />
                  {/* {touched.phone_number && errors.phone_number ? (
                  <Text style={styles.errorText}>{errors.phone_number}</Text>
                ) : null} */}
                </View>
                <View style={styles.inputContainer}>
                  <C_TxtInput
                    placeholder="Address"
                    placeholderTextColor={color.defalt}
                    onChangeText={setaddress}
                    //  onBlur={handleBlur('address')}
                    value={address}
                  />
                  {/* {touched.address && errors.address ? (
                  <Text style={styles.errorText}>{errors.address}</Text>
                ) : null} */}
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
                          fontWeight="bold"
                          fontSize={17}
                        />
                      ))}
                    </Picker>
                  </View>
                  {countryError && (
                    <Text style={styles.errorText}>
                      Please select a country.
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    width: '80%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 10,
                    marginBottom: '22%',
                  }}>
                  <C_TxtInput
                    placeholder="Association"
                    placeholderTextColor={color.defalt}
                    onChangeText={setassociation}
                    // onBlur={handleBlur('association')}
                    value={association}
                  />
                </View>
              </ScrollView>
              <View style={styles.btnContainer}>
                <BotonComp
                  BtnStyle={styles.BtnStyle}
                  btnText={
                    load ? (
                      <ActivityIndicator size={28} color="#f8f8ff" />
                    ) : (
                      'OK'
                    )
                  }
                  onPressFunc={() => {
                    HandlADdetial();

                    setsigninmodal(false);
                    //navigation.navigate('AddBank');
                  }}
                />
                <BotonComp
                  BtnStyle={styles.BtnStyle}
                  btnText={
                    load ? (
                      <ActivityIndicator size={28} color="#f8f8ff" />
                    ) : (
                      'Add bank'
                    )
                  }
                  onPressFunc={() => {
                    //  navigation.navigate('edit_profile');
                    navigation.navigate('PublicRoutes', {
                      screen: 'AddBankGoogle',
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Dshbord;
const styles = StyleSheet.create({
  BtnStyle: {
    marginTop: 15,
    width: '45%',
    margin: 4,
  },
  itemsStyle: {
    color: color.rd,
    fontWeight: '400',
  },
  inputContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  DropDownContainer: {
    borderColor: color.defalt,
    borderWidth: 1,
    paddingHorizontal: 5,
    width: '100%',
    borderRadius: 6,
    marginTop: 6,
    height: 53,
  },
  container: {
    backgroundColor: '#fff',
    height: '60%',
    elevation: 6,
  },
  backgroundImg: {
    height: '100%',
  },

  confirmBtn: {
    backgroundColor: color.drkGren,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    width: '40%',
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.wite,
  },
  innercontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '80%',
    flex: 0.8,
  },
  accountVer: {
    color: color.defalt,
    fontSize: 25,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  dropdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    width: '80%',
  },
  iconCont: {
    width: '38%',
  },
  iconStyle: {
    fontSize: 30,
    color: color.drkGren,
    position: 'absolute',
    right: -180,
    top: 10,
  },
  modalBody: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  successmodalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  pendAppr: {
    fontWeight: 'bold',
    fontSize: 17,
    color: color.drkGren,
    paddingTop: 5,
  },
  cardCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headStyle: {
    fontSize: 19,
    fontWeight: '700',
    color: color.blak,
    paddingVertical: 10,
  },
  linearGradientStyle: {
    alignItems: 'center',
    elevation: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
  },
  locationCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  chStyle: {
    fontSize: 17,
    fontWeight: '700',
    color: color.Gren,
  },
  searchContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: color.litgren,
  },
  locStyle: {
    fontSize: 16,
    color: color.litGry,
  },
  deliverStyle: {
    fontSize: 20,
    fontWeight: '700',
    color: color.blak,
    paddingHorizontal: 10,
  },
  imgStyle: {
    marginRight: 10,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  loginBtn: {
    borderRadius: 5,
    backgroundColor: 'transparent',
    width: '50%',
    marginTop: 7,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  prodName: {
    color: color.blak,
    fontWeight: '700',
    fontSize: 20,
  },
  linearGradientStyle: {
    alignItems: 'center',
    elevation: 0,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
  },
  priceStyle: {
    fontSize: 16,
    color: color.Gren,
    fontWeight: '600',
    marginTop: 7,
  },
  listimgStyle: {
    width: 80,
    height: 80,
  },
  CardContainer: {
    marginTop: -60,
  },
  cardContent: {
    width: '94%',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
    margin: 0,
  },
  chartContainer: {
    backgroundColor: color.wite,
    marginTop: 20,
    borderRadius: 10,
    elevation: 1,
  },
  incomeStyle: {
    fontSize: 17,
    color: color.blak,
    fontWeight: '500',
  },
  filterCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 100,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '20%',
    height: '60%',
  },
  modalContainertwo: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 100,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '20%',
    height: '80%',
  },

  modalView: {
    borderRadius: 12,
    width: '90%',
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
    marginBottom: 10,
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
});
