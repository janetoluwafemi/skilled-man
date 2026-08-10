import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import color from '../../Assets/colors/colors';
import SearchHeader from './SearchHeader';
import { BASIC_URL } from '../Signin/Signin';

const Balance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASIC_URL}provider-transactions/${global.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const transactions = result.data || [];
      setData(transactions);
      setFilteredData(transactions);
    } catch (error) {
      console.log('Error fetching transaction balance data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.user_name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleSearchIconPress = () => {
    if (searchQuery.trim() === '') {
      setFilteredData(data);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <Image
          source={
            item.user_profile
              ? { uri: `${BASIC_URL}uploads/${item.user_profile}` }
              : require('../../Assets/Images/logo.png')
          }
          style={styles.avatar}
        />
        <View style={styles.infoCol}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {item.user_name}
          </Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.name}>Balance:</Text>
        <Text style={styles.balance}>₦ {item.amount || 0}</Text>
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
        {loading ? (
          <ActivityIndicator
            size="large"
            color={color.defalt}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No transaction records found</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

export default Balance;

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
    marginRight: 10,
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
    fontSize: 13,
    fontWeight: '700',
    color: color.defalt,
    marginBottom: 4,
  },
  balance: {
    fontSize: 15,
    fontWeight: '600',
    color: color.defalt,
  },
  dateText: {
    color: color.defalt,
    fontSize: 11,
  },
  loader: {
    marginTop: 40,
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