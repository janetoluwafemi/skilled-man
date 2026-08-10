import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';

const SearchHeader = ({ onSearch, searchQuery, onSearchIconPress }) => {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.userStyle}>Earned Balance</Text>
      <View style={styles.searchStyle}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={onSearchIconPress} activeOpacity={0.8}>
            <Icons.FontAwesome5 name="search" size={18} color={color.defalt} />
          </TouchableOpacity>
          <TextInput
            style={styles.inputStyle}
            value={searchQuery}
            placeholder="Search for services"
            placeholderTextColor={color.defalt}
            onChangeText={onSearch}
          />
        </View>
      </View>
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: color.defalt,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
  },
  userStyle: {
    fontSize: 20,
    fontWeight: '800',
    color: color.wite,
    marginBottom: 10,
  },
  searchStyle: {
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
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
    backgroundColor: 'transparent',
    height: '100%',
  },
});