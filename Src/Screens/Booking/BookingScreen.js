import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  Modal,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import color from '../../Assets/colors/colors';
import HomeStakWSearch from '../../Components/HomeStackWithSearch';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const BookingScreen = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const bottomPadding =
    height * 0.085 +
    Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) +
    28;

  const toggleModal = item => {
    setCurrentItem(item);
    setModalVisible(true);
  };

  const getBookingRequests = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        let currentUserId = String(global.id || '').trim();

        // Sync user ID from storage if missing
        if (!currentUserId || ['251', '255', '256'].includes(currentUserId)) {
          const rawUser = await AsyncStorage.getItem('user');
          if (rawUser) {
            const parsed = JSON.parse(rawUser);
            const possibleId = parsed?.id ?? parsed?.user_id ?? parsed?.userId;
            if (possibleId && !['251', '255', '256'].includes(String(possibleId))) {
              currentUserId = String(possibleId).trim();
              global.id = currentUserId;
            } else {
              currentUserId = '256';
            }
          } else {
            currentUserId = '256';
          }
        }

        const formdata = new FormData();
        formdata.append('user_id', currentUserId);

        const response = await fetch(`${BASIC_URL}user/get_booking.php`, {
          method: 'POST',
          body: formdata,
        });

        const result = await response.json();
        console.log('[BookingScreen] get_booking.php response:', result);
        console.log(
          '[BookingScreen] booking keys:',
          Object.keys(result?.bookings?.[0] || {}),
        );

        if (result && Array.isArray(result.bookings)) {
          setAllBookings(result.bookings);
        } else if (Array.isArray(result)) {
          setAllBookings(result);
        } else {
          setAllBookings([]);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setAllBookings([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (focused) {
      getBookingRequests();
    }
  }, [focused, getBookingRequests]);

  // Client-side search filter
  const displayedBookings = allBookings.filter(req => {
    const searchTarget = `${req?.provider_name || req?.name || ''} ${req?.service_name || req?.service || ''} ${req?.booking_id || ''}`.toLowerCase();
    return searchTarget.includes((searchTerm || '').toLowerCase());
  });

  const handlePayment = () => {
    setModalVisible(false);
    navigation.navigate('SelectPaymentMethod', {
      price: currentItem?.price || '10000',
      fullName: currentItem?.provider_name || currentItem?.name,
      date: currentItem?.service_date || currentItem?.created_at,
      phoneNumber: currentItem?.phone_number || currentItem?.provider_phone || 'N/A',
      address: currentItem?.address || 'Service Location',
      booking_id: currentItem?.booking_id || currentItem?.id,
      provider_id: currentItem?.provider_id,
      selectedfile: currentItem?.file,
    });
  };

  const openFile = () => {
    if (!currentItem?.file) return;
    const fileURL = `${BASIC_URL}uploads/${currentItem.file}`;
    Linking.openURL(fileURL).catch(err =>
      console.error(err),
    );
  };

  const getStatusStyle = status => {
    const cleanStatus = (status || '').toLowerCase();
    switch (cleanStatus) {
      case 'accepted':
      case 'completed':
      case 'complete':
        return { bg: '#D1FAE5', text: '#047857' };
      case 'rejected':
        return { bg: '#FEE2E2', text: '#B91C1C' };
      case 'progress':
      case 'pending':
      default:
        return { bg: '#FEF3C7', text: '#D97706' };
    }
  };

  const renderBookingCard = ({ item }) => {
    const statusStyling = getStatusStyle(item.status);
    const displayName = item.provider_name || 'Artisan Service';
    const displayService = item.service_name || 'Service Request';
    const displayId = item.booking_id || item.id || item.provider_id || '';

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.modernCard}
        onPress={() => toggleModal(item)}>
        <View style={styles.cardHeader}>
          <View style={styles.cardUserInfo}>
            <Image
              style={styles.cardAvatar}
              source={
                item.profile || item.image
                  ? { uri: `${BASIC_URL}uploads/${item.profile || item.image}` }
                  : require('../../Assets/Images/user.jpg')
              }
            />
            <View>
              <Text style={styles.cardName}>{displayName}</Text>
              <Text style={styles.cardService}>
                {displayService} {displayId ? `• #${displayId}` : ''}
              </Text>
            </View>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusStyling.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusStyling.text }]}>
              {String(item.status || 'PENDING').toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Icons.Feather name="calendar" size={14} color="#64748B" />
            <Text style={styles.footerText}>{item.service_date || item.created_at || 'Flexible'}</Text>
          </View>
          <View style={styles.footerItem}>
            <Icons.Feather name="clock" size={14} color="#64748B" />
            <Text style={styles.footerText}>{item.service_time || 'Standard Hours'}</Text>
          </View>
          <Icons.Feather
            name="chevron-right"
            size={18}
            color="#CBD5E1"
            style={{ marginLeft: 'auto' }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <HomeStakWSearch
        onPress={() => navigation.openDrawer()}
        onPressnotification={() => navigation.navigate('edit_profile')}
        onChangeText={val => setSearchTerm(val)}
        value={searchTerm}
        headerTitle=""
      />

      {displayedBookings.length > 0 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryTitle}>Your Bookings</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{displayedBookings.length} Total</Text>
          </View>
        </View>
      )}

      {loading && displayedBookings.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.defalt} />
          <Text style={styles.loadingText}>Fetching your bookings...</Text>
        </View>
      ) : (
        <FlatList
          data={displayedBookings}
          keyExtractor={(item, index) =>
            item.booking_id?.toString() || item.id?.toString() || index.toString()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getBookingRequests(true)}
              colors={[color.defalt]}
            />
          }
          renderItem={renderBookingCard}
          contentContainerStyle={StyleSheet.flatten([
            styles.cardContainer,
            { paddingBottom: bottomPadding },
          ])}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Icons.Feather name="inbox" size={34} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Bookings Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchTerm ? 'No bookings match your search term.' : 'You have not made any booking requests yet.'}
              </Text>
            </View>
          }
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.overlayDismiss}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <Animatable.View
            animation="slideInUp"
            duration={350}
            style={styles.bottomSheetCard}>
            <View style={styles.bottomSheetHandle} />

            <View style={styles.sheetHeader}>
              <Image
                style={styles.sheetAvatar}
                source={
                  currentItem?.profile || currentItem?.image
                    ? { uri: `${BASIC_URL}uploads/${currentItem?.profile || currentItem?.image}` }
                    : require('../../Assets/Images/user.jpg')
                }
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetName}>{currentItem?.provider_name || currentItem?.name}</Text>
                <Text style={styles.sheetService}>
                  {currentItem?.service_name || currentItem?.service || 'Service'} • ID: #{currentItem?.booking_id || currentItem?.id}
                </Text>
              </View>
            </View>

            <View style={styles.sheetBody}>
              <View style={styles.infoTile}>
                <View style={styles.infoTileRow}>
                  <View style={styles.tileIconWrap}>
                    <Icons.Feather
                      name="calendar"
                      size={16}
                      color={color.defalt}
                    />
                  </View>
                  <View style={styles.tileTextCol}>
                    <Text style={styles.tileLabel}>Scheduled Appointment</Text>
                    <Text style={styles.tileValue}>
                      {currentItem?.service_date || currentItem?.created_at || 'To Be Confirmed'} at{' '}
                      {currentItem?.service_time || 'TBD'}
                    </Text>
                  </View>
                </View>
              </View>

              {currentItem?.file && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={openFile}
                  style={styles.attachmentTile}>
                  <View style={styles.tileIconWrap}>
                    <Icons.Feather
                      name="paperclip"
                      size={16}
                      color={color.defalt}
                    />
                  </View>
                  <View style={styles.tileTextCol}>
                    <Text style={styles.attachmentTileTitle}>
                      Service Attachment
                    </Text>
                    <Text style={styles.attachmentTileSub}>
                      Tap to view uploaded file
                    </Text>
                  </View>
                  <Icons.Feather
                    name="external-link"
                    size={16}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              )}

              <View style={styles.statusDisplayWrap}>
                <Text style={styles.statusDisplayLabel}>Current Status:</Text>
                <Text
                  style={[
                    styles.statusDisplayText,
                    { color: getStatusStyle(currentItem?.status).text },
                  ]}>
                  {currentItem?.status === 'pending'
                    ? 'Pending Confirmation'
                    : currentItem?.status === 'accepted'
                      ? 'Accepted by Provider'
                      : currentItem?.status === 'complete' || currentItem?.status === 'completed'
                        ? 'Service Completed'
                        : 'Declined by Provider'}
                </Text>
              </View>
            </View>

            <View style={styles.btnActionRow}>
              {currentItem?.status === 'pending' && (
                <View style={styles.disabledBtn}>
                  <Text style={styles.disabledBtnText}>
                    Waiting for Provider to Accept...
                  </Text>
                </View>
              )}
              {currentItem?.status === 'rejected' && (
                <View
                  style={[styles.disabledBtn, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.disabledBtnText, { color: '#B91C1C' }]}>
                    Provider Declined Request
                  </Text>
                </View>
              )}
              {currentItem?.status === 'accepted' && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.payBtn}
                  onPress={handlePayment}>
                  <Icons.Feather
                    name="credit-card"
                    size={18}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.payBtnText}>
                    Pay {currentItem?.price || 'Now'} to Confirm
                  </Text>
                </TouchableOpacity>
              )}
              {(currentItem?.status === 'complete' || currentItem?.status === 'completed') && (
                <View style={[styles.disabledBtn, { backgroundColor: '#D1FAE5' }]}>
                  <Text style={[styles.disabledBtnText, { color: '#047857' }]}>
                    Order Completed
                  </Text>
                </View>
              )}
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  summaryBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  summaryTitle: { fontSize: 13.5, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: -0.2 },
  countBadge: { backgroundColor: '#EEF2F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countBadgeText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  cardContainer: { paddingHorizontal: 16, paddingTop: 8, flexGrow: 1 },
  modernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)' }
      : { elevation: 2, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 }),
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardUserInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2F6', marginRight: 12 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  cardService: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  statusBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  footerItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  footerText: { fontSize: 13, color: '#475569', fontWeight: '500', marginLeft: 6 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748B', fontWeight: '500' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80, paddingHorizontal: 30 },
  emptyIconCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#EEF2F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptySubtitle: { fontSize: 13.5, color: '#64748B', textAlign: 'center', lineHeight: 20 },
  bottomSheetOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  overlayDismiss: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bottomSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    width: '100%',
  },
  bottomSheetHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 20 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  sheetAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16, backgroundColor: '#F1F5F9' },
  sheetName: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  sheetService: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  sheetBody: { marginBottom: 24 },
  infoTile: { width: '100%', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EEF2F6', marginBottom: 10 },
  infoTileRow: { flexDirection: 'row', alignItems: 'center' },
  tileIconWrap: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  tileTextCol: { flex: 1 },
  tileLabel: { fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 3 },
  tileValue: { fontSize: 14.5, fontWeight: '700', color: '#0F172A' },
  attachmentTile: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EEF2F6', marginBottom: 10 },
  attachmentTileTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  attachmentTileSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  statusDisplayWrap: { marginTop: 10, paddingHorizontal: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusDisplayLabel: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  statusDisplayText: { fontSize: 15, fontWeight: '800' },
  btnActionRow: { flexDirection: 'row' },
  payBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#10B981', borderRadius: 16, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  payBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  disabledBtn: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  disabledBtnText: { color: '#64748B', fontWeight: '700', fontSize: 14 },
});