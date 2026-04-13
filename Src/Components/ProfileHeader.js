import {StyleSheet, TouchableOpacity, Text, View, Platform, StatusBar, Dimensions} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import color from '../Assets/colors/colors';
import {Image} from 'native-base';
import {Icons} from './Icons';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
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

const ProflHader = props => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.containerStyle,
      {paddingTop: Math.max(insets.top, Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0)}
    ]}>
      <StatusBar barStyle="light-content" backgroundColor={color.defalt} translucent={false} />
      <View style={styles.topCont}>
        <TouchableOpacity onPress={props.onPress} style={styles.menuStyle} activeOpacity={0.7}>
          <Icon 
            name="menu" 
            size={getResponsiveSize(30, 33, 35)} 
            color={color.wite} 
          />
        </TouchableOpacity>
        <Text style={[
          styles.userStyle,
          {fontSize: getResponsiveSize(14, 15, 16)}
        ]}>
          {props.screenTitle}
        </Text>
        <TouchableOpacity onPress={props.onPressnotification} activeOpacity={0.7}>
          <Icons.FontAwesome
            name={props.rightIcon}
            size={getResponsiveSize(18, 19, 20)}
            color={color.wite}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProflHader;

const styles = StyleSheet.create({
  topCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 8 : 4,
  },
  containerStyle: {
    backgroundColor: color.defalt,
    paddingHorizontal: getResponsiveSpacing(12, 15, 18),
    paddingVertical: getResponsiveSpacing(10, 12, 15),
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  userStyle: {
    fontWeight: '800',
    color: color.wite,
  },
  menuStyle: {
    padding: 4,
  },
});
