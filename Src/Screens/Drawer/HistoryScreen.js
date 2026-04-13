import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView, Alert,FlatList
} from 'react-native';
import React, { useState, useEffect } from 'react';
import color from '../../Assets/colors/colors';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import BookingCrd from '../../Components/BookingCard';
import DrarTitlProfilHeader from '../../Components/DrawerTitleProfileHeader';
import CstmHeader from '../../Components/CustomHeader';
const { height } = Dimensions.get('window');
const { width } = Dimensions.get('window');
import Toast from 'react-native-simple-toast';
import FltLstCrd from '../../Components/FlatListCard';
import { BASIC_URL } from '../Signin/Signin';
const HistryScren = props => {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const [data, setData] = useState()
  useEffect(() => {
    GetData();
  }, [focus])

  const GetData = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Cookie", "PHPSESSID=pqe6giac1t2jjjqkr6sh3r747i");

      var formdata = new FormData();
      formdata.append("provider_id", global.id);
      formdata.append("status", "complete");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      // const apiurl = "https://fisdemoprojects.com/skilledman/api/provider_status.php"
      const apiurl = `${BASIC_URL}provider_status.php`

      const response = await fetch(apiurl, requestOptions)
      const result = await response.json();
      if (result && result.booking_request) {
        console.log(result.booking_request, '123')
        setData(result.booking_request)
      }
      else if (result && result.error) {
        Toast.show(result.error);
      }
    } catch (error) {
      Alert.alert(error)
    }

  }
  return (
    <ScrollView style={styles.scrollViewStyle}>
      <CstmHeader
        title="History"
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.cardContainer}>
        {/* <BookingCard
          cardTitle="Amadi"
          bookingId="Booking ID - 48755DA"
          expertise="Expert Mechanic"
          status="Paid"
          paidTitle="June 08, 2023"
          dateCont={styles.dateCont}
        /> */}

        <FlatList
          data={data}
          renderItem={({ item }) => (
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
      </View>
    </ScrollView>
  );
};

export default HistryScren;

const styles = StyleSheet.create({
  cardStyle: {
    paddingTop: 0,
  },
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

  pendAppr: {
    fontWeight: 'bold',
    fontSize: 17,
    color: color.blak,
    paddingVertical: 5,
  },
  cardContainer: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 27,
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
  dateCont: {
    fontWeight: '400',
    color: color.gry,
  },
});