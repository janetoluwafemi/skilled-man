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
const SarchInpt = props => {
  const { mode = 'outlined' } = props;
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.searchContainer}>
      <Icons.FontAwesome name="search" size={18} color={color.defalt} />
      <TextInput
        style={{
          flex: 1,
          paddingLeft: 10,
        }}
        placeholder="Search"
        placeholderTextColor={color.defalt}
        color={color.defalt}
        onChangeText={props.onChangeText}
        value={props.value}
      />
    </View>
  );
};

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
});

export default SarchInpt;