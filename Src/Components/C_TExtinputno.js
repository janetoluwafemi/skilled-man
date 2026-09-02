import React, { useState, forwardRef } from 'react';
import {StyleSheet, TextInput, View ,
  Platform} from 'react-native';
import color from '../Assets/colors/colors';
import { Icons } from './Icons';

const C_TxtInputNo = forwardRef(
  (
    {
      placeholder,
      placeholderTextColor = color.gry,
      value,
      onChangeText,
      onChange,
      editable = true,
      disabled = false,
      keyboardType,
      multiline,
      numberOfLines,
      secureTextEntry,
      maxLength,
      textAlign,
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
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          editable={!disabled && editable}
          textAlign={textAlign}
          keyboardType={keyboardType}
          scrollEnabled={false}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          onChangeText={onChangeText}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.inputstyle,
            icon && styles.inputWithIcon,
            isFocused && styles.focusedBorder,
            customStyle,
          ]}
        />
        {icon && (
          <Icons.Feather name={icon} style={styles.iconStyle} />
        )}
      </View>
    );
  }
);

C_TxtInputNo.displayName = 'C_TxtInputNo';

export default C_TxtInputNo;

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  inputstyle: {
    width: '100%',
    paddingVertical: 10,
    fontSize: 17,
    paddingLeft: 20,
    paddingRight: 20,
    color: color.defalt,
  },
  inputWithIcon: {
    paddingRight: 45,
  },
  focusedBorder: {
    borderColor: color.defalt,
    borderBottomWidth: 2,
  },
  iconStyle: {
    fontSize: 22,
    color: color.defalt,
    position: 'absolute',
    right: 15,
  },
});