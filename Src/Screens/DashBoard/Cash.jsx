import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

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
  const navigation = useNavigation();

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
    <TouchableOpacity activeOpacity={0.7} style={styles.cardContainer}>
      <View style={styles.leftRow}>
        <View style={styles.infoCol}>
          <Text style={styles.nameText} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.metaRow}>
            {Icons?.Feather && (
              <Icons.Feather name="calendar" size={12} color="#94A3B8" style={styles.metaIcon} />
            )}
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <View style={styles.amountBadge}>
          <Text style={styles.balanceValue}>₦{item.balance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.flexFill} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          {Icons?.Feather ? (
            <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
          ) : (
            <Text style={styles.fallbackBackText}>←</Text>
          )}
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <Animatable.View animation="fadeInUp" duration={600} style={styles.contentContainer}>
        <Text style={styles.welcomeTitle}>Cash In</Text>
        <Text style={styles.welcomeSubtitle}>
          View and monitor your earnings, receipts, and cash history.
        </Text>

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
                <View style={styles.emptyIconCircle}>
                  {Icons?.Feather && (
                    <Icons.Feather name="dollar-sign" size={32} color="#94A3B8" />
                  )}
                </View>
                <Text style={styles.emptyTitle}>No Cash Records Found</Text>
                <Text style={styles.emptySubtitle}>
                  No transactions matched your search query.
                </Text>
              </View>
            }
          />
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default Cash;

const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
  },
  backArrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  fallbackBackText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 4,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
    flexGrow: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }
      : {
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      }),
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  dateText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  amountBadge: {
    backgroundColor: '#FAF4F0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  balanceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: color.defalt,
    letterSpacing: -0.3,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#EEF2F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 19,
  },
});