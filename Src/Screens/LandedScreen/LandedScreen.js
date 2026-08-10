import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';

const LndedScren = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
          <Text style={styles.title}>Skilledman</Text>
          <Text style={styles.subtitle}>Professional Services at Your Fingertips</Text>
        </Animatable.View>

        <Animatable.Image
          animation="zoomIn"
          duration={1200}
          source={require('../../Assets/Images/landed.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Animatable.View animation="fadeInUp" duration={1000} style={styles.footer}>
          <Text style={styles.description}>
            Connecting skilled professionals with service seekers through innovative technology.
          </Text>

          <View style={styles.btnGroup}>
            <BotonComp
              BtnStyle={styles.signUpBtn}
              btnText="Sign Up"
              btnTextStyle={{ color: color.defalt, fontSize: 16 }}
              onPressFunc={() => navigation.navigate('SignupScreen')}
            />
            <BotonComp
              BtnStyle={styles.signInBtn}
              btnText="Sign In"
              btnTextStyle={{ fontSize: 16 }}
              onPressFunc={() => navigation.navigate('Signin')}
            />
          </View>
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
};

export default LndedScren;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: color.defalt,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: '42%',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 10,
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
    borderColor: color.defalt,
    elevation: 0,
    shadowOpacity: 0,
    borderRadius: 12,
  },
  signInBtn: {
    width: '48%',
    backgroundColor: color.defalt,
    borderRadius: 12,
  },
});