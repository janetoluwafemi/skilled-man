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
      styles: customInputStyle,
      containerStyle,
      placeholder,
      placeholderTextColor = '#94A3B8',
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
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          containerStyle,
        ]}>
        <TextInput
          {...rest}
          ref={ref}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          textAlign={textAlign}
          keyboardType={keyboardType}
          scrollEnabled={false}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          style={[styles.textInputField, customInputStyle]}
          onChangeText={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.iconButton}
          onPress={onPress}>
          <Icons.Feather
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={18}
            color="#64748B"
          />
        </TouchableOpacity>
      </View>
    );
  }
);

C_InputScurEntry.displayName = 'C_InputScurEntry';

export default C_InputScurEntry;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginVertical: 4,
  },
  inputContainerFocused: {
    borderColor: color.defalt,
    backgroundColor: '#FFFFFF',
  },
  textInputField: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 0,
    height: '100%',
    outlineStyle: 'none',
  },
  iconButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});