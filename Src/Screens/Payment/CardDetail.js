import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import C_TxtInput from '../../Components/C_TextInput';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const CrdDetails = props => {
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

  const createBooking = async () => {
    try {
      setLoading(true);

      if (!price || price <= 0) {
        Alert.alert('Error', 'Invalid price amount');
        return;
      }

      if (!global.id) {
        Alert.alert('Error', 'User not logged in');
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
        formdata.append('file', {
          uri: selectedfile.uri,
          name: selectedfile.name || 'file',
          type: selectedfile.type || 'application/octet-stream',
        });
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
        Alert.alert(
          'Booking Failed',
          'Transaction incomplete. Kindly message the booked provider to reject your booking, then initiate a new transaction'
        );
      } else {
        Alert.alert('Booking Failed', result?.error || 'Unknown error');
      }
    } catch (error) {
      Alert.alert('Error', 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const initiatePaystack = async () => {
    try {
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
        setModalVisible(true);
      } else {
        Alert.alert('Payment Error', 'Failed to initialize payment');
      }
    } catch (error) {
      Alert.alert('Payment Error', 'Failed to process payment');
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
    showToast('Payment Successful!');
    navigation.navigate('PaymentCongratulations');
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.navigation.goBack()}
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
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../Assets/Images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Billing Details</Text>
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

            {paymentUrl ? (
              <BotonComp
                BtnStyle={styles.submitBtn}
                btnText="Proceed to Pay"
                onPressFunc={() => setModalVisible(true)}
              />
            ) : null}
          </View>
        </Animatable.View>
      </ScrollView>

      <Modal
        visible={modalVisible && !!paymentUrl}
        animationType="slide"
        onRequestClose={handleCloseModal}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalHeaderBar}>
            <Text style={styles.modalHeaderTitle}>Secure Checkout</Text>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.modalCloseBtn}>
              <Icons.Ionicons name="close-circle" size={26} color="#94A3B8" />
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  backArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  logoImage: {
    width: 52,
    height: 52,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 4,
    lineHeight: 20,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  modalHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 4,
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