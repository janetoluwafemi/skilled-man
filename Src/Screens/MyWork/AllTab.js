import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  Modal,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {showToast} from '../../utilis/showToast';

import color from '../../Assets/colors/colors';
import {Icons} from '../../Components/Icons';
import OngoingDrpdwn from '../../Components/OngoingDropdown';
import BotonComp from '../../Components/BtnComp';
import {getBookings, updateBookingStatus} from '../../utilis/providerStatus';

const AllTabs = ({value = ''}) => {
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const {height, width} = useWindowDimensions();

  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('0');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const bottomPadding =
      height * 0.085 +
      Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0) +
      24;

  const toggleModal = () => {
    setModalVisible(prev => !prev);
  };

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      setData(await getBookings({searchTerm: value}));
    } catch (error) {
      console.log('Error fetching provider status:', error);
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

  const changeStatus = async bookingId => {
    try {
      if (!selectedBusiness || selectedBusiness === '0') {
        Alert.alert('Please select a booking status.');
        return;
      }

      await updateBookingStatus(bookingId, selectedBusiness);
      setSelectedBookingId(null);
      setSelectedBusiness('0');
      setModalVisible(false);

      showToast('Booking status updated successfully');
      await getData();
    } catch (error) {
      Alert.alert('Error', error?.message || 'An error occurred');
    }
  };

  const modalWidth = Math.min(width * 0.9, 400);

  const renderAllCard = ({item}) => {
    let statusColor = '#3B82F6';
    let statusBg = '#EFF6FF';
    let statusIcon = 'inbox';

    const statusLower = item?.status?.toLowerCase() || '';
    if (statusLower === 'complete' || statusLower === 'completed') {
      statusColor = '#10B981';
      statusBg = '#ECFDF5';
      statusIcon = 'check';
    } else if (statusLower === 'progress' || statusLower === 'ongoing') {
      statusColor = '#EA580C';
      statusBg = '#FFF7ED';
      statusIcon = 'clock';
    }

    return (
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <View style={styles.userInfo}>
              <View style={[styles.avatar, {backgroundColor: statusBg}]}>
                <Icons.Feather name={statusIcon} size={18} color={statusColor} />
              </View>
              <View>
                <Text style={styles.customerName}>{item.name || 'Customer'}</Text>
                <Text style={styles.bookingId}>Booking ID: {item.booking_id}</Text>
              </View>
            </View>

            <TouchableOpacity
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                onPress={() => {
                  setSelectedBookingId(item.booking_id);
                  setSelectedBusiness('0');
                  toggleModal();
                }}
                style={styles.actionButton}>
              <Icons.FontAwesome name="ellipsis-v" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.cardFooter}>
            <View style={styles.dateTimeWrapper}>
              <View style={styles.iconRow}>
                <Icons.Feather name="calendar" size={14} color="#64748B" />
                <Text style={styles.dateTimeText}>{item.service_date}</Text>
              </View>
              <View style={styles.dot} />
              <View style={styles.iconRow}>
                <Icons.Feather name="clock" size={14} color="#64748B" />
                <Text style={styles.dateTimeText}>{item.service_time}</Text>
              </View>
            </View>

            <View style={[styles.statusPill, {backgroundColor: statusBg}]}>
              <Text style={[styles.statusText, {color: statusColor}]}>
                {item.status || 'Pending'}
              </Text>
            </View>
          </View>
        </View>
    );
  };

  return (
      <View style={styles.flexContainer}>
        <FlatList
            data={data}
            refreshing={loading}
            onRefresh={getData}
            keyExtractor={(item, index) =>
                item.booking_id?.toString() || index.toString()
            }
            contentContainerStyle={[
              styles.listContent,
              {paddingBottom: bottomPadding},
            ]}
            showsVerticalScrollIndicator={false}
            renderItem={renderAllCard}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icons.Feather name="inbox" size={54} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Bookings Available</Text>
                <Text style={styles.emptySubtitle}>
                  All incoming service bookings will appear here.
                </Text>
              </View>
            }
        />

        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={toggleModal}>
          <View style={styles.modalOverlay}>
            <Animatable.View
                animation="zoomIn"
                duration={300}
                style={[styles.modalView, {width: modalWidth}]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitleText}>Update Booking</Text>
                <TouchableOpacity
                    onPress={toggleModal}
                    hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                  <Icons.Ionicons name="close-circle" color="#94A3B8" size={26} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.dropdownWrapper}>
                  <OngoingDrpdwn
                      selectedBusiness={selectedBusiness}
                      setselectedBusiness={setSelectedBusiness}
                  />
                </View>
              </View>

              <View style={styles.btnContainer}>
                <BotonComp
                    BtnStyle={styles.acceptStyle}
                    btnTextStyle={styles.btnTextStyle}
                    btnText="Update Status"
                    onPressFunc={() => {
                      if (!selectedBookingId) {
                        Alert.alert('Please select a booking before submitting.');
                        return;
                      }

                      changeStatus(selectedBookingId);
                    }}
                />
              </View>
            </Animatable.View>
          </View>
        </Modal>
      </View>
  );
};

export default AllTabs;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
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
  actionButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalBody: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    width: '100%',
  },
  dropdownWrapper: {
    width: '100%',
  },
  btnContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  acceptStyle: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: color.defalt,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  btnTextStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});