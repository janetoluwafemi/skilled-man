import React, {useState, useEffect} from 'react';
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
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

import {Icons} from '../../Components/Icons';
import color from '../../Assets/colors/colors';
import {BASIC_URL} from '../Signin/Signin';

const UserProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {userId, userData, provider, item, user} = route.params || {};
  const activeUserObject = userData || provider || item || user || {};

  const userName = activeUserObject?.name || 'User';
  const peerId = String(
    userId ||
    activeUserObject?.id ||
    activeUserObject?.provider_id ||
    activeUserObject?.user_id ||
    activeUserObject?.uuid ||
    '',
  ).trim();
  const currentUserId = global.id;

  const userImage = activeUserObject?.image
    ? `${BASIC_URL}uploads/${activeUserObject.image.replace(/^\/+/, '')}`
    : null;

  const [isChatLocked, setIsChatLocked] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [encryptionVisible, setEncryptionVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [mediaVisible, setMediaVisible] = useState(false);
  const [disappearingVisible, setDisappearingVisible] = useState(false);
  const [createGroupVisible, setCreateGroupVisible] = useState(false);

  const [muteSelection, setMuteSelection] = useState('Off');
  const [mediaSelection, setMediaSelection] = useState('Default (Yes)');
  const [disappearingSelection, setDisappearingSelection] = useState('Off');
  const [newGroupName, setNewGroupName] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    iconName: '',
  });

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const lockedState = await AsyncStorage.getItem(`chat_locked_${peerId}`);
        if (lockedState === 'true') setIsChatLocked(true);

        const blockedState = await AsyncStorage.getItem(
          `user_blocked_${peerId}`,
        );
        if (blockedState === 'true') setIsBlocked(true);

        const mediaPref = await AsyncStorage.getItem(`media_pref_${peerId}`);
        if (mediaPref) setMediaSelection(mediaPref);

        const mutePref = await AsyncStorage.getItem(`mute_pref_${peerId}`);
        if (mutePref) setMuteSelection(mutePref);
      } catch (e) {
        console.log('Error loading preferences', e);
      }
    };
    if (peerId) loadPreferences();
  }, [peerId]);

  const closeMenu = () => setMenuVisible(false);

  const handleScroll = event => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 150 && !isScrolled) setIsScrolled(true);
    else if (scrollY <= 150 && isScrolled) setIsScrolled(false);
  };

  const openConfirmModal = type => {
    closeMenu();
    let title = '',
      message = '',
      iconName = '';

    if (type === 'clear') {
      title = 'Clear chat?';
      message = 'Are you sure you want to clear all chat?';
      iconName = 'trash-2';
    } else if (type === 'block') {
      title = `Block ${userName}?`;
      message = `Blocked contacts will no longer be able to call or send you messages.`;
      iconName = 'slash';
    } else if (type === 'unblock') {
      title = `Unblock ${userName}?`;
      message = `Do you want to allow ${userName} to message you again?`;
      iconName = 'check';
    } else if (type === 'report') {
      title = `Report ${userName}?`;
      message = `Are you sure you want to report this contact?`;
      iconName = 'thumbs-down';
    }

    setConfirmModal({visible: true, type, title, message, iconName});
  };

  const handleConfirmAction = async () => {
    const {type} = confirmModal;
    setConfirmModal({
      visible: false,
      type: '',
      title: '',
      message: '',
      iconName: '',
    });

    try {
      const formData = new FormData();
      formData.append('user_id', currentUserId);
      formData.append('peer_id', peerId);

      if (type === 'clear') {
        await AsyncStorage.removeItem(
          `chat_history_${currentUserId}_${peerId}`,
        );
        Alert.alert('Cleared', 'Chat history has been cleared locally.');
      } else if (type === 'block') {
        await AsyncStorage.setItem(`user_blocked_${peerId}`, 'true');
        setIsBlocked(true);
        Alert.alert('Blocked', `${userName} has been blocked.`);
      } else if (type === 'unblock') {
        await AsyncStorage.removeItem(`user_blocked_${peerId}`);
        setIsBlocked(false);
        Alert.alert('Unblocked', `${userName} has been unblocked.`);
      } else if (type === 'report') {
        const response = await fetch(`${BASIC_URL}report_user.php`, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        Alert.alert(
          'Reported',
          result.message || 'User successfully reported.',
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Failed to process request.');
    }
  };

  const toggleChatLock = async value => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert('Error', 'Biometrics are not set up on this device.');
        return;
      }

      const promptMsg = value
        ? 'Authenticate to lock this chat'
        : 'Authenticate to unlock this chat';
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMsg,
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        setIsChatLocked(value);
        if (value) {
          await AsyncStorage.setItem(`chat_locked_${peerId}`, 'true');
        } else {
          await AsyncStorage.removeItem(`chat_locked_${peerId}`);
        }
      }
    } catch (error) {
      console.log('Biometric error:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (newGroupName.trim() === '') {
      Alert.alert('Error', 'Please enter a group subject');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('creator_id', currentUserId);
      formData.append('participant_id', peerId);
      formData.append('group_name', newGroupName.trim());

      const response = await fetch(`${BASIC_URL}create_group.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      setIsLoading(false);
      setCreateGroupVisible(false);
      setNewGroupName('');

      if (result.status === 'success') {
        navigation.navigate('IndividualChat', {
          receiver_id: result.group_id,
          currentuser: {
            id: result.group_id,
            name: result.group_name,
            image: '',
          },
        });
      } else {
        Alert.alert('Group Created', `You and ${userName} have been added to "${newGroupName}".`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Create group error:', error);
      Alert.alert('Error', 'Could not create group. Check your connection.');
    }
  };

  const saveMediaVisibility = async () => {
    await AsyncStorage.setItem(`media_pref_${peerId}`, mediaSelection);
    setMediaVisible(false);
  };

  const saveMutePreference = async () => {
    await AsyncStorage.setItem(`mute_pref_${peerId}`, muteSelection);
    setNotificationsVisible(false);
  };

  const triggerChatSearch = () => {
    navigation.navigate('IndividualChat', {
      receiver_id: peerId,
      currentuser: activeUserObject,
      startSearch: true,
    });
  };

  const renderRadioOption = (label, currentSelection, onSelect) => (
    <TouchableOpacity style={styles.radioRow} onPress={() => onSelect(label)}>
      <Icons.Ionicons
        name={
          currentSelection === label ? 'radio-button-on' : 'radio-button-off'
        }
        size={24}
        color={currentSelection === label ? color.defalt : '#94A3B8'}
      />
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
                  activeUserObject?.image
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

      {/* Modals */}
      <Modal
        visible={notificationsVisible}
        transparent={true}
        animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.actionModalCard}>
            <Text style={styles.actionModalTitle}>Mute notifications</Text>
            {renderRadioOption('Off', muteSelection, setMuteSelection)}
            {renderRadioOption('8 hours', muteSelection, setMuteSelection)}
            {renderRadioOption('1 week', muteSelection, setMuteSelection)}
            {renderRadioOption('Always', muteSelection, setMuteSelection)}
            <View style={styles.actionModalFooter}>
              <TouchableOpacity onPress={() => setNotificationsVisible(false)}>
                <Text style={styles.actionModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveMutePreference}>
                <Text style={styles.actionModalBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={mediaVisible} transparent={true} animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.actionModalCard}>
            <Text style={styles.actionModalTitle}>
              Show newly downloaded media from this chat in your device's
              gallery?
            </Text>
            {renderRadioOption(
              'Default (Yes)',
              mediaSelection,
              setMediaSelection,
            )}
            {renderRadioOption('Yes', mediaSelection, setMediaSelection)}
            {renderRadioOption('No', mediaSelection, setMediaSelection)}
            <View style={styles.actionModalFooter}>
              <TouchableOpacity onPress={() => setMediaVisible(false)}>
                <Text style={styles.actionModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveMediaVisibility}>
                <Text style={styles.actionModalBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={disappearingVisible}
        transparent={true}
        animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.actionModalCard}>
            <Text style={styles.actionModalTitle}>Message timer</Text>
            <Text style={styles.actionModalSubtitle}>
              For more privacy, new messages will disappear for everyone after
              the selected duration.
            </Text>
            {renderRadioOption(
              '24 hours',
              disappearingSelection,
              setDisappearingSelection,
            )}
            {renderRadioOption(
              '7 days',
              disappearingSelection,
              setDisappearingSelection,
            )}
            {renderRadioOption(
              '90 days',
              disappearingSelection,
              setDisappearingSelection,
            )}
            {renderRadioOption(
              'Off',
              disappearingSelection,
              setDisappearingSelection,
            )}
            <View style={styles.actionModalFooter}>
              <TouchableOpacity onPress={() => setDisappearingVisible(false)}>
                <Text style={styles.actionModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDisappearingVisible(false)}>
                <Text style={styles.actionModalBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* CREATE GROUP MODAL - CLEAN MOBILE DESIGN WITHOUT BLACK BORDER */}
      <Modal
        visible={createGroupVisible}
        transparent={true}
        animationType="slide">
        <SafeAreaView style={styles.fullScreenModalSafe} edges={['top', 'bottom']}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <View style={styles.headerBar}>
            <TouchableOpacity
              onPress={() => setCreateGroupVisible(false)}
              style={styles.iconBtn}>
              <Icons.Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.fullScreenModalTitle}>New group</Text>
            <View style={{flex: 1}} />
          </View>
          <View style={styles.groupCreateBody}>
            <View style={styles.groupParticipantsRow}>
              <Text style={styles.groupParticipantLabel}>Participants: </Text>
              <Text style={styles.groupParticipantNames}>You, {userName}</Text>
            </View>
            <TextInput
              style={styles.groupInput}
              placeholder="Type group subject here..."
              placeholderTextColor="#94A3B8"
              value={newGroupName}
              onChangeText={setNewGroupName}
              autoFocus={true}
            />
          </View>
          <TouchableOpacity
            style={[styles.fabBtn, isLoading && {opacity: 0.7}]}
            onPress={handleCreateGroup}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icons.Ionicons name="checkmark" size={28} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={encryptionVisible}
        transparent={true}
        animationType="slide">
        <SafeAreaView style={styles.fullScreenModalSafe} edges={['top', 'bottom']}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <View style={styles.headerBar}>
            <TouchableOpacity
              onPress={() => setEncryptionVisible(false)}
              style={styles.iconBtn}>
              <Icons.Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.fullScreenModalTitle}>
              Verify security code
            </Text>
            <View style={{flex: 1}} />
          </View>
          <ScrollView contentContainerStyle={styles.encryptionBody}>
            <View style={styles.qrPlaceholder}>
              <Icons.Ionicons
                name="qr-code-outline"
                size={150}
                color="#0F172A"
              />
            </View>
            <Text style={styles.securityCodeText}>
              27189 45912 61234 88123{'\n'}
              99120 45719 33412 11094{'\n'}
              78213 54311 09843 66124
            </Text>
            <Text style={styles.encryptionInfo}>
              To verify that messages and calls with {userName} are end-to-end
              encrypted, scan this code on their device. You can also compare
              the number above.
            </Text>
            <TouchableOpacity style={styles.scanBtn}>
              <Text style={styles.scanBtnText}>Scan Code</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={confirmModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() =>
          setConfirmModal(prev => ({...prev, visible: false}))
        }>
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <View style={styles.popupIconWrapper}>
              <Icons.Feather
                name={confirmModal.iconName}
                size={22}
                color={color.defalt}
              />
            </View>
            <Text style={styles.popupTitle}>{confirmModal.title}</Text>
            <Text style={styles.popupMessage}>{confirmModal.message}</Text>
            <View style={styles.popupButtonsRow}>
              <TouchableOpacity
                style={styles.popupBtnWhite}
                onPress={() =>
                  setConfirmModal(prev => ({...prev, visible: false}))
                }>
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
                activeUserObject?.image
                  ? {uri: userImage}
                  : require('../../Assets/Images/user.jpg')
              }
              style={styles.avatar}
            />
          </View>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileSubText}>
            {isBlocked ? 'Blocked contact' : 'Last seen today at 8:27 AM'}
          </Text>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.circleActionBtn}>
              <Icons.Feather name="phone" size={20} color={color.defalt} />
              <Text style={styles.actionButtonText}>Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleActionBtn}>
              <Icons.Feather name="video" size={20} color={color.defalt} />
              <Text style={styles.actionButtonText}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleActionBtn}
              onPress={triggerChatSearch}>
              <Icons.Feather name="search" size={20} color={color.defalt} />
              <Text style={styles.actionButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setNotificationsVisible(true)}>
            <Icons.Feather
              name="bell"
              size={20}
              color="#64748B"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Mute notifications</Text>
              <Text style={styles.optionSubtitle}>
                {muteSelection === 'Off' ? '' : muteSelection}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setMediaVisible(true)}>
            <Icons.Feather
              name="image"
              size={20}
              color="#64748B"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Media visibility</Text>
              <Text style={styles.optionSubtitle}>
                {mediaSelection === 'Default (Yes)' ? '' : mediaSelection}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setEncryptionVisible(true)}>
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

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setDisappearingVisible(true)}>
            <Icons.Feather
              name="clock"
              size={20}
              color="#64748B"
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Disappearing messages</Text>
              <Text style={styles.optionSubtitle}>{disappearingSelection}</Text>
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
              onValueChange={toggleChatLock}
              trackColor={{false: '#CBD5E1', true: color.defalt}}
              thumbColor={isChatLocked ? '#FFFFFF' : '#F1F5F9'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.footerInfoBox}>
            <Text style={styles.footerInfoText}>No groups in common</Text>
          </View>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setCreateGroupVisible(true)}>
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

          {/* BLOCK / UNBLOCK TOGGLE OPTION */}
          {isBlocked ? (
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => openConfirmModal('unblock')}>
              <Icons.Feather
                name="check"
                size={20}
                color="#10B981"
                style={styles.optionIcon}
              />
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, {color: '#10B981'}]}>
                  Unblock {userName}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
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
          )}

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
                Clear Chat
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
  safeArea: {flex: 1, backgroundColor: '#FFFFFF'},
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
  iconBtn: {padding: 8},
  scrolledTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  smallAvatarContainer: {marginRight: 10},
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CBD5E1',
  },
  scrolledTitleText: {fontSize: 16, fontWeight: '700', color: '#0F172A'},
  modalOverlay: {flex: 1},
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
  menuItem: {paddingVertical: 12, paddingHorizontal: 16},
  menuText: {fontSize: 15, color: '#0F172A', fontWeight: '500'},
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
  popupButtonsRow: {flexDirection: 'row', gap: 10, width: '100%'},
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
  popupBtnWhiteText: {color: '#0F172A', fontSize: 14, fontWeight: '600'},
  popupBtnPrimary: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    backgroundColor: color.defalt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBtnPrimaryText: {color: '#FFFFFF', fontSize: 14, fontWeight: '600'},
  container: {paddingBottom: 40},
  profileInfoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 8,
    borderBottomColor: '#F8FAFC',
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {marginBottom: 16},
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
  profileSubText: {fontSize: 13, color: '#64748B', marginBottom: 20},
  actionButtonsRow: {flexDirection: 'row', justifyContent: 'center', gap: 16},
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
  optionsSection: {backgroundColor: '#FFFFFF'},
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  optionIcon: {marginRight: 16},
  optionTextContainer: {flex: 1},
  optionTitle: {fontSize: 15, color: '#0F172A', fontWeight: '500'},
  optionSubtitle: {fontSize: 13, color: '#64748B', marginTop: 2},
  divider: {height: 8, backgroundColor: '#F8FAFC', marginVertical: 4},
  footerInfoBox: {paddingVertical: 14, paddingHorizontal: 20},
  footerInfoText: {color: '#64748B', fontSize: 13, fontWeight: '500'},
  fullScreenModalSafe: {flex: 1, backgroundColor: '#FFFFFF'},
  fullScreenModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 16,
    flex: 2,
  },
  encryptionBody: {padding: 24, alignItems: 'center'},
  qrPlaceholder: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
  },
  securityCodeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 34,
    marginVertical: 24,
  },
  encryptionInfo: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  scanBtn: {
    backgroundColor: color.defalt,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  scanBtnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '600'},
  groupCreateBody: {padding: 20},
  groupParticipantsRow: {flexDirection: 'row', marginBottom: 20},
  groupParticipantLabel: {fontSize: 15, color: '#64748B'},
  groupParticipantNames: {fontSize: 15, color: '#0F172A', fontWeight: '500'},
  groupInput: {
    borderBottomWidth: 2,
    borderBottomColor: color.defalt,
    fontSize: 16,
    paddingVertical: 10,
    color: '#0F172A',
  },
  fabBtn: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: color.defalt,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  actionModalCard: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  actionModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  actionModalSubtitle: {fontSize: 14, color: '#64748B', marginBottom: 16},
  radioRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 12},
  radioText: {fontSize: 16, color: '#0F172A', marginLeft: 12},
  actionModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 20,
  },
  actionModalBtnText: {fontSize: 14, fontWeight: '600', color: color.defalt},
});
