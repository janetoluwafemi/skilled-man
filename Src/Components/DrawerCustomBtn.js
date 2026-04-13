import React from 'react';
import {StyleSheet, Image, TouchableOpacity, Text, Dimensions, Platform} from 'react-native';
import color from '../Assets/colors/colors';
import {useNavigation} from '@react-navigation/native';
import icon, {Icons} from '../Components/Icons';
import {Hidden} from 'native-base';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;
const isLargeDevice = SCREEN_HEIGHT >= 900;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const getResponsiveSpacing = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const DrarCstmBtn = props => {
  const navigation = useNavigation();

  return (
    <>
      <TouchableOpacity 
        style={styles.loginBtn} 
        onPress={props.DrawerBtnPress}
        activeOpacity={0.7}>
        <Icons.FontAwesome 
          name={props.drawerIcon} 
          style={[
            styles.iconStyle,
            {fontSize: getResponsiveSize(24, 26, 27)}
          ]} 
        />
        <Text style={[
          styles.btnText,
          {fontSize: getResponsiveSize(16, 17, 18)}
        ]}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  loginBtn: {
    textAlign: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: getResponsiveSpacing(12, 14, 15),
    borderBottomColor: color.wite,
    borderBottomWidth: 0,
    width: '100%',
    paddingHorizontal: getResponsiveSpacing(15, 18, 20),
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
    flex: 1,
    marginLeft: getResponsiveSpacing(10, 12, 15),
  },
  iconStyle: {
    color: color.wite,
    width: getResponsiveSpacing(30, 35, 40),
    textAlign: 'center',
  },
});

export default DrarCstmBtn;
