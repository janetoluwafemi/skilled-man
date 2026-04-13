import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import color from '../../Assets/colors/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import SearchHeader from './SearchHeader';

const Balance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const response = await fetch(
        `https://theskilledman.com/api/provider-transactions/${global.id}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const transactions = result.data || [];
      setFilteredData(transactions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchdata();
    } else {
      const filtered = filteredData.filter(item =>
        item.user_name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };

  const handleSearchIconPress = () => {
    if (searchQuery.trim() === '') {
      fetchdata();
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.container}>
      {/* Container for Image and Name with flex: 1 to allow shrinking/growing */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          marginRight: 10,
        }}>
        <Image
          source={require('../../Assets/Images/logo.png')}
          style={{width: 50, height: 50, borderRadius: 25}}
        />
        <View style={{marginLeft: 10, flex: 1}}>
          {/* Added flex: 1 here and numberOfLines below */}
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {item.user_name}
          </Text>
          <Text style={{color: color.defalt, fontSize: 10}}>{item.date}</Text>
        </View>
      </View>

      {/* Balance Section - Keeps its fixed width layout */}
      <View style={{alignItems: 'flex-end'}}>
        <Text style={styles.name}>Balance:</Text>
        <Text style={styles.balance}>₦ {item.amount || 0}</Text>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <SearchHeader
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onSearchIconPress={handleSearchIconPress}
      />
      <View style={{flex: 1, marginTop: 30}}>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
        />
      </View>
    </View>
  );
};

export default Balance;

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
    fontSize: 12,
    fontWeight: '700',
    color: color.defalt,
    marginBottom: 8,
    marginTop: 4,
  },
  balance: {
    fontSize: 16,
    fontWeight: '400',
    color: color.defalt,
  },
});
