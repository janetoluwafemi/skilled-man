import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import color from '../../Assets/colors/colors';
import BookingCrd from '../../Components/BookingCard';
import CstmHeader from '../../Components/CustomHeader';
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

const UsrHstry = () => {
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
      <CstmHeader
        title="History"
        onPressBack={() => navigation.goBack()}
      />
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
            <Text style={styles.emptyText}>No booking history found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default UsrHstry;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardContainer: {
    paddingHorizontal: getResponsiveSpacing(12, 15, 18),
    paddingTop: getResponsiveSpacing(8, 10, 12),
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: getResponsiveSize(14, 16, 18),
    color: color.gry,
    fontWeight: '500',
  },
  dateCont: {
    fontWeight: '400',
    color: color.gry,
  },
});