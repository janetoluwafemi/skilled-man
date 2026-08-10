import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  Share,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import color from '../../Assets/colors/colors';
import BookingCrd from '../../Components/BookingCard';
import DrarTitlProfilHeader from '../../Components/DrawerTitleProfileHeader';
import { Icons } from '../../Components/Icons';
import C_TxtInput from '../../Components/C_TextInput';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

const BokngScren = () => {
  const focus = useIsFocused();
  const navigation = useNavigation();

  const [bookData, setBookData] = useState([]);
  const [submitReviewVisible, setSubmitReviewVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [details, setDetails] = useState('');
  const [bookId, setBookId] = useState('');
  const [providerId, setProviderId] = useState('');

  useEffect(() => {
    if (focus) {
      fetchBookingData();
    }
  }, [focus]);

  const fetchBookingData = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=2d0j4je2t3mdtg29p1ncvpab0b');

      const formdata = new FormData();
      formdata.append('user_id', global.id);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      const response = await fetch(
        `${BASIC_URL}user/request_booking_service.php`,
        requestOptions
      );
      const result = await response.json();

      if (result.booking_request) {
        const uniqueBookings = result.booking_request.filter(
          (item, index, self) =>
            index === self.findIndex((b) => b.booking_id === item.booking_id)
        );
        setBookData(uniqueBookings);
      }

      if (result.error) {
        Toast.show(result.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch booking data');
    }
  };

  const sendRating = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Cookie', 'PHPSESSID=fhc8n3gq283lr08p22d9n0nfaa');

      const formdata = new FormData();
      formdata.append('user_id', global.id);
      formdata.append('rating', rating);
      formdata.append('feedback', feedback);
      formdata.append('provider_id', providerId);
      formdata.append('bookingId', bookId);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      const apiurl = `${BASIC_URL}user/feedback.php`;
      const response = await fetch(apiurl, requestOptions);
      const result = await response.json();

      if (result.success) {
        Alert.alert('Thank you!', result.success);
      } else if (result.error) {
        Alert.alert('Error occurred', result.error);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.log('Error in review submission:', error);
    }
  };

  const openReviewOptions = (selectedBookingId, selectedProviderId) => {
    setBookId(selectedBookingId);
    setProviderId(selectedProviderId);
    setReviewVisible(true);
  };

  const toggleSubmitReview = () => {
    setSubmitReviewVisible(!submitReviewVisible);
    setReviewVisible(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Share Booking Details',
        message: details || 'Booking Details from Skilledman App',
      });
    } catch (error) {
      console.log('Share error:', error.message);
    }
  };

  const renderStarPicker = () => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <TouchableOpacity
            key={starIndex}
            onPress={() => setRating(starIndex)}
            style={styles.starTouch}>
            <Icons.FontAwesome
              name={starIndex <= rating ? 'star' : 'star-o'}
              size={32}
              color={starIndex <= rating ? 'gold' : 'lightgray'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={submitReviewVisible}
        onRequestClose={() => setSubmitReviewVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Opinion matters to us!</Text>
              <TouchableOpacity
                style={styles.cancelCont}
                onPress={toggleSubmitReview}>
                <Icons.FontAwesome5 name="times" color={color.wite} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {renderStarPicker()}

              <C_TxtInput
                styles={{ fontWeight: '400', width: '100%' }}
                numberOfLines={4}
                multiline={true}
                placeholder="Give your feedback"
                placeholderTextColor={color.litGry}
                onChangeText={(val) => setFeedback(val)}
              />

              <BotonComp
                onPressFunc={() => {
                  sendRating();
                  setSubmitReviewVisible(false);
                }}
                BtnStyle={{ marginTop: 20, width: '100%' }}
                btnText="Submit"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewVisible}
        onRequestClose={() => setReviewVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Service</Text>
              <TouchableOpacity
                style={styles.cancelCont}
                onPress={() => setReviewVisible(false)}>
                <Icons.FontAwesome5 name="times" color={color.wite} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TouchableOpacity style={styles.attachCont}>
                <Icons.FontAwesome5
                  name="exclamation-circle"
                  size={20}
                  style={styles.attachIcon}
                  color={color.defalt}
                />
                <Text style={styles.labelStyle}>Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleSubmitReview}
                style={styles.attachCont}>
                <Icons.FontAwesome5
                  name="edit"
                  size={20}
                  style={styles.attachIcon}
                  color={color.defalt}
                />
                <Text style={styles.labelStyle}>Review</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleShare} style={styles.attachCont}>
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
        </View>
      </Modal>

      <DrarTitlProfilHeader
        screenTitle="Booked Services"
        onPress={() => navigation.openDrawer()}
        userProfile={() => navigation.navigate('editUserProfile')}
        imgUrl={require('../../Assets/Images/user.jpg')}
      />

      <FlatList
        data={bookData}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item, index) =>
          item.booking_id ? item.booking_id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <BookingCrd
            cardTitle={item.name}
            bookingId={`Booking ID - ${item.booking_id}`}
            expertise={`Expert ${item.service}`}
            status={item.status}
            paidTitle={item.service_date}
            dateCont={styles.dateCont}
            filepress={item.file}
            toggleReviewModal={() => {
              openReviewOptions(item.booking_id, item.provider_id);
              setDetails(`Booking ID: ${item.booking_id}\nService: ${item.service}\nProvider: ${item.name}`);
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default BokngScren;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 30,
  },
  dateCont: {
    fontWeight: '400',
    color: color.gry,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    borderRadius: 12,
    width: '85%',
    backgroundColor: color.wite,
    overflow: 'hidden',
    elevation: 5,
  },
  modalHeader: {
    backgroundColor: color.defalt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  modalTitle: {
    fontSize: 18,
    color: color.wite,
    fontWeight: '600',
  },
  cancelCont: {
    position: 'absolute',
    right: 15,
  },
  modalBody: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  starTouch: {
    paddingHorizontal: 6,
  },
  attachCont: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 12,
    width: '100%',
  },
  attachIcon: {
    marginRight: 12,
  },
  labelStyle: {
    fontSize: 16,
    color: color.blak,
    fontWeight: '500',
  },
});