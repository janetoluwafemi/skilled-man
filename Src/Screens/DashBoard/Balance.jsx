import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
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
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.balance}>₦ {item.amount || 0}</Text>
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
                <Icons.Feather name="credit-card" size={48} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Transactions Found</Text>
                <Text style={styles.emptySubtitle}>
                  Your completed earnings and transaction history will appear here.
                </Text>
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
  loader: {
    marginTop: 40,
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