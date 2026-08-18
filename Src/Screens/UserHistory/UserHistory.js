import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import color from '../../Assets/colors/colors';
import BookingCrd from '../../Components/BookingCard';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 900;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const getResponsiveSpacing = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const UserHistory = () => {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [bookData, setBookData] = useState([]);

  useEffect(() => {
    if (focus) {
      fetchBookingData();
    }
  }, [focus]);

  const fetchBookingData = async () => {
    try {
      const formdata = new FormData();
      formdata.append('user_id', global.id);

      const response = await fetch(`${BASIC_URL}user/request_booking_service.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.booking_request) {
        setBookData(result.booking_request);
      }
    } catch (error) {
      console.log('Error fetching booking history:', error);
    }
  };

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 20;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking History</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={bookData}
        keyExtractor={(item, index) => item.booking_id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <BookingCrd
            cardTitle={item.name}
            bookingId={`Booking ID - ${item.booking_id}`}
            expertise={item.service}
            status={item.status}
            paidTitle={item.service_date}
            dateCont={styles.dateCont}
            filepress={item.file}
          />
        )}
        contentContainerStyle={[
          styles.cardContainer,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icons.Feather name="clock" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Booking History</Text>
            <Text style={styles.emptySubtitle}>
              Completed and previous service bookings will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default UserHistory;

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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardContainer: {
    paddingHorizontal: getResponsiveSpacing(16, 20, 24),
    paddingTop: getResponsiveSpacing(10, 14, 16),
    flexGrow: 1,
  },
  emptyContainer: {
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
  dateCont: {
    fontWeight: '500',
    color: '#64748B',
  },
});