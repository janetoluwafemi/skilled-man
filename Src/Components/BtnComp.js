import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import color from '../Assets/colors/colors';

const BotonComp = props => {
  const {
    BtnStyle,
    btnTextStyle,
    btnText,
    onPressFunc,
    icon,
    iconPosition = 'left',
  } = props;

  return (
    <TouchableOpacity
      style={[
        styles.loginBtn,
        BtnStyle,
        icon && styles.rowCenter, // only apply row if icon exists
      ]}
      onPress={onPressFunc}>
      {icon && iconPosition === 'left' && (
        <View style={styles.iconWrapper}>{icon}</View>
      )}

      <Text style={[styles.btnText, btnTextStyle]}>{btnText}</Text>

      {icon && iconPosition === 'right' && (
        <View style={styles.iconWrapper}>{icon}</View>
      )}
    </TouchableOpacity>
  );
};

export default BotonComp;
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
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginHorizontal: 8,
  },
  btnText: {
    color: color.wite,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
});
