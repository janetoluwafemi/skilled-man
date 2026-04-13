import React, {useState} from 'react';
import {Dimensions, StyleSheet, TextInput, View,TouchableOpacity} from 'react-native';
import color from '../Assets/colors/colors';
import Icon,{ Icons }  from './Icons';
const C_TxtInputNo = props => {
  const {mode = 'outlined'} = props;
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const lowercaseFirstLetter = (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
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
       // value={lowercaseFirstLetter(props.value)}
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
       <Icons.Feather name={props.icon} style={TextInputStyle.iconStyle} />
      {/* {props.secureTextEntry==true?(  <TouchableOpacity><Icons.Feather name={props.icon} style={TextInputStyle.iconStyle} /></TouchableOpacity>):(<TouchableOpacity><Icons.Feather name={"eye"} style={TextInputStyle.iconStyle} /></TouchableOpacity>)} */}
    </View>
  );
};

const TextInputStyle = StyleSheet.create({
  inputstyle: {
    width: '100%',
    paddingVertical: 0,
    fontSize: 17,
    paddingHorizontal:20,
  
    // fontWeight: 'bold',
  },
  inputView: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    width: '100%',
    
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 1,
    elevation: 0,
  },
  inputFocused: {
    borderBottomWidth: 1.7,
  },
  iconStyle: {
    fontSize: 25,
    color: color.defalt,
    marginLeft: -45,
    marginRight: 6,
  },
});

export default C_TxtInputNo;
