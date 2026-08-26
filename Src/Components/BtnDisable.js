import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import color from '../Assets/colors/colors';

const BtnDisable = ({
                      isDisabled = false,
                      onPressFunc,
                      btnTextStyle,
                      load = false,
                      btnText,
                      BtnStyle,
                      activeOpacity = 0.85,
                      ...rest
                    }) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[
        styles.loginBtn,
        isDisabled && styles.disabledBtn,
        BtnStyle,
      ]}
      onPress={onPressFunc}
      disabled={isDisabled || load}
      {...rest}>
      {load ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={[styles.btnText, btnTextStyle]}>{btnText}</Text>
      )}
    </TouchableOpacity>
  );
};

export default BtnDisable;

const styles = StyleSheet.create({
  loginBtn: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: color.defalt,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    ...Platform.select({
      ios: {
        shadowColor: color.defalt,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 12px rgba(186, 104, 56, 0.25)',
      },
    }),
  },
  disabledBtn: {
    opacity: 0.5,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
      web: {
        boxShadow: 'none',
      },
    }),
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});