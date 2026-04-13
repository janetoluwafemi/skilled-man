import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import color from '../../Assets/colors/colors';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';
import CstmHeader from '../../Components/CustomHeader';
import {RadioButton} from 'react-native-paper';
import BotonComp from '../../Components/BtnComp';
import {Icons} from '../../Components/Icons';
const {height} = Dimensions.get('window');
const {width} = Dimensions.get('window');

const SlctPaymentMethd = props => {
  const navigation = useNavigation();
  const [value, setValue] = React.useState('Cash on Delivery');
  // const handleNavigate = () => {
  //   // Navigate to the OtherScreen and pass the map input value as a parameter
  //  // navigation.navigate('SelectPaymentMethod',{price});
  //  navigation.navigate('CardDetail', {price});
  // };
  const route = useRoute();
  const price = route.params?.price;
  const fullName = route.params?.fullName;
  const date = route.params?.date;
  const phoneNumber = route.params?.phoneNumber;
  const address = route.params?.address;
  const provider_id = route.params?.provider_id;
  const selectedfile = route.params?.selectedfile;
  console.log('value u selected', value);
  useEffect(() => {
    console.log('price changed:', price);
    console.log('full name changed:', fullName);
    console.log('phone changed:', phoneNumber);
    console.log('address changed:', address);
    console.log('date changed:', date);
    console.log('provider_id changed:', provider_id);
    console.log('selectedfile', selectedfile);
  }, [price, fullName, phoneNumber, address, date, provider_id, selectedfile]);
  return (
    <>
      <CstmHeader
        title="Select Payment Method"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView style={styles.scrollView}>
        <View>
          <Text style={styles.paymentTitle}>Select Payment Method </Text>
          <RadioButton.Group
            onValueChange={value => setValue(value)}
            value={value}>
            <View style={styles.radioStyle}>
              <RadioButton value="Pay Online" />
              <Icons.FontAwesome5
                name="credit-card"
                color={color.gry}
                size={28}
                style={styles.closeStyle}
              />
              <Text style={styles.methodName}>Pay Online</Text>
            </View>
            {/* <View style={styles.radioStyle}>
              <RadioButton value="Cash on Delivery" />
              <Icons.FontAwesome5
                name="money-bill-alt"
                color={color.drkGry}
                size={28}
                style={styles.closeStyle}
              />
              <Text style={styles.methodName}>Cash on Delivery</Text>
            </View> */}
          </RadioButton.Group>

          {value == 'Cash on Delivery' ? (
            <BotonComp
              onPressFunc={() => navigation.navigate('PaymentCongratulations')}
              BtnStyle={styles.BtnStyle}
              btnText="Next"
            />
          ) : (
            <BotonComp
              onPressFunc={() =>
                // handleNavigate();
                navigation.navigate('CardDetail', {
                  price,
                  fullName,
                  date,
                  phoneNumber,
                  address,
                  provider_id,
                  selectedfile,
                })
              }
              BtnStyle={styles.BtnStyle}
              btnText="Next"
            />
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default SlctPaymentMethd;

const styles = StyleSheet.create({
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
});
