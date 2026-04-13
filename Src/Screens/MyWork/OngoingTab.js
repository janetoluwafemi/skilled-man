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
import {BASIC_URL} from '../Signin/Signin';

const {height} = Dimensions.get('window');
const OngoingTabs = props => {
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  
  const bottomPadding = (height * 0.085) + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

  useEffect(() => {
    GettData();
  }, [focus, props?.value]);
  const GettData = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=pqe6giac1t2jjjqkr6sh3r747i');

      var formdata = new FormData();
      formdata.append('provider_id', global.id);
      formdata.append('status', 'progress');
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
      //console.log(result)
    } catch (error) {
      Alert.alert('Error', error?.message || String(error) || 'An error occurred');
    }
  };

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
            status="In Progress"
            filepress={item.file}
          />
        )}
      />
      {/* <FlatListCard
        cardTitle="Hazle"
        bookingId="Booking ID - 88745RE"
        date="Oct 11, 2023"
        time="1:00 PM"
        paidTitle="Paid"
        status="28%"
      />
      <FlatListCard
        cardTitle="Hazle"
        bookingId="Booking ID - 88745RE"
        date="Oct 11, 2023"
        time="1:00 PM"
        status="28%"
        paidTitle="Paid"
      />
      <FlatListCard
        cardTitle="Hazle"
        bookingId="Booking ID - 88745RE"
        date="Oct 11, 2023"
        time="1:00 PM"
        paidTitle="Paid"
        status="28%"
      /> */}
    </ScrollView>
  );
};

export default OngoingTabs;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
