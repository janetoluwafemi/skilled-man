import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet ,
  Platform} from 'react-native';
import color from '../Assets/colors/colors';
import { Icons } from './Icons';

const GooglButon = ({
                      btnText = 'Sign in with Google',
                      iconName = 'google',
                      onPressFunc,
                      BtnStyle,
                      btnTextStyle,
                      iconSize = 22,
                      iconColor = color.defalt,
                      activeOpacity = 0.7,
                      ...rest
                    }) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[styles.loginBtn, BtnStyle]}
      onPress={onPressFunc}
      {...rest}>
      <Text style={[styles.btnText, btnTextStyle]}>{btnText}</Text>
      {iconName ? (
        <Icons.FontAwesome
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={styles.iconStyle}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export default GooglButon;

const styles = StyleSheet.create({
  loginBtn: {
    borderRadius: 8,
    backgroundColor: color.defalt,
    width: '80%',
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 13,
    paddingHorizontal: 15,
    elevation: 1,
    borderWidth: 2,
    borderColor: color.defalt,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: color.wite,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  iconStyle: {
    marginLeft: 10,
  },
});