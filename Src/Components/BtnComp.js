// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import color from '../Assets/colors/colors';
//
// const BotonComp = ({
//                      BtnStyle,
//                      btnTextStyle,
//                      btnText,
//                      onPressFunc,
//                      icon,
//                      iconPosition = 'left',
//                      disabled = false,
//                      activeOpacity = 0.7,
//                      ...rest
//                    }) => {
//
//   const combinedButtonStyle = StyleSheet.flatten([
//     styles.loginBtn,
//     disabled && styles.disabledBtn,
//     BtnStyle,
//     icon && styles.rowCenter,
//   ]);
//   const combinedTextStyle = StyleSheet.flatten([
//     styles.btnText,
//     btnTextStyle,
//   ]);
//
//   return (
//     <TouchableOpacity
//       activeOpacity={activeOpacity}
//       disabled={disabled}
//       style={combinedButtonStyle}
//       onPress={onPressFunc}
//       {...rest}>
//       {icon && iconPosition === 'left' && (
//         <View style={styles.iconWrapper}>{icon}</View>
//       )}
//
//       <Text style={combinedTextStyle}>{btnText}</Text>
//
//       {icon && iconPosition === 'right' && (
//         <View style={styles.iconWrapper}>{icon}</View>
//       )}
//     </TouchableOpacity>
//   );
// };
//
// export default BotonComp;
//
// const styles = StyleSheet.create({
//   loginBtn: {
//     borderRadius: 12,
//     backgroundColor: color.defalt,
//     width: '80%',
//     marginTop: 20,
//     alignSelf: 'center',
//     paddingVertical: 15,
//     shadowColor: color.defalt,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//     elevation: 8,
//   },
//   disabledBtn: {
//     opacity: 0.6,
//   },
//   rowCenter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   iconWrapper: {
//     marginHorizontal: 8,
//   },
//   btnText: {
//     color: color.wite,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import color from '../Assets/colors/colors';

const BotonComp = ({
                     BtnStyle,
                     btnTextStyle,
                     btnText,
                     onPressFunc,
                     icon,
                     iconPosition = 'left',
                     disabled = false,
                     activeOpacity = 0.7,
                     ...rest
                   }) => {
  const combinedButtonStyle = StyleSheet.flatten([
    styles.loginBtn,
    disabled && styles.disabledBtn,
    BtnStyle,
    icon && styles.rowCenter,
  ]);

  const combinedTextStyle = StyleSheet.flatten([
    styles.btnText,
    btnTextStyle,
  ]);

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={disabled}
      style={combinedButtonStyle}
      onPress={onPressFunc}
      {...rest}>
      {icon && iconPosition === 'left' && (
        <View style={styles.iconWrapper}>{icon}</View>
      )}

      <Text style={combinedTextStyle}>{btnText}</Text>

      {icon && iconPosition === 'right' && (
        <View style={styles.iconWrapper}>{icon}</View>
      )}
    </TouchableOpacity>
  );
};

export default BotonComp;

const styles = StyleSheet.create({
  loginBtn: {
    borderRadius: 12,
    backgroundColor: color.defalt,
    width: '80%',
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 15,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
      },
      default: {
        elevation: 8,
        shadowColor: color.defalt,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
    }),
  },
  disabledBtn: {
    opacity: 0.6,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginHorizontal: 8,
  },
  btnText: {
    color: color.wite,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});