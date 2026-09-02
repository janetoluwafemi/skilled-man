import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import NotiCard from '../../Components/NotificationCard';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const NotificationScreen = props => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0) + 20;

  const fetchNotifications = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('own_id', String(global?.id || '256'));
      // Default integration of required params from API contract
      formdata.append('only_unread', '0'); // set '1' to fetch only unread if you add a toggle
      formdata.append('limit', '50');
      formdata.append('offset', '0');

      const response = await fetch(
        `${BASIC_URL}firebase/get_notifications.php`,
        {
          method: 'POST',
          body: formdata,
        }
      );

      const jsonData = await response.json();

      if (jsonData?.success) {
        const list = Array.isArray(jsonData.notifications) ? jsonData.notifications : [];
        setNotifications(list);

        // Compute unread count for potential badge counters
        try {
          const unread = list.reduce((acc, n) => {
            const isUnread =
              String(n?.is_read ?? n?.read_status ?? '0') === '0';
            return acc + (isUnread ? 1 : 0);
          }, 0);
          global.unreadnotification = unread;
        } catch (e) {
          // ignore counter calculation errors
        }
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
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.navigation.goBack()}
          style={styles.backArrowBtn}>
          <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

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
            <Icons.Feather
              name="bell-off"
              size={48}
              color="#CBD5E1"
            />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You do not have any new updates or alerts right now.
            </Text>
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

export default NotificationScreen;

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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    marginTop: 14,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modalAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  modalName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalMessage: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalTime: {
    fontSize: 12,
    marginTop: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: color.defalt,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 14,
    elevation: 3,
    shadowColor: color.defalt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
