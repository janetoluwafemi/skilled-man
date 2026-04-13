import React, {useRef} from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import {useNavigation} from '@react-navigation/native';
// import GetStartedBtn from '../../Components/GetStartedBtn';
const LndedScren = () => {
  const navigation = useNavigation();
  return (
    <>
      <ImageBackground
        source={require('../../Assets/Images/bg.png')}
        resizeMode="cover"
        style={{width: '100%', height: '100%'}}>
        <View style={styles.contentContainer}>
          <Text style={styles.titleStyle}>Skilledman</Text>
          <Image
            source={require('../../Assets/Images/landed.png')}
            style={styles.imgStyle}
          />
          <Text style={styles.contentStyle}>
            A product of Intelligence Technologies Ltd designed to provide a
            forum for the skilled men (service providers) to conveniently meet
            with service users using technologies.
          </Text>
          <View style={styles.btnContainer}>
            <BotonComp
              BtnStyle={styles.signUpStyle}
              btnText="Sign Up"
              btnTextStyle={styles.btnTextStyle}
              onPress={() => navigation.navigate('SignupScreen')}
            />
            <BotonComp
              BtnStyle={styles.signInStyle}
              btnText="Sign In"
              onPressFunc={() => navigation.navigate('Signin')}
            />
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default LndedScren;

const styles = StyleSheet.create({
  titleStyle: {
    textAlign: 'center',
    color: color.defalt,
    fontSize: 40,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingVertical: 30,
  },
  imgStyle: {
    width: '90%',
    height: '20%',
  },
  contentStyle: {
    fontSize: 23,
    fontWeight: '700',
    color: color.defalt,
    width: '70%',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 30,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 50,
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  btnTextStyle: {
    color: color.defalt,
  },
  signUpStyle: {
    backgroundColor: color.wite,
    borderWidth: 2,
    borderColor: color.defalt,
    color: color.defalt,
    elevation: 1,
    width: '48%',
  },
  signInStyle: {
    width: '48%',
  },
});
