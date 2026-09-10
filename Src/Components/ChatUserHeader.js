import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icons} from './Icons';

const ChatUserHeader = ({
  userName,
  userImage,
  onlineStatus,
  onProfilePress,
}) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}>
        <Icons.Ionicons name="arrow-back" size={24} color="#0F172A" />
      </TouchableOpacity>

      {/* Wrapped in TouchableOpacity to handle profile clicks */}
      <TouchableOpacity
        style={styles.profileSection}
        activeOpacity={0.7}
        onPress={onProfilePress}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              userImage
                ? {uri: userImage}
                : require('../Assets/Images/user.jpg') // Make sure this path is correct for your structure
            }
            style={styles.avatar}
          />
          {onlineStatus ? <View style={styles.onlineBadge} /> : null}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {userName || 'User'}
          </Text>
          <Text style={styles.statusText}>
            {onlineStatus ? 'Online' : 'Offline'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.headerRightActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Icons.Feather name="video" size={22} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Icons.Feather name="phone" size={20} color="#0F172A" />
        </TouchableOpacity>
        {/* Triggers the Dropdown Menu */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setMenuVisible(true)}>
          <Icons.Feather name="more-vertical" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}>
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>New group</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>Add to contacts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>Media, links, and docs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>Mute notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>Disappearing messages</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>Chat theme</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemMore]}
                onPress={closeMenu}>
                <Text style={styles.menuText}>More</Text>
                <Icons.Feather name="chevron-right" size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ChatUserHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    zIndex: 1,
  },
  backBtn: {
    paddingRight: 8,
  },
  profileSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CBD5E1',
  },
  onlineBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
  },
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 220,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemMore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '400',
  },
});
