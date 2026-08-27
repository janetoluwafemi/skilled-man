import React, { useState, forwardRef } from 'react';
import { StyleSheet, TextInput, View, Platform } from 'react-native';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';

const InputEditProfile = forwardRef((props, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = e => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = e => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <View
      style={[
        styles.inputWrapper,
        props.editable === false && styles.disabledWrapper,
        isFocused && styles.inputWrapperFocused,
      ]}>
      {props.icon && (
        <View style={styles.iconBox}>
          <Icons.Feather
            name={props.icon}
            size={18}
            color={isFocused ? color.defalt : '#94A3B8'}
          />
        </View>
      )}
      <TextInput
        {...props}
        ref={ref}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor || '#94A3B8'}
        textAlign={props.textAlign}
        keyboardType={props.keyboardType}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        secureTextEntry={props.secureTextEntry}
        maxLength={props.maxLength}
        editable={props.editable}
        style={[styles.inputField, props.style]}
        onChangeText={props.onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
});

export default InputEditProfile;

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    minHeight: 52,
    transition: 'all 0.2s ease-in-out',
  },
  inputWrapperFocused: {
    borderColor: color.defalt,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: color.defalt,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 0 0 3px rgba(186, 104, 56, 0.15)',
      },
    }),
  },
  disabledWrapper: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.8,
  },
  iconBox: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 12,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
        outlineColor: 'transparent',
        boxShadow: 'none',
      },
    }),
  },
});