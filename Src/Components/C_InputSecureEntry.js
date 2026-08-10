import React, { useState, forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import color from '../Assets/colors/colors';
import { Icons } from './Icons';

const C_InputScurEntry = forwardRef(
  (
    {
      mode = 'outlined',
      styles: customInputStyle,
      containerStyle,
      placeholder,
      placeholderTextColor,
      textAlign,
      keyboardType,
      multiline,
      numberOfLines,
      secureTextEntry = true,
      isNumericOnly = false,
      maxLength,
      onChangeText,
      onFocus,
      onBlur,
      onPress,
      icon = 'eye-off',
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

    const handleInputChange = (text) => {
      let formattedText = text;

      if (isNumericOnly) {
        formattedText = formattedText.replace(/[^0-9]/g, '');
      }

      if (maxLength) {
        formattedText = formattedText.slice(0, maxLength);
      }

      if (onChangeText) {
        onChangeText(formattedText);
      }
    };

    return (
      <View style={[styles.inputView, containerStyle]}>
        <View style={styles.inputWrapper}>
          <TextInput
            {...rest}
            ref={ref}
            placeholder={placeholder}
            mode={mode}
            placeholderTextColor={placeholderTextColor}
            textAlign={textAlign}
            keyboardType={keyboardType}
            scrollEnabled={false}
            multiline={multiline}
            numberOfLines={numberOfLines}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            style={[
              styles.inputstyle,
              isFocused && styles.focusedBorder,
              customInputStyle,
            ]}
            onChangeText={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.iconStyle}
          onPress={onPress}>
          <Icons.Feather
            name={secureTextEntry ? icon : 'eye'}
            size={22}
            color={color.defalt}
          />
        </TouchableOpacity>
      </View>
    );
  }
);

C_InputScurEntry.displayName = 'C_InputScurEntry';

export default C_InputScurEntry;

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  inputWrapper: {
    width: '100%',
  },
  inputstyle: {
    width: '100%',
    paddingVertical: 10,
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 45,
    borderColor: color.defalt,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 6,
    color: color.defalt,
  },
  focusedBorder: {
    borderColor: color.defalt,
    borderWidth: 1.5,
  },
  iconStyle: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
});