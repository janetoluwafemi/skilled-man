import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FltLstCrd from '../../Components/FlatListCard';
import color from '../../Assets/colors/colors';
import {Modal} from 'react-native-paper';
import {Icons} from '../../Components/Icons';
import OngoingDrpdwn from '../../Components/OngoingDropdown';
import BotonComp from '../../Components/BtnComp';
import Toast from 'react-native-simple-toast';
import {useIsFocused} from '@react-navigation/native';

import {BASIC_URL} from '../Signin/Signin';

const {height} = Dimensions.get('window');
const ComplteTab = props => {
  //console.log(props.value, 'on complete tab')
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState();
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  
  const bottomPadding = (height * 0.085) + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

  const getservicestataus = () => {
    console.log('books ervice status');
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
      formdata.append('status', 'complete');
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
  console.log(data, 'data');
  return (
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
            paidTitle="Paid"
            status={item.status}
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
              <OngoingDrpdwn />
            </View>

            <View style={styles.btnContainer}>
              <BotonComp
                BtnStyle={styles.acceptStyle}
                btnTextStyle={styles.btnTextStyle}
                btnText="Submit"
                onPressFunc={toggleModal}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ComplteTab;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
