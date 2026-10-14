import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const HistoryScreen = () => {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomPadding =
    height * 0.085 +
    Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) +
    24;

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append('provider_id', global.id || '255');
      formdata.append('status', 'complete');

      const response = await fetch(`${BASIC_URL}provider_status.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      const bookings = result?.booking_request;
      setData(
        Array.isArray(bookings)
          ? bookings
          : bookings && typeof bookings === 'object'
            ? Object.values(bookings)
            : [],
      );
    } catch (error) {
      console.log('History Fetch Error:', error);
      Alert.alert('Error', error?.message || 'Unable to fetch history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (focus) {
      getData();
    }
  }, [focus, getData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
        <Text style={styles.welcomeTitle}>Completed History</Text>
        <Text style={styles.welcomeSubtitle}>
          Review your completed jobs and service history.
        </Text>

        {loading ? (
          <View style={styles.loaderCenter}>
            <ActivityIndicator size="large" color={color.defalt} />
            <Text style={styles.loadingText}>Loading history records...</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              `${item.booking_id ?? 'booking'}-${index}`
            }
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: bottomPadding },
            ]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Animatable.View
                animation="fadeInUp"
                duration={400}
                delay={Math.min(index * 50, 400)}
                style={styles.cardItemWrapper}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() =>
                    navigation.navigate('HistoryDetail', { booking: item })
                  }
                  style={styles.historyCard}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.serviceIcon}>
                      <Icons.Feather name="tool" size={19} color="#C07A50" />
                    </View>
                    <View style={styles.cardHeading}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.service || item.name || 'Completed booking'}
                      </Text>
                      <Text style={styles.bookingId}>
                        Booking #{item.booking_id || '—'}
                      </Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>
                        {item.status || 'complete'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardDivider} />
                  <View style={styles.cardBottomRow}>
                    <View style={styles.dateGroup}>
                      <Icons.Feather name="calendar" size={14} color="#7D8798" />
                      <Text style={styles.dateText}>
                        {item.service_date || 'Date not set'}
                      </Text>
                      <Text style={styles.timeText}>
                        {item.service_time || ''}
                      </Text>
                    </View>
                    <Text style={styles.priceText}>
                      PKR {item.price || '—'}
                    </Text>
                  </View>
                  <View style={styles.detailsLink}>
                    <Text style={styles.detailsLinkText}>View details</Text>
                    <Icons.Feather
                      name="chevron-right"
                      size={16}
                      color="#C07A50"
                    />
                  </View>
                </TouchableOpacity>
              </Animatable.View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBox}>
                  <Icons.Feather name="clock" size={32} color="#94A3B8" />
                </View>
                <Text style={styles.emptyTitle}>No completed bookings</Text>
                <Text style={styles.emptySubtitle}>
                  Your completed jobs and past service bookings will appear here.
                </Text>
              </View>
            }
          />
        )}
      </Animatable.View>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  safeArea: {
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
  headerSpacer: {
    width: 40,
  },
  formContainer: {
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
    marginBottom: 20,
    marginTop: 4,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 6,
  },
  cardItemWrapper: {
    marginBottom: 10,
  },
  historyCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF0F4',
    elevation: 2,
    shadowColor: '#26334D',
    shadowOpacity: 0.045,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#FBF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeading: {
    flex: 1,
    marginHorizontal: 12,
  },
  cardTitle: {
    color: '#172033',
    fontSize: 15,
    fontWeight: '700',
  },
  bookingId: {
    color: '#8993A5',
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
    backgroundColor: '#E7F7EF',
  },
  statusText: {
    color: '#27815C',
    textTransform: 'capitalize',
    fontSize: 10,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0F1F4',
    marginVertical: 14,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  dateText: {
    marginLeft: 7,
    color: '#687386',
    fontSize: 12,
  },
  timeText: {
    marginLeft: 7,
    color: '#8993A5',
    fontSize: 11,
  },
  priceText: {
    color: '#172033',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  detailsLinkText: {
    color: '#C07A50',
    fontSize: 12,
    fontWeight: '700',
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyIconBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 16,
  },
});
