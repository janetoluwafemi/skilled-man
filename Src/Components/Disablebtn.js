import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import color from '../Assets/colors/colors';

const Dsablbtn = ({
                    isValid = true,
                    onPress,
                    btnText = 'Disable',
                    BtnStyle,
                    btnTextStyle,
                    activeOpacity = 0.7,
                    ...rest
                  }) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={!isValid}
      onPress={onPress}
      style={[
        styles.loginBtn,
        isValid ? styles.activeBg : styles.disabledBg,
        BtnStyle,
      ]}
      {...rest}>
      <Text style={[styles.btnText, btnTextStyle]}>{btnText}</Text>
    </TouchableOpacity>
  );
};

export default Dsablbtn;

const styles = StyleSheet.create({
  loginBtn: {
    borderRadius: 8,
    width: '80%',
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 13,
    elevation: 1,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBg: {
    backgroundColor: color.defalt,
  },
  disabledBg: {
    backgroundColor: 'gray',
  },
  btnText: {
    color: color.wite,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
});