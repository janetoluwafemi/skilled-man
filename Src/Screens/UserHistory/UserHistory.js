import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {Icons} from '../../Components/Icons';
import {BASIC_URL} from '../Signin/Signin';

const normalizeBookings = bookingRequest => {
  if (Array.isArray(bookingRequest)) {
    return bookingRequest.filter(item => item && typeof item === 'object');
  }
  if (bookingRequest && typeof bookingRequest === 'object') {
    return Object.values(bookingRequest).filter(
      item => item && typeof item === 'object',
    );
  }
  return [];
};

const UserHistory = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookingData = useCallback(async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append('user_id', global.id || '255');

      const response = await fetch(
        `${BASIC_URL}user/request_booking_service.php`,
        {method: 'POST', body: formdata},
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Unable to fetch booking history.');
      }
      setBookData(normalizeBookings(result?.booking_request));
    } catch (error) {
      console.log('Error fetching booking history:', error);
      setBookData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchBookingData();
    }
  }, [fetchBookingData, isFocused]);

  const bottomPadding =
    Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 0) + 20;

  const openHistory = booking =>
    navigation.navigate('HistoryDetail', {booking});

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />
      <View style={styles.headerBar}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={bookData}
        keyExtractor={(item, index) =>
          `${item.booking_id ?? 'booking'}-${index}`
        }
        contentContainerStyle={[
          styles.listContent,
          {paddingBottom: bottomPadding},
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.welcomeTitle}>Booking History</Text>
            <Text style={styles.subtitle}>
              All your service requests, together in one place.
            </Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator size="large" color="#C07A50" />
              <Text style={styles.stateText}>Loading your bookings...</Text>
            </View>
          ) : (
            <View style={styles.stateContainer}>
              <View style={styles.emptyIcon}>
                <Icons.Feather name="inbox" size={26} color="#8993A5" />
              </View>
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.stateText}>
                Your previous service bookings will appear here.
              </Text>
            </View>
          )
        }
        renderItem={({item, index}) => {
          const status = String(item.status || 'pending');
          const statusStyle =
            status.toLowerCase() === 'complete' ||
            status.toLowerCase() === 'completed'
              ? styles.statusComplete
              : status.toLowerCase() === 'rejected' ||
                  status.toLowerCase() === 'cancelled'
                ? styles.statusCancelled
                : styles.statusPending;

          return (
            <Animatable.View
              animation="fadeInUp"
              duration={350}
              delay={Math.min(index * 40, 240)}>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => openHistory(item)}
                style={styles.bookingCard}>
                <View style={styles.cardTopRow}>
                  <View style={styles.serviceIcon}>
                    <Icons.Feather name="tool" size={19} color="#C07A50" />
                  </View>
                  <View style={styles.cardHeading}>
                    <Text style={styles.serviceName} numberOfLines={1}>
                      {item.service || 'Service booking'}
                    </Text>
                    <Text style={styles.bookingId}>
                      Booking #{item.booking_id || '—'}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, statusStyle]}>
                    <Text
                      style={[styles.statusText, {color: statusStyle.color}]}>
                      {status}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBottomRow}>
                  <View style={styles.metaItem}>
                    <Icons.Feather name="calendar" size={14} color="#7D8798" />
                    <Text style={styles.metaText}>
                      {item.service_date || 'Date not set'}
                    </Text>
                  </View>
                  <View style={styles.cardPrice}>
                    <Text style={styles.priceCurrency}>PKR</Text>
                    <Text style={styles.priceText}>{item.price || '—'}</Text>
                  </View>
                </View>
                <View style={styles.openDetails}>
                  <Text style={styles.openDetailsText}>View booking details</Text>
                  <Icons.Feather
                    name="chevron-right"
                    size={17}
                    color="#C07A50"
                  />
                </View>
              </TouchableOpacity>
            </Animatable.View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default UserHistory;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FB',
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  listHeader: {
    paddingTop: 4,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#EEF0F4',
    elevation: 2,
    shadowColor: '#26334D',
    shadowOpacity: 0.045,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    height: 44,
    width: 44,
    borderRadius: 15,
    backgroundColor: '#FBF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeading: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  serviceName: {
    fontSize: 16,
    color: '#172033',
    fontWeight: '700',
  },
  bookingId: {
    color: '#8993A5',
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statusPending: {
    color: '#A76A16',
    backgroundColor: '#FFF5DF',
  },
  statusComplete: {
    color: '#27815C',
    backgroundColor: '#E7F7EF',
  },
  statusCancelled: {
    color: '#B44848',
    backgroundColor: '#FCECEC',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F1F4',
    marginVertical: 14,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 7,
    color: '#687386',
    fontSize: 12,
  },
  cardPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceCurrency: {
    color: '#919AAC',
    fontSize: 10,
    marginRight: 4,
    fontWeight: '600',
  },
  priceText: {
    color: '#172033',
    fontSize: 16,
    fontWeight: '800',
  },
  openDetails: {
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  openDetailsText: {
    color: '#C07A50',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 2,
  },
  stateContainer: {
    flex: 1,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: '#E9EDF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    color: '#172033',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
  },
  stateText: {
    color: '#8791A3',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 10,
  },
});
