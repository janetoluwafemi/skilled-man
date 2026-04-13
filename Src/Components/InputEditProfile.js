import React, {useState} from 'react';
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';
import Icon, {Icons} from './Icons';
import color from '../Assets/colors/colors';
const InputEdtProfil = props => {
  const {mode = 'outlined'} = props;
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={TextInputStyle.inputView}>
      <Icons.Feather name={props.icon} style={TextInputStyle.iconStyle} />
      <TextInput
        ref={props.ref}
        placeholder={props.placeholder}
        mode={mode}
        color={color.defalt}
        disabled={props.disabled}
        value={props.value}
        placeholderTextColor={props.placeholderTextColor}
        // editable={false}
        textAlign={props.textAlign}
        keyboardType={props.keyboardType}
        scrollEnabled={false}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        // onChangeText={props.onChangeText}
        onChange={props.onChange}
        secureTextEntry={props.secureTextEntry}
        maxLength={props.maxLength}
        // theme={{color: {primary: color.Green, underlineColor: color.red}}}
        outlineColor={props.outlineColor}
        underlineColor={props.underlineColor}
        editable={props?.editable}
        // onTouchMove
        style={[TextInputStyle.inputstyle]}
        onChangeText={props.onChangeText}
      />
    </View>
  );
};

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
