import React, {useState, useRef} from 'react';
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';

import color from '../Assets/colors/colors';
const OtpInpt = props => {
  const [otp, setOTP] = useState('');
  const firstInput = useRef();
  const secondInput = useRef();
  const thirdInput = useRef();
  const fourthInput = useRef();

  const [firstDigit, setFirstDigit] = useState('');
  const [secondDigit, setSecondDigit] = useState('');
  const [thirdDigit, setThirdDigit] = useState('');
  const [fourthDigit, setFourthDigit] = useState('');

  const [visible, setVisible] = React.useState(false);
  const [textfield, setTextFieldCode] = React.useState([]);


  const FinalOtp = firstDigit + secondDigit + thirdDigit + fourthDigit;
  console.log(FinalOtp,'final')


  const handleKeyPress = (text, nextRef) => {
    if (text.length === 1) {
      nextRef.current.focus();
    }
  };
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
        ref={firstInput}
        placeholder={props.placeholder}
        mode={mode}
        color={color.defalt}
        disabled={props.disabled}
        value={firstDigit}
        placeholderTextColor={props.placeholderTextColor}
        // editable={false}
        textAlign={props.textAlign}
        keyboardType="numeric"
        scrollEnabled={false}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        // onChangeText={props.onChangeText}
        onChange={props.onChange}
        secureTextEntry={props.secureTextEntry}
        // theme={{color: {primary: color.Green, underlineColor: color.red}}}
        outlineColor={props.outlineColor}
        underlineColor={props.underlineColor}
        editable={props?.editable}
        // onTouchMove
        style={[TextInputStyle.inputstyle]}
        onChangeText={text => {
          setFirstDigit(text), text && secondInput.current.focus();
        }}
        maxLength={1}
      />
      <TextInput
        ref={secondInput}
        placeholder={props.placeholder}
        mode={mode}
        color={color.defalt}
        disabled={props.disabled}
        placeholderTextColor={props.placeholderTextColor}
        // editable={false}
        textAlign={props.textAlign}
        keyboardType="numeric"
        scrollEnabled={false}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        // onChangeText={props.onChangeText}
        onChange={props.onChange}
        secureTextEntry={props.secureTextEntry}
        // theme={{color: {primary: color.Green, underlineColor: color.red}}}
        outlineColor={props.outlineColor}
        underlineColor={props.underlineColor}
        editable={props?.editable}
        // onTouchMove
        style={[TextInputStyle.inputstyle]}
        maxLength={1}
        value={secondDigit}
        onChangeText={text => {
          setSecondDigit(text),
            text ? thirdInput.current.focus() : firstInput.current.focus();
        }}
      />

      <TextInput
        ref={thirdInput}
        placeholder={props.placeholder}
        mode={mode}
        color={color.defalt}
        disabled={props.disabled}
        value={thirdDigit}
        placeholderTextColor={props.placeholderTextColor}
        // editable={false}
        textAlign={props.textAlign}
        keyboardType="numeric"
        scrollEnabled={false}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        // onChangeText={props.onChangeText}
        onChange={props.onChange}
        secureTextEntry={props.secureTextEntry}
        maxLength={1}
        // theme={{color: {primary: color.Green, underlineColor: color.red}}}
        outlineColor={props.outlineColor}
        underlineColor={props.underlineColor}
        editable={props?.editable}
        // onTouchMove
        style={[TextInputStyle.inputstyle]}
        onChangeText={text => {
          setThirdDigit(text),
            text ? fourthInput.current.focus() : secondInput.current.focus();
        }}
      />
      <TextInput
        ref={fourthInput}
        placeholder={props.placeholder}
        mode={mode}
        color={color.defalt}
        disabled={props.disabled}
        placeholderTextColor={props.placeholderTextColor}
        // editable={false}
        textAlign={props.textAlign}
        keyboardType="numeric"
        scrollEnabled={false}
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        // onChangeText={props.onChangeText}
        onChange={props.onChange}
        secureTextEntry={props.secureTextEntry}
        maxLength={1}
        // theme={{color: {primary: color.Green, underlineColor: color.red}}}
        outlineColor={props.outlineColor}
        underlineColor={props.underlineColor}
        editable={props?.editable}
        // onTouchMove
        style={[TextInputStyle.inputstyle]}
        value={fourthDigit}
        onChangeText={text => {
          setFourthDigit(text);
        }}
      />
    </View>
  );
};

const TextInputStyle = StyleSheet.create({
  inputstyle: {
    width: '14%',
    paddingVertical: 15,
    fontSize: 25,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    borderColor: color.defalt,
    borderWidth: 1,
    borderBottomColor: color.defalt,
    backgroundColor: 'transparent',
    borderRadius: 1,
    textAlign: 'center',
  },
  inputView: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
    elevation: 0,
  },
  inputFocused: {
    borderBottomWidth: 1.7,
  },
});

export default OtpInpt;
