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
          <TouchableOpacity onPress={onSearchIconPress} activeOpacity={0.8} style={styles.searchIconBtn}>
            <Icons.Feather name="search" size={18} color="#64748B" />
          </TouchableOpacity>
          <TextInput
            style={styles.inputStyle}
            value={searchQuery}
            placeholder="Search transactions..."
            placeholderTextColor="#94A3B8"
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
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  userStyle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  searchStyle: {
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  searchIconBtn: {
    paddingRight: 8,
  },
  inputStyle: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    height: '100%',
    fontWeight: '500',
  },
});