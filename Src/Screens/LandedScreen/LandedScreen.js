import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';

const LndedScren = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Skilledman</Text>
          <Text style={styles.subtitle}>Professional Services at Your Fingertips</Text>
        </View>

        <Image
          source={require('../../Assets/Images/landed.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.cardWrapper}>
          <Text style={styles.description}>
            Connecting skilled professionals with service seekers through innovative technology.
          </Text>

          <View style={styles.btnGroup}>
            <BotonComp
              BtnStyle={styles.signUpBtn}
              btnText="Sign Up"
              btnTextStyle={styles.signUpBtnText}
              onPressFunc={() => navigation.navigate('SignupScreen')}
            />
            <BotonComp
              BtnStyle={styles.signInBtn}
              btnText="Sign In"
              btnTextStyle={styles.signInBtnText}
              onPressFunc={() => navigation.navigate('Signin')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LndedScren;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '44%',
    alignSelf: 'center',
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  signUpBtn: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 14,
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  signUpBtnText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  signInBtn: {
    width: '48%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});