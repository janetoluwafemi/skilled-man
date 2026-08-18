import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import C_TaxInput from '../../Components/C_Taxinput';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const AddTax = props => {
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [taxId, setTaxId] = useState('');
  const [load, setLoad] = useState(false);

  const adTxFun = async () => {
    if (!taxId.trim() || !description.trim()) {
      showToast('Please fill the required fields.');
      return;
    }
    try {
      setLoad(true);
      const formdata = new FormData();
      formdata.append('tax', taxId);
      formdata.append('user_id', global.id);
      formdata.append('description', description);

      const response = await fetch(`${BASIC_URL}add_tax.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      setLoad(false);

      if (result) {
        showToast('Tax details added successfully');
        navigation.navigate('Congratulations');
      }
    } catch (error) {
      setLoad(false);
      showToast('Failed to add tax details.');
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
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={styles.formContainer}>

          <View style={styles.badgeRow}>
            <View style={styles.badgeCircle}>
              <Icons.Ionicons
                name="receipt-outline"
                size={34}
                color={color.defalt}
              />
            </View>
          </View>

          <Text style={styles.welcomeTitle}>Add Tax Detail</Text>
          <Text style={styles.welcomeSubtitle}>
            Provide your tax identification number and registration details
          </Text>

          <View style={styles.cardWrapper}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Tax ID / Identification Number</Text>
              <C_TaxInput
                placeholder="e.g. TIN-12345678"
                placeholderTextColor={color.litGry}
                value={taxId}
                onChangeText={setTaxId}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Description</Text>
              <C_TaxInput
                placeholder="e.g. Registered Business Tax Information"
                placeholderTextColor={color.litGry}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <BotonComp
              BtnStyle={styles.submitBtn}
              btnText={
                load ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  'Register'
                )
              }
              onPressFunc={adTxFun}
            />
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTax;

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
});