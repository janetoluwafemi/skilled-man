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
  StatusBar,
  Share,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import BookingCrd from '../../Components/BookingCard';
import DrarTitlProfilHeader from '../../Components/DrawerTitleProfileHeader';
import { Icons } from '../../Components/Icons';
import C_TxtInput from '../../Components/C_TextInput';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

const BookingScreen = () => {
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
        console.log(result.error);
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
              color={starIndex <= rating ? '#F59E0B' : '#CBD5E1'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <Modal
        animationType="fade"
        transparent={true}
        visible={submitReviewVisible}
        onRequestClose={() => setSubmitReviewVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Opinion Matters</Text>
              <TouchableOpacity
                style={styles.cancelCont}
                onPress={toggleSubmitReview}>
                <Icons.Ionicons name="close-circle" color="#94A3B8" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {renderStarPicker()}

              <C_TxtInput
                styles={{ fontWeight: '400', width: '100%' }}
                numberOfLines={4}
                multiline={true}
                placeholder="Give your feedback"
                placeholderTextColor="#94A3B8"
                onChangeText={(val) => setFeedback(val)}
              />

              <BotonComp
                onPressFunc={() => {
                  sendRating();
                  setSubmitReviewVisible(false);
                }}
                BtnStyle={styles.submitBtn}
                btnText="Submit Review"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={reviewVisible}
        onRequestClose={() => setReviewVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Options</Text>
              <TouchableOpacity
                style={styles.cancelCont}
                onPress={() => setReviewVisible(false)}>
                <Icons.Ionicons name="close-circle" color="#94A3B8" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TouchableOpacity style={styles.attachCont}>
                <Icons.Feather
                  name="alert-circle"
                  size={20}
                  style={styles.attachIcon}
                  color="#EF4444"
                />
                <Text style={[styles.labelStyle, { color: '#EF4444' }]}>Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleSubmitReview}
                style={styles.attachCont}>
                <Icons.Feather
                  name="edit-3"
                  size={20}
                  style={styles.attachIcon}
                  color={color.defalt}
                />
                <Text style={styles.labelStyle}>Write Review</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleShare} style={styles.attachCont}>
                <Icons.Feather
                  name="share-2"
                  size={20}
                  style={styles.attachIcon}
                  color={color.defalt}
                />
                <Text style={styles.labelStyle}>Share Details</Text>
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
        showsVerticalScrollIndicator={false}
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

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 30,
  },
  dateCont: {
    fontWeight: '500',
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    borderRadius: 20,
    width: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    color: '#0F172A',
    fontWeight: '800',
  },
  cancelCont: {
    padding: 2,
  },
  modalBody: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 14,
  },
  starTouch: {
    paddingHorizontal: 6,
  },
  attachCont: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 14,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  attachIcon: {
    marginRight: 14,
  },
  labelStyle: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 16,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});