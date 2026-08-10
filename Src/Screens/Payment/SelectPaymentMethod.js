import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';

import color from '../../Assets/colors/colors';
import CstmHeader from '../../Components/CustomHeader';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';

const SlctPaymentMethd = props => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    price,
    fullName,
    date,
    phoneNumber,
    address,
    provider_id,
    selectedfile,
  } = route.params || {};

  const [value, setValue] = useState('Pay Online');

  const handleNext = () => {
    if (value === 'Cash on Delivery') {
      navigation.navigate('PaymentCongratulations');
    } else {
      navigation.navigate('CardDetail', {
        price,
        fullName,
        date,
        phoneNumber,
        address,
        provider_id,
        selectedfile,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <CstmHeader
        title="Select Payment Method"
        onPressBack={() => props.navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.paymentTitle}>Choose Payment Option</Text>
          <Text style={styles.paymentSubtitle}>
            Select how you would like to complete your booking payment
          </Text>

          <RadioButton.Group
            onValueChange={newValue => setValue(newValue)}
            value={value}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.optionCard,
                value === 'Pay Online' && styles.optionCardSelected,
              ]}
              onPress={() => setValue('Pay Online')}>
              <RadioButton.Android
                value="Pay Online"
                color={color.defalt}
                uncheckedColor="#94A3B8"
              />
              <View style={styles.iconWrapper}>
                <Icons.FontAwesome5
                  name="credit-card"
                  color={color.defalt}
                  size={20}
                />
              </View>
              <View style={styles.optionTextCol}>
                <Text style={styles.methodName}>Pay Online</Text>
                <Text style={styles.methodSub}>Debit / Credit Card or Paystack</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.optionCard,
                value === 'Cash on Delivery' && styles.optionCardSelected,
              ]}
              onPress={() => setValue('Cash on Delivery')}>
              <RadioButton.Android
                value="Cash on Delivery"
                color={color.defalt}
                uncheckedColor="#94A3B8"
              />
              <View style={styles.iconWrapper}>
                <Icons.FontAwesome5
                  name="money-bill-alt"
                  color={color.defalt}
                  size={20}
                />
              </View>
              <View style={styles.optionTextCol}>
                <Text style={styles.methodName}>Pay Later / Cash</Text>
                <Text style={styles.methodSub}>Pay provider after service completion</Text>
              </View>
            </TouchableOpacity>
          </RadioButton.Group>

          <BotonComp
            onPressFunc={handleNext}
            BtnStyle={styles.submitBtn}
            btnText="Next"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SlctPaymentMethd;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  paymentTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  optionCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: color.defalt,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    marginRight: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  optionTextCol: {
    flex: 1,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  methodSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  submitBtn: {
    width: '100%',
    marginTop: 20,
    backgroundColor: color.defalt,
    borderRadius: 12,
    paddingVertical: 14,
  },
});