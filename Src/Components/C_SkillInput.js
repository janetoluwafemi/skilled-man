import React, {useState} from 'react';
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';

import color from '../Assets/colors/colors';
const C_SkilInput = props => {
  const {mode = 'outlined'} = props;
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <View style={TextInputStyle.inputView}>
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
        style={[TextInputStyle.inputstyle, {...props.styles}]}
        onChangeText={props.onChangeText}
        onBlur={props.onBlur}
      />
    </View>
  );
};

const TextInputStyle = StyleSheet.create({
  inputstyle: {
    width: '100%',
    paddingVertical: 10,
    fontSize: 15,
    paddingHorizontal: 20,
    borderColor: color.defalt,
    borderWidth: 1,
    borderBottomColor: color.defalt,
    backgroundColor: 'transparent',
    borderRadius: 6,
    fontWeight: 'bold',
  },
  inputView: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
    elevation: 0,
  },
  inputFocused: {
    borderBottomWidth: 1.7,
  },
});

export default C_SkilInput;
