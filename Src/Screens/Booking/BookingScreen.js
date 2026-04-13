import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import color from '../../Assets/colors/colors';
import {
  createNavigationContainerRef,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import BookingCrd from '../../Components/BookingCard';
import DrarTitlProfilHeader from '../../Components/DrawerTitleProfileHeader';
const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');
import Toast from 'react-native-simple-toast';
import StarRating from 'react-native-star-rating';
import {Icons} from '../../Components/Icons';
import C_TxtInput from '../../Components/C_TextInput';
import BotonComp from '../../Components/BtnComp';
import Share from 'react-native-share';
import {BASIC_URL} from '../Signin/Signin';
const BokngScren = () => {
  const focus = useIsFocused();
  const navigation = useNavigation();
  const [Book_Data, setBook_Data] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitReviewVisible, setsubmitReviewVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [Feedback, setFeedback] = useState('');
  const [Details, setDetails] = useState({});
  const [bookid, setBookid] = useState('');
  const [provideid, setprovideId] = useState('');
  useEffect(() => {
    BokngData();
  }, [focus]);
  const BokngData = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=2d0j4je2t3mdtg29p1ncvpab0b');

      var formdata = new FormData();
      formdata.append('user_id', global.id);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // fetch(
      //   'https://fisdemoprojects.com/skilledman/api/user/request_booking_service.php',
      //   requestOptions,
      // )
      fetch(`${BASIC_URL}user/request_booking_service.php`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result, '1234');
          console.log('Booking Data:', result);

          // if (result.booking_request) {
          //   // it was showing duolicate entries from server
          //   setBook_Data(result.booking_request);
          // }
          if (result.booking_request) {
            const uniqueBookings = result.booking_request.filter(
              (item, index, self) =>
                index === self.findIndex(b => b.booking_id === item.booking_id),
            );

            setBook_Data(uniqueBookings);
          }

          if (result.error) {
            Toast.show(result.error);
          }
        })
        .catch(error => console.log('Error fetching booking data:', error));
    } catch (error) {
      Alert.alert(error);
    }
  };

  const SndRatng = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=fhc8n3gq283lr08p22d9n0nfaa');
      var formdata = new FormData();
      formdata.append('user_id', global.id);
      formdata.append('rating', rating);
      formdata.append('feedback', Feedback);
      formdata.append('provider_id', provideid);
      formdata.append('bookingId', bookid);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      // const apiurl ='https://fisdemoprojects.com/skilledman/api/user/feedback.php';
      const apiurl = `${BASIC_URL}user/feedback.php`;

      const response = await fetch(apiurl, requestOptions);
      const result = await response.json();
      console.log('Feedback Response:', result);
      if (result.success) {
        Alert.alert('Thank you!', result.success);
      } else if (result.error) {
        Alert.alert('Error occurred', result.error);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.log('error in review', error);
    }
  };
  const hndlRatng = rating => {
    setRating(rating);
    const value = rating * 1; // Convert rating to desired value range
    Alert.alert('Rating', `You rated ${rating} stars. Value: ${value}%`);
  };
  const toggleReview = (bookingid, providerId) => {
    console.log('booking ID', bookingid, 'providerId', providerId);
    setBookid(bookingid);
    setprovideId(providerId);
    setReviewVisible(!reviewVisible);
    setModalVisible(false);
  };
  const toggleSumbitReview = () => {
    setsubmitReviewVisible(!submitReviewVisible);
    setReviewVisible(false);
  };

  const getDetails = obj => {
    setDetails(JSON.stringify(obj));
  };

  const shareImage = async () => {
    try {
      const options = {
        title: 'Share Image',
        message: Details,
      };

      await Share.open(options);

      console.log('Image shared successfully');
    } catch (error) {
      //ToastAndroid.show('User did not share', ToastAndroid.LONG);
      console.log('An error occurred:', error);
    }
  };

  return (
    // <ScrollView style={styles.scrollViewStyle}>
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={submitReviewVisible}
        onRequestClose={() => setsubmitReviewVisible(false)}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Opinion matters to us!</Text>
            <TouchableOpacity
              style={styles.cancelCont}
              onPress={toggleSumbitReview}>
              <Icons.FontAwesome5
                name="times"
                color={color.wite}
                size={20}
                style={styles.closeStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.iconCont}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                halfStarEnabled // Enable half-star selection
                selectedStar={hndlRatng}
                containerStyle={{marginVertical: 10}}
                starSize={40}
                starStyle={{marginRight: 5}}
                //iconSet="MaterialIcons"
                emptyStarColor="lightgray"
                fullStarColor="gold"
                halfStarColor="orange"
              />
            </View>
            <C_TxtInput
              styles={{fontWeight: '400'}}
              numberOfLines={5}
              multiline={true}
              // maxLength={200}
              placeholder="Give your feedback"
              placeholderTextColor={color.litGry}
              onChangeText={val => {
                setFeedback(val);
              }}
            />
            <BotonComp
              onPressFunc={() => {
                SndRatng();
                setsubmitReviewVisible(!submitReviewVisible);
                setReviewVisible(false);
              }}
              BtnStyle={{marginTop: 25}}
              btnText="Submit"
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={reviewVisible}
        onRequestClose={() => setReviewVisible(false)}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Book Service</Text>
            <TouchableOpacity style={styles.cancelCont} onPress={toggleReview}>
              <Icons.FontAwesome5
                name="times"
                color={color.wite}
                size={20}
                style={styles.closeStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <TouchableOpacity
              style={[styles.attachCont, {...styles.revListing}]}>
              <Icons.FontAwesome5
                name="exclamation-circle"
                size={20}
                style={styles.attachIcon}
                color={color.defalt}
              />
              <Text style={styles.labelStyle}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleSumbitReview}
              style={styles.attachCont}>
              <Icons.FontAwesome5
                name="edit"
                size={20}
                style={styles.attachIcon}
                color={color.defalt}
              />
              <Text style={styles.labelStyle}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                shareImage();
              }}
              style={styles.attachCont}>
              <Icons.Feather
                name="share-2"
                size={20}
                style={styles.attachIcon}
                color={color.defalt}
              />
              <Text style={styles.labelStyle}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DrarTitlProfilHeader
        screenTitle="Booked Services"
        onPress={() => {
          navigation.openDrawer();
        }}
        userProfile={() => {
          navigation.navigate('editUserProfile');
        }}
        imgUrl={require('../../Assets/Images/user.jpg')}
      />
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.cardContainer}>
          <FlatList
            data={Book_Data}
            renderItem={({item}) => (
              <BookingCrd
                cardTitle={item.name}
                bookingId={`Booking ID - ${item.booking_id}`}
                expertise={`Expert ${item.service}`}
                status={item.status}
                paidTitle={item.service_date}
                dateCont={styles.dateCont}
                filepress={item.file}
                toggleReviewModal={() => {
                  toggleReview(item.booking_id, item.provider_id);
                  getDetails(item);
                }}
                // toggleReviewModal={() => console.log("helo baby ", "provideer id", item.booking_id, item.provider_id)}
              />
            )}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default BokngScren;

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
  modalContainer: {
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
  cardContainer: {
    marginHorizontal: 15,
    marginTop: 15,
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
  // add css for modal
  inputContainer: {
    marginBottom: 10,
  },
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
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContainer: {
    paddingHorizontal: 11,
    paddingVertical: 11,
    backgroundColor: color.wite,
    borderRadius: 10,
    elevation: 1,
    marginBottom: 10,
    marginRight: 10,
    width: 280,
  },
  TextStyle: {
    fontSize: 20,
    color: color.blak,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 5,
  },
  msgTitle: {
    fontSize: 16,
    color: color.gry,
    fontWeight: '400',
    textAlign: 'left',
    paddingVertical: 6,
  },
  statusStyle: {
    fontSize: 14,
    color: color.rd,
    fontWeight: '400',
  },
  logoImg: {
    width: width / 6,
    height: height / 15,
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
  expertImg: {
    width: '100%',
    height: height / 3,
  },
  imgCont: {
    position: 'absolute',
    width: '100%',
    height: height / 3.43,
    elevation: 1,
    backgroundColor: color.defalt,
    zIndex: 900,
    opacity: 0.3,
    top: 19,
  },
  expertTitle: {
    position: 'absolute',
    bottom: '11%',
    left: '5%',
    fontWeight: 'bold',
    fontSize: 20,
    color: color.wite,
    zIndex: 9000,
  },
  contentStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  displayFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameStyle: {
    fontWeight: 'bold',
    fontSize: 23,
    color: color.defalt,
    marginRight: 5,
  },
  disStyle: {
    fontSize: 16,
    color: color.defalt,
  },
  expStyle: {
    fontSize: 16,
    color: color.gry,
    paddingLeft: 6,
  },
  ratingCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    backgroundColor: '#e8e8e8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 1,
  },
  ratContent: {
    justifyContent: 'flex-start',
  },
  ratTitle: {
    fontSize: 18,
    color: color.gry,
    paddingBottom: 7,
  },
  totRat: {
    fontSize: 18,
    color: color.blak,
    paddingLeft: 5,
    fontWeight: '600',
    textAlign: 'center',
  },
  serInc: {
    fontSize: 18,
    color: color.defalt,
    fontWeight: '600',
  },
  licenseStyle: {
    fontSize: 18,
    color: color.defalt,
    fontWeight: '600',
    paddingRight: 6,
  },
  serviceCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 4,
  },
  listStyle: {
    fontSize: 17,
    color: color.gry,
    fontWeight: '400',
    paddingRight: 2,
  },
  listCont: {
    marginBottom: 10,
  },
  btnContainer: {
    //position: 'absolute',
    //bottom: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    //zIndex: 1,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  BtnStyle: {
    width: '46%',
    marginTop: 0,
  },

  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 100,
  },
  modalView: {
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: color.wite,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    width: '100%',
  },
  modalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    zIndex: 100,
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
  labelStyle: {
    fontSize: 19,
    color: color.blak,
    fontWeight: '600',
  },
  attachCont: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingVertical: 10,
  },
  attachIcon: {
    marginRight: 5,
  },
  revListing: {
    paddingHorizontal: 6,
  },
  iconCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
});
