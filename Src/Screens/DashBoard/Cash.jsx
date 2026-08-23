import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

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
        <View style={styles.avatarWrapper}>
          <Image
            source={require('../../Assets/Images/logo.png')}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
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

      <View style={styles.topHeaderRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          {Icons?.Feather ? (
            <Icons.Feather name="arrow-left" size={22} color="#0F172A" />
          ) : (
            <Text style={styles.fallbackBackText}>←</Text>
          )}
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Text style={styles.centerHeaderText}>Cash In</Text>
        </View>
      </View>

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
    </SafeAreaView>
  );
};

export default Cash;

const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeaderRow: {
    position: 'relative',
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    marginTop: Platform.OS === 'android' ? 6 : 2,
  },
  backArrowBtn: {
    position: 'absolute',
    left: 16,
    top: 0,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    zIndex: 10,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }
      : {
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      }),
  },
  fallbackBackText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  titleWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  centerHeaderText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoCol: {
    marginLeft: 12,
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
    paddingVertical: 90,
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