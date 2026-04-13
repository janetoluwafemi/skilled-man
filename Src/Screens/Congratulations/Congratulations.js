import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import color from '../../Assets/colors/colors';
import BotonComp from '../../Components/BtnComp';
import CstmHeaderIcon from '../../Components/CustomHeaderIcon';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const Congratulation = props => {
  const navigation = useNavigation();
  // console.log(props.route.params);
  // const selectedRole = props.route.params ?? 'user';
  // console.log(selectedRole, 'congral');
  return (
    <>
      <ImageBackground
        source={require('../../Assets/Images/cong.png')}
        resizeMode="cover"
        style={styles.backgroundImg}>
        <CstmHeaderIcon
          onPress={() => {
            props.navigation.goBack();
          }}
          headerIcon={styles.headerIcon}
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
            onPressFunc={() => {
              // props.navigation.navigate('Main', selectedRole);
              props.navigation.navigate('Signin');
            }}
          />
        </View>
      </ImageBackground>
    </>
  );
};

export default Congratulation;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '80%',
    flex: 0.8,
  },

  backgroundImg: {
    width: '100%',
    height: '100%',
  },
  logoStyle: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImg: {
    width: width / 2,
    height: height / 4.6,
  },
  dropdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },

  BtnStyle: {
    marginTop: 55,
    width: '100%',
  },
  headerIcon: {
    paddingLeft: 20,
  },
  CongText: {
    color: color.defalt,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  successText: {
    fontSize: 17,
    textAlign: 'center',
    color: color.defalt,
  },
});
