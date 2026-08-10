import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';

const SarchInpt = props => {
  return (
    <View style={[styles.searchContainer, props.containerStyle]}>
      <Icons.FontAwesome name="search" size={18} color={color.defalt} />
      <TextInput
        style={styles.inputStyle}
        placeholder={props.placeholder || 'Search'}
        placeholderTextColor={color.defalt}
        onChangeText={props.onChangeText}
        value={props.value}
      />
    </View>
  );
};

export default SarchInpt;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: color.wite,
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 10,
    color: color.defalt,
    fontSize: 14,
  },
});