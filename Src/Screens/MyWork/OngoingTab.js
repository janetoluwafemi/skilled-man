import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { showToast } from '../../utilis/showToast';

import FltLstCrd from '../../Components/FlatListCard';
import { Icons } from '../../Components/Icons';
import color from '../../Assets/colors/colors';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const OngoingTabs = props => {
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState([]);

  const bottomPadding =
    height * 0.085 + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

  const getData = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('provider_id', global.id);
      formdata.append('status', 'progress');
      if (props?.value) {
        formdata.append('searchTerm', props.value);
      }

      const response = await fetch(`${BASIC_URL}provider_status.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.booking_request) {
        setData(result.booking_request);
      } else if (result?.error) {
        showToast(result.error);
      }
    } catch (error) {
      Alert.alert('Error', error?.message || String(error) || 'An error occurred');
    }
  }, [props?.value]);

  useEffect(() => {
    if (focus) {
      getData();
    }
  }, [focus, getData]);

  return (
    <View style={styles.flexContainer}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.booking_id?.toString() || index.toString()}
        contentContainerStyle={[styles.container, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FltLstCrd
            cardTitle={item.name}
            bookingId={`Booking ID - ${item.booking_id}`}
            date={item.service_date}
            time={item.service_time}
            paidTitle="Paid"
            status="In Progress"
            filepress={item.file}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icons.Feather name="clock" size={48} color="#CBD5E1" />
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
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
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
});