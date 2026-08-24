import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Icons } from './Icons';
import { LinearGradient } from 'expo-linear-gradient';
import color from '../Assets/colors/colors';

const InputSarchFiltr = props => {
  const { toggleModal } = props;

  const gradientColors = [
    color.lnTpClr || '#4c669f',
    color.lnMdClr || '#3b5998',
    color.lnBtClr || '#192f6a',
  ];

  return (
    <View style={StyleSheet.flatten([styles.searchContainer, props.containerStyle])}>
      {Icons?.FontAwesome5 && (
        <Icons.FontAwesome5 name="search" size={18} color={color.defalt} />
      )}
      <TextInput
        style={StyleSheet.flatten([styles.textInput, props.inputStyle])}
        value={props.value}
        placeholder="Search for services"
        placeholderTextColor={color.defalt}
        onChangeText={props.onChangeText}
        underlineColorAndroid="transparent"
      />
      {props.screen ? null : (
        <TouchableOpacity onPress={toggleModal} activeOpacity={0.7}>
          <LinearGradient
            style={StyleSheet.flatten([styles.sliderStyle])}
            colors={gradientColors}
          >
            {Icons?.FontAwesome && (
              <Icons.FontAwesome name="sliders" size={18} color={color.wite} />
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputSarchFiltr;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: color.wite,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: color.defalt,
    borderWidth: 0,
    outlineStyle: 'none',
    ...(Platform.OS === 'web' && {
      outlineWidth: 0,
      outlineColor: 'transparent',
    }),
  },
  sliderStyle: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
});