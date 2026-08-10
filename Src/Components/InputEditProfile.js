import React, {useState, forwardRef} from 'react';
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';
import Icon, {Icons} from './Icons';
import color from '../Assets/colors/colors';
const InputEdtProfil = forwardRef((props, ref) => {
  const {mode = 'outlined'} = props;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <View style={[
      TextInputStyle.inputView,
      isFocused && {borderColor: color.defalt, borderWidth: 1.5}
    ]}>
      <Icons.Feather name={props.icon} style={TextInputStyle.iconStyle} />
      <TextInput
        {...props}
        ref={ref}
        placeholder={props.placeholder}
        mode={mode}
        placeholderTextColor={props.placeholderTextColor}
        textAlign={props.textAlign}
        keyboardType={props.keyboardType}
        scrollEnabled={false}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        onChange={props.onChange}
        secureTextEntry={props.secureTextEntry}
        maxLength={props.maxLength}
        outlineColor={props.outlineColor}
        underlineColor={props.underlineColor}
        editable={props?.editable}
        style={[TextInputStyle.inputstyle, props.styles]}
        onChangeText={props.onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
});

const TextInputStyle = StyleSheet.create({
  inputstyle: {
    width: '100%',
    paddingVertical: 10,
    fontSize: 15,
    paddingHorizontal: 45,
    borderColor: color.defalt,
    backgroundColor: 'transparent',
    borderRadius: 6,
  },
  inputView: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderTopColor: color.defalt,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRightColor: color.defalt,
    borderLeftColor: color.defalt,
    borderBottomColor: color.defalt,
    paddingHorizontal: 10,
  },
  inputFocused: {
    borderBottomWidth: 1.7,
  },
  iconStyle: {
    fontSize: 25,
    color: color.defalt,
    marginRight: -35,
  },
});

export default InputEdtProfil;
