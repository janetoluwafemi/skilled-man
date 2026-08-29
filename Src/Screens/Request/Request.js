import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
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
import { showToast } from '../../utilis/showToast';
import color from '../../Assets/colors/colors';
import HomeStakWSearch from '../../Components/HomeStackWithSearch';
import { Icons } from '../../Components/Icons';
import FltLstCrd from '../../Components/FlatListCard';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const RequestScreen = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [booklist, setBooklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const bottomPadding =
    height * 0.085 +
    Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) +
    28;

  const toggleModal = item => {
    if (item.status !== 'progress') {
      setCurrentItem(item);
      setModalVisible(true);
    } else {
      showToast('This request is already in progress and cannot be modified.');
    }
  };

  const getBookingRequests = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const formdata = new FormData();
        formdata.append('provider_id', global.id);

        if (searchTerm.trim() !== '') {
          formdata.append('searchTerm', searchTerm.trim());
        }
        const response = await fetch(`${BASIC_URL}provider_status.php`, {
          method: 'POST',
          body: formdata,
        });
        const result = await response.json();
        if (result?.booking_request) {
          setBooklist(result.booking_request);
        } else if (result?.error) {
          console.log(result.error);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchTerm]
  );

  useEffect(() => {
    if (focused) {
      getBookingRequests();
    }
  }, [focused, getBookingRequests]);

  const changeStatus = async statusValue => {
    try {
      const formdata = new FormData();
      formdata.append('id', currentItem.booking_id);
      formdata.append('status', statusValue);

      const response = await fetch(`${BASIC_URL}status_update.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();

      if (result?.success) {
        showToast(result.success);
        setModalVisible(false);
        setCurrentItem(null);
        getBookingRequests();
      } else if (result?.error) {
        showToast(result.error);
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'An error occurred');
    }
  };

  const openFile = () => {
    if (!currentItem?.file) return;

    const fileURL = `${BASIC_URL}uploads/${currentItem.file}`;

    Linking.openURL(fileURL).catch(err =>
      console.error(`Error opening file: ${err}`)
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
        headerTitle="Booking Requests"
      />

      {booklist.length > 0 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryTitle}>Incoming Requests</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{booklist.length} Total</Text>
          </View>
        </View>
      )}

      {loading && booklist.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.defalt} />
          <Text style={styles.loadingText}>Fetching requests...</Text>
        </View>
      ) : (
        <FlatList
          data={booklist}
          keyExtractor={(item, index) =>
            item.booking_id?.toString() || index.toString()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getBookingRequests(true)}
              colors={[color.defalt]}
            />
          }
          renderItem={({ item, index }) => (
            <View style={styles.cardItemWrapper}>
              <FltLstCrd
                index={index}
                cardTitle={item.name}
                bookingId={`Booking ID - ${item.booking_id}`}
                date={item.service_date}
                time={item.service_time}
                status={item.status}
                onPressShowProfile={() => toggleModal(item)}
                iconName="ellipsis-v"
                filepress={item.file}
              />
            </View>
          )}
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
              <Text style={styles.emptyTitle}>No Booking Requests</Text>
              <Text style={styles.emptySubtitle}>
                New customer service requests will appear here in real time.
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
        <View style={styles.modalOverlay}>
          <Animatable.View animation="zoomIn" duration={250} style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.modalHeaderIconWrap}>
                  <Icons.Feather name="user-check" size={17} color={color.defalt} />
                </View>
                <Text style={styles.modalTitleText}>Request Details</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.closeCircleBtn}
                onPress={() => setModalVisible(false)}>
                <Icons.Ionicons name="close" color="#64748B" size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.logoImg}
                  resizeMode="cover"
                  source={
                    currentItem?.profile
                      ? { uri: `${BASIC_URL}uploads/${currentItem.profile}` }
                      : require('../../Assets/Images/user.jpg')
                  }
                />
              </View>

              <Text style={styles.customerName}>{currentItem?.name}</Text>
              <Text style={styles.bookingIdPill}>
                Booking ID • #{currentItem?.booking_id}
              </Text>

              <View style={styles.infoTile}>
                <View style={styles.infoTileRow}>
                  <View style={styles.tileIconWrap}>
                    <Icons.Feather name="calendar" size={16} color={color.defalt} />
                  </View>
                  <View style={styles.tileTextCol}>
                    <Text style={styles.tileLabel}>Scheduled Date & Time</Text>
                    <Text style={styles.tileValue}>
                      {currentItem?.service_date}{' '}
                      {currentItem?.service_time ? `(${currentItem.service_time})` : ''}
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
                    <Icons.Feather name="paperclip" size={16} color={color.defalt} />
                  </View>
                  <View style={styles.tileTextCol}>
                    <Text style={styles.attachmentTileTitle}>Service Attachment</Text>
                    <Text style={styles.attachmentTileSub}>Tap to view uploaded file</Text>
                  </View>
                  <Icons.Feather name="external-link" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}

              <TouchableOpacity activeOpacity={0.8} style={styles.directionsBtn}>
                <Icons.Feather
                  name="navigation"
                  size={15}
                  color={color.defalt}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.directionsText}>Get Directions to Location</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnActionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.rejectBtn}
                onPress={() => changeStatus('reject')}>
                <Icons.Feather name="x" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.rejectBtnText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.acceptBtn}
                onPress={() => changeStatus('progress')}>
                <Icons.Feather name="check" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.acceptBtnText}>Accept Request</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RequestScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  summaryTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: -0.2,
  },
  countBadge: {
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
  cardItemWrapper: {
    marginBottom: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }
      : {
        elevation: 1,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EEF2F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 20px 40px rgba(15, 23, 42, 0.16)' }
      : {
        elevation: 10,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
      }),
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F7ECE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalTitleText: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  closeCircleBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 8,
    position: 'relative',
  },
  logoImg: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#F8FAFC',
    backgroundColor: '#E2E8F0',
  },
  customerName: {
    fontWeight: '800',
    fontSize: 18,
    color: '#0F172A',
    letterSpacing: -0.3,
    marginTop: 4,
  },
  bookingIdPill: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 14,
  },
  infoTile: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 8,
  },
  infoTileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tileIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tileTextCol: {
    flex: 1,
  },
  tileLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  tileValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  attachmentTile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 8,
  },
  attachmentTileTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  attachmentTileSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  directionsText: {
    color: color.defalt,
    fontWeight: '700',
    fontSize: 13,
  },
  btnActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 6,
    gap: 12,
  },
  acceptBtn: {
    flex: 1.2,
    flexDirection: 'row',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14.5,
  },
  rejectBtn: {
    flex: 0.9,
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
});