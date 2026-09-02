import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import { Icons } from '../../Components/Icons';

const { width, height } = Dimensions.get('window');

const Congratulations = props => {
  const navigation = useNavigation();

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

      <View style={styles.content}>
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={styles.cardWrapper}>

          <View style={styles.logoStyle}>
            <Image
              style={styles.logoImg}
              resizeMode="contain"
              source={require('../../Assets/icons/badge.png')}
            />
          </View>

          <Text style={styles.CongText}>Congratulations</Text>
          <Text style={styles.successText}>
            Your Account is successfully Created!
          </Text>

          <BotonComp
            BtnStyle={styles.BtnStyle}
            btnText="Get Started"
            onPressFunc={() => navigation.navigate('Signin')}
          />
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
};

export default Congratulations;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    alignItems: 'center',
  },
  logoStyle: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImg: {
    width: width / 2.5,
    height: height / 5,
  },
  CongText: {
    color: '#0F172A',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  BtnStyle: {
    marginTop: 30,
    width: '100%',
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
