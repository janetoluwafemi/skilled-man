import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showToast} from '../../utilis/showToast';

import {Icons} from '../../Components/Icons';
import color from '../../Assets/colors/colors';
import {dummyBookings} from '../../utilis/MockJobsData';
// import {BASIC_URL} from '../Signin/Signin';

const OngoingTabs = ({route}) => {
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const {height, width} = useWindowDimensions();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const value = route?.params?.value;

  const bottomPadding =
    height * 0.085 +
    Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0) +
    24;

  const getData = useCallback(async () => {
    try {
      setLoading(true);

      const filteredBookings = dummyBookings.filter(
        item => item.status === 'ongoing',
      );

      setData(filteredBookings);

      /*
      const storedUser = await AsyncStorage.getItem('user');
      const userObj = storedUser ? JSON.parse(storedUser) : null;
      const providerId = global.id || userObj?.id || '255';

      const formdata = new FormData();
      formdata.append('provider_id', String(providerId));
      formdata.append('status', 'progress');

      if (value) {
        formdata.append('searchTerm', value);
      }

      const response = await fetch(`${BASIC_URL}provider_status.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();

      if (
        result?.booking_request &&
        Array.isArray(result.booking_request)
      ) {
        setData(result.booking_request);
      } else {
        setData([]);
      }
      */
    } catch (error) {
      console.log('Error fetching ongoing jobs:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [value]);

  useEffect(() => {
    if (focus) {
      getData();
    }
  }, [focus, getData]);

  const renderOngoingCard = ({item}) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Icons.Feather name="clock" size={18} color="#EA580C" />
          </View>
          <View>
            <Text style={styles.customerName}>{item?.name || 'Customer'}</Text>
            <Text style={styles.bookingId}>Booking ID: {item?.booking_id}</Text>
          </View>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>In Progress</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.dateTimeWrapper}>
          <View style={styles.iconRow}>
            <Icons.Feather name="calendar" size={14} color="#64748B" />
            <Text style={styles.dateTimeText}>{item?.service_date}</Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.iconRow}>
            <Icons.Feather name="clock" size={14} color="#64748B" />
            <Text style={styles.dateTimeText}>{item?.service_time}</Text>
          </View>
        </View>

        <Text style={styles.paidText}>Paid</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.defalt} />
      </View>
    );
  }

  return (
    <View style={styles.flexContainer}>
      <FlatList
        data={data}
        keyExtractor={(item, index) =>
          item?.booking_id?.toString() || index.toString()
        }
        contentContainerStyle={[
          styles.listContent,
          {paddingBottom: bottomPadding},
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={renderOngoingCard}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icons.Feather name="clock" size={54} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Ongoing Jobs</Text>
            <Text style={styles.emptySubtitle}>
              Jobs currently marked as in progress will appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default OngoingTabs;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexGrow: 1,
  },

  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  bookingId: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statusPill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
    fontWeight: '500',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  paidText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
});
