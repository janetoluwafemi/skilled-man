import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Image,
  FlatList,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import color from '../../Assets/colors/colors';
import NotiCard from '../../Components/NotificationCard';
import CstmHeader from '../../Components/CustomHeader';
import { BASIC_URL } from '../Signin/Signin';

const NotifiScreen = props => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0) + 20;

  const fetchNotifications = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('own_id', global.id);

      const response = await fetch(
        `${BASIC_URL}firebase/get_notifications.php`,
        {
          method: 'POST',
          body: formdata,
        }
      );

      const jsonData = await response.json();

      if (jsonData?.success) {
        setNotifications(jsonData.notifications || []);
      }
    } catch (error) {
      console.log('Error fetching notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const openNotification = item => {
    setSelectedNotification(item);
    setModalVisible(true);
  };

  const renderNotificationItem = ({ item }) => {
    const avatarUri = item?.sender_profile
      ? `${BASIC_URL}uploads/${item.sender_profile}`
      : null;

    return (
      <NotiCard
        orderPicked={item.sender_name}
        message={item.message}
        time={item.created_at_display}
        source={
          avatarUri
            ? { uri: avatarUri }
            : require('../../Assets/Images/user.jpg')
        }
        onPress={() => openNotification(item)}
      />
    );
  };

  const selectedAvatarUri = selectedNotification?.sender_profile
    ? `${BASIC_URL}uploads/${selectedNotification.sender_profile}`
    : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CstmHeader
        title="Notifications"
        onPressBack={() => props.navigation.goBack()}
      />

      <FlatList
        data={notifications}
        keyExtractor={(item, index) =>
          item.notification_id?.toString() || index.toString()
        }
        renderItem={renderNotificationItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color={color.gry}
            />
            <Text style={styles.emptyText}>No Notifications Found</Text>
          </View>
        }
      />

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalBox}>
            <Image
              source={
                selectedAvatarUri
                  ? { uri: selectedAvatarUri }
                  : require('../../Assets/Images/user.jpg')
              }
              style={styles.modalAvatar}
            />

            <Text style={styles.modalName}>
              {selectedNotification?.sender_name || 'System Notification'}
            </Text>

            <Text style={styles.modalMessage}>
              {selectedNotification?.message}
            </Text>

            <Text style={styles.modalTime}>
              {selectedNotification?.created_at_display}
            </Text>

            <Pressable
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default NotifiScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  listContent: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 12,
    color: color.gry,
    fontSize: 15,
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 22,
    alignItems: 'center',
    elevation: 6,
  },
  modalAvatar: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
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
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});