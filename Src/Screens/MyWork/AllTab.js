import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import color from '../../Assets/colors/colors';
import FltLstCrd from '../../Components/FlatListCard';
import { Icons } from '../../Components/Icons';
import OngoingDrpdwn from '../../Components/OngoingDropdown';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const AlTabs = props => {
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('0');
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const bottomPadding =
    height * 0.085 + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

  const toggleModal = () => {
    setModalVisible(prev => !prev);
  };

  const getData = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('provider_id', global.id);
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
        Toast.show(result.error);
      }
    } catch (error) {
      console.log('Error fetching provider status:', error);
    }
  }, [props?.value]);

  useEffect(() => {
    if (focus) {
      getData();
    }
  }, [focus, getData]);

  const changeStatus = async bookingId => {
    try {
      const formdata = new FormData();
      formdata.append('id', bookingId);
      formdata.append('status', selectedBusiness);

      const response = await fetch(`${BASIC_URL}status_update.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.success) {
        Toast.show(result.success);
        getData();
      } else if (result?.error) {
        Toast.show(result.error);
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'An error occurred');
    }
  };

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
            status={item.status}
            iconName="ellipsis-v"
            onPressShowProfile={() => {
              setSelectedBookingId(item.booking_id);
              toggleModal();
            }}
            filepress={item.file}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookings available</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={toggleModal}>
                <Icons.FontAwesome5 name="times" color={color.wite} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.successmodalBody}>
              <OngoingDrpdwn
                selectedBusiness={selectedBusiness}
                setselectedBusiness={setSelectedBusiness}
              />
            </View>

            <View style={styles.btnContainer}>
              <BotonComp
                BtnStyle={styles.acceptStyle}
                btnTextStyle={styles.btnTextStyle}
                btnText="Submit"
                onPressFunc={() => {
                  if (selectedBookingId) {
                    changeStatus(selectedBookingId);
                    toggleModal();
                  } else {
                    Alert.alert('Please select a booking before submitting.');
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AlTabs;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#FFF',
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
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: color.gry,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    borderRadius: 12,
    width: '85%',
    backgroundColor: color.wite,
    overflow: 'hidden',
    elevation: 5,
  },
  modalHeader: {
    backgroundColor: color.defalt,
    alignItems: 'flex-end',
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  successmodalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  acceptStyle: {
    width: '100%',
  },
  btnTextStyle: {
    fontSize: 14,
  },
});