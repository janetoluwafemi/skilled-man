import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  Linking,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import color from '../../Assets/colors/colors';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import HomStakWSarch from '../../Components/HomeStackWithSearch';
import { Modal } from 'react-native-paper';
import Icon, { Icons } from '../../Components/Icons';
import FltLstCrd from '../../Components/FlatListCard';
import BotonComp from '../../Components/BtnComp';
import Toast from 'react-native-simple-toast';
import { BASIC_URL } from '../Signin/Signin';

const { height, width } = Dimensions.get('window');

const ReqestScren = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [booklist, setbooklist] = useState([]);
  const [currentitem, setCurrentItem] = useState(null);
  const [searchTerm, setsearchTerm] = useState('');
  
  const bottomPadding = (height * 0.085) + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

  const toggleModal = (item) => {
    if (item.status !== 'progress') {
      setModalVisible(!modalVisible);
      setCurrentItem(item);
    } else {
      Toast.show('This request is already in progress and cannot be modified.');
    }
  };

  const getBokngReqest = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Cookie", "PHPSESSID=5sfeloifjcmrpti44vvqmr763q");

    const formdata = new FormData();
    formdata.append("provider_id", global.id);
    if (searchTerm !== '') {
      formdata.append("searchTerm", searchTerm);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    const apiurl = `${BASIC_URL}provider_status.php`;

    try {
      const response = await fetch(apiurl, requestOptions);
      const result = await response.json();

      if (result && result.booking_request) {
        setbooklist(result.booking_request);
      } else if (result && result.error) {
        Toast.show(result.error);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    getBokngReqest();
  }, [focused, searchTerm]);

  const changstatus = async (v) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Cookie", "PHPSESSID=5sfeloifjcmrpti44vvqmr763q");
  
      const formdata = new FormData();
      formdata.append("id", currentitem.booking_id);
      formdata.append("status", v);
  
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
  
      const apiurl = `${BASIC_URL}status_update.php`;
  
      const response = await fetch(apiurl, requestOptions);
      const result = await response.json();
  
      if (result.success) {
        Toast.show(result.success);
        setModalVisible(false);      // ✅ Close the modal
        setCurrentItem(null);        // ✅ Reset the current item
        getBokngReqest();            // ✅ Immediately refresh data
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  
  const openFile = () => {
    const fileURL = `${BASIC_URL}uploads/${currentitem?.file}`;
    Linking.openURL(fileURL).catch((err) =>
      console.error(`Error opening file: ${err}`)
    );
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}} edges={['top']}>
        <HomStakWSarch
          onPress={() => navigation.openDrawer()}
          onPressnotification={() => navigation.navigate('edit_profile')}
          onChangeText={(val) => setsearchTerm(val)}
          value={searchTerm}
        />

        <FlatList
          data={booklist}
          keyExtractor={(item) => item.booking_id.toString()}
          renderItem={({ item, index }) => (
            <FltLstCrd
              index={index}
              cardTitle={item.name}
              bookingId={`Booking ID - ${item.booking_id}`}
              date={item.service_date}
              time={item.service_time}
              status={item.status}
              onPressShowProfile={() => toggleModal(item)}
              iconName="ellipsis-v"
              filepress={item.file}
            />
          )}
          contentContainerStyle={[
            styles.cardContainer,
            {paddingBottom: bottomPadding}
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No requests found</Text>
            </View>
          }
        />
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icons.FontAwesome5
                  name="times"
                  color={color.wite}
                  size={20}
                  style={styles.closeStyle}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.successmodalBody}>
              {currentitem?.profile ? (
                <Image
                  style={styles.logoImg}
                  resizeMode="contain"
                  source={{ uri: `${BASIC_URL}uploads/${currentitem.profile}` }}
                />
              ) : (
                <Image
                  style={styles.logoImg}
                  resizeMode="contain"
                  source={require('../../Assets/Images/profile.jpg')}
                />
              )}

              <Text style={styles.pendAppr}>{currentitem?.name}</Text>
              <Text style={styles.bookingStyle}>
                Booking ID- {currentitem?.booking_id}
              </Text>

              <View style={styles.dateTimeCont}>
                <Text style={styles.dateStyle}>{currentitem?.service_date}</Text>
                <Text style={styles.bookingStyle}>
                  ({currentitem?.service_time})
                </Text>
              </View>

              <View style={styles.dateTimeCont}>
                <TouchableOpacity onPress={openFile} style={{ flexDirection: 'row' }}>
                  <Icons.FontAwesome
                    name="file-text"
                    size={22}
                    color={color.drkGry}
                  />
                  <Text style={styles.bookingStyle}> Service Detail</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity>
                <Text style={styles.getDir}> Get Direction</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnContainer}>
              <BotonComp
                BtnStyle={styles.acceptStyle}
                btnTextStyle={styles.btnTextStyle}
                btnText="Accept"
                onPressFunc={() => changstatus('progress')}
              />
              <BotonComp
                BtnStyle={styles.rejectStyle}
                btnTextStyle={styles.btnTextStyle}
                btnText="Reject"
                onPressFunc={() => changstatus('reject')}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ReqestScren;




const styles = StyleSheet.create({
  linearGradientStyle: {
    elevation: 0,
    borderRadius: 6,
    height: '100%',
  },
  scrollView: {
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  vegetableTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: color.blak,
  },
  inputCont: {
    marginVertical: 10,
    width: '100%',
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
  cardContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: color.gry,
    fontWeight: '500',
  },

  modalContainer: {
    // flex:1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginLeft: 0,
    marginRight: 0,
  },
  modalBody: {
    flexDirection: 'column',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  modalView: {
    borderRadius: 12,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: color.wite,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
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
    color: color.blak,
    paddingVertical: 5,
  },

  scrollViewStyle: {
    marginBottom: 40,
    paddingBottom: 40,
  },
  modalHeader: {
    backgroundColor: color.defalt,
    alignItems: 'flex-end',
    paddingVertical: 17,
    paddingHorizontal: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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

  btnTextStyle: {
    fontSize: 13,
  },
  acceptStyle: {
    width: '47%',
  },
  rejectStyle: {
    backgroundColor: color.rd,
    borderColor: color.rd,
    borderWidth: 2,
    width: '47%',
  },
  getDir: {
    color: color.defalt,
    fontWeight: '700',
    paddingTop: 5,
  },
});