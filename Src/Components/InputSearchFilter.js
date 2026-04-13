import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { Icons } from '../Components/Icons';
import LinearGradient from 'react-native-linear-gradient';

import color from '../Assets/colors/colors';
const InputSarchFiltr = props => {
  const { mode = 'outlined', toggleModal } = props;
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  console.log(props.screen, 'toggle here');

  return (
    <View style={styles.searchContainer}>
      <Icons.FontAwesome5 name="search" size={18} color={color.defalt} />
      <TextInput
        style={{
          flex: 1,
          paddingLeft: 10,
          color:color.defalt
        }}
        value={props.value}
        placeholder="Search for services"
        placeholderTextColor={color.defalt}
        onChangeText={props.onChangeText}
      />
      {props.screen ? null :
        <TouchableOpacity onPress={toggleModal}>
          <LinearGradient
            style={styles.sliderStyle}
            colors={[color.lnTpClr, color.lnMdClr, color.lnBtClr]}>
            <Icons.FontAwesome name="sliders" size={18} color={color.wite} />
          </LinearGradient>
        </TouchableOpacity>
      }
    </View>
  );
};
export default InputSarchFiltr;

const styles = StyleSheet.create({
  inputstyle: {
    width: '100%',
    paddingVertical: 10,
    fontSize: 15,
    paddingHorizontal: 15,
    borderBottomColor: color.litGry,
    borderBottomWidth: 1,
    borderBottomColor: color.litGry,
    backgroundColor: 'transparent',
    borderRadius: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: color.wite,
  },
  sliderStyle: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
});