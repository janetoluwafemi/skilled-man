import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import color from '../Assets/colors/colors';
import {Icons} from './Icons';
const GooglButon = props => {
  return (
    <TouchableOpacity
      style={[styles.loginBtn, {...props.BtnStyle}]}
      onPress={props.onPressFunc}>
      <Text style={[styles.btnText, {...props.btnTextStyle}]}>
        {props.btnText}{' '}
      </Text>
      <Icons.FontAwesome
        name={props.iconName}
        size={22}
        color={color.defalt}
      />
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
    elevation: 1,
    borderWidth: 2,
    borderColor: color.defalt,
  },
  btnText: {
    color: color.wite,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
});
