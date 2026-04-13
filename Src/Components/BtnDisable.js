import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import color from '../Assets/colors/colors';

const BtnDisable = props => {
  const backgroundColor = props.isDisabled ? 'gray' : color.defalt;

  return (
    <TouchableOpacity
      style={[styles.loginBtn, { backgroundColor }]}
      onPress={props.onPressFunc}
      disabled={props.isDisabled}
    >
      <Text style={[styles.btnText, props.btnTextStyle]}>
        {props.load ? (
          <ActivityIndicator size="small" color="#f8f8ff" />
        ) : (
          props.btnText
        )}
      </Text>
    </TouchableOpacity>
  );
};

export default BtnDisable;

const styles = StyleSheet.create({
  loginBtn: {
    borderRadius: 8,
    width: '46%',
    // marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 13,
    elevation: 1,
  },
  btnText: {
    color: color.wite,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
});