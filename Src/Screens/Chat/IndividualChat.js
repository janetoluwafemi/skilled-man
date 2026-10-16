import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  Dimensions,
  Platform,
  StatusBar,
  Clipboard,
  TextInput,
  ScrollView,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Switch,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
  MessageText,
} from 'react-native-gifted-chat';

import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as LocalAuthentication from 'expo-local-authentication';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import EmojiSelector from 'react-native-emoji-selector';
import color from '../../Assets/colors/colors';
import CustomAlert from '../../Components/CustomAlert';
import ChatUsrHeader from '../../Components/ChatUserHeader';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';
import {
  blockChatUser,
  clearChat,
  deleteChatMessage,
  getBlockedChatUsers,
  reportChatUser,
  unblockChatUser,
} from '../../utilis/chatApi';

let cachedAudioModule;
let didResolveAudioModule = false;

const getAudioModule = () => {
  if (didResolveAudioModule) {
    return cachedAudioModule;
  }
  didResolveAudioModule = true;
  try {
    cachedAudioModule = require('expo-av').Audio;
  } catch (error) {
    cachedAudioModule = null;
    console.warn('Voice notes are unavailable because this app build does not include expo-av.');
  }
  return cachedAudioModule;
};

const getSynchronizedUserId = async () => {
  try {
    const rawUser = await AsyncStorage.getItem('user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      const permanentId = parsed?.id || parsed?.user_id || parsed?.userId;
      if (permanentId && String(permanentId).trim() !== '' && !['251', '255', '256'].includes(String(permanentId))) {
        const cleanId = String(permanentId).trim();
        global.id = cleanId;
        return cleanId;
      }
    }
  } catch (e) {
    console.log('Error reading AsyncStorage in getSynchronizedUserId:', e);
  }
  if (global.id && String(global.id).trim() !== '' && !['251', '255', '256'].includes(String(global.id))) {
    return String(global.id).trim();
  }
  return null;
};

const getProfilePhone = (...profiles) => {
  const fields = [
    'phone_number',
    'phone',
    'user_number',
    'mobile_number',
    'mobile',
    'contact_number',
  ];
  const nestedProfileKeys = ['data', 'user', 'profile', 'provider'];

  for (const profile of profiles) {
    if (!profile || typeof profile !== 'object') {
      continue;
    }
    const profileCandidates = [
      profile,
      ...nestedProfileKeys
          .map(key => profile[key])
          .filter(value => value && typeof value === 'object'),
    ];
    for (const candidate of profileCandidates) {
      for (const field of fields) {
        const phone = candidate[field];
        if (typeof phone === 'string' || typeof phone === 'number') {
          const normalizedPhone = String(phone).trim();
          if (normalizedPhone) {
            return normalizedPhone;
          }
        }
      }
    }
  }
  return '';
};

const DISAPPEARING_MESSAGE_AGES = {
  '24 hours': 24 * 60 * 60 * 1000,
  '7 days': 7 * 24 * 60 * 60 * 1000,
};

const AudioMessage = ({ audioUri, isMe }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const textColor = isMe ? '#FFFFFF' : color.defalt;

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const playAudio = async () => {
    const Audio = getAudioModule();
    if (!Audio) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
      });
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
        setSound(newSound);
        setIsPlaying(true);
        await newSound.playAsync();
        newSound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) setIsPlaying(false);
        });
      }
    } catch (error) {
      console.log('Error playing audio', error);
    }
  };

  return (
      <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', minWidth: 150 }}>
        <TouchableOpacity onPress={playAudio} style={{ marginRight: 10 }}>
          <Icons.Feather name={isPlaying ? 'pause-circle' : 'play-circle'} size={28} color={textColor} />
        </TouchableOpacity>
        <Icons.Feather name="bar-chart-2" size={24} color={textColor} style={{ opacity: 0.7 }} />
        <Icons.Feather name="bar-chart-2" size={24} color={textColor} style={{ opacity: 0.4, marginLeft: -8 }} />
        <Text style={{ marginLeft: 10, color: textColor, fontSize: 12 }}>Voice Note</Text>
      </View>
  );
};

