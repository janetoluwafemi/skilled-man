import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';

const SelectPaymentMethod = props => {
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
          style={styles.container}>

          <View style={styles.badgeRow}>
            <View style={styles.badgeCircle}>
              <Icons.Ionicons
                name="wallet-outline"
                size={34}
                color={color.defalt}
              />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Choose Payment Option</Text>
          <Text style={styles.welcomeSubtitle}>
            Select how you would like to complete your booking payment
          </Text>

          <View style={styles.cardWrapper}>
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
                    size={18}
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
                    size={18}
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
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectPaymentMethod;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 12,
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
  container: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  badgeRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
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
    paddingHorizontal: 12,
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
    backgroundColor: '#EFF6FF',
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
    shadowColor: '#0F172A',
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
    marginTop: 10,
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});