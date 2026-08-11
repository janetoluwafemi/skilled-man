import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
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
    <View style={styles.searchContainer}>
      <Icons.FontAwesome5 name="search" size={18} color={color.defalt} />
      <TextInput
        style={styles.textInput}
        value={props.value}
        placeholder="Search for services"
        placeholderTextColor={color.defalt}
        onChangeText={props.onChangeText}
      />
      {props.screen ? null : (
        <TouchableOpacity onPress={toggleModal}>
          <LinearGradient
            style={styles.sliderStyle}
            colors={gradientColors}
          >
            <Icons.FontAwesome name="sliders" size={18} color={color.wite} />
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
  },
  sliderStyle: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
});