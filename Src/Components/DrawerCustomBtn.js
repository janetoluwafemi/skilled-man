import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import color from '../Assets/colors/colors';
import { Icons } from './Icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_HEIGHT < 700;
const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;

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

const DrarCstmBtn = ({
                       title,
                       drawerIcon,
                       DrawerBtnPress,
                       IconComponent = Icons?.FontAwesome,
                       style,
                       textStyle,
                       iconStyle,
                       activeOpacity = 0.7,
                       ...rest
                     }) => {
  const iconSize = getResponsiveSize(24, 26, 27);
  const containerStyle = StyleSheet.flatten([styles.loginBtn, style]);
  const combinedIconStyle = StyleSheet.flatten([styles.iconStyle, iconStyle]);
  const combinedTextStyle = StyleSheet.flatten([
    styles.btnText,
    { fontSize: getResponsiveSize(16, 17, 18) },
    textStyle,
  ]);

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={DrawerBtnPress}
      activeOpacity={activeOpacity}
      {...rest}>
      {drawerIcon && IconComponent ? (
        <IconComponent
          name={drawerIcon}
          size={iconSize}
          color={color.wite}
          style={combinedIconStyle}
        />
      ) : null}
      <Text style={combinedTextStyle} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default DrarCstmBtn;

const styles = StyleSheet.create({
  loginBtn: {
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
    width: getResponsiveSpacing(30, 35, 40),
    textAlign: 'center',
  },
});