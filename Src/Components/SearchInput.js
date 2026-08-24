import React from 'react';
import { StyleSheet, TextInput, View, Platform } from 'react-native';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';

const SearchInput = props => {
  return (
    <View style={[styles.searchContainer, props.containerStyle]}>
      <Icons.FontAwesome name="search" size={18} color={color.defalt} />
      <TextInput
        style={styles.inputStyle}
        placeholder={props.placeholder || 'Search'}
        placeholderTextColor={color.defalt}
        onChangeText={props.onChangeText}
        value={props.value}
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

export default SearchInput;

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
    height: '100%',
    paddingVertical: 0,
    borderWidth: 0,
    ...(Platform.OS === 'web' && {
      outlineWidth: 0,
      outlineColor: 'transparent',
      outlineStyle: 'none',
      boxShadow: 'none',
    }),
  },
});