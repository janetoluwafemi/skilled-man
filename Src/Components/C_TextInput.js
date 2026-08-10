import React, { useState, forwardRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import color from '../Assets/colors/colors';
import { Icons } from './Icons';

const C_TxtInput = forwardRef(
  (
    {
      placeholder,
      placeholderTextColor = color.gry,
      icon,
      styles: customStyle,
      containerStyle,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <View style={[styles.inputView, containerStyle]}>
        <TextInput
          {...rest}
          ref={ref}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          style={[
            styles.inputstyle,
            icon && styles.inputWithIcon,
            isFocused && styles.focusedBorder,
            customStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {icon && (
          <Icons.FontAwesome6 name={icon} style={styles.iconStyle} />
        )}
      </View>
    );
  }
);

C_TxtInput.displayName = 'C_TxtInput';

export default C_TxtInput;

const styles = StyleSheet.create({
  inputView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  inputstyle: {
    width: '100%',
    paddingVertical: 12,
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    color: '#333',
  },
  inputWithIcon: {
    paddingRight: 45,
  },
  focusedBorder: {
    borderColor: color.defalt,
    borderWidth: 1.5,
  },
  iconStyle: {
    fontSize: 20,
    color: color.defalt,
    position: 'absolute',
    right: 15,
  },
});