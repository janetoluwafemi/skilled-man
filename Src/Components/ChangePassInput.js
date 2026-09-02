import React, { useState, forwardRef } from 'react';
import {StyleSheet, TextInput, View ,
  Platform} from 'react-native';
import color from '../Assets/colors/colors';

const ChangPasInput = forwardRef(
  (
    {
      placeholder,
      placeholderTextColor = color.litGry,
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
            isFocused && styles.focusedBorder,
            customStyle,
          ]}
        />
      </View>
    );
  }
);

ChangPasInput.displayName = 'ChangPasInput';

export default ChangPasInput;

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  inputstyle: {
    width: '100%',
    paddingVertical: 10,
    fontSize: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: color.defalt,
    backgroundColor: 'transparent',
    borderRadius: 6,
    color: color.defalt,
  },
  focusedBorder: {
    borderWidth: 1.5,
    borderColor: color.defalt,
  },
});