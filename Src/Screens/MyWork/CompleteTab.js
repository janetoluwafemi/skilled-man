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
import * as Animatable from 'react-native-animatable';
import { showToast } from '../../utilis/showToast';

import FltLstCrd from '../../Components/FlatListCard';
import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import OngoingDrpdwn from '../../Components/OngoingDropdown';
import BotonComp from '../../Components/BtnComp';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const CompleteTab = props => {
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);

  const bottomPadding =
    height * 0.085 + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) + 20;

  const toggleModal = () => {
    setModalVisible(prev => !prev);
  };

  const getCompletedData = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('provider_id', global.id);
      formdata.append('status', 'complete');
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
        console.log(result.error);
      }
    } catch (error) {
      Alert.alert('Error', error?.message || String(error) || 'An error occurred');
    }
  }, [props?.value]);

  useEffect(() => {
    if (focus) {
      getCompletedData();
    }
  }, [focus, getCompletedData]);

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
            status={item.status}
            filepress={item.file}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icons.Feather name="check-circle" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Completed Jobs</Text>
            <Text style={styles.emptySubtitle}>
              Jobs that have been finalized and approved will appear here.
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
          <Animatable.View animation="zoomIn" duration={300} style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitleText}>Job Options</Text>
              <TouchableOpacity onPress={toggleModal}>
                <Icons.Ionicons name="close-circle" color="#94A3B8" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.successmodalBody}>
              <View style={styles.dropdownWrapper}>
                <OngoingDrpdwn />
              </View>
            </View>

            <View style={styles.btnContainer}>
              <BotonComp
                BtnStyle={styles.acceptStyle}
                btnTextStyle={styles.btnTextStyle}
                btnText="Submit"
                onPressFunc={toggleModal}
              />
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

export default CompleteTab;

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    borderRadius: 20,
    width: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
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
  modalTitleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  successmodalBody: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  dropdownWrapper: {
    width: '100%',
  },
  btnContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  acceptStyle: {
    width: '100%',
    backgroundColor: color.defalt,
    borderRadius: 14,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  btnTextStyle: {
    fontSize: 15,
    fontWeight: '700',
  },
});