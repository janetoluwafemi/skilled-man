import React, { useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import color from '../../Assets/colors/colors';
import SearchHeader from './SearchHeader';

const dummyData = [
  { id: '1', name: 'John Doe', date: '12/10/2004', balance: '120.00' },
  { id: '2', name: 'Jane Smith', date: '05/03/2003', balance: '200.00' },
  { id: '3', name: 'Alice Johnson', date: '22/07/2001', balance: '150.00' },
  { id: '4', name: 'Bob Brown', date: '15/01/2002', balance: '100.00' },
  { id: '5', name: 'Charlie Green', date: '30/11/2005', balance: '180.00' },
];

const Cash = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(dummyData);

  useEffect(() => {
    setFilteredData(dummyData);
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData(dummyData);
    } else {
      const filtered = dummyData.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleSearchIconPress = () => {
    if (searchQuery.trim() === '') {
      setFilteredData(dummyData);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <Image
          source={require('../../Assets/Images/logo.png')}
          style={styles.avatar}
        />
        <View style={styles.infoCol}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.balance}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.name}>Balance:</Text>
        <Text style={styles.balance}>
          <FontAwesome6 name="registered" color={color.defalt} size={15} />{' '}
          {item.balance}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.flexFill}>
      <SearchHeader
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onSearchIconPress={handleSearchIconPress}
      />
      <View style={styles.listWrapper}>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No cash records found</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default Cash;

const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listWrapper: {
    flex: 1,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 8,
    marginTop: 8,
    alignSelf: 'center',
    width: '90%',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  infoCol: {
    marginLeft: 12,
    flex: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: color.defalt,
    marginBottom: 4,
  },
  balance: {
    fontSize: 14,
    fontWeight: '400',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: color.gry,
  },
});