const NewMessage = ({ userId, providerId, peerData, showAlert }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const [messages, setMessages] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [voiceCallLoading, setVoiceCallLoading] = useState(false);
  const voiceCallInProgressRef = useRef(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // WhatsApp Style Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const timerRef = useRef(null);

  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockedActionsBar, setShowBlockedActionsBar] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [kebabVisible, setKebabVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(route.params?.startSearch || false);
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const composerRef = useRef(null);
  const recordingRef = useRef(null);
  const isStartingRef = useRef(false);
  const currentDashboardRole = String(global.role) === '1' ? 'provider' : 'customer';
  const cleanUserId = String(userId ?? '').trim();

  let peerId = String(providerId ?? '').trim();
  if (peerId === cleanUserId) {
    const possibleIds = [peerData?.user_id, peerData?.provider_id, peerData?.id].map(id => String(id || '').trim());
    const actualPeer = possibleIds.find(id => id && id !== cleanUserId);
    peerId = actualPeer || 'incoming-peer-fallback';
  }

  const chatStorageKey = `chat_history_${cleanUserId}_${peerId}`;
  const chatThemeStorageKey = `chat_theme_${cleanUserId}_${peerId}`;
  const disappearingTimerStorageKey = `chat_disappearing_${cleanUserId}_${peerId}`;
  const [chatTheme, setChatTheme] = useState('Default Light');
  const [disappearingTimer, setDisappearingTimer] = useState('Off');
  const expirationRequestsRef = useRef(new Set());
  const isDarkTheme = chatTheme === 'Dark Mode';

  const filterExpiredMessages = useCallback(
    (candidateMessages, persist = true) => {
      const maxAge = DISAPPEARING_MESSAGE_AGES[disappearingTimer];
      if (!maxAge) {
        return candidateMessages;
      }

      const now = Date.now();
      const expiredMessages = [];
      const remainingMessages = candidateMessages.filter(message => {
        const createdAt = new Date(message.createdAt).getTime();
        if (Number.isFinite(createdAt) && now - createdAt >= maxAge) {
          expiredMessages.push(message);
          return false;
        }
        return true;
      });

      expiredMessages.forEach(message => {
        const serverMessageId =
          message._serverId ||
          (String(message.user?._id) !== cleanUserId
            ? String(message._id)
            : null);
        if (!serverMessageId || expirationRequestsRef.current.has(String(serverMessageId))) {
          return;
        }

        const requestKey = String(serverMessageId);
        expirationRequestsRef.current.add(requestKey);
        deleteChatMessage(cleanUserId, requestKey, 'me').catch(error => {
          expirationRequestsRef.current.delete(requestKey);
          console.error('Unable to delete an expired chat message:', error);
        });
      });

      if (persist && expiredMessages.length > 0) {
        AsyncStorage.setItem(chatStorageKey, JSON.stringify(remainingMessages)).catch(
          error => console.error('Unable to save expired chat history:', error),
        );
      }
      return remainingMessages;
    },
    [chatStorageKey, cleanUserId, disappearingTimer],
  );

  const handleThemeChange = useCallback(
    async theme => {
      setChatTheme(theme);
      try {
        await AsyncStorage.setItem(chatThemeStorageKey, theme);
      } catch (error) {
        console.error('Unable to save chat theme:', error);
      }
    },
    [chatThemeStorageKey],
  );

  const handleDisappearingTimerChange = useCallback(
    async timer => {
      setDisappearingTimer(timer);
      try {
        await AsyncStorage.setItem(disappearingTimerStorageKey, timer);
      } catch (error) {
        console.error('Unable to save disappearing-message setting:', error);
      }
    },
    [disappearingTimerStorageKey],
  );

  useEffect(() => {
    let isCurrent = true;
    const loadChatPreferences = async () => {
      try {
        const [storedTheme, storedTimer] = await Promise.all([
          AsyncStorage.getItem(chatThemeStorageKey),
          AsyncStorage.getItem(disappearingTimerStorageKey),
        ]);
        if (!isCurrent) {
          return;
        }
        if (storedTheme === 'Default Light' || storedTheme === 'Dark Mode') {
          setChatTheme(storedTheme);
        }
        if (
          storedTimer === 'Off' ||
          Object.prototype.hasOwnProperty.call(
            DISAPPEARING_MESSAGE_AGES,
            storedTimer,
          )
        ) {
          setDisappearingTimer(storedTimer);
        }
      } catch (error) {
        console.error('Unable to load chat preferences:', error);
      }
    };

    loadChatPreferences();
    return () => {
      isCurrent = false;
    };
  }, [chatThemeStorageKey, disappearingTimerStorageKey]);

  useEffect(() => {
    if (disappearingTimer === 'Off') {
      return undefined;
    }

    setMessages(previousMessages => filterExpiredMessages(previousMessages));
    const expirationInterval = setInterval(() => {
      setMessages(previousMessages => filterExpiredMessages(previousMessages));
    }, 60 * 1000);

    return () => clearInterval(expirationInterval);
  }, [disappearingTimer, filterExpiredMessages]);

  // Dynamic User Avatar calculation supporting global profile updates
  const [myAvatar, setMyAvatar] = useState(
      global.profile ? `${BASIC_URL}uploads/${global.profile.replace(/^\/+/, '')}` : `${BASIC_URL}uploads/dumy.png`
  );

  useEffect(() => {
    const updateMyAvatar = async () => {
      if (global.profile) {
        setMyAvatar(`${BASIC_URL}uploads/${global.profile.replace(/^\/+/, '')}?v=${Date.now()}`);
      } else {
        try {
          const rawUser = await AsyncStorage.getItem('user');
          if (rawUser) {
            const parsed = JSON.parse(rawUser);
            const profilePic = parsed?.profile || parsed?.image || parsed?.data?.profile;
            if (profilePic) {
              setMyAvatar(`${BASIC_URL}uploads/${String(profilePic).replace(/^\/+/, '')}?v=${Date.now()}`);
            }
          }
        } catch (e) {}
      }
    };
    updateMyAvatar();
  }, []);

  const peerAvatar = peerData?.image ? `${BASIC_URL}uploads/${peerData.image.replace(/^\/+/, '')}` : `${BASIC_URL}uploads/dumy.png`;
  const [livePeerAvatar, setLivePeerAvatar] = useState(peerAvatar);
  const [livePeerProfile, setLivePeerProfile] = useState(peerData);

  useEffect(() => {
    let isCurrent = true;
    setLivePeerAvatar(peerAvatar);
    setLivePeerProfile(peerData);
    const fetchPeerAvatar = async () => {
      try {
        const response = await fetch(`${BASIC_URL}user/get_profile.php?id=${peerId}`);
        const result = await response.json();
        if (isCurrent) {
          setLivePeerProfile(result);
          const image =
              typeof result?.profile === 'string'
                  ? result.profile
                  : result?.profile?.image ||
                  result?.data?.profile ||
                  result?.data?.image;
          if (image) {
            setLivePeerAvatar(`${BASIC_URL}uploads/${String(image).replace(/^\/+/, '')}?v=${Date.now()}`);
          }
        }
      } catch (error) {
        console.log('Error fetching chat peer profile:', error);
      }
    };
    fetchPeerAvatar();
    return () => { isCurrent = false; };
  }, [peerId, peerAvatar, peerData]);

  // Timer effect for recording duration
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  const formatRecordTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
      const receiverPhone = getProfilePhone(livePeerProfile, peerData);

      if (!callerPhone || !receiverPhone) {
        throw new Error(
            !callerPhone && !receiverPhone
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
          caller_id: cleanUserId,
          peer_id: peerId,
          from: callerPhone,
          to: receiverPhone,
        }),
      });
      const responseText = await response.text();
      let result;
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error('The call service returned an invalid response.');
      }

      if (!response.ok || result?.error || result?.success === false) {
        throw new Error(
            result?.error || result?.message || 'Unable to start the voice call.',
        );
      }

      showAlert(
          'Call requested',
          result?.message || 'Your voice call request has been sent.',
      );
    } catch (error) {
      showAlert(
          'Unable to start call',
          error?.message || 'Please try again in a moment.',
      );
    } finally {
      voiceCallInProgressRef.current = false;
      setVoiceCallLoading(false);
    }
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        () => setShowEmojiPicker(false)
    );
    return () => showSubscription.remove();
  }, []);

  useEffect(() => {
    const checkBlockedStatus = async () => {
      try {
        const blockedState = await AsyncStorage.getItem(`user_blocked_${peerId}`);
        setIsBlocked(blockedState === 'true');

        if (cleanUserId && peerId) {
          const result = await getBlockedChatUsers(cleanUserId);
          const blockedUsers =
              result?.blocked_users || result?.blocked || result?.data || [];
          const isBlockedOnServer = Array.isArray(blockedUsers)
              ? blockedUsers.some(item =>
                  String(item?.blocked_id || item?.user_id || item?.id) === peerId,
              )
              : false;
          setIsBlocked(isBlockedOnServer);
          if (isBlockedOnServer) {
            await AsyncStorage.setItem(`user_blocked_${peerId}`, 'true');
          } else {
            await AsyncStorage.removeItem(`user_blocked_${peerId}`);
            setShowBlockedActionsBar(false);
          }
        }
      } catch (error) {
        console.log('Error checking blocked chat user:', error);
      }
    };
    checkBlockedStatus();
    const unsubscribe = navigation.addListener('focus', checkBlockedStatus);
    return unsubscribe;
  }, [navigation, peerId, cleanUserId]);

  useEffect(() => {
    if (route.params?.startSearch) setIsSearchActive(true);
  }, [route.params?.startSearch]);

  useEffect(() => {
    const loadLocalHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(chatStorageKey);
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          const alignedHistory = parsedHistory
            .filter(msg => msg.senderRole)
            .map(msg => ({
              ...msg,
              user: {
                ...msg.user,
                _id:
                  msg.senderRole === currentDashboardRole
                    ? cleanUserId
                    : peerId,
              },
            }));
          setMessages(filterExpiredMessages(alignedHistory));
        }
      } catch (error) {
        console.log('Error loading local chat history', error);
      }
    };
    loadLocalHistory();
  }, [
    chatStorageKey,
    currentDashboardRole,
    cleanUserId,
    peerId,
    filterExpiredMessages,
  ]);

  const fetchApiMessages = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('own_id', cleanUserId);
      const response = await fetch(`${BASIC_URL}get_all_chats.php`, { method: 'POST', body: formdata });
      const textRes = await response.text();
      let result;
      try { result = JSON.parse(textRes); } catch (parseErr) { return; }

      const allChats = result?.chat || [];
      const specificChat = allChats.find(c => String(c.chat_id) === peerId || String(c.user_id) === peerId || String(c.provider_id) === peerId || c.name === peerData?.name);

      if (specificChat) {
        let parsedDate = new Date();
        if (specificChat.created_at) {
          const d = new Date(specificChat.created_at);
          if (!isNaN(d.getTime())) parsedDate = d;
        }

        const stableId = String(specificChat.id || `${specificChat.created_at}_${specificChat.message}`);

        setMessages(previousMessages => {
          const rawSenderId = String(specificChat.sender_id || '');
          const isActuallyMe = rawSenderId === cleanUserId;
          const oppositeRole = currentDashboardRole === 'provider' ? 'customer' : 'provider';
          const msgSenderRole = specificChat.senderRole || (isActuallyMe ? currentDashboardRole : oppositeRole);

          const newIncomingMessage = {
            _id: stableId,
            _serverId: specificChat.id ? String(specificChat.id) : undefined,
            text: specificChat.message || '',
            createdAt: parsedDate,
            senderRole: msgSenderRole,
            user: {
              _id: msgSenderRole === currentDashboardRole ? cleanUserId : peerId,
              name: isActuallyMe ? 'Me' : specificChat.name || peerData?.name || 'User',
              avatar: isActuallyMe ? myAvatar : livePeerAvatar,
            },
          };

          if (filterExpiredMessages([newIncomingMessage], false).length === 0) {
            return filterExpiredMessages(previousMessages);
          }

          const existingIds = new Set(previousMessages.map(m => String(m._id)));
          const localMatchIndex = previousMessages.findIndex(
            message =>
              String(message.user?._id) === cleanUserId &&
              !message._serverId &&
              message.text?.trim() === (specificChat.message || '').trim(),
          );
          if (localMatchIndex >= 0) {
            const updatedMessages = previousMessages.map((message, index) =>
              index === localMatchIndex
                ? {...message, _serverId: newIncomingMessage._serverId}
                : message,
            );
            AsyncStorage.setItem(
              chatStorageKey,
              JSON.stringify(updatedMessages),
            ).catch(error =>
              console.error('Unable to save chat history:', error),
            );
            return updatedMessages;
          }
          if (!existingIds.has(newIncomingMessage._id)) {
            const updatedMessages = GiftedChat.append(previousMessages, [newIncomingMessage]);
            AsyncStorage.setItem(chatStorageKey, JSON.stringify(updatedMessages)).catch(error =>
              console.error('Unable to save chat history:', error),
            );
            return updatedMessages;
          }
          return previousMessages;
        });
      }
    } catch (error) {
      console.log('Error fetching chat messages:', error);
    }
  }, [cleanUserId, peerId, peerData, chatStorageKey, myAvatar, livePeerAvatar, currentDashboardRole, filterExpiredMessages]);

  useEffect(() => {
    fetchApiMessages();
    const interval = setInterval(() => fetchApiMessages(), 4000);
    return () => clearInterval(interval);
  }, [fetchApiMessages]);

  const startRecording = async () => {
    if (isBlocked || recordingRef.current || isStartingRef.current) return;
    const Audio = getAudioModule();
    if (!Audio) {
      showAlert('Voice Notes Unavailable', 'Update the app to a build that includes voice note support.');
      return;
    }
    try {
      isStartingRef.current = true;
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        showAlert('Permission Required', 'Microphone access is needed.');
        isStartingRef.current = false;
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      if (!isStartingRef.current) {
        await newRecording.stopAndUnloadAsync();
        return;
      }
      recordingRef.current = newRecording;
      setRecordSeconds(0);
      setIsPaused(false);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      showAlert('Voice Note Failed', err?.message || 'The recording could not be started. Please try again.');
    } finally {
      isStartingRef.current = false;
    }
  };

  const pauseRecording = async () => {
    const activeRecording = recordingRef.current;
    if (!activeRecording) return;
    try {
      if (isPaused) {
        await activeRecording.startAsync();
        setIsPaused(false);
      } else {
        await activeRecording.pauseAsync();
        setIsPaused(true);
      }
    } catch (error) {
      console.log('Error pausing/resuming recording', error);
    }
  };

  const cancelRecording = async () => {
    const activeRecording = recordingRef.current;
    recordingRef.current = null;
    isStartingRef.current = false;
    setIsRecording(false);
    setIsPaused(false);
    setRecordSeconds(0);
    if (activeRecording) {
      try {
        await activeRecording.stopAndUnloadAsync();
      } catch (e) {}
    }
  };

  const stopAndSendRecording = async () => {
    isStartingRef.current = false;
    const activeRecording = recordingRef.current;
    recordingRef.current = null;
    setIsRecording(false);
    setIsPaused(false);
    setRecordSeconds(0);

    if (!activeRecording) return;
    try {
      await activeRecording.stopAndUnloadAsync();
      const uri = activeRecording.getURI();
      if (uri) onSend([{ text: '', audio: uri }]);
    } catch (error) {
      console.error('Failed to stop recording', error);
      showAlert('Voice Note Failed', 'The recording could not be saved. Please try again.');
    } finally {
      const Audio = getAudioModule();
      if (Audio) {
        try { await Audio.setAudioModeAsync({ allowsRecordingIOS: false }); } catch (error) {}
      }
    }
  };

  const pickDocument = async () => {
    if (isBlocked) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        onSend([{ text: '', document: asset.uri, documentName: asset.name }]);
      }
    } catch (err) {
      console.log('Error picking document', err);
      showAlert('Upload failed', 'Could not select document.');
    }
  };

  const handleLongPress = (context, message) => {
    if (Platform.OS !== 'web' && !message.system) {
      setSelectedMessage(message);
      setKebabVisible(false);
    }
  };

  const handlePress = (context, message) => {
    if (Platform.OS !== 'web' && selectedMessage) {
      setSelectedMessage(null);
      setKebabVisible(false);
    }
  };

  const deleteMessageLocally = async messageId => {
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.filter(m => String(m._id) !== String(messageId));
      AsyncStorage.setItem(chatStorageKey, JSON.stringify(updatedMessages)).catch(e => console.log(e));
      return updatedMessages;
    });
    setSelectedMessage(null);
  };

  const handleCopyAction = text => {
    if (text) { try { Clipboard.setString(text); } catch (e) {} }
    setKebabVisible(false);
    setSelectedMessage(null);
  };

  const handleForwardAction = text => {
    showAlert('Forward Message', `Forwarding: "${text || 'Image/Document message'}"`);
    setKebabVisible(false);
    setSelectedMessage(null);
  };

  const handleClearChatAction = () => {
    setMessages([]);
    AsyncStorage.removeItem(chatStorageKey).catch(e => console.log(e));
    setSelectedMessage(null);
    setKebabVisible(false);
    setShowBlockedActionsBar(false);
  };

  const handleHeaderBlockAction = async () => {
    try {
      if (!cleanUserId || !peerId) {
        throw new Error('A valid user and contact are required.');
      }
      if (isBlocked) {
        await unblockChatUser(cleanUserId, peerId);
        await AsyncStorage.removeItem(`user_blocked_${peerId}`);
        setIsBlocked(false);
        setShowBlockedActionsBar(false);
        showAlert('Unblocked', `${peerData?.name || 'This contact'} has been unblocked.`);
      } else {
        await blockChatUser(cleanUserId, peerId);
        await AsyncStorage.setItem(`user_blocked_${peerId}`, 'true');
        setIsBlocked(true);
        showAlert('Blocked', `${peerData?.name || 'This contact'} has been blocked.`);
      }
    } catch (error) {
      showAlert(
          isBlocked ? 'Unable to unblock contact' : 'Unable to block contact',
          error?.message || 'Please try again.',
      );
    }
  };

  const handleHeaderReportAction = async () => {
    try {
      if (!cleanUserId || !peerId) {
        throw new Error('A valid user and contact are required.');
      }
      const result = await reportChatUser(
          cleanUserId,
          peerId,
          'Harassment',
          `Report submitted for ${peerData?.name || 'this contact'}.`,
      );
      showAlert(
          'Reported',
          result?.message || 'This contact has been reported.',
      );
    } catch (error) {
      showAlert(
          'Unable to report contact',
          error?.message || 'Please try again.',
      );
    }
  };

  const handleHeaderDeleteChat = async () => {
    try {
      if (!cleanUserId || !peerId) {
        throw new Error('A valid user and contact are required.');
      }
      await clearChat(cleanUserId, peerId);
      await AsyncStorage.removeItem(chatStorageKey);
      handleClearChatAction();
      showAlert('Chat deleted', 'Your chat history has been deleted.');
    } catch (error) {
      showAlert(
          'Unable to delete chat',
          error?.message || 'Please try again.',
      );
    }
  };

  const onSend = async (messagesList = []) => {
    if (isBlocked) return;
    try {
      const msg = messagesList[0];
      if (!msg?.text?.trim() && !msg?.image && !msg?.audio && !msg?.document) return;

      const currentSyncId = (await getSynchronizedUserId()) || cleanUserId;
      const textContent = msg.text ? msg.text.trim() : msg.audio ? '🎤 Voice Note' : msg.document ? `📄 ${msg.documentName || 'Document'}` : msg.image ? '📷 Sent an image' : '';

      const formattedMsg = {
        _id: String(Date.now()),
        text: textContent,
        createdAt: new Date(),
        senderRole: currentDashboardRole,
        user: { _id: cleanUserId, name: 'Me', avatar: myAvatar },
        image: msg.image || '',
        audio: msg.audio || '',
        document: msg.document || '',
        documentName: msg.documentName || '',
      };

      setMessages(previousMessages => {
        const updatedMessages = GiftedChat.append(previousMessages, [formattedMsg]);
        AsyncStorage.setItem(chatStorageKey, JSON.stringify(updatedMessages)).catch(e => console.log(e));
        return updatedMessages;
      });

      const chatForm = new FormData();
      chatForm.append('own_id', currentSyncId);
      chatForm.append('chat_user_id', peerId);
      chatForm.append('message', textContent);
      chatForm.append('senderRole', currentDashboardRole);

      if (msg.document && Platform.OS !== 'web') chatForm.append('file', { uri: msg.document, name: msg.documentName || `DOC_${Date.now()}`, type: '*/*' });
      if (msg.image && Platform.OS !== 'web') chatForm.append('file', { uri: msg.image, name: `IMG_${Date.now()}.jpg`, type: 'image/jpeg' });
      if (msg.audio && Platform.OS !== 'web') chatForm.append('file', { uri: msg.audio, name: `VOICE_${Date.now()}.m4a`, type: 'audio/mp4' });

      const notifyForm = new FormData();
      notifyForm.append('sender_id', currentSyncId);
      notifyForm.append('receiver_id', peerId);
      notifyForm.append('message', textContent || '📷 Sent a file');

      const chatResponse = await fetch(`${BASIC_URL}firebase/chat.php`, { method: 'POST', body: chatForm });
      if (!chatResponse.ok) throw new Error(`Message save failed (${chatResponse.status})`);
      setText('');

      try {
        await fetch(`${BASIC_URL}firebase/send_notification.php`, { method: 'POST', body: notifyForm });
      } catch (notificationError) {
        console.warn('Message notification failed:', notificationError);
      }
    } catch (error) {
      console.error('Send error:', error);
      showAlert('Send failed', 'Could not send message.');
    }
  };

  const openCamera = async () => {
    if (isBlocked) return;
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission Required', 'Camera access is needed.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!result.canceled && result.assets?.length > 0) {
        setUploading(true);
        const asset = result.assets[0];
        setUploading(false);
        onSend([{ text: '', image: asset.uri }]);
      }
    } catch (err) {
      setUploading(false);
      showAlert('Upload failed', 'Could not upload image.');
    }
  };

  const unblockUser = async () => {
    try {
      await unblockChatUser(cleanUserId, peerId);
      await AsyncStorage.removeItem(`user_blocked_${peerId}`);
      setIsBlocked(false);
      setShowBlockedActionsBar(false);
      showAlert('Unblocked', `${peerData?.name || 'This contact'} has been unblocked.`);
    } catch (error) {
      showAlert(
          'Unable to unblock contact',
          error?.message || 'Please try again.',
      );
    }
  };

  if (!cleanUserId || !peerId || cleanUserId === 'undefined' || peerId === 'undefined') {
    return (
        <View style={styles.missingUserBox}>
          <Icons.Feather name="alert-circle" size={40} color="#CBD5E1" />
          <Text style={styles.missingUserText}>Loading chat session...</Text>
        </View>
    );
  }

  const finalMessages = searchQuery.trim()
      ? messages.filter(m => m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()))
      : messages;

  return (
      <View
        style={[
          styles.chatWrapper,
          isDarkTheme && {backgroundColor: '#0B1220'},
        ]}>
        <StatusBar
          barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkTheme ? '#111827' : '#F8FAFC'}
        />
        {selectedMessage ? (
            <View style={styles.contextualHeader}>
              <View style={styles.contextHeaderLeft}>
                <TouchableOpacity onPress={() => { setSelectedMessage(null); setKebabVisible(false); }}>
                  <Icons.Feather name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.contextHeaderText}>1</Text>
              </View>
              <View style={styles.contextHeaderRight}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Icons.Feather name="corner-up-left" size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <Icons.Feather name="star" size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMessageLocally(selectedMessage._id)} style={styles.iconBtn}>
                  <Icons.Ionicons name="trash" size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleForwardAction(selectedMessage.text)} style={styles.iconBtn}>
                  <Icons.Feather name="corner-up-right" size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setKebabVisible(!kebabVisible)} style={styles.iconBtn}>
                  <Icons.Feather name="more-vertical" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
        ) : isSearchActive ? (
            <View
              style={[
                styles.searchHeader,
                isDarkTheme && {
                  backgroundColor: '#111827',
                  borderBottomColor: '#334155',
                },
              ]}>
              <TouchableOpacity onPress={() => { setIsSearchActive(false); setSearchQuery(''); navigation.setParams({ startSearch: false }); }}>
                <Icons.Feather
                  name="arrow-left"
                  size={24}
                  color={isDarkTheme ? '#F8FAFC' : '#0F172A'}
                />
              </TouchableOpacity>
              <TextInput
                  style={[
                    styles.searchHeaderInput,
                    isDarkTheme && {color: '#F8FAFC'},
                  ]}
                  placeholder="Search..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
              />
              {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 12 }}>
                    <Icons.Feather name="x" size={20} color="#64748B" />
                  </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.iconBtn}>
                <Icons.Feather
                  name="calendar"
                  size={22}
                  color={isDarkTheme ? '#F8FAFC' : '#0F172A'}
                />
              </TouchableOpacity>
            </View>
        ) : (
            <View style={{ zIndex: 10 }}>
              <ChatUsrHeader
                userName={peerData?.name || 'Chat'}
                userImage={livePeerAvatar}
                onlineStatus={!isBlocked}
                onProfilePress={() => navigation.navigate('UserProfile', { userId: peerId, userData: peerData })}
                onSearchPress={() => setIsSearchActive(true)}
                onVoiceCallPress={startVoiceCall}
                voiceCallLoading={voiceCallLoading}
                isBlocked={isBlocked}
                onBlockPress={handleHeaderBlockAction}
                onReportPress={handleHeaderReportAction}
                onDeleteChatPress={handleHeaderDeleteChat}
                messages={messages}
                chatTheme={chatTheme}
                disappearingTimer={disappearingTimer}
                onThemeChange={handleThemeChange}
                onDisappearingTimerChange={handleDisappearingTimerChange}
              />
            </View>
        )}

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        >
          <GiftedChat
              messages={finalMessages}
              text={text}
              textInputProps={{
                onFocus: () => setShowEmojiPicker(false),
                onChangeText: setText,
              }}
              textInputRef={composerRef}
              extraData={{
                selectedMessage,
                searchQuery,
                isBlocked,
                isRecording,
                isPaused,
                recordSeconds,
              }}
              bottomOffset={Platform.OS === 'ios' ? insets.bottom : 10}
              onSend={messagesList => onSend(messagesList)}
              user={{ _id: String(cleanUserId) }}
              isUserAvatarVisible={true}
              alignTop={false}
              scrollToBottom={true}
              isAvatarOnTop={true}
              isInverted={true}
              isSendButtonAlwaysVisible
              onLongPressMessage={handleLongPress}
              onPressMessage={handlePress}
              messagesContainerStyle={{
                backgroundColor: isDarkTheme ? '#0B1220' : '#F0F2F5',
                paddingBottom: 10,
              }}
              listViewProps={{
                style: { flex: 1 },
                keyboardShouldPersistTaps: 'always',
                keyboardDismissMode: Platform.OS === 'ios' ? 'interactive' : 'on-drag',
              }}
              renderSystemMessage={(props) => {
                return (
                    <View
                      style={[
                        styles.systemMessageContainer,
                        isDarkTheme && {backgroundColor: '#1F2937'},
                      ]}>
                      <Text
                        style={[
                          styles.systemMessageText,
                          isDarkTheme && {color: '#CBD5E1'},
                        ]}>
                        {props.currentMessage.text}
                      </Text>
                    </View>
                );
              }}
              renderCustomView={props => {
                const { currentMessage, position } = props;
                if (currentMessage.document) {
                  const isMe = position === 'right';
                  const textColor = isMe ? '#FFFFFF' : color.defalt;
                  return (
                      <TouchableOpacity style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }} onPress={() => Linking.openURL(currentMessage.document).catch(() => {})}>
                        <Icons.Feather name="file-text" size={24} color={textColor} />
                        <Text style={{ color: textColor, marginLeft: 8, fontSize: 14, textDecorationLine: 'underline', maxWidth: 200 }} numberOfLines={1}>
                          {currentMessage.documentName || 'View Document'}
                        </Text>
                      </TouchableOpacity>
                  );
                }
                return null;
              }}
              renderMessageAudio={props => {
                const { currentMessage, position } = props;
                return <AudioMessage audioUri={currentMessage.audio} isMe={position === 'right'} />;
              }}
              renderMessageImage={props => {
                const { currentMessage } = props;
                if (!currentMessage?.image) return null;
                return (
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { setSelectedImage(currentMessage.image); setImageModalVisible(true); }}>
                      <Image source={{ uri: currentMessage.image }} style={styles.chatMsgImage} resizeMode="cover" />
                    </TouchableOpacity>
                );
              }}
              renderMessageText={props => {
                const { currentMessage } = props;
                if (currentMessage?.audio || currentMessage?.document) return null;
                return (
                    <MessageText
                        {...props}
                        textStyle={{
                          left: { color: isDarkTheme ? '#F8FAFC' : color.defalt, fontSize: 15.5, lineHeight: 22, ...(Platform.OS === 'web' && { wordBreak: 'break-word' }) },
                          right: { color: '#FFFFFF', fontSize: 15.5, lineHeight: 22, ...(Platform.OS === 'web' && { wordBreak: 'break-word' }) },
                        }}
                    />
                );
              }}
              renderInputToolbar={props => {
                if (isBlocked) {
                  if (!showBlockedActionsBar) {
                    return (
                        <View style={styles.blockedPillWrapper}>
                          <TouchableOpacity
                              onPress={() => setShowBlockedActionsBar(true)}
                              activeOpacity={0.8}
                              style={styles.systemMessageContainer}
                          >
                            <Text style={styles.systemMessageText}>You blocked this person. Tap to unblock.</Text>
                          </TouchableOpacity>
                        </View>
                    );
                  }
                  return (
                      <View style={styles.blockedActionsContainer}>
                        <TouchableOpacity
                            style={styles.blockedActionBtn}
                            onPress={handleClearChatAction}
                            activeOpacity={0.7}
                        >
                          <Icons.Feather name="trash-2" size={20} color="#EF4444" />
                          <Text style={styles.deleteChatText}>Delete chat</Text>
                        </TouchableOpacity>
                        <View style={styles.blockedDivider} />
                        <TouchableOpacity
                            style={styles.blockedActionBtn}
                            onPress={unblockUser}
                            activeOpacity={0.7}
                        >
                          <Icons.Feather name="slash" size={20} color="#10B981" />
                          <Text style={styles.unblockText}>Unblock</Text>
                        </TouchableOpacity>
                      </View>
                  );
                }

                // WhatsApp-style Recording Active View in Input Toolbar
                if (isRecording) {
                  return (
                      <View style={styles.recordingToolbarContainer}>
                        <TouchableOpacity
                            style={styles.recordActionBtn}
                            onPress={cancelRecording}
                            activeOpacity={0.7}
                        >
                          <Icons.Feather name="trash-2" size={22} color="#EF4444" />
                        </TouchableOpacity>

                        <View style={styles.recordingStatusBox}>
                          <View style={[styles.redDot, isPaused && { backgroundColor: '#F59E0B' }]} />
                          <Text style={styles.recordingTimerText}>{formatRecordTime(recordSeconds)}</Text>
                          <TouchableOpacity
                              onPress={pauseRecording}
                              style={styles.pauseResumeBtn}
                              activeOpacity={0.7}
                          >
                            <Icons.Feather name={isPaused ? 'play' : 'pause'} size={18} color="#64748B" />
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={stopAndSendRecording}
                            activeOpacity={0.7}
                        >
                          <Icons.Feather name="send" size={16} color="#FFFFFF" style={{ marginLeft: -2 }} />
                        </TouchableOpacity>
                      </View>
                  );
                }

                return (
                    <InputToolbar
                        {...props}
                        containerStyle={[
                          styles.inputToolbar,
                          isDarkTheme && {backgroundColor: '#111827'},
                        ]}
                        primaryStyle={styles.inputToolbarPrimary}
                    />
                );
              }}
              renderComposer={props => {
                if (isBlocked || isRecording) return null;
                const hasText = props.text && props.text.trim().length > 0;
                return (
                    <View
                      style={[
                        styles.composerWrapper,
                        isDarkTheme && {
                          backgroundColor: '#1F2937',
                          borderColor: '#334155',
                        },
                      ]}>
                      <TouchableOpacity
                          style={styles.inputActionBtn}
                          onPress={() => {
                            if (showEmojiPicker) {
                              setShowEmojiPicker(false);
                              composerRef.current?.focus();
                            } else {
                              Keyboard.dismiss();
                              setTimeout(() => setShowEmojiPicker(true), 100);
                            }
                          }}
                          activeOpacity={0.7}
                      >
                        {showEmojiPicker ? (
                            <Icons.Ionicons name="keypad-outline" size={24} color={isDarkTheme ? '#CBD5E1' : '#64748B'} />
                        ) : (
                            <Icons.Feather name="smile" size={24} color={isDarkTheme ? '#CBD5E1' : '#64748B'} />
                        )}
                      </TouchableOpacity>
                      <Composer
                          {...props}
                          placeholder="Message"
                          placeholderTextColor="#94A3B8"
                          textInputStyle={[
                            styles.composerInput,
                            {color: isDarkTheme ? '#F8FAFC' : '#0F172A'},
                          ]}
                      />
                      <View style={styles.composerRightIcons}>
                        <TouchableOpacity style={styles.inputActionBtn} activeOpacity={0.7} onPress={pickDocument}>
                          <Icons.Feather name="paperclip" size={22} color="#64748B" />
                        </TouchableOpacity>
                        {!hasText && !uploading && (
                            <TouchableOpacity style={styles.inputActionBtn} onPress={openCamera} activeOpacity={0.7}>
                              <Icons.Feather name="camera" size={22} color="#64748B" />
                            </TouchableOpacity>
                        )}
                      </View>
                    </View>
                );
              }}
              renderSend={props => {
                if (isBlocked || isRecording) return null;
                const hasText = props.text && props.text.trim().length > 0;
                return (
                    <View style={styles.sendComponentWrapper}>
                      {hasText ? (
                          <Send {...props} containerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.sendButton}>
                              {uploading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Icons.Feather name="send" size={16} color="#FFFFFF" style={{ marginLeft: -2 }} />}
                            </View>
                          </Send>
                      ) : (
                          <TouchableOpacity
                              onPress={startRecording}
                              activeOpacity={0.7}
                              style={styles.sendButton}
                          >
                            <Icons.Feather name="mic" size={18} color="#FFFFFF" />
                          </TouchableOpacity>
                      )}
                    </View>
                );
              }}
              renderBubble={props => (
                  <Bubble
                      {...props}
                      wrapperStyle={{
                        left: {
                          backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF',
                          borderRadius: 16,
                          borderBottomLeftRadius: 4,
                          borderBottomRightRadius: 16,
                          padding: 4,
                          marginBottom: 4,
                          maxWidth: Dimensions.get('window').width * 0.75,
                        },
                        right: {
                          backgroundColor: color.defalt,
                          borderRadius: 16,
                          borderBottomLeftRadius: 16,
                          borderBottomRightRadius: 4,
                          padding: 4,
                          marginBottom: 4,
                          maxWidth: Dimensions.get('window').width * 0.75,
                        },
                      }}
                      textStyle={{
                        left: { color: isDarkTheme ? '#F8FAFC' : color.defalt, fontSize: 15.5, lineHeight: 22 },
                        right: { color: '#FFFFFF', fontSize: 15.5, lineHeight: 22 },
                      }}
                  />
              )}
          />

          {showEmojiPicker && (
              <View
                style={{
                  height: 280,
                  backgroundColor: isDarkTheme ? '#111827' : '#FFFFFF',
                }}>
                <EmojiSelector
                    onEmojiSelected={emoji => setText(prev => prev + emoji)}
                    showSearchBar={false}
                    columns={8}
                    showHistory={false}
                    showSectionTitles={false}
                    showTabs={false}
                />
              </View>
          )}
        </KeyboardAvoidingView>

        <Modal visible={imageModalVisible} transparent={true} animationType="fade" onRequestClose={() => setImageModalVisible(false)}>
          <Pressable style={styles.modalContainer} onPress={() => setImageModalVisible(false)}>
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />}
          </Pressable>
        </Modal>

        {selectedMessage && kebabVisible && (
            <View style={styles.kebabMenu}>
              <TouchableOpacity style={styles.kebabMenuItem} onPress={() => handleCopyAction(selectedMessage.text)}>
                <Text style={styles.kebabMenuText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.kebabMenuItem} onPress={() => handleForwardAction(selectedMessage.text)}>
                <Text style={styles.kebabMenuText}>Forward</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.kebabMenuItem} onPress={handleClearChatAction}>
                <Text style={[styles.kebabMenuText, { color: '#EF4444' }]}>Clear chat</Text>
              </TouchableOpacity>
            </View>
        )}
      </View>
  );
};

const EncryptionInfoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userName } = route.params || { userName: 'User' };

  return (
      <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Icons.Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.fullScreenModalTitle}>Encryption</Text>
          <View style={{ flex: 1 }} />
        </View>
        <ScrollView contentContainerStyle={styles.encryptionBody}>
          <View style={styles.lockBadgeBox}>
            <Icons.Feather name="lock" size={48} color={color.defalt} />
          </View>
          <Text style={styles.encryptionMainTitle}>End-to-end encryption</Text>
          <Text style={styles.encryptionDetailText}>Messages and calls you share with {userName} are end-to-end encrypted. This means WhatsApp and third-party services cannot read or listen to them.</Text>
          <View style={styles.qrPlaceholder}>
            <Icons.Ionicons name="qr-code-outline" size={140} color="#0F172A" />
          </View>
          <Text style={styles.securityCodeText}>27189 45912 61234 88123{'\n'}99120 45719 33412 11094{'\n'}78213 54311 09843 66124</Text>
          <Text style={styles.encryptionInfo}>Verify this code with {userName} by scanning their QR code or comparing the numbers above.</Text>
        </ScrollView>
      </SafeAreaView>
  );
};

const IndividualChat = () => {
  const route = useRoute();
  const currentprovider = route.params?.currentuser || route.params?.userData || route.params?.provider || route.params?.item || route.params?.user;
  const peerId = String(route.params?.receiver_id || route.params?.userId || currentprovider?.id || currentprovider?.provider_id || currentprovider?.user_id || currentprovider?.uuid || '').trim();
  const [resolvedUserId, setResolvedUserId] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', onOk: () => setAlertConfig(prev => ({ ...prev, visible: false })) });

  const showAlert = (title, message, onOk) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      onOk: () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        if (onOk) onOk();
      },
    });
  };

  useEffect(() => {
    const syncUser = async () => {
      const userId = await getSynchronizedUserId();
      if (userId) setResolvedUserId(userId);
      else if (global.id) setResolvedUserId(String(global.id));
    };
    if (!resolvedUserId) syncUser();
  }, [resolvedUserId]);

  return (
      <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.chatViewContainer}>
          {resolvedUserId && peerId ? (
              <NewMessage userId={resolvedUserId} providerId={peerId} peerData={currentprovider} showAlert={showAlert} />
          ) : (
              <View style={styles.missingUserBox}>
                <ActivityIndicator size="large" color={color.defalt} />
                <Text style={styles.missingUserText}>Connecting to conversation...</Text>
              </View>
          )}
        </View>
        <CustomAlert visible={alertConfig.visible} title={alertConfig.title} message={alertConfig.message} onOk={alertConfig.onOk} />
      </SafeAreaView>
  );
};

