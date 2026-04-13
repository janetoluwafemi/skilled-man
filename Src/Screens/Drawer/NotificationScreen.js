import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  Pressable,
  Image,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import color from '../../Assets/colors/colors';
import NotiCard from '../../Components/NotificationCard';
import CstmHeader from '../../Components/CustomHeader';
import {BASIC_URL} from '../Signin/Signin';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const NotifiScreen = props => {
  const [notifications, setNotifications] = useState([]);

  // ✅ Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // ✅ Fetch Notifications API
  const fetchNotifications = async () => {
    try {
      const formdata = new FormData();
      formdata.append('own_id', global.id);

      const response = await fetch(
        'https://theskilledman.com/api/firebase/get_notifications.php',
        {
          method: 'POST',
          body: formdata,
        },
      );

      const jsonData = await response.json();

      if (jsonData?.success) {
        setNotifications(jsonData.notifications || []);
      }
    } catch (error) {
      console.log('❌ Notification API Error:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Open Modal
  const openNotification = item => {
    setSelectedNotification(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <CstmHeader
        title="Notifications"
        onPressBack={() => props.navigation.goBack()}
      />

      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={45}
              color={color.gry}
            />
            <Text style={styles.emptyText}>No Notifications Found</Text>
          </View>
        ) : (
          notifications.map(item => (
            <NotiCard
              key={item.notification_id}
              orderPicked={item.sender_name}
              message={item.message}
              time={item.created_at_display}
              source={{
                uri: `${BASIC_URL}uploads/${item.sender_profile}`,
              }}
              onPress={() => openNotification(item)}
            />
          ))
        )}
      </ScrollView>

      {/* ================= MODAL VIEW ================= */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        {/* Background Overlay */}
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}>
          {/* Modal Box */}
          <View style={styles.modalBox}>
            {/* Sender Image */}
            <Image
              source={{
                uri: `${BASIC_URL}uploads/${selectedNotification?.sender_profile}`,
              }}
              style={styles.modalAvatar}
            />

            {/* Sender Name */}
            <Text style={styles.modalName}>
              {selectedNotification?.sender_name}
            </Text>

            {/* Message */}
            <Text style={styles.modalMessage}>
              {selectedNotification?.message}
            </Text>

            {/* Time */}
            <Text style={styles.modalTime}>
              {selectedNotification?.created_at_display}
            </Text>

            {/* Close Button */}
            <Pressable
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}>
              <Text style={{color: 'white', fontWeight: '600'}}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default NotifiScreen;

const styles = StyleSheet.create({
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
  },
  emptyText: {
    marginTop: 10,
    color: color.gry,
    fontSize: 14,
  },

  /* ===== MODAL STYLES ===== */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalBox: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 22,
    alignItems: 'center',
    elevation: 6,
  },

  modalAvatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    marginBottom: 12,
  },

  modalName: {
    fontSize: 17,
    fontWeight: '700',
    color: color.blak,
  },

  modalMessage: {
    fontSize: 14,
    color: color.gry,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },

  modalTime: {
    fontSize: 12,
    marginTop: 12,
    color: color.gry,
  },

  closeBtn: {
    marginTop: 18,
    backgroundColor: color.defalt,
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 6,
  },
});
