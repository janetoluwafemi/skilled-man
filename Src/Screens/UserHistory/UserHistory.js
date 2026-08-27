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
      formdata.append('user_id', global.id || '255');

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

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 20 : 0) + 24;

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
        <View style={{ width: 40 }} />
      </View>

      <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
        <Text style={styles.welcomeTitle}>Booking History</Text>
        <Text style={styles.welcomeSubtitle}>
          View and track all your previous service bookings and requests.
        </Text>

        <FlatList
          data={bookData}
          keyExtractor={(item, index) => item.booking_id?.toString() || index.toString()}
          renderItem={({ item, index }) => (
            <Animatable.View
              animation="fadeInUp"
              duration={400}
              delay={Math.min(index * 50, 400)}
              style={styles.cardItemWrapper}>
              <BookingCrd
                cardTitle={item.name}
                bookingId={`Booking ID - ${item.booking_id}`}
                expertise={item.service}
                status={item.status}
                paidTitle={item.service_date}
                dateCont={styles.dateCont}
                filepress={item.file}
              />
            </Animatable.View>
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: bottomPadding },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Icons.Feather name="clock" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Booking History</Text>
              <Text style={styles.emptySubtitle}>
                Completed and previous service bookings will appear here.
              </Text>
            </View>
          }
        />
      </Animatable.View>
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
    paddingTop: 4,
  },
  cardItemWrapper: {
    marginBottom: 10,
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
  dateCont: {
    fontWeight: '500',
    color: '#64748B',
  },
});