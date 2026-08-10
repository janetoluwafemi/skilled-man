import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';

const { width, height } = Dimensions.get('window');

const Congratulation = props => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ImageBackground
        source={require('../../Assets/Images/cong.png')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <CstmHeaderIcon
          onPress={() => props.navigation.goBack()}
          headerIconStyle={styles.headerBackIcon}
        />
        <View style={styles.container}>
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
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Congratulation;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  headerBackIcon: {
    color: '#0F172A',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '85%',
    flex: 0.85,
  },
  logoStyle: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoImg: {
    width: width / 2.2,
    height: height / 4.5,
  },
  BtnStyle: {
    marginTop: 45,
    width: '100%',
  },
  CongText: {
    color: color.defalt,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#475569',
    fontWeight: '500',
    lineHeight: 22,
  },
});