import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Icons } from '../../Components/Icons';

const SearchHeader = ({ onSearch, searchQuery, onSearchIconPress }) => {
  return (
      <View style={styles.containerStyle}>
        <View style={styles.searchStyle}>
          <View style={styles.searchContainer}>
            <TouchableOpacity onPress={onSearchIconPress} activeOpacity={0.8} style={styles.searchIconBtn}>
              <Icons.Feather name="search" size={20} color="#64748B" />
            </TouchableOpacity>
            <TextInput
                style={styles.inputStyle}
                value={searchQuery}
                placeholder="Search transactions..."
                placeholderTextColor="#94A3B8"
                onChangeText={onSearch}
                underlineColorAndroid="transparent"
            />
          </View>
        </View>
      </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: '#F8FAFC',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  searchStyle: {
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 52,
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  searchIconBtn: {
    paddingRight: 10,
  },
  inputStyle: {
    flex: 1,
    width: '100%',
    color: '#0F172A',
    fontSize: 15,
    height: '100%',
    fontWeight: '500',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
    ...(Platform.OS === 'web' && {
      outlineWidth: 0,
      outlineColor: 'transparent',
      outlineStyle: 'none',
      borderStyle: 'none',
      boxShadow: 'none',
    }),
  },
});