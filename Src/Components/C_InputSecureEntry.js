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

const C_InputScurEntry = props => {
  const {mode = 'outlined'} = props;
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleInputChange = (text) => {
    // Allow only digits
    const numericText = text.replace(/[^0-9]/g, '');

    // Limit to 10 digits
    const limitedText = numericText.slice(0, 10);

    setText(limitedText);

    if (props.onChangeText) {
      props.onChangeText(limitedText);
    }c
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
          textAlign={props.textAlign}
          keyboardType={props.keyboardType}
          scrollEnabled={false}
          multiline={props.multiline}
          numberOfLines={props.numberOfLines}
          onBlur={props.onBlur}
          secureTextEntry={props.secureTextEntry}
          
          maxLength={10} // Set the maximum length to 10 digits
          style={[TextInputStyle.inputstyle, {...props.styles}]}
          onChangeText={props.onChangeText}
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

export default C_InputScurEntry;

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


// import {
//   Dimensions,
//   StyleSheet,
//   TextInput,
//   View,
//   TouchableOpacity,
// } from 'react-native';
// import React, {useState} from 'react';
// import color from '../Assets/colors/colors';
// import Icon, {Icons} from './Icons';

// const C_InputSecureEntry = props => {
//   const {mode = 'outlined'} = props;
//   const [text, setText] = useState('');
//   const [isFocused, setIsFocused] = useState(false);

//   const handleFocus = () => {
//     setIsFocused(true);
//   };

//   const handleBlur = () => {
//     setIsFocused(false);
//   };

//   const lowercaseFirstLetter = (str) => {
//     return (str ?? "").charAt(0).toLowerCase() + (str ?? "").slice(1);
//   };
  

//   return (
//     <View style={TextInputStyle.inputView}>
//       <View style={{width: '100%'}}>
//         <TextInput
//           ref={props.ref}
//           placeholder={props.placeholder}
//           mode={mode}
//           color={color.default}
//           disabled={props.disabled}
//           value={props.value}
//          //value={lowercaseFirstLetter(props.value)}
//           placeholderTextColor={props.placeholderTextColor}
//           // editable={false}
//           textAlign={props.textAlign}
//           keyboardType={props.keyboardType}
//           scrollEnabled={false}
//           multiline={props.multiline}
//           numberOfLines={props.numberOfLines}
//           // onChangeText={props.onChangeText}
//           onChange={props.onChange}
//           secureTextEntry={props.secureTextEntry}
//           maxLength={props.maxLength}
//           // theme={{color: {primary: color.Green, underlineColor: color.red}}}
//           outlineColor={props.outlineColor}
//           underlineColor={props.underlineColor}
//           editable={props?.editable}
//           // onTouchMove
//           style={[TextInputStyle.inputstyle, {...props.styles}]}
//           onChangeText={props.onChangeText}
//           onBlur={props.onBlur}
//           //width='100%'
//         />
//       </View>
//       <View style={{backgroundColor: 'red'}}>
//         {props.secureTextEntry == true ? (
//           <TouchableOpacity
//             style={TextInputStyle.iconStyle}
//             onPress={props.onPress}>
//             <Icons.Feather
//               name={props.icon}
//               size={24}
//               style={{color: color.default}}
//             />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={TextInputStyle.iconStyle}
//             onPress={props.onPress}>
//             <Icons.Feather
//               name={'eye'}
//               size={24}
//               style={{color: color.default}}
//             />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// export default C_InputSecureEntry;

// const TextInputStyle = StyleSheet.create({
//   inputstyle: {
//     width: '100%',
//     paddingVertical: 10,
//     fontSize: 15,
//     paddingHorizontal: 20,
//     borderColor: color.default,
//     borderWidth: 1,
//     borderBottomColor: color.default,
//     backgroundColor: 'transparent',
//     borderRadius: 6,
//     //fontWeight: 'bold',
//   },
//   inputView: {
//     backgroundColor: 'transparent',
//     borderRadius: 6,
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginVertical: 5,
//     elevation: 0,
//   },
//   inputFocused: {
//     borderBottomWidth: 1.7,
//   },
//   iconStyle: {
//     fontSize: 25,
//     color: color.default,
//     marginLeft: -45,
//     marginRight: 6,
//     //backgroundColor: 'green'
//   },
// });