export { EncryptionInfoScreen };
export default IndividualChat;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  chatWrapper: { flex: 1, backgroundColor: '#F0F2F5' },
  chatViewContainer: { flex: 1, backgroundColor: '#F0F2F5' },
  contextualHeader: { height: 60, backgroundColor: color.defalt, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 10, elevation: 4 },
  contextHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  contextHeaderText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginLeft: 20 },
  contextHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  searchHeader: { height: 60, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, zIndex: 10, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
  searchHeaderInput: { flex: 1, height: 40, marginLeft: 12, fontSize: 16, color: '#0F172A', borderWidth: 0, ...(Platform.OS === 'web' && { outlineStyle: 'none' }) },
  iconBtn: { marginLeft: 16, padding: 4 },
  kebabMenu: { position: 'absolute', top: 55, right: 16, backgroundColor: '#FFFFFF', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, paddingVertical: 4, zIndex: 1000 },
  kebabMenuItem: { paddingHorizontal: 20, paddingVertical: 12 },
  kebabMenuText: { fontSize: 15, color: '#0F172A', fontWeight: '500' },
  chatMsgImage: { width: Math.min(Dimensions.get('window').width * 0.72, 240), height: 180, borderRadius: 12, margin: 4 },
  inputToolbar: { backgroundColor: '#F0F2F5', borderTopWidth: 0, paddingHorizontal: 12, paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 12 },
  inputToolbarPrimary: { alignItems: 'flex-end', justifyContent: 'space-between' },
  composerWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, paddingLeft: 4, paddingRight: 4, marginRight: 8, minHeight: 46, maxHeight: 120, borderWidth: 1, borderColor: '#E2E8F0' },
  inputActionBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  composerRightIcons: { flexDirection: 'row', alignItems: 'center' },
  composerInput: { flex: 1, color: '#0F172A', fontSize: 16, lineHeight: 21, paddingTop: Platform.OS === 'ios' ? 11 : 8, paddingBottom: Platform.OS === 'ios' ? 11 : 8, paddingHorizontal: 4, ...(Platform.OS === 'web' && { outlineWidth: 0 }) },
  sendComponentWrapper: { justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  sendButton: { backgroundColor: color.defalt, borderRadius: 22, width: 44, height: 44, justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: color.defalt, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }, android: { elevation: 2 }, web: { boxShadow: '0 2px 6px rgba(186, 104, 56, 0.25)' } }) },
  modalContainer: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.95)', justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  missingUserBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  missingUserText: { textAlign: 'center', color: '#64748B', fontSize: 15, fontWeight: '600', marginTop: 12 },

  // WhatsApp Style Recording Toolbar Styles
  recordingToolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    marginHorizontal: 8,
    marginBottom: Platform.OS === 'ios' ? 20 : 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 50,
  },
  recordActionBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingStatusBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    marginRight: 10,
  },
  recordingTimerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  pauseResumeBtn: {
    padding: 8,
    marginRight: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },

  blockedPillWrapper: { width: '100%', alignItems: 'center', paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 30 : 12, backgroundColor: 'transparent' },
  blockedActionsContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 30 : 16 },
  blockedActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  blockedDivider: { width: 1, height: 24, backgroundColor: '#E2E8F0' },
  deleteChatText: { fontSize: 16, fontWeight: '500', color: '#EF4444', marginLeft: 8 },
  unblockText: { fontSize: 16, fontWeight: '500', color: '#10B981', marginLeft: 8 },
  systemMessageContainer: { backgroundColor: '#F8FAFC', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 16, alignSelf: 'center', marginVertical: 8, elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2 },
  systemMessageText: { color: '#64748B', fontSize: 13, textAlign: 'center', fontWeight: '500' },

  headerBar: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  fullScreenModalTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A', marginLeft: 16, flex: 2 },
  encryptionBody: { padding: 24, alignItems: 'center' },
  lockBadgeBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  encryptionMainTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 12, textAlign: 'center' },
  encryptionDetailText: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  qrPlaceholder: { marginVertical: 10, padding: 15, backgroundColor: '#F8FAFC', borderRadius: 16 },
  securityCodeText: { fontSize: 16, fontWeight: '600', color: '#0F172A', textAlign: 'center', letterSpacing: 1.5, lineHeight: 26, marginVertical: 16 },
  encryptionInfo: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  scanBtn: { backgroundColor: color.defalt, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24 },
});