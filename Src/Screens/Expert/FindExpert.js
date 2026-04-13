import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';
import SavCrd from '../../Components/SaveCard';
import CstmHeader from '../../Components/CustomHeader';
import DlivrTo from '../../Components/DeliverTo';
import color from '../../Assets/colors/colors';
import {Icons} from '../../Components/Icons';
const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');
import Toast from 'react-native-simple-toast';
import InputSarchFiltr from '../../Components/InputSearchFilter';
// import Modal from 'react-native-modal';
import BotonComp from '../../Components/BtnComp';
import {BASIC_URL} from '../Signin/Signin';

// const getData=()=>{

// }

const FndExprt = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data;
  const [GetExpertProvpider, setGetExpertProvider] = useState(data);
  console.log('GetExpertProvpider data from satate', GetExpertProvpider);
  console.log('data of specfic job', data);

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
  const [modalVisible, setModalVisible] = useState(false);
  const [showJob, setShowJob] = useState(false); // Initially show the Job section
  const [showLocation, setShowLocation] = useState(false); // Initially show the Location section
  const [showAccount, setShowAccount] = useState(false); // Initially show the Account section
  const [modalTitle, setModalTitle] = useState('Filter');
  const [searchTerm, setsearchTerm] = useState('');
  const [_Locations, set_Locations] = useState();
  const [skill, setskill] = useState([]); //
  const [selectedshowJob, setselectedShowJob] = useState('');
  const [selectedslocation, setselectedsLocation] = useState('');
  const [selectedAccount, setselectedAccount] = useState('');

  // const Jobs = ({ item }) => {
  //   console.log("item value recieve in job", item)
  //   return (
  //     <View style={styles.listCont}>
  //       <TouchableOpacity style={styles.itemStyle} onPress={() => {
  //         handleJob(item.select_bussiness)
  //         toggleBack()
  //       }}>
  //         <Text style={styles.itemName}>{item?.select_bussiness}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  useEffect(() => {
    gettLocation();
  }, []);

  const gettLocation = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Cookie', 'PHPSESSID=9ja56p1knn975d9evvulceop0i');

    var formdata = new FormData();
    formdata.append('select_bussiness', GetExpertProvpider[0]?.service_name);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    // fetch("https://fisdemoprojects.com/skilledman/api/user/get_location.php", requestOptions)
    fetch(`${BASIC_URL}user/get_location.php`, requestOptions).then(response =>
      response.json(),
    );
    console
      .log('gettLocation response', response)
      .then(result => {
        console.log('locationlocation', result);
        if (result && result.provider_location) {
          set_Locations(result.provider_location);
        } else if (result && result.provider_location) {
          Toast.show(result.error);
        }
      })
      .catch(error => console.log('error', error));
  };

  console.log('===============searchTerm', searchTerm);

  const filteredData = GetExpertProvpider.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  console.log('===============searchTerm filteredData', filteredData);

  const sortedData = filteredData.slice().sort((a, b) => {
    // Change 'name' to the actual property you want to sort by
    return a.name.localeCompare(b.name);
  });

  const Locations = ({item}) => {
    console.log('item value recieve in location', item);
    return (
      <View style={styles.listCont}>
        <TouchableOpacity
          style={styles.itemStyle}
          onPress={() => {
            handleLocation(item.address);
            toggleBack();
          }}>
          <Text style={styles.itemName}>{item.address}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Accounts = ({item}) => {
    return (
      <View style={styles.listCont}>
        <TouchableOpacity
          style={styles.itemStyle}
          onPress={() => {
            handleAccount(item.name);
            toggleBack();
          }}>
          <Text style={styles.itemName}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setShowLocation(false);
    //setShowJob(false);
    setShowAccount(false);
  };

  const toggleBack = () => {
    setShowLocation(false);
    //setShowJob(false);
    setShowAccount(false);
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

  const applyFilter = async () => {
    // navigation.navigate('FindExpert')
    try {
      var formdata = new FormData();
      formdata.append('job', data[0].service_name);
      // formdata.append("location", selectedslocation);
      // formdata.append("account", selectedAccount);
      formdata.append('user_id', global.id);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };
      // const apiurl = "https://fisdemoprojects.com/skilledman/api/user/providers_job.php"
      const apiurl = `${BASIC_URL}user/providers_job.php`;

      const response = await fetch(apiurl, requestOptions);
      const result = await response.json();
      if (result && result.add_skills) {
        setGetExpertProvider([]);
        setGetExpertProvider(result.add_skills);
      } else if (result && result.error) {
        Alert.alert(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ExpertsList = ({item}) => {
    console.log('item value recieve in Find exper', item);
    // const imageurl = `https://fisdemoprojects.com/skilledman/api/uploads//${item.image}`
    const imageurl = `${BASIC_URL}uploads//${item.image}`;

    const addtofavourite = async () => {
      console.log('add to favourite');
      try {
        var formdata = new FormData();
        formdata.append('user_id', global.id);
        formdata.append('provider_id', item.id);
        formdata.append('provider_name', item.name);
        formdata.append('rating', item.averageRating.toFixed(2));
        formdata.append('total_jobs', item.totaljob);
        formdata.append('distance', item.distance);
        formdata.append('profile', item.image);
        formdata.append('service_name', item.service_name);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow',
        };
        // const apiurl = "https://fisdemoprojects.com/skilledman/api/user/favorite_providers.php"
        const apiurl = `${BASIC_URL}user/favorite_providers.php`;

        const response = await fetch(apiurl, requestOptions);
        const result = await response.json();
        if (result.status) {
          console.log('add to favourite', result.status);
          Alert.alert('add to favourite');
          // navigation.navigate('SaveScreen');
        }
      } catch (error) {
        error => console.log('error', error);
      }
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ExpertDetail', {item})}
        style={[styles.textContainer, {...props.cardStyle}]}>
        <Image
          style={styles.logoImg}
          resizeMode="contain"
          source={{uri: imageurl}}
        />

        <View style={styles.profileCont}>
          <View style={[styles.openingStyle, {...styles.titleCont}]}>
            <View style={styles.nameCont}>
              <Text style={styles.TextStyle}>{item.name}</Text>
              {item.verified == 'Verified' ? (
                <Icons.FontAwesome5
                  name={'user-check'}
                  color={color.blu}
                  size={16}
                />
              ) : null}
            </View>

            <TouchableOpacity onPress={() => addtofavourite()}>
              <Icons.FontAwesome
                name={'bookmark-o'}
                color={color.defalt}
                size={25}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.openingStyle}>
            <View>
              <Text style={styles.msgTitle}>{'Rating'}</Text>
              <View style={styles.starCont}>
                <Icons.FontAwesome name={'star'} color={color.ylow} size={15} />
                <Text style={[styles.msgTitle, {marginLeft: 3}]}>
                  {item.averageRating.toFixed(2)}
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.msgTitle}>{'Total jobs'}</Text>
              <Text style={styles.msgTitle}>{item.totaljob}</Text>
            </View>
            <View>
              <Text style={styles.msgTitle}>{'Experience'}</Text>
              <Text style={styles.msgTitle}>{item.experience} Years</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              {showLocation || showAccount ? (
                <>
                  <TouchableOpacity
                    style={[styles.cancelCont, {left: 10}]}
                    onPress={toggleBack}>
                    <Icons.FontAwesome5
                      name="angle-left"
                      color={color.wite}
                      size={23}
                      style={styles.closeStyle}
                    />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{modalTitle}</Text>
                </>
              ) : (
                <Text style={styles.modalTitle}>Filter</Text>
              )}

              <TouchableOpacity style={styles.cancelCont} onPress={toggleModal}>
                <Icons.FontAwesome5
                  name="times"
                  color={color.wite}
                  size={20}
                  style={styles.closeStyle}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* {!showLocation && !showAccount  ? (
                <View style={styles.jobsCont}>
                  <Text style={styles.jobTitle}>Job</Text>
                  <TouchableOpacity
                    style={styles.cancelCont}
                    onPress={toggleJob}>
                    <Text style={{ color: 'black' }}>View All</Text>
                    <Icons.FontAwesome
                      name="angle-right"
                      color={color.black}
                      size={25}
                      style={styles.angleRight}
                    />
                  </TouchableOpacity>
                </View>
              ) : null} */}

              {/* {showJob && (
                <View style={styles.flatCont}>
                  <FlatList
                    data={skill}
                    renderItem={({ item }) => <Jobs item={item} />}
                    keyExtractor={(item, index) => `job_${index}`} // Use a dynamic key
                    numColumns={2} // Set the number of columns to 2
                  />
                </View>
              )} */}
              {!showLocation && !showAccount ? (
                <View style={styles.jobsCont}>
                  <Text style={styles.jobTitle}>Location</Text>
                  <TouchableOpacity
                    style={styles.cancelCont}
                    onPress={toggleLocation}>
                    {selectedslocation ? (
                      <Text style={{color: 'black', fontSize: 11.5}}>
                        {selectedslocation}
                      </Text>
                    ) : (
                      <Text style={{color: 'black'}}>View All</Text>
                    )}
                    <Icons.FontAwesome
                      name="angle-right"
                      color={color.blak}
                      size={25}
                      style={styles.angleRight}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
              {showLocation && (
                <View style={styles.flatCont}>
                  <FlatList
                    data={_Locations}
                    renderItem={({item}) => <Locations item={item} />}
                    keyExtractor={(item, index) => `location_${index}`}
                    numColumns={2}
                  />
                </View>
              )}
              {!showLocation && !showAccount ? (
                <View style={styles.jobsCont}>
                  <Text style={styles.jobTitle}>Account</Text>
                  <TouchableOpacity
                    style={styles.cancelCont}
                    onPress={toggleAccount}>
                    {selectedAccount ? (
                      <Text style={{color: 'black'}}>{selectedAccount}</Text>
                    ) : (
                      <Text style={{color: 'black'}}>View All</Text>
                    )}
                    <Icons.FontAwesome
                      name="angle-right"
                      color={color.blak}
                      size={25}
                      style={styles.angleRight}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}

              {showAccount && (
                <View style={styles.flatCont}>
                  <FlatList
                    data={accounts}
                    renderItem={({item}) => <Accounts item={item} />}
                    keyExtractor={(item, index) => `account_${index}`}
                    numColumns={2}
                  />
                </View>
              )}
            </View>

            <BotonComp
              onPressFunc={() => {
                applyFilter();
                toggleModal();
              }}
              BtnStyle={styles.BtnStyle}
              btnText="Apply"
            />
          </View>
        </View>
      </Modal>
      <CstmHeader
        title={`Find Expert ${data[0].service_name}`}
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <View style={styles.searchStyle}>
        <InputSarchFiltr
          toggleModal={toggleModal}
          onChangeText={val => {
            setsearchTerm(val);
          }}
          value={searchTerm}
        />
      </View>

      {/* <DeliverTo
          deliverTo="Deliver to:"
          location="Saim Ali, Islamabad..."
          change="Change"
          deliverCont={styles.deliverCont}
        /> */}
      <ScrollView style={{paddingHorizontal: 20, marginTop: 5}}>
        <FlatList
          data={sortedData}
          renderItem={({item}) => (
            <ExpertsList
              item={item}
              keyExtractor={({item, index}) => `expert_${index}`}
            />
          )}
        />
      </ScrollView>
    </>
  );
};

export default FndExprt;

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 15,
    marginTop: 20,
  },

  inputCont: {
    marginVertical: 10,
    width: '100%',
  },
  deliverCont: {
    paddingBottom: 15,
  },

  profileCont: {
    width: '100%',
  },
  textContainer: {
    paddingHorizontal: 11,
    paddingVertical: 15,
    backgroundColor: color.wite,
    borderRadius: 10,
    elevation: 1,
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  TextStyle: {
    fontSize: 18,
    color: color.blak,
    fontWeight: '700',
    textAlign: 'left',
    marginRight: 5,
  },
  msgTitle: {
    fontSize: 14,
    color: color.gry,
    fontWeight: '400',
    textAlign: 'center',
  },
  openingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '72%',
  },
  searchStyle: {
    // position: 'absolute',
    // bottom: -25,
    //alignSelf: 'center',
    //width: '100%',
    elevation: 1,
    padding: '5%',
  },
  statusStyle: {
    fontSize: 14,
    color: color.rd,
    fontWeight: '400',
  },
  logoImg: {
    width: width / 4.8,
    height: height / 8,
    borderRadius: 10,
    marginRight: 7,
  },
  titleCont: {
    paddingBottom: 18,
  },
  nameCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
  },
  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 100,
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
  cancelCont: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  jobTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: color.defalt,
    paddingTop: 5,
  },
  angleRight: {
    marginLeft: 5,
  },
  flatCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
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
  itemName: {
    color: color.wite,
    textAlign: 'center',
  },
});
