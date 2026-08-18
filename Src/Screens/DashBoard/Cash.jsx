import React, { useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, View, StatusBar } from 'react-native';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
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
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.balance}>₦ {item.balance}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.flexFill}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
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
              <Icons.Feather name="dollar-sign" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Cash Records Found</Text>
              <Text style={styles.emptySubtitle}>
                No transactions matched your search query.
              </Text>
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
    backgroundColor: '#F8FAFC',
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
    flexGrow: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 12,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E2E8F0',
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
    color: '#0F172A',
    marginBottom: 2,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  balance: {
    fontSize: 15,
    fontWeight: '800',
    color: color.defalt,
  },
  dateText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});