import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
// import { TextInput } from 'react-native-paper';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';

const SearchHeader = ({ onSearch, searchQuery, onSearchIconPress }) => {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.userStyle}>Earned Balance</Text>
      <View style={styles.searchStyle}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={onSearchIconPress}>
            <Icons.FontAwesome5 name="search" size={18} color={color.defalt} />
          </TouchableOpacity>
          <TextInput
            style={{
              flex: 1,
              paddingLeft: 10,
              color: color.defalt,
              backgroundColor: 'white',
              height: 50,

            }}
            value={searchQuery}
            placeholder="Search for services"
            placeholderTextColor={color.defalt}
            onChangeText={onSearch} // Call the search handler on text change
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
    height: 100,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: color.wite,
  },
  userStyle: {
    fontSize: 20,
    fontWeight: '800',
    color: color.wite,
    marginBottom: 10,
  },
  searchStyle:{
    marginTop: 20,
  }
});