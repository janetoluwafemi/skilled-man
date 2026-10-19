import React, {useState, useEffect, useRef} from 'react';
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
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library/legacy';

import {Icons} from '../../Components/Icons';
import color from '../../Assets/colors/colors';
import {BASIC_URL} from '../Signin/Signin';
import {
  blockChatUser,
  clearChat,
  getChatMessages,
  getChatResultItems,
  getBlockedChatUsers,
  reportChatUser,
  unblockChatUser,
} from '../../utilis/chatApi';

const EMPTY_PROFILE = {};

const extractChatMediaUris = messages => {
  const mediaUris = [];
  const mediaFields = [
    'image',
    'image_url',
    'photo',
    'photo_url',
    'video',
    'video_url',
    'media_url',
    'file_url',
    'attachment',
    'file',
    'media',
  ];

  messages.forEach(message => {
    if (!message || typeof message !== 'object') {
      return;
    }

    mediaFields.forEach(field => {
      const value = message[field];
      const candidate =
        typeof value === 'string'
          ? value
          : value && typeof value === 'object'
            ? value.uri || value.url || value.path
            : null;
      if (typeof candidate !== 'string' || !candidate.trim()) {
        return;
      }

      const mediaType = String(
        value?.mimeType || value?.type || message.mimeType || message.type || '',
      ).toLowerCase();
      const isKnownMediaField = [
        'image',
        'image_url',
        'photo',
        'photo_url',
        'video',
        'video_url',
      ].includes(field);
      const isMediaMimeType =
        mediaType.startsWith('image/') || mediaType.startsWith('video/');
      const isMediaFile = /\.(jpe?g|png|gif|webp|heic|heif|mp4|mov|m4v|webm)(?:[?#]|$)/i.test(
        candidate,
      );
      if (isKnownMediaField || isMediaMimeType || isMediaFile) {
        mediaUris.push({
          uri: candidate.trim(),
          isVideo:
            field === 'video' ||
            field === 'video_url' ||
            mediaType.startsWith('video/'),
        });
      }
    });
  });

  return [...new Map(mediaUris.map(media => [media.uri, media])).values()];
};

const getProfilePhone = (...profiles) => {
  const phoneFields = [
    'phone_number',
    'phone',
    'user_number',
    'mobile_number',
    'mobile',
    'contact_number',
  ];
  const nestedKeys = ['data', 'user', 'profile', 'provider'];

  for (const profile of profiles) {
    if (!profile || typeof profile !== 'object') {
      continue;
    }
    const candidates = [
      profile,
      ...nestedKeys
        .map(key => profile[key])
        .filter(value => value && typeof value === 'object'),
    ];
    for (const candidate of candidates) {
      for (const field of phoneFields) {
        const value = candidate[field];
        if (typeof value === 'string' || typeof value === 'number') {
          const phone = String(value).trim();
          if (phone) {
            return phone;
          }
        }
      }
    }
  }
  return '';
};

const UserProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {userId, userData, provider, item, user} = route.params || {};
  const activeUserObject = userData || provider || item || user || EMPTY_PROFILE;

  const userName = activeUserObject?.name || 'User';
  const peerId = String(
    userId ||
    activeUserObject?.id ||
    activeUserObject?.provider_id ||
    activeUserObject?.user_id ||
    activeUserObject?.uuid ||
    '',
  ).trim();
  const [currentUserId, setCurrentUserId] = useState(String(global.id || ''));
  const [peerProfile, setPeerProfile] = useState(activeUserObject);
  const [voiceCallLoading, setVoiceCallLoading] = useState(false);
  const voiceCallInProgressRef = useRef(false);

  const userImage = activeUserObject?.image
    ? `${BASIC_URL}uploads/${activeUserObject.image.replace(/^\/+/, '')}`
    : null;

  const [isChatLocked, setIsChatLocked] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [encryptionVisible, setEncryptionVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [mediaVisible, setMediaVisible] = useState(false);
  const [disappearingVisible, setDisappearingVisible] = useState(false);

  const [muteSelection, setMuteSelection] = useState('Off');
  const [mediaSelection, setMediaSelection] = useState('Default (Yes)');
  const [disappearingSelection, setDisappearingSelection] = useState('Off');
  const [chatTheme, setChatTheme] = useState('Default Light');
  const [mediaSaving, setMediaSaving] = useState(false);
  const isDarkTheme = chatTheme === 'Dark Mode';

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    type: '',
    title: '',
    message: '',
    iconName: '',
  });

  useEffect(() => {
    let isCurrent = true;
    setPeerProfile(activeUserObject);
    const fetchPeerProfile = async () => {
      if (!peerId) {
        return;
      }
      try {
        const response = await fetch(
          `${BASIC_URL}user/get_profile.php?id=${encodeURIComponent(peerId)}`,
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.error || 'Unable to load contact profile.');
        }
        if (isCurrent) {
          setPeerProfile(
            result?.data && typeof result.data === 'object'
              ? {...activeUserObject, ...result.data}
              : {...activeUserObject, ...result},
          );
        }
      } catch (error) {
        console.log('Error fetching contact profile:', error);
      }
    };
    fetchPeerProfile();
    return () => {
      isCurrent = false;
    };
  }, [activeUserObject, peerId]);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const rawUser = await AsyncStorage.getItem('user');
        if (rawUser) {
          const savedUser = JSON.parse(rawUser);
          const savedId =
            savedUser?.id ||
            savedUser?.user_id ||
            savedUser?.userId ||
            savedUser?.data?.id ||
            savedUser?.data?.user_id;
          if (savedId) {
            setCurrentUserId(String(savedId));
            global.id = String(savedId);
          }
        }

        const lockedState = await AsyncStorage.getItem(`chat_locked_${peerId}`);
        if (lockedState === 'true') setIsChatLocked(true);

        const blockedState = await AsyncStorage.getItem(`user_blocked_${peerId}`);
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

  useEffect(() => {
    if (!currentUserId || !peerId) {
      return undefined;
    }

    let isCurrent = true;
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(
          `chat_theme_${currentUserId}_${peerId}`,
        );
        if (
          isCurrent &&
          (savedTheme === 'Default Light' || savedTheme === 'Dark Mode')
        ) {
          setChatTheme(savedTheme);
        }
      } catch (error) {
        console.error('Unable to load chat theme:', error);
      }
    };

    loadTheme();
    const unsubscribe = navigation.addListener('focus', loadTheme);
    return () => {
      isCurrent = false;
      unsubscribe();
    };
  }, [currentUserId, navigation, peerId]);

  useEffect(() => {
    if (!currentUserId || !peerId) return;

    getBlockedChatUsers(currentUserId)
      .then(result => {
        const blockedUsers = result?.blocked_users || result?.blocked || result?.data || [];
        const isServerBlocked = Array.isArray(blockedUsers)
          ? blockedUsers.some(item =>
              String(item?.blocked_id || item?.user_id || item?.id) === peerId
            )
          : false;
        setIsBlocked(isServerBlocked);
        if (isServerBlocked) {
          AsyncStorage.setItem(`user_blocked_${peerId}`, 'true').catch(error =>
            console.log('Error saving blocked state:', error)
          );
        }
      })
      .catch(error => console.log('Error loading blocked users:', error));
  }, [currentUserId, peerId]);

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
      if (!currentUserId || !peerId) {
        throw new Error('A valid user and contact are required.');
      }

      if (type === 'clear') {
        await clearChat(currentUserId, peerId);
        await AsyncStorage.removeItem(
          `chat_history_${currentUserId}_${peerId}`,
        );
        Alert.alert('Cleared', 'Chat history has been cleared.');
      } else if (type === 'block') {
        await blockChatUser(currentUserId, peerId);
        await AsyncStorage.setItem(`user_blocked_${peerId}`, 'true');
        setIsBlocked(true);
        Alert.alert('Blocked', `${userName} has been blocked.`);
      } else if (type === 'unblock') {
        await unblockChatUser(currentUserId, peerId);
        await AsyncStorage.removeItem(`user_blocked_${peerId}`);
        setIsBlocked(false);
        Alert.alert('Unblocked', `${userName} has been unblocked.`);
      } else if (type === 'report') {
        const result = await reportChatUser(
          currentUserId,
          peerId,
          'Harassment',
          `Report submitted for ${userName}.`,
        );
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

  const saveMediaVisibility = async () => {
    setMediaSaving(true);
    try {
      await AsyncStorage.setItem(`media_pref_${peerId}`, mediaSelection);

      if (mediaSelection === 'No') {
        setMediaVisible(false);
        return;
      }

      if (Platform.OS === 'web') {
        throw new Error('Saving chat media to your gallery is only supported in the mobile app.');
      }
      if (!currentUserId || !peerId) {
        throw new Error('Unable to identify this chat.');
      }

      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (!permission.granted) {
        throw new Error('Photo library permission is required to save chat media.');
      }

      const historyKey = `chat_history_${currentUserId}_${peerId}`;
      const savedMediaKey = `chat_gallery_saved_${currentUserId}_${peerId}`;
      const [storedHistory, storedSavedMedia] = await Promise.all([
        AsyncStorage.getItem(historyKey),
        AsyncStorage.getItem(savedMediaKey),
      ]);
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      if (!Array.isArray(history)) {
        throw new Error('Chat history is not in a valid format.');
      }

      let serverMessages = [];
      try {
        const result = await getChatMessages(
          currentUserId,
          peerId,
          currentUserId,
        );
        serverMessages = getChatResultItems(result);
      } catch (error) {
        console.warn('Unable to load server chat media; using local history:', error);
      }

      const alreadySaved = new Set(
        storedSavedMedia ? JSON.parse(storedSavedMedia) : [],
      );
      const mediaUris = extractChatMediaUris([...history, ...serverMessages]);
      const mediaToSave = mediaUris.filter(media => !alreadySaved.has(media.uri));
      if (mediaToSave.length === 0) {
        setMediaVisible(false);
        Alert.alert('Media visibility saved', 'There are no new chat photos or videos to save.');
        return;
      }

      const savedUris = [];
      const errors = [];
      for (const [index, media] of mediaToSave.entries()) {
        const {uri, isVideo} = media;
        try {
          let localUri = uri;
          if (/^https?:\/\//i.test(uri)) {
            const path = uri.split('?')[0].split('#')[0];
            const extensionMatch = path.match(/\.([a-z0-9]{2,5})$/i);
            const extension = extensionMatch
              ? extensionMatch[1].toLowerCase()
              : isVideo
                ? 'mp4'
                : 'jpg';
            if (!FileSystem.cacheDirectory) {
              throw new Error('A temporary folder is unavailable for media download.');
            }
            const fileUri = `${FileSystem.cacheDirectory}chat_media_${Date.now()}_${index}.${extension}`;
            const download = await FileSystem.downloadAsync(uri, fileUri);
            if (download.status < 200 || download.status >= 300) {
              throw new Error(`Media download failed (${download.status}).`);
            }
            localUri = download.uri;
          } else if (!/^(file|content):\/\//i.test(uri)) {
            const relativeUri = uri.replace(/^\/+/, '');
            const remoteUri = /^uploads\//i.test(relativeUri)
              ? `${BASIC_URL}${relativeUri}`
              : `${BASIC_URL}uploads/${relativeUri}`;
            const path = remoteUri.split('?')[0].split('#')[0];
            const extensionMatch = path.match(/\.([a-z0-9]{2,5})$/i);
            const extension = extensionMatch
              ? extensionMatch[1].toLowerCase()
              : isVideo
                ? 'mp4'
                : 'jpg';
            if (!FileSystem.cacheDirectory) {
              throw new Error('A temporary folder is unavailable for media download.');
            }
            const fileUri = `${FileSystem.cacheDirectory}chat_media_${Date.now()}_${index}.${extension}`;
            const download = await FileSystem.downloadAsync(remoteUri, fileUri);
            if (download.status < 200 || download.status >= 300) {
              throw new Error(`Media download failed (${download.status}).`);
            }
            localUri = download.uri;
          }

          await MediaLibrary.saveToLibraryAsync(localUri);
          savedUris.push(uri);
        } catch (error) {
          console.error('Unable to save chat media:', error);
          errors.push(uri);
        }
      }

      if (savedUris.length > 0) {
        await AsyncStorage.setItem(
          savedMediaKey,
          JSON.stringify([...alreadySaved, ...savedUris]),
        );
      }
      setMediaVisible(false);
      if (errors.length > 0) {
        Alert.alert(
          'Some media could not be saved',
          `${savedUris.length} of ${mediaToSave.length} items were saved. Check your connection and try again for the remaining media.`,
        );
      } else {
        Alert.alert(
          'Media saved',
          `${savedUris.length} ${savedUris.length === 1 ? 'item was' : 'items were'} saved to your gallery.`,
        );
      }
    } catch (error) {
      console.error('Unable to update media visibility:', error);
      Alert.alert(
        'Unable to save media',
        error?.message || 'Please try again.',
      );
    } finally {
      setMediaSaving(false);
    }
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

  const startVoiceCall = async () => {
    if (voiceCallInProgressRef.current) {
      return;
    }

    voiceCallInProgressRef.current = true;
    setVoiceCallLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        throw new Error('Your account details are unavailable. Please sign in again.');
      }
      const callerProfile = JSON.parse(storedUser);
      const callerPhone = getProfilePhone(callerProfile);
      let recipientPhone = getProfilePhone(peerProfile, activeUserObject);

      if (!recipientPhone && peerId) {
        const profileResponse = await fetch(
          `${BASIC_URL}user/get_profile.php?id=${encodeURIComponent(peerId)}`,
        );
        const profileResult = await profileResponse.json();
        if (!profileResponse.ok) {
          throw new Error(
            profileResult?.error || 'Unable to load the recipient phone number.',
          );
        }
        setPeerProfile(
          profileResult?.data && typeof profileResult.data === 'object'
            ? {...activeUserObject, ...profileResult.data}
            : {...activeUserObject, ...profileResult},
        );
        recipientPhone = getProfilePhone(profileResult);
      }

      if (!callerPhone || !recipientPhone) {
        throw new Error(
          !callerPhone && !recipientPhone
            ? 'Phone numbers are missing for both call participants.'
            : !callerPhone
              ? 'Your phone number is missing from your profile.'
              : 'The recipient phone number is missing from their profile.',
        );
      }

      const response = await fetch(`${BASIC_URL}make-call`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          caller_id: currentUserId,
          peer_id: peerId,
          from: callerPhone,
          to: recipientPhone,
        }),
      });
      const responseText = await response.text();
      let result;
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error('The call service returned an invalid response.');
      }

      const callStatus = String(
        result?.status || result?.call_status || '',
      ).toLowerCase();
      const callFailed =
        !response.ok ||
        result?.error ||
        result?.success === false ||
        String(result?.success).toLowerCase() === 'false' ||
        ['error', 'failed', 'failure', 'rejected'].includes(callStatus);

      if (callFailed) {
        throw new Error(
          result?.error || result?.message || 'Unable to start the voice call.',
        );
      }
      Alert.alert(
        'Call requested',
        result?.message || 'Your voice call request has been sent.',
      );
    } catch (error) {
      Alert.alert(
        'Unable to make call',
        error?.message || 'Please try again in a moment.',
      );
    } finally {
      voiceCallInProgressRef.current = false;
      setVoiceCallLoading(false);
    }
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
      <Text
        style={[
          styles.radioText,
          isDarkTheme && {color: '#F8FAFC'},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isDarkTheme && {backgroundColor: '#0B1220'},
      ]}
      edges={['top', 'bottom']}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkTheme ? '#111827' : '#FFFFFF'}
      />

      <View
        style={[
          styles.headerBar,
          isDarkTheme && {
            backgroundColor: '#111827',
            borderBottomColor: '#334155',
          },
        ]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}>
          <Icons.Ionicons
            name="arrow-back"
            size={24}
            color={isDarkTheme ? '#F8FAFC' : '#0F172A'}
          />
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
            <Text
              style={[
                styles.scrolledTitleText,
                isDarkTheme && {color: '#F8FAFC'},
              ]}
              numberOfLines={1}>
              {userName}
            </Text>
          </View>
        ) : (
          <View style={{flex: 1}} />
        )}

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setMenuVisible(true)}>
          <Icons.Feather
            name="more-vertical"
            size={22}
            color={isDarkTheme ? '#F8FAFC' : '#0F172A'}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeMenu}>
          <View
            style={[
              styles.dropdownMenu,
              isDarkTheme && {backgroundColor: '#1F2937'},
            ]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                // Add Share functionality logic here if needed
              }}>
              <Text
                style={[
                  styles.menuText,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                Share
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                // Add View in Address Book logic here if needed
              }}>
              <Text
                style={[
                  styles.menuText,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                View in address book
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                setEncryptionVisible(true);
              }}>
              <Text
                style={[
                  styles.menuText,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                Verify security code
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={notificationsVisible}
        transparent={true}
        animationType="fade">
        <View style={styles.popupOverlay}>
          <View
            style={[
              styles.actionModalCard,
              isDarkTheme && {backgroundColor: '#1F2937'},
            ]}>
            <Text
              style={[
                styles.actionModalTitle,
                isDarkTheme && {color: '#F8FAFC'},
              ]}>
              Mute notifications
            </Text>
            {renderRadioOption('Off', muteSelection, setMuteSelection)}
            {renderRadioOption('8 hours', muteSelection, setMuteSelection)}
            {renderRadioOption('1 week', muteSelection, setMuteSelection)}
            {renderRadioOption('Always', muteSelection, setMuteSelection)}
            <View style={styles.actionModalFooter}>
              <TouchableOpacity onPress={() => setNotificationsVisible(false)}>
                  <Text
                    style={[
                      styles.actionModalBtnText,
                      isDarkTheme && {color: '#F8FAFC'},
                    ]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveMutePreference}
                  style={styles.actionModalConfirmButton}>
                  <Text
                    style={[
                      styles.actionModalBtnText,
                      isDarkTheme && {color: '#F8FAFC'},
                    ]}>
                    OK
                  </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={mediaVisible} transparent={true} animationType="fade">
        <View style={styles.popupOverlay}>
          <View
            style={[
              styles.actionModalCard,
              isDarkTheme && {backgroundColor: '#1F2937'},
            ]}>
            <Text
              style={[
                styles.actionModalTitle,
                isDarkTheme && {color: '#F8FAFC'},
              ]}>
              Save photos and videos from this chat to your device's gallery?
            </Text>
            {renderRadioOption(
              'Default (Yes)',
              mediaSelection,
              setMediaSelection,
            )}
            {renderRadioOption('Yes', mediaSelection, setMediaSelection)}
            {renderRadioOption('No', mediaSelection, setMediaSelection)}
            <View style={styles.actionModalFooter}>
              <TouchableOpacity
                disabled={mediaSaving}
                onPress={() => setMediaVisible(false)}>
                <Text
                  style={[
                    styles.actionModalBtnText,
                    isDarkTheme && {color: '#F8FAFC'},
                  ]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={mediaSaving}
                onPress={saveMediaVisibility}
                style={styles.actionModalConfirmButton}>
                {mediaSaving ? (
                  <ActivityIndicator color={color.defalt} />
                ) : (
                  <Text
                    style={[
                      styles.actionModalBtnText,
                      isDarkTheme && {color: '#F8FAFC'},
                    ]}>
                    OK
                  </Text>
                )}
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
          <View
            style={[
              styles.actionModalCard,
              isDarkTheme && {backgroundColor: '#1F2937'},
            ]}>
            <Text
              style={[
                styles.actionModalTitle,
                isDarkTheme && {color: '#F8FAFC'},
              ]}>
              Message timer
            </Text>
            <Text
              style={[
                styles.actionModalSubtitle,
                isDarkTheme && {color: '#CBD5E1'},
              ]}>
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
              <TouchableOpacity
                onPress={() => setDisappearingVisible(false)}>
                  <Text
                    style={[
                      styles.actionModalBtnText,
                      isDarkTheme && {color: '#F8FAFC'},
                    ]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDisappearingVisible(false)}
                  style={styles.actionModalConfirmButton}>
                  <Text
                    style={[
                      styles.actionModalBtnText,
                      isDarkTheme && {color: '#F8FAFC'},
                    ]}>
                    OK
                  </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={encryptionVisible}
        transparent={true}
        animationType="slide">
        <SafeAreaView
          style={[
            styles.fullScreenModalSafe,
            isDarkTheme && {backgroundColor: '#0B1220'},
          ]}
          edges={['top', 'bottom']}>
        <StatusBar
          barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkTheme ? '#111827' : '#FFFFFF'}
        />
        <View
          style={[
            styles.headerBar,
            isDarkTheme && {
              backgroundColor: '#111827',
              borderBottomColor: '#334155',
            },
          ]}>
            <TouchableOpacity
              onPress={() => setEncryptionVisible(false)}
              style={styles.iconBtn}>
              <Icons.Ionicons
                name="arrow-back"
                size={24}
                color={isDarkTheme ? '#F8FAFC' : '#0F172A'}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.fullScreenModalTitle,
                isDarkTheme && {color: '#F8FAFC'},
              ]}>
              Verify security code
            </Text>
            <View style={{flex: 1}} />
          </View>
          <ScrollView
            contentContainerStyle={[
              styles.encryptionBody,
              isDarkTheme && {backgroundColor: '#0B1220'},
            ]}>
            <View
              style={[
                styles.qrPlaceholder,
                isDarkTheme && {backgroundColor: '#1F2937'},
              ]}>
              <Icons.Ionicons
                name="qr-code-outline"
                size={150}
                color={isDarkTheme ? '#F8FAFC' : '#0F172A'}
              />
            </View>
            <Text
              style={[
                styles.securityCodeText,
                isDarkTheme && {color: '#F8FAFC'},
              ]}>
              27189 45912 61234 88123{'\n'}
              99120 45719 33412 11094{'\n'}
              78213 54311 09843 66124
            </Text>
            <Text
              style={[
                styles.encryptionInfo,
                isDarkTheme && {color: '#CBD5E1'},
              ]}>
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
          <View
            style={[
              styles.popupCard,
              isDarkTheme && {backgroundColor: '#1F2937'},
            ]}>
            <View style={styles.popupIconWrapper}>
              <Icons.Feather
                name={confirmModal.iconName}
                size={22}
                color={color.defalt}
              />
            </View>
            <Text
              style={[
                styles.popupTitle,
                isDarkTheme && {color: '#F8FAFC'},
              ]}>
              {confirmModal.title}
            </Text>
            <Text
              style={[
                styles.popupMessage,
                isDarkTheme && {color: '#CBD5E1'},
              ]}>
              {confirmModal.message}
            </Text>
            <View style={styles.popupButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.popupBtnWhite,
                  isDarkTheme && {
                    backgroundColor: '#1F2937',
                    borderColor: '#475569',
                  },
                ]}
                onPress={() =>
                  setConfirmModal(prev => ({...prev, visible: false}))
                }>
                <Text
                  style={[
                    styles.popupBtnWhiteText,
                    isDarkTheme && {color: '#F8FAFC'},
                  ]}>
                  No
                </Text>
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
        contentContainerStyle={[
          styles.container,
          isDarkTheme && {backgroundColor: '#0B1220'},
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <View
          style={[
            styles.profileInfoSection,
            isDarkTheme && {
              backgroundColor: '#111827',
              borderBottomColor: '#1F2937',
            },
          ]}>
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
          <Text
            style={[
              styles.profileName,
              isDarkTheme && {color: '#F8FAFC'},
            ]}>
            {userName}
          </Text>
          <Text
            style={[
              styles.profileSubText,
              isDarkTheme && {color: '#CBD5E1'},
            ]}>
            {isBlocked ? 'Blocked contact' : 'Last seen today at 8:27 AM'}
          </Text>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.circleActionBtn,
                isDarkTheme && {
                  backgroundColor: '#1F2937',
                  borderColor: '#334155',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Start voice call"
              accessibilityState={{disabled: voiceCallLoading}}
              disabled={voiceCallLoading}
              onPress={startVoiceCall}>
              {voiceCallLoading ? (
                <ActivityIndicator size="small" color={color.defalt} />
              ) : (
                <Icons.Feather name="phone" size={20} color={color.defalt} />
              )}
              <Text
                style={[
                  styles.actionButtonText,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                {voiceCallLoading ? 'Calling...' : 'Audio'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.circleActionBtn,
                isDarkTheme && {
                  backgroundColor: '#1F2937',
                  borderColor: '#334155',
                },
              ]}>
              <Icons.Feather name="video" size={20} color={color.defalt} />
              <Text
                style={[
                  styles.actionButtonText,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.circleActionBtn,
                isDarkTheme && {
                  backgroundColor: '#1F2937',
                  borderColor: '#334155',
                },
              ]}
              onPress={triggerChatSearch}>
              <Icons.Feather name="search" size={20} color={color.defalt} />
              <Text
                style={[
                  styles.actionButtonText,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.optionsSection,
            isDarkTheme && {backgroundColor: '#111827'},
          ]}>
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
              <Text
                style={[
                  styles.optionTitle,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                Mute notifications
              </Text>
              <Text
                style={[
                  styles.optionSubtitle,
                  isDarkTheme && {color: '#CBD5E1'},
                ]}>
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
              <Text
                style={[
                  styles.optionTitle,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                Media visibility
              </Text>
              <Text
                style={[
                  styles.optionSubtitle,
                  isDarkTheme && {color: '#CBD5E1'},
                ]}>
                {mediaSelection === 'Default (Yes)' ? '' : mediaSelection}
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={[
              styles.divider,
              isDarkTheme && {backgroundColor: '#1F2937'},
            ]}
          />

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setEncryptionVisible(true)}>
            <Icons.Feather
              name="lock"
              size={20}
              color={isDarkTheme ? '#94A3B8' : '#64748B'}
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text
                style={[
                  styles.optionTitle,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                Encryption
              </Text>
              <Text
                style={[
                  styles.optionSubtitle,
                  isDarkTheme && {color: '#CBD5E1'},
                ]}>
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
              color={isDarkTheme ? '#94A3B8' : '#64748B'}
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text
                style={[
                  styles.optionTitle,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                Disappearing messages
              </Text>
              <Text
                style={[
                  styles.optionSubtitle,
                  isDarkTheme && {color: '#CBD5E1'},
                ]}>
                {disappearingSelection}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.optionItem}>
            <Icons.Feather
              name="shield"
              size={20}
              color={isDarkTheme ? '#94A3B8' : '#64748B'}
              style={styles.optionIcon}
            />
            <View style={styles.optionTextContainer}>
              <Text
                style={[
                  styles.optionTitle,
                  isDarkTheme && {color: '#F8FAFC'},
                ]}>
                Chat lock
              </Text>
              <Text
                style={[
                  styles.optionSubtitle,
                  isDarkTheme && {color: '#CBD5E1'},
                ]}>
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

          <View
            style={[
              styles.divider,
              isDarkTheme && {backgroundColor: '#1F2937'},
            ]}
          />

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
  popupButtonsRow: {flexDirection: 'row', width: '100%'},
  popupBtnWhite: {
    flex: 1,
    marginRight: 10,
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
  container: {flexGrow: 1, paddingBottom: 40},
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
  actionButtonsRow: {flexDirection: 'row', justifyContent: 'center'},
  circleActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
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
  },
  actionModalConfirmButton: {
    marginLeft: 20,
  },
  actionModalBtnText: {fontSize: 14, fontWeight: '600', color: color.defalt},
});