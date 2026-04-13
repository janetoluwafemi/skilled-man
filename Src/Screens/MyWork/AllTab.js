import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FltLstCrd from '../../Components/FlatListCard';
import Toast from 'react-native-simple-toast';
import {useIsFocused} from '@react-navigation/native';
import color from '../../Assets/colors/colors';
import {Modal} from 'react-native-paper';
import {Icons} from '../../Components/Icons';
import OngoingDrpdwn from '../../Components/OngoingDropdown';
import BotonComp from '../../Components/BtnComp';
import {BASIC_URL} from '../Signin/Signin';

const {height} = Dimensions.get('window');
const AlTabs = props => {
  //console.log(props.value, 'on all')
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState();
  console.log(data, 'qwert');
  const [selectedBusiness, setselectedBusiness] = useState('0');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  
  const bottomPadding = (height * 0.085) + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    GetData();
  }, [focus, props?.value]);

  const GetData = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=pqe6giac1t2jjjqkr6sh3r747i');

      var formdata = new FormData();
      formdata.append('provider_id', global.id);
      if (props?.value) {
        formdata.append('searchTerm', props?.value);
      }
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      // const apiurl = "https://fisdemoprojects.com/skilledman/api/provider_status.php"
      const apiurl = `${BASIC_URL}provider_status.php`;

      const response = await fetch(apiurl, requestOptions);
      const result = await response.json();
      if (result && result.booking_request) {
        setData(result.booking_request);
      } else if (result && result.error) {
        Toast.show(result.error);
      }
    } catch (error) {
      Alert.alert('Error', error?.message || String(error) || 'An error occurred');
    }
  };
  console.log(selectedBusiness, 'yetefd');
  const changstatus = async bookingId => {
    console.log(bookingId);
    try {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=5sfeloifjcmrpti44vvqmr763q');
      var formdata = new FormData();
      formdata.append('id', bookingId);
      formdata.append('status', selectedBusiness);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // const apiurl = "https://fisdemoprojects.com/skilledman/api/status_update.php";
      const apiurl = `${BASIC_URL}status_update.php`;

      const response = await fetch(apiurl, requestOptions);
      const result = await response.json();
      if (result.success) {
        Toast.show(result.success);
      }
    } catch (error) {
      Alert.alert('Error', error?.message || String(error) || 'An error occurred');
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: bottomPadding,
        }}
        showsVerticalScrollIndicator={false}>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <FltLstCrd
              cardTitle={item.name}
              bookingId={`Booking ID - ${item.booking_id}`}
              date={item.service_date}
              time={item.service_time}
              status={item.status}
              iconName="ellipsis-v"
              onPressShowProfile={() => {
                setSelectedBookingId(item.booking_id); // Store the selected booking_id
                toggleModal();
              }}
              filepress={item.file}
            />
          )}
        />
        {/* <FlatListCard
        cardTitle={data[0].name}
        bookingId="Booking ID - 88745RE"
        date="Oct 11, 2023"
        time="1:00 PM"
        status="28%"
        iconName="ellipsis-v"
        onPressShowProfile={toggleModal}
      />
      <FlatListCard
        cardTitle="Hazle"
        bookingId="Booking ID - 88745RE"
        date="Oct 11, 2023"
        time="1:00 PM"
        status="28%"
        iconName="ellipsis-v"
        onPressShowProfile={toggleModal}
      />
      <FlatListCard
        cardTitle="Hazle"
        bookingId="Booking ID - 88745RE"
        date="Oct 11, 2023"
        time="1:00 PM"
        status="28%"
        iconName="ellipsis-v"
        onPressShowProfile={toggleModal}
      /> */}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={toggleModal}>
                <Icons.FontAwesome5
                  name="times"
                  color={color.wite}
                  size={20}
                  style={styles.closeStyle}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.successmodalBody}>
              <OngoingDrpdwn
                selectedBusiness={selectedBusiness}
                setselectedBusiness={setselectedBusiness}
              />
            </View>

            <View style={styles.btnContainer}>
              <BotonComp
                BtnStyle={styles.acceptStyle}
                btnTextStyle={styles.btnTextStyle}
                btnText="Submit"
                onPressFunc={() => {
                  if (selectedBookingId) {
                    changstatus(selectedBookingId); // Pass the selected booking_id
                    toggleModal();
                  } else {
                    Alert.alert('Please select a booking before submitting.');
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AlTabs;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginLeft: 0,
    marginRight: 0,
    height: '100%',
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  modalView: {
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: color.wite,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
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
  modalHeader: {
    backgroundColor: color.defalt,
    alignItems: 'flex-end',
    paddingVertical: 17,
    paddingHorizontal: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});
