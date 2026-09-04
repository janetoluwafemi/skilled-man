import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import * as Animatable from 'react-native-animatable';
import CustomAlert from '../../Components/CustomAlert';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

import { normalize } from '../../utilis/responsive';

const CrdDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    price = 1,
    fullName = '',
    date = new Date(),
    phoneNumber = '',
    address = '',
    provider_id = global.providerid,
    selectedfile = null,
  } = route.params || {};

  const [paymentUrl, setPaymentUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializingPayment, setInitializingPayment] = useState(false);

  const [customAlert, setCustomAlert] = useState({
    visible: false,
    title: '',
    message: '',
    onPress: null,
  });

  const [billingDetail] = useState({
    billingName: global.name || '',
    billingEmail: global.email || '',
    billingMobile: global.phone_number || '',
    billingAmount: price || 0,
  });

  useEffect(() => {
    createBooking();
  }, []);

  const safeToString = value => {
    if (value === null || value === undefined) {
      return '';
    }
    return value.toString();
  };

  const formatTime = dateObj => {
    const d = new Date(dateObj);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const showAlert = (title, message, onPress = null) => {
    setCustomAlert({
      visible: true,
      title,
      message,
      onPress,
    });
  };

  const createBooking = async () => {
    try {
      setLoading(true);

      if (!price || price <= 0) {
        showAlert('Error', 'Invalid price amount');
        return;
      }

      if (!global.id) {
        showAlert('Error', 'User not logged in');
        return;
      }

      const bookingDateObj = new Date(date);
      const bookingdate = bookingDateObj.toISOString().split('T')[0];
      const bookingtime = formatTime(bookingDateObj);

      const formdata = new FormData();
      formdata.append('user_id', global.id);
      formdata.append('servic_phone_no', phoneNumber);
      formdata.append('service_date', bookingdate);
      formdata.append('address', address);
      formdata.append('service_time', bookingtime);
      formdata.append('price', price.toString());
      formdata.append('provider_id', provider_id);
      formdata.append('Full_name', fullName);

      if (selectedfile && selectedfile.uri) {
        if (Platform.OS === 'web') {
          const fileBlobResponse = await fetch(selectedfile.uri);
          const blob = await fileBlobResponse.blob();
          formdata.append('file', blob, selectedfile.name || 'booking_image.jpg');
        } else {
          formdata.append('file', {
            uri: selectedfile.uri,
            name: selectedfile.name || 'booking_image.jpg',
            type: selectedfile.type || 'image/jpeg',
          });
        }
      }

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const response = await fetch(
        `${BASIC_URL}user/book_service.php`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result?.status) {
        global.bookid = result.booking_id;
        initiatePaystack();
      } else if (
        result?.error ===
        'Your Request is in Progress. So, Before Completing Previous you can Not Send Again'
      ) {
        showAlert(
          'Booking Failed',
          'Transaction incomplete. Kindly message the booked provider to reject your booking, then initiate a new transaction'
        );
      } else {
        showAlert('Booking Failed', result?.error || 'Unknown error');
      }
    } catch (error) {
      console.log('Booking creation error:', error);
      showAlert('Error', 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const initiatePaystack = async () => {
    try {
      setInitializingPayment(true);
      const formdata = new FormData();
      formdata.append(
        'amount',
        (billingDetail.billingAmount * 100).toString()
      );
      formdata.append('email', billingDetail.billingEmail);
      formdata.append('transaction_type', 'deposit');
      formdata.append('booking_id', global.bookid);

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const response = await fetch(`${BASIC_URL}paystack.php`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result?.data?.authorization_url) {
        global.refnum = result?.data?.reference;
        setPaymentUrl(result?.data?.authorization_url);
      } else {
        showAlert('Payment Error', 'Failed to initialize payment');
      }
    } catch (error) {
      showAlert('Payment Error', 'Failed to process payment');
    } finally {
      setInitializingPayment(false);
    }
  };

  const handleProceedToPay = () => {
    if (paymentUrl) {
      setModalVisible(true);
    } else if (loading || initializingPayment) {
      showAlert('Please Wait', 'Payment gateway is still initializing...');
    } else {
      createBooking();
    }
  };

  const handlePaymentNavigationChange = navState => {
    const { url } = navState;

    if (url.includes('payment-success')) {
      handlePaymentSuccess();
    }
  };

  const handlePaymentSuccess = () => {
    setModalVisible(false);
    showAlert('Success', 'Payment Successful!', () => {
      navigation.navigate('PaymentCongratulations');
    });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={color.defalt} />
        <Text style={styles.loadingText}>Initializing Payment...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={styles.formContainer}>
          <View style={styles.badgeRow}>
            <View style={styles.badgeCircle}>
              <Icons.Feather name="credit-card" size={28} color={color.defalt} />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Checkout Info</Text>
          <Text style={styles.welcomeSubtitle}>
            Review your checkout information and proceed to payment
          </Text>

          <View style={styles.cardWrapper}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Billing Name</Text>
              <C_TxtInput
                placeholder="Billing Name"
                placeholderTextColor={color.litGry}
                value={billingDetail.billingName}
                editable={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Billing Email</Text>
              <C_TxtInput
                placeholder="Billing Email"
                placeholderTextColor={color.litGry}
                value={billingDetail.billingEmail}
                editable={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Mobile Number</Text>
              <C_TxtInput
                placeholder="Mobile Number"
                placeholderTextColor={color.litGry}
                value={billingDetail.billingMobile}
                editable={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Amount (₦)</Text>
              <C_TxtInput
                placeholder="Amount"
                placeholderTextColor={color.litGry}
                value={safeToString(billingDetail.billingAmount)}
                editable={false}
              />
            </View>

            <BotonComp
              BtnStyle={styles.submitBtn}
              btnText={
                initializingPayment ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  'Proceed to Pay'
                )
              }
              onPressFunc={handleProceedToPay}
            />
          </View>
        </Animatable.View>
      </ScrollView>

      <CustomAlert
        visible={customAlert.visible}
        title={customAlert.title}
        message={customAlert.message}
        onOk={() => {
          const action = customAlert.onPress;
          setCustomAlert({ visible: false, title: '', message: '', onPress: null });
          if (action) action();
        }}
      />

      <Modal
        visible={modalVisible && !!paymentUrl}
        animationType="slide"
        onRequestClose={handleCloseModal}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.headerBar}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCloseModal}
              style={styles.backArrowBtn}>
              <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: paymentUrl }}
            style={styles.webView}
            onNavigationStateChange={handlePaymentNavigationChange}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator
                size="large"
                color={color.defalt}
                style={styles.loaderMargin}
              />
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CrdDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: normalize(20),
    paddingTop: Platform.OS === 'android' ? normalize(16) : normalize(8),
    paddingBottom: normalize(12),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  backArrowBtn: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: normalize(40),
  },
  formContainer: {
    paddingHorizontal: normalize(20),
    paddingTop: normalize(4),
  },
  badgeRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeCircle: {
    width: normalize(68),
    height: normalize(68),
    borderRadius: normalize(34),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  welcomeTitle: {
    fontSize: normalize(22),
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: normalize(13),
    color: '#64748B',
    textAlign: 'center',
    marginBottom: normalize(18),
    marginTop: normalize(4),
    lineHeight: normalize(18),
    paddingHorizontal: normalize(16),
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(18),
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: normalize(16),
  },
  fieldGroup: {
    marginBottom: normalize(14),
    width: '100%',
  },
  fieldLabel: {
    fontSize: normalize(13),
    fontWeight: '600',
    color: '#334155',
    marginBottom: normalize(6),
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: normalize(14),
    paddingVertical: normalize(14),
    marginTop: normalize(10),
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  webView: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  loaderMargin: {
    marginTop: 20,
  },
});