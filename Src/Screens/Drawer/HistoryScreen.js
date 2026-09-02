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
import { showToast } from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import FltLstCrd from '../../Components/FlatListCard';
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
      if (result?.booking_request) {
        setData(result.booking_request);
      } else if (result?.error) {
        setData([]);
      }
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
        <View style={{ width: 40 }} />
      </View>

      <Animatable.View animation="fadeInUp" duration={600} style={styles.formContainer}>
        <Text style={styles.welcomeTitle}>Completed History</Text>
        <Text style={styles.welcomeSubtitle}>
          Review your past completed jobs and service history.
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
              item.booking_id?.toString() || index.toString()
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
                <FltLstCrd
                  cardTitle={item.name}
                  bookingId={`Booking ID - ${item.booking_id}`}
                  date={item.service_date}
                  time={item.service_time}
                  paidTitle="Paid"
                  status={item.status}
                  filepress={item.file}
                />
              </Animatable.View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBox}>
                  <Icons.Feather name="clock" size={32} color="#94A3B8" />
                </View>
                <Text style={styles.emptyTitle}>No History Records Found</Text>
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

