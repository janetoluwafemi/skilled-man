import React, { useState, forwardRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import color from '../Assets/colors/colors';

const C_SkilInput = forwardRef(
  (
    {
      placeholder,
      placeholderTextColor = color.defalt,
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

C_SkilInput.displayName = 'C_SkilInput';

export default C_SkilInput;

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
    paddingHorizontal: 20,
    borderColor: color.defalt,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 6,
    fontWeight: 'bold',
    color: color.defalt,
  },
  focusedBorder: {
    borderColor: color.defalt,
    borderWidth: 1.5,
  },
});