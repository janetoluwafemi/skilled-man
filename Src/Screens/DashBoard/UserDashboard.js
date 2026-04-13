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
  Modal,
  ScrollView as RNScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import color from '../../Assets/colors/colors';
import {ScrollView, useAccessibleColors} from 'native-base';
//import Modal from 'react-native-modal';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {Icons} from '../../Components/Icons';
import HeaderWSarchFiltr from '../../Components/HeaderWithSearchFilter';
import SrvicCrd from '../../Components/ServiceCard';
import BotonComp from '../../Components/BtnComp';
import {useAuth} from '../../context/AuthProvider';
import {BASIC_URL} from '../Signin/Signin';

const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');

const locations = [
  {
    id: '1',
    name: 'Eastern Cape',
  },
  {
    id: '2',
    name: 'Gauteng',
  },
  {
    id: '3',
    name: 'KwaZulu-Natal',
  },
  {
    id: '4',
    name: 'Limpopo',
  },
  {
    id: '5',
    name: 'Nort West',
  },
  {
    id: '6',
    name: 'Rawalpindi',
  },
];

const accounts = [
  {
    id: '1',
    name: 'Verified',
  },
  {
    id: '2',
    name: 'Non Verified',
  },
];
const UsrDshbord = () => {
  const isfocused = useIsFocused();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [showJob, setShowJob] = useState(false); // Initially show the Job section
  const [showLocation, setShowLocation] = useState(false); // Initially show the Location section
  const [showAccount, setShowAccount] = useState(false); // Initially show the Account section
  const [modalTitle, setModalTitle] = useState('Filter');
  const [searchTerm, setsearchTerm] = useState('');

  const [skill, setskill] = useState([]); //
  const [selectedshowJob, setselectedShowJob] = useState('');
  const [selectedslocation, setselectedsLocation] = useState('');
  const [selectedAccount, setselectedAccount] = useState('');
  const {state} = useAuth();
  const [signinmodal, setsigninmodal] = useState();
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setShowLocation(false);
    setShowJob(false);
    setShowAccount(false);
  };

  const toggleBack = () => {
    setShowLocation(false);
    setShowJob(false);
    setShowAccount(false);
  };

  // Function to toggle the visibility of the Job section
  const toggleJob = () => {
    setShowJob(true);
    console.log(showJob);
    setModalTitle(showJob ? 'Filter' : 'Job');
  };

  // Function to toggle the visibility of the Location section
  const toggleLocation = () => {
    setShowLocation(true);
    console.log(showLocation);
    setModalTitle(showLocation ? 'Filter' : 'Location');
  };

  // Function to toggle the visibility of the Account section
  const toggleAccount = () => {
    setShowAccount(true);
    console.log(showAccount);
    setModalTitle(showAccount ? 'Filter' : 'Account');
  };

  const handleAccount = value => {
    setselectedAccount(value);
  };
  const handleLocation = value => {
    setselectedsLocation(value);
  };
  const handleJob = value => {
    setselectedShowJob(value);
  };

  console.log('selectedShow JOB filter', selectedshowJob);
  console.log('selectedShow JOB filterlocation', selectedslocation);
  console.log('selectedShow Account filter', selectedAccount);
  console.log('global id', global.id);
  const applyFilter = async () => {
    // navigation.navigate('FindExpert')
    try {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=djpeho05m1o2dmm2p8k1vaill4');
      var formdata = new FormData();
      formdata.append('job', selectedshowJob);
      formdata.append('Location', selectedslocation);
      formdata.append('accounts', selectedAccount);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      const apiurl =
        'https://fisdemoprojects.com/skilledman/api/user/getdata.php';

      const response = await fetch(apiurl, requestOptions);
      const result = await response.json();
      console.log('result of get data in userdashboard', result);
      if (result.add_skills) {
        console.log('result useeffect', result.add_skills);

        Alert.alert(JSON.stringify(result.add_skills));
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
  // api
  const Fetchspecficdata = async value => {
    console.log('value to fetch', value);

    try {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=lccmaap9lnt4db1mjf1247d3md');

      var formdata = new FormData();
      formdata.append('job', value);
      formdata.append('user_id', global.id);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      // const apiurl ="https://fisdemoprojects.com/skilledman/api/user/providers_job.php"
      const apiurl = `${BASIC_URL}user/providers_job.php`;

      const response = await fetch(apiurl, requestOptions);
      const result = await response.json();
      console.log('result of expert', result);

      if (result && result.add_skills) {
        console.log(`result of ${value}`, result);
        navigation.navigate('FindExpert', {data: result.add_skills});
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

  useEffect(() => {
    // alert

    {
      state.isAuth == true
        ? //Alert.alert('Disclaimer notice')
          setModalVisible(true)
        : null;
    }

    const gettOveral = async () => {
      try {
        var myHeaders = new Headers();
        myHeaders.append('Cookie', 'PHPSESSID=pqe6giac1t2jjjqkr6sh3r747i');

        var urlencoded = new URLSearchParams();

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow',
        };
        // const apiurl ='https://fisdemoprojects.com/skilledman/api/get_services.php';
        const apiurl = `${BASIC_URL}get_services.php`;

        const response = await fetch(apiurl, requestOptions);
        const result = await response.json();
        if (result && result.add_skills) {
          console.log('result services', result.add_skills);
          setskill(result.add_skills);
        } else if (result.error) {
          Alert.alert('Error', typeof result.error === 'string' ? result.error : String(result.error));
        }
      } catch (error) {
        console.log(error);
      }
    };
    gettOveral();
  }, []);

  const filteredData = skill.filter(item =>
    item.select_bussiness.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  console.log(filteredData, 'filteredData');

  return (
    <View style={{flex: 1}}>
      <HeaderWSarchFiltr
        onPress={() => {
          navigation.openDrawer();
        }}
        onPressNotifiction={() => {
          navigation.navigate('notification_screen');
        }}
        onPressProfile={() => {
          navigation.navigate('editUserProfile');
        }}
        titleText="What service are you searching for?"
        bellIcon="bell"
        // toggleModal={toggleModal}
        onChangeText={val => {
          setsearchTerm(val);
        }}
        value={searchTerm}
        screen={'user'}
      />
      <ScrollView
        style={{
          paddingHorizontal: 15,
          paddingVertical: 20,
          marginTop: 15,
        }}
        contentContainerStyle={{
          paddingBottom: (height * 0.085) + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20
        }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginBottom: 30,
          }}>
          {filteredData?.map((itemdata, ind) => (
            <SrvicCrd
              key={ind}
              showProfile={() => {
                Fetchspecficdata(itemdata.select_bussiness);
              }}
              serviceTitle={itemdata.select_bussiness}
              // iconUrl={require('../../Assets/icons/Mechanics.png')}
              // iconUrl={`https://fisdemoprojects.com/skilledman/api/uploads//${itemdata.image}`}
              iconUrl={`${BASIC_URL}uploads//${itemdata.image}`}
            />
          ))}
        </View>
        <View style={{marginTop: '17%'}} />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        // style={styles.overlay}
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
                    lineHeight: 26,
                  }}>
                  The following disclaimer outlines the terms of use for the
                  Skilledman App, a platform designed to connect artisans and
                  users.{'\n'}
                  By accessing or using the Skilledman application, you agree to
                  comply with the terms and conditions outlined below. The app
                  serves as a medium for facilitating communication and
                  transactions between artisans and users. We do not take
                  responsibility for the quality, guarantee, pricing, delivery,
                  or any other aspect of the products or services offered by
                  artisans.{'\n'}
                  We do not endorse or take responsibility for the accuracy,
                  reliability, or legality of any content, products, or services
                  provided by artisans on the platform. Users are advised to
                  exercise their own discretion and judgment before engaging in
                  any transactions.{'\n'}
                  Skilledman App is not liable for any direct, indirect,
                  incidental, special, or consequential damages that may arise
                  from the use of the platform, including, but not limited to,
                  losses incurred from transactions with artisans.{'\n'}
                  Users are responsible for conducting their own due diligence,
                  including verifying the credentials, qualifications, and
                  background of artisans before engaging in any business
                  transactions. {'\n'}
                  We reserve the right to suspend, terminate, or modify any part
                  of the platform without prior notice. We are not liable for
                  any damages or losses resulting from such actions. {'\n'}
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
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={signinmodal}
        onRequestClose={() => setsigninmodal()}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Account Type</Text>
            </View>

            <View style={styles.modalBody}>
            <View style={styles.btnContainer}>
                <BtnComp
                  BtnStyle={styles.acceptStyle}
                  btnTextStyle={styles.btnTextStyle}
                  btnText="Sign In As User"
                  onPressFunc={() => {
                    setsigninmodal(false);
                  }}
                />
              </View>
              <View style={styles.btnContainer}>
                <BtnComp
                  BtnStyle={styles.acceptStyle}
                  btnTextStyle={styles.btnTextStyle}
                  btnText="Sign In As Provider"
                  onPressFunc={() => {
                    setsigninmodal(false);
                    navigation.navigate('PublicRoutes', { screen: 'AddBusiness' });
                  }}
                />
              </View>
               
             
            </View>
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

export default UsrDshbord;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
  modalStyle: {
    // shadowOffset: {width: 100, height: 0},
    // shadowOpacity: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // modalContainer: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0,0,0,0.5)', // dim background
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 100,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '20%',
    margin: '5%',
    height: '60%',
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

  modalView: {
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: color.wite,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  modalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: '90%',
  },
  jobTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: color.defalt,
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
  logoImg: {
    width: width / 4,
    height: height / 8,
    marginTop: -55,
    borderRadius: 10,
  },
  bookingStyle: {
    fontSize: 14,
    color: color.gry,
    fontWeight: '400',
    textAlign: 'left',
  },
  openingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '93%',
    marginBottom: 15,
  },
  dateTimeCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dateStyle: {
    fontSize: 14,
    color: color.ylow,
    fontWeight: '400',
    textAlign: 'left',
  },

  modalTitle: {
    fontSize: 19,
    color: color.wite,
    fontWeight: '600',
  },
  cancelCont: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  angleRight: {
    marginLeft: 5,
  },
  jobsCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: color.gry,
    paddingBottom: 5,
    marginTop: 20,
  },
  BtnStyle: {
    marginVertical: 15,
  },

  listCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  itemStyle: {
    backgroundColor: color.litOrng,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 6,
    width: '97%',
    marginBottom: 5,
  },
  flatCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  itemName: {
    color: color.wite,
    textAlign: 'center',
  },
});
