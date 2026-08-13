import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Button,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import C_TxtInput from '../../Components/C_TextInput';
import { BASIC_URL } from '../Signin/Signin';

const { height, width } = Dimensions.get('window');

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
      </View>
    );
  }

  if (modalVisible && paymentUrl) {
    return (
      <View style={styles.container}>
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
        <Button title="Cancel Payment" onPress={handleCloseModal} color={color.defalt} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CstmHeader
        title="Card Detail"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.inputContainer}>
          <C_TxtInput
            placeholder="Billing Name"
            placeholderTextColor={color.defalt}
            value={billingDetail.billingName}
            editable={false}
          />
          <C_TxtInput
            placeholder="Billing Email"
            placeholderTextColor={color.defalt}
            value={billingDetail.billingEmail}
            editable={false}
          />
          <C_TxtInput
            placeholder="Mobile Number"
            placeholderTextColor={color.defalt}
            value={billingDetail.billingMobile}
            editable={false}
          />
          <C_TxtInput
            placeholder="Amount"
            placeholderTextColor={color.defalt}
            value={safeToString(billingDetail.billingAmount)}
            editable={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CrdDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webView: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inputContainer: {
    width: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loaderMargin: {
    marginTop: 20,
  },
});