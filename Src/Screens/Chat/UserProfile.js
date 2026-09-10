import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Icons} from '../../Components/Icons';
import color from '../../Assets/colors/colors';
import {BASIC_URL} from '../Signin/Signin';

const UserProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {userId, userData} = route.params || {};

  const userName = userData?.name || '+852 3575 7577';
  const userImage = userData?.image
    ? `${BASIC_URL}uploads/${userData.image.replace(/^\/+/, '')}`
    : null;

  const [isChatLocked, setIsChatLocked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    type: '',=
    title: '',
    message: '',
    iconName: '',
  });

  const closeMenu = () => setMenuVisible(false);

  const handleScroll = event => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 150 && !isScrolled) {
      setIsScrolled(true);
    } else if (scrollY <= 150 && isScrolled) {
      setIsScrolled(false);
    }
  };

  const openConfirmModal = (type) => {
    closeMenu();
    let title = '';
    let message = '';
    let iconName = '';

    if (type === 'clear') {
      title = 'Clear chat?';
      message = 'Are you sure you want to clear all chat?';
      iconName = 'trash-2';
    } else if (type === 'block') {
      title = `Block ${userName}?`;
      message = `Are you sure you want to block this user? Blocked contacts will no longer be able to call or send you messages.`;
      iconName = 'slash';
    } else if (type === 'report') {
      title = `Report ${userName}?`;
      message = `Are you sure you want to report this contact?`;
      iconName = 'thumbs-down';
    }

    setConfirmModal({
      visible: true,
      type,
      title,
      message,
      iconName,
    });
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === 'clear') {
      console.log('Chat cleared successfully');
    } else if (confirmModal.type === 'block') {
      console.log('User blocked');
    } else if (confirmModal.type === 'report') {
      console.log('User reported');
    }
    setConfirmModal({visible: false, type: '', title: '', message: '', iconName: ''});
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {isSearchActive ? (
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => setIsSearchActive(false)}
            style={styles.iconBtn}>
            <Icons.Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={true}
          />
          <TouchableOpacity style={styles.iconBtn}>
            <Icons.Feather name="calendar" size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}>
            <Icons.Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          {isScrolled ? (
            <View style={styles.scrolledTitleContainer}>
              <View style={styles.smallAvatarContainer}>
                <Image
                  source={
                    userData?.image
                      ? {uri: userImage}
                      : require('../../Assets/Images/user.jpg')
                  }
                  style={styles.smallAvatar}
                />
              </View>
              <Text style={styles.scrolledTitleText} numberOfLines={1}>
                {userName}
              </Text>
            </View>
          ) : (
            <View style={{flex: 1}} />
          )}

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setMenuVisible(true)}>
            <Icons.Feather name="more-vertical" size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}>
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>View in address book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={confirmModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmModal(prev => ({...prev, visible: false}))}>
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <View style={styles.popupIconWrapper}>
              <Icons.Feather name={confirmModal.iconName} size={22} color={color.defalt} />
            </View>
            <Text style={styles.popupTitle}>{confirmModal.title}</Text>
            <Text style={styles.popupMessage}>{confirmModal.message}</Text>

            <View style={styles.popupButtonsRow}>
              <TouchableOpacity
                style={styles.popupBtnWhite}
                onPress={() => setConfirmModal(prev => ({...prev, visible: false}))}>
                <Text style={styles.popupBtnWhiteText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.popupBtnPrimary}
                onPress={handleConfirmAction}>
                <Text style={styles.popupBtnPrimaryText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <View style={styles.profileInfoSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                userData?.image
                  ? {uri: userImage}
                  : require('../../Assets/Images/user.jpg')
              }
              style={styles.avatar}
            />
          </View>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileSubText}>Last seen today at 8:27 AM</Text>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.circleActionBtn}>
              <Icons.Feather name="phone" size={20} color={color.defalt} />
              <Text style={styles.actionButtonText}>Voice</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleActionBtn}>
              <Icons.Feather name="video" size={20} color={color.defalt} />
              <Text style={styles.actionButtonText}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.circleActionBtn}
              onPress={() => setIsSearchActive(true)}>
              <Icons.Feather name="search" size={20} color={color.defalt} />
              <Text style={styles.actionButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionItem}>
            <Icons.Feather
              name="bell"
              size={20}
              color="#64748B"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Notifications</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Icons.Feather
              name="image"
              size={20}
              color="#64748B"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Media visibility</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.optionItem}>
            <Icons.Feather
              name="lock"
              size={20}
              color="#64748B"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Encryption</Text>
              <Text style={styles.optionSubtitle}>
                Messages and calls are end-to-end encrypted. Tap to verify.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Icons.Feather
              name="clock"
              size={20}
              color="#64748B"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Disappearing messages</Text>
              <Text style={styles.optionSubtitle}>Off</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.optionItem}>
            <Icons.Feather
              name="shield"
              size={20}
              color="#64748B"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Chat lock</Text>
              <Text style={styles.optionSubtitle}>
                Lock and hide this chat on this device.
              </Text>
            </View>
            <Switch
              value={isChatLocked}
              onValueChange={setIsChatLocked}
              trackColor={{false: '#CBD5E1', true: color.defalt}}
              thumbColor={isChatLocked ? '#FFFFFF' : '#F1F5F9'}
            />
          </View>

          <TouchableOpacity style={styles.optionItem}>
            <Icons.Feather
              name="shield-off"
              size={20}
              color="#64748B"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Advanced chat privacy</Text>
              <Text style={styles.optionSubtitle}>Off</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.footerInfoBox}>
            <Text style={styles.footerInfoText}>No groups in common</Text>
          </View>

          <TouchableOpacity style={styles.optionItem}>
            <Icons.Feather
              name="users"
              size={20}
              color={color.defalt}
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, {color: color.defalt}]}>
                Create group with {userName}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Icons.Feather
              name="user-plus"
              size={20}
              color="#64748B"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Add to list</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => openConfirmModal('clear')}>
            <Icons.Feather
              name="trash-2"
              size={20}
              color="#EF4444"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, {color: '#EF4444'}]}>
                Clear chat
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => openConfirmModal('block')}>
            <Icons.Feather
              name="slash"
              size={20}
              color="#EF4444"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, {color: '#EF4444'}]}>
                Block {userName}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => openConfirmModal('report')}>
            <Icons.Feather
              name="thumbs-down"
              size={20}
              color="#EF4444"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, {color: '#EF4444'}]}>
                Report {userName}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
  },
  iconBtn: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#0F172A',
    marginHorizontal: 8,
    ...(Platform.OS === 'web' && {outlineWidth: 0}),
  },
  scrolledTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  smallAvatarContainer: {
    marginRight: 10,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CBD5E1',
  },
  scrolledTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalOverlay: {
    flex: 1,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 55,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  // Compact Popup Modal Styles matching your reference scale
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  popupCard: {
    width: '78%',
    maxWidth: 290,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  popupIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  popupMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  popupButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  popupBtnWhite: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBtnWhiteText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
  },
  popupBtnPrimary: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: color.defalt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    paddingBottom: 40,
  },
  profileInfoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 8,
    borderBottomColor: '#F8FAFC',
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#CBD5E1',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  profileSubText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  circleActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionButtonText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  optionsSection: {
    backgroundColor: '#FFFFFF',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 8,
    backgroundColor: '#F8FAFC',
    marginVertical: 4,
  },
  footerInfoBox: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  footerInfoText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
  },
});