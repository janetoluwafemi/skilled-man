import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import color from '../Assets/colors/colors';

const BtnDisable = ({
                      isDisabled = false,
                      onPressFunc,
                      btnTextStyle,
                      load = false,
                      btnText,
                      BtnStyle,
                      activeOpacity = 0.7,
                      ...rest
                    }) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[
        styles.loginBtn,
        isDisabled && styles.disabledBg,
        BtnStyle,
      ]}
      onPress={onPressFunc}
      disabled={isDisabled || load}
      {...rest}>
      {load ? (
        <ActivityIndicator size="small" color="#f8f8ff" />
      ) : (
        <Text style={[styles.btnText, btnTextStyle]}>{btnText}</Text>
      )}
    </TouchableOpacity>
  );
};

export default BtnDisable;

const styles = StyleSheet.create({
  loginBtn: {
    borderRadius: 8,
    backgroundColor: color.defalt,
    width: '46%',
    alignSelf: 'center',
    paddingVertical: 13,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
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