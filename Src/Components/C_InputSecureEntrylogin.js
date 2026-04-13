import {
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import color from '../Assets/colors/colors';
import Icon, {Icons} from './Icons';

const C_InputScurEntrylogin = props => {
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
      <View style={{width: '100%'}}>
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
          //width='100%'
        />
      </View>
      <View style={{backgroundColor: 'red'}}>
        {props.secureTextEntry == true ? (
          <TouchableOpacity
            style={TextInputStyle.iconStyle}
            onPress={props.onPress}>
            <Icons.Feather
              name={props.icon}
              size={24}
              style={{color: color.defalt}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={TextInputStyle.iconStyle}
            onPress={props.onPress}>
            <Icons.Feather
              name={'eye'}
              size={24}
              style={{color: color.defalt}}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default C_InputScurEntrylogin;

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
    //fontWeight: 'bold',
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
  iconStyle: {
    fontSize: 25,
    color: color.defalt,
    marginLeft: -45,
    marginRight: 6,
    //backgroundColor: 'green'
  },
});
