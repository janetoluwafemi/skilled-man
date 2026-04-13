import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Button,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import color from '../../Assets/colors/colors';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';
import CstmHeader from '../../Components/CustomHeader';
import {WebView} from 'react-native-webview';
import C_TxtInput from '../../Components/C_TextInput';
import Toast from 'react-native-simple-toast';
import {BASIC_URL} from '../Signin/Signin';

const {height, width} = Dimensions.get('window');

const CrdDetails = props => {
  const navigation = useNavigation();
  const route = useRoute();

  // Add safe parameter extraction with defaults
  const {
    price = 1, // Default to 0 if undefined
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

  // Initialize with safe values
  const [billingDetail, setBillingDetail] = useState({
    billingName: global.name || '',
    billingEmail: global.email || '',
    billingMobile: global.phone_number || '',
    billingAmount: price || 0,
  });

  useEffect(() => {
    createBooking();
  }, []);

  // Safe toString function
  const safeToString = value => {
    if (value === null || value === undefined) {
      return '';
    }
    return value.toString();
  };

  const createBooking = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!price || price <= 0) {
        Alert.alert('Error', 'Invalid price amount');
        return;
      }

      if (!global.id) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const bookingdate = date.toISOString().split('T')[0];
      const bookingtime = formatTime(date);

      const formdata = new FormData();
      formdata.append('user_id', global.id);
      formdata.append('servic_phone_no', phoneNumber);
      formdata.append('service_date', bookingdate);
      formdata.append('address', address);
      formdata.append('service_time', bookingtime);
      formdata.append('price', price.toString());
      formdata.append('provider_id', provider_id);
      formdata.append('Full_name', fullName);

      formdata.append('file', {
        uri: selectedfile.uri,
        name: selectedfile.name,
        type: selectedfile.type,
      });

      const requestOptions = {
        method: 'POST',
        body: formdata,
      };

      const response = await fetch(
        `${BASIC_URL}user/book_service.php`,
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result?.status) {
        global.bookid = result.booking_id;
        initiatePaystack();
      }
      else if (
        result?.error ===
        'Your Request is in Progress. So, Before Completing Previous you can Not Send Again'
      ) {
        Alert.alert(
          'Booking Failed',
          'Transaction incomplete. Kindly message the booked provider to reject your booking, then initiate a new transaction',
        );
      } else {
        Alert.alert('Booking Failed', result?.error || 'Unknown error');
        console.log('Booking Error', result);
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const initiatePaystack = async () => {
    try {
      const formdata = new FormData();
      // formdata.append('amount', billingDetail.billingAmount.toString());
      // Using This line because paystack use mini value in this case kodo
      formdata.append('amount', (billingDetail.billingAmount * 100).toString());
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
        console.error('Payment initialization failed:', result);
        Alert.alert('Payment Error', 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Error', 'Failed to process payment');
    }
  };

  const handlePaymentNavigationChange = navState => {
    const {url} = navState;

    if (url.includes('payment-success')) {
      handlePaymentSuccess();
    }
  };

  const handlePaymentSuccess = () => {
    setModalVisible(false);
    Toast.show('Payment Successful!');
    navigation.navigate('PaymentCongratulations');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const formatTime = date => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  if (modalVisible && paymentUrl) {
    return (
      <View style={styles.container}>
        <WebView
          source={{uri: paymentUrl}}
          style={styles.webView}
          onNavigationStateChange={handlePaymentNavigationChange}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color={color.primary}
              style={{marginTop: 20}}
            />
          )}
        />
        <Button title="Cancel Payment" onPress={handleCloseModal} />
      </View>
    );
  }

  return (
    <>
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
    </>
  );
};

export default CrdDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  radioStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 3,
  },
  methodName: {
    fontSize: 17,
    fontWeight: '500',
    color: color.defalt,
  },
  paymentTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: color.defalt,
    marginBottom: 15,
  },
  BtnStyle: {
    marginTop: 35,
  },
  closeStyle: {
    marginHorizontal: 8,
  },
  lockCont: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
