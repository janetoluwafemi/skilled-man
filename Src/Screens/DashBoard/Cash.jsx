import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import color from '../../Assets/colors/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import SearchHeader from './SearchHeader';



const Cash = () => {
  // Initialize filteredData with dummyData to show all data on component mount
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(dummyData);

  useEffect(() => {
    setFilteredData(dummyData);
  }, []);

  const dummyData = [
    { id: '1', name: 'John Doe', date: '12/10/2004', balance: '120.00' },
    { id: '2', name: 'Jane Smith', date: '05/03/2003', balance: '200.00' },
    { id: '3', name: 'Alice Johnson', date: '22/07/2001', balance: '150.00' },
    { id: '4', name: 'Bob Brown', date: '15/01/2002', balance: '100.00' },
    { id: '5', name: 'Charlie Green', date: '30/11/2005', balance: '180.00' },
  ];

  // Filter data based on the search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      // Show all data if the search query is empty
      setFilteredData(dummyData);
    } else {
      // Filter data based on the search query
      const filtered = dummyData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  // Handle search icon press
  const handleSearchIconPress = () => {
    if (searchQuery.trim() === '') {
      // Reset to show all data when the search icon is pressed with an empty query
      setFilteredData(dummyData);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={require('../../Assets/Images/logo.png')}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.balance}>{item.date}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.name}>Balance:</Text>
        <Text style={styles.balance}>
          <FontAwesome6 name="registered" color={color.defalt} size={15} /> {item.balance}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Pass search handlers to SearchHeader */}
      <SearchHeader
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onSearchIconPress={handleSearchIconPress}
      />
      <View style={{ marginTop: 30 }}>
        {/* FlatList renders filteredData */}
        <FlatList
          data={filteredData} // Use filteredData to show all or filtered items
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default Cash;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
    width: '90%',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: color.defalt,
    marginBottom: 8,
    marginTop: 4,
  },
  balance: {
    fontSize: 16,
    fontWeight: '400',
  },
});