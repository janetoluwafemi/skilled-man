import React, {useState, useEffect, useCallback} from 'react';
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
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
  MessageText,
} from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

import color from '../../Assets/colors/colors';
import CustomAlert from '../../Components/CustomAlert';
import ChatUsrHeader from '../../Components/ChatUserHeader';
import {Icons} from '../../Components/Icons';
import {BASIC_URL} from '../Signin/Signin';

const getSynchronizedUserId = async () => {
  try {
    const rawUser = await AsyncStorage.getItem('user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      const permanentId = parsed?.id || parsed?.user_id || parsed?.userId;
      if (
          permanentId &&
          String(permanentId).trim() !== '' &&
          !['251', '255', '256'].includes(String(permanentId))
      ) {
        const cleanId = String(permanentId).trim();
        global.id = cleanId;
        return cleanId;
      }
    }
  } catch (e) {
    console.log('Error reading AsyncStorage in getSynchronizedUserId:', e);
  }

  if (
      global.id &&
      String(global.id).trim() !== '' &&
      !['251', '255', '256'].includes(String(global.id))
  ) {
    return String(global.id).trim();
  }
  return null;
};

const AudioMessage = ({ audioUri, isMe }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const textColor = isMe ? '#FFFFFF' : color.defalt;

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const playAudio = async () => {
    try {
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

        newSound.setOnPlaybackStatusUpdate((status) => {
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
          <Icons.Feather name={isPlaying ? "pause-circle" : "play-circle"} size={28} color={textColor} />
        </TouchableOpacity>
        <Icons.Feather name="bar-chart-2" size={24} color={textColor} style={{ opacity: 0.7 }} />
        <Icons.Feather name="bar-chart-2" size={24} color={textColor} style={{ opacity: 0.4, marginLeft: -8 }} />
        <Text style={{ marginLeft: 10, color: textColor, fontSize: 12 }}>Voice Note</Text>
      </View>
  );
};

const NewMessage = ({userId, providerId, peerData, showAlert}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [recording, setRecording] = useState();

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [kebabVisible, setKebabVisible] = useState(false);

  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [openMenuMessageId, setOpenMenuMessageId] = useState(null);

  const [isSearchActive, setIsSearchActive] = useState(route.params?.startSearch || false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentDashboardRole =
      String(global.role) === '1' ? 'provider' : 'customer';

  const cleanUserId = String(userId ?? '').trim();
  let peerId = String(providerId ?? '').trim();

  if (peerId === cleanUserId) {
    const possibleIds = [
      peerData?.user_id,
      peerData?.provider_id,
      peerData?.id,
    ].map(id => String(id || '').trim());
    const actualPeer = possibleIds.find(id => id && id !== cleanUserId);
    peerId = actualPeer || 'incoming-peer-fallback';
  }

  const chatStorageKey = `chat_history_${cleanUserId}_${peerId}`;

  const myAvatar = global.profile
      ? `${BASIC_URL}uploads/${global.profile.replace(/^\/+/, '')}`
      : `${BASIC_URL}uploads/dumy.png`;

  const peerAvatar = peerData?.image
      ? `${BASIC_URL}uploads/${peerData.image.replace(/^\/+/, '')}`
      : `${BASIC_URL}uploads/dumy.png`;

  useEffect(() => {
    if (route.params?.startSearch) {
      setIsSearchActive(true);
    }
  }, [route.params?.startSearch]);

  useEffect(() => {
    const loadLocalHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(chatStorageKey);
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          const alignedHistory = parsedHistory
              .filter(msg => msg.senderRole)
              .map(msg => {
                msg.user._id =
                    msg.senderRole === currentDashboardRole ? cleanUserId : peerId;
                return msg;
              });
          setMessages(alignedHistory);
        }
      } catch (error) {
        console.log('Error loading local chat history', error);
      }
    };
    loadLocalHistory();
  }, [chatStorageKey, currentDashboardRole, cleanUserId, peerId]);

  const fetchApiMessages = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('own_id', cleanUserId);

      const response = await fetch(`${BASIC_URL}get_all_chats.php`, {
        method: 'POST',
        body: formdata,
      });

      const textRes = await response.text();
      let result;
      try {
        result = JSON.parse(textRes);
      } catch (parseErr) {
        return;
      }

      const allChats = result?.chat || [];
      const specificChat = allChats.find(
          c =>
              String(c.chat_id) === peerId ||
              String(c.user_id) === peerId ||
              String(c.provider_id) === peerId ||
              c.name === peerData?.name,
      );

      if (specificChat) {
        let parsedDate = new Date();
        if (specificChat.created_at) {
          const d = new Date(specificChat.created_at);
          if (!isNaN(d.getTime())) parsedDate = d;
        }

        const stableId = String(
            specificChat.id ||
            `${specificChat.created_at}_${specificChat.message}`,
        );

        setMessages(previousMessages => {
          const alreadySentByMe = previousMessages.some(
              m =>
                  m.text.trim() === (specificChat.message || '').trim() &&
                  String(m.user?._id) === String(cleanUserId),
          );

          if (alreadySentByMe) return previousMessages;

          const rawSenderId = String(specificChat.sender_id || '');
          const isActuallyMe = rawSenderId === cleanUserId;

          const oppositeRole =
              currentDashboardRole === 'provider' ? 'customer' : 'provider';
          const msgSenderRole =
              specificChat.senderRole ||
              (isActuallyMe ? currentDashboardRole : oppositeRole);

          const newIncomingMessage = {
            _id: stableId,
            text: specificChat.message || '',
            createdAt: parsedDate,
            senderRole: msgSenderRole,
            user: {
              _id:
                  msgSenderRole === currentDashboardRole ? cleanUserId : peerId,
              name: isActuallyMe
                  ? 'Me'
                  : specificChat.name || peerData?.name || 'User',
              avatar: isActuallyMe ? myAvatar : peerAvatar,
            },
          };

          const existingIds = new Set(previousMessages.map(m => String(m._id)));
          if (!existingIds.has(newIncomingMessage._id)) {
            const updatedMessages = GiftedChat.append(previousMessages, [
              newIncomingMessage,
            ]);
            AsyncStorage.setItem(
                chatStorageKey,
                JSON.stringify(updatedMessages),
            ).catch(e => console.log(e));
            return updatedMessages;
          }

          return previousMessages;
        });
      }
    } catch (error) {
      console.log('Error fetching chat messages:', error);
    }
  }, [cleanUserId, peerId, peerData, chatStorageKey, myAvatar, peerAvatar, currentDashboardRole]);

  useEffect(() => {
    fetchApiMessages();
    const interval = setInterval(() => {
      fetchApiMessages();
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchApiMessages]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        showAlert('Permission Required', 'Microphone access is needed to send voice notes.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

    const uri = recording.getURI();
    if (uri) {
      onSend([{ text: '', audio: uri }]);
    }
  };

  const handleLongPress = (context, message) => {
    if (Platform.OS !== 'web') {
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
      const updatedMessages = prevMessages.filter(
          m => String(m._id) !== String(messageId),
      );
      AsyncStorage.setItem(
          chatStorageKey,
          JSON.stringify(updatedMessages),
      ).catch(e => console.log(e));
      return updatedMessages;
    });
    setSelectedMessage(null);
    setOpenMenuMessageId(null);
  };

  const handleCopyAction = text => {
    if (text) {
      try { Clipboard.setString(text); } catch (e) {}
    }
    setKebabVisible(false);
    setSelectedMessage(null);
    setOpenMenuMessageId(null);
  };

  const handleForwardAction = text => {
    showAlert('Forward Message', `Forwarding: "${text || 'Image message'}"`);
    setKebabVisible(false);
    setSelectedMessage(null);
    setOpenMenuMessageId(null);
  };

  const handleClearChatAction = () => {
    setMessages([]);
    AsyncStorage.removeItem(chatStorageKey).catch(e => console.log(e));
    setSelectedMessage(null);
    setKebabVisible(false);
  };

  const onSend = async (messagesList = []) => {
    try {
      const msg = messagesList[0];

      if (!msg?.text?.trim() && !msg?.image && !msg?.audio) {
        return;
      }

      const currentSyncId = (await getSynchronizedUserId()) || cleanUserId;
      const textContent = msg.text ? msg.text.trim() : (msg.audio ? '🎤 Voice Note' : '');

      const formattedMsg = {
        _id: String(Date.now()),
        text: textContent,
        createdAt: new Date(),
        senderRole: currentDashboardRole,
        user: {
          _id: cleanUserId,
          name: 'Me',
          avatar: myAvatar,
        },
        image: msg.image || '',
        audio: msg.audio || '', // Handle Audio
      };

      setMessages(previousMessages => {
        const updatedMessages = GiftedChat.append(previousMessages, [
          formattedMsg,
        ]);
        AsyncStorage.setItem(
            chatStorageKey,
            JSON.stringify(updatedMessages),
        ).catch(e => console.log(e));
        return updatedMessages;
      });

      const chatForm = new FormData();
      chatForm.append('own_id', currentSyncId);
      chatForm.append('chat_user_id', peerId);
      chatForm.append('message', textContent);
      chatForm.append('senderRole', currentDashboardRole);

      const notifyForm = new FormData();
      notifyForm.append('sender_id', currentSyncId);
      notifyForm.append('receiver_id', peerId);
      notifyForm.append('message', textContent || (msg.image ? '📷 Sent an image' : '🎤 Sent a voice note'));

      await Promise.allSettled([
        fetch(`${BASIC_URL}firebase/chat.php`, {
          method: 'POST',
          body: chatForm,
        }),
        fetch(`${BASIC_URL}firebase/send_notification.php`, {
          method: 'POST',
          body: notifyForm,
        }),
      ]);
    } catch (error) {
      console.error('Send error:', error);
      showAlert('Send failed', 'Could not send message. Please check your connection.');
    }
  };

  const openCamera = async () => {
    try {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission Required', 'Camera access is needed.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setUploading(true);
        const asset = result.assets[0];
        setUploading(false);
        onSend([{text: '', image: asset.uri}]);
      }
    } catch (err) {
      setUploading(false);
      showAlert('Upload failed', 'Could not upload image.');
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

  const displayedMessages = searchQuery.trim()
      ? messages.filter(m => m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()))
      : messages;

  return (
      <View style={styles.chatWrapper}>
        {selectedMessage ? (
            <View style={styles.contextualHeader}>
              <View style={styles.contextHeaderLeft}>
                <TouchableOpacity onPress={() => { setSelectedMessage(null); setKebabVisible(false); }}>
                  <Icons.Feather name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.contextHeaderText}>1</Text>
              </View>
              <View style={styles.contextHeaderRight}>
                <TouchableOpacity style={styles.iconBtn}><Icons.Feather name="corner-up-left" size={22} color="#FFF" /></TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}><Icons.Feather name="star" size={22} color="#FFF" /></TouchableOpacity>
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
              {kebabVisible && (
                  <View style={styles.kebabMenu}>
                    <TouchableOpacity onPress={() => handleCopyAction(selectedMessage.text)} style={styles.kebabMenuItem}>
                      <Text style={styles.kebabMenuText}>Copy Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleClearChatAction} style={styles.kebabMenuItem}>
                      <Text style={[styles.kebabMenuText, {color: '#EF4444'}]}>Clear Chat</Text>
                    </TouchableOpacity>
                  </View>
              )}
            </View>
        ) : isSearchActive ? (
            <View style={styles.searchHeader}>
              <TouchableOpacity onPress={() => {
                setIsSearchActive(false);
                setSearchQuery('');
                navigation.setParams({ startSearch: false });
              }}>
                <Icons.Feather name="arrow-left" size={24} color="#0F172A" />
              </TouchableOpacity>

              <TextInput
                  style={styles.searchHeaderInput}
                  placeholder="Search..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
              />

              {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={{marginRight: 12}}>
                    <Icons.Feather name="x" size={20} color="#64748B" />
                  </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.iconBtn}>
                <Icons.Feather name="calendar" size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>
        ) : (
            <ChatUsrHeader
                userName={peerData?.name || 'Chat'}
                userImage={peerAvatar}
                onlineStatus={true}
                onProfilePress={() => {
                  navigation.navigate('UserProfile', { userId: peerId, userData: peerData });
                }}
            />
        )}

        <Modal visible={imageModalVisible} transparent animationType="fade" onRequestClose={() => setImageModalVisible(false)}>
          <Pressable style={styles.modalContainer} onPress={() => setImageModalVisible(false)}>
            <Image source={{uri: selectedImage}} style={styles.fullImage} resizeMode="contain" />
          </Pressable>
        </Modal>

        <GiftedChat
            messages={displayedMessages}
            extraData={{selectedMessage, hoveredMessageId, openMenuMessageId, searchQuery}}
            bottomOffset={Platform.OS === 'ios' ? insets.bottom : 0}
            onSend={messagesList => onSend(messagesList)}
            user={{_id: String(cleanUserId)}}
            showUserAvatar={true}
            alignTop={false}
            scrollToBottom={true}
            renderAvatarOnTop={true}
            inverted={true}
            alwaysShowSend
            messagesContainerStyle={{backgroundColor: '#F0F2F5', paddingBottom: 10}}
            listViewProps={{style: {flex: 1}}}

            renderMessageAudio={(props) => {
              const { currentMessage, position } = props;
              const isMe = position === 'right';
              return <AudioMessage audioUri={currentMessage.audio} isMe={isMe} />;
            }}

            renderMessageImage={props => {
              const {currentMessage} = props;
              if (!currentMessage?.image) return null;
              return (
                  <TouchableOpacity activeOpacity={0.9} onPress={() => { setSelectedImage(currentMessage.image); setImageModalVisible(true); }}>
                    <Image source={{uri: currentMessage.image}} style={styles.chatMsgImage} resizeMode="cover" />
                  </TouchableOpacity>
              );
            }}
            renderMessageText={(props) => {
              const { currentMessage, position } = props;
              const text = currentMessage?.text || '';

              if (currentMessage.audio) return null;

              if (searchQuery && text.toLowerCase().includes(searchQuery.toLowerCase())) {
                const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
                const textColor = position === 'right' ? '#FFFFFF' : color.defalt;

                return (
                    <View style={{ paddingTop: 5, paddingBottom: 5, paddingHorizontal: 10 }}>
                      <Text style={{ fontSize: 15.5, lineHeight: 22, color: textColor }}>
                        {parts.map((part, i) =>
                            part.toLowerCase() === searchQuery.toLowerCase() ? (
                                <Text key={i} style={{ backgroundColor: 'rgba(255, 215, 0, 0.6)', fontWeight: 'bold' }}>
                                  {part}
                                </Text>
                            ) : (
                                <Text key={i}>{part}</Text>
                            )
                        )}
                      </Text>
                    </View>
                );
              }

              return (
                  <MessageText
                      {...props}
                      textStyle={{
                        left: { color: color.defalt, fontSize: 15.5, lineHeight: 22 },
                        right: { color: '#FFFFFF', fontSize: 15.5, lineHeight: 22 },
                      }}
                  />
              );
            }}
            renderInputToolbar={props => (
                <InputToolbar {...props} containerStyle={styles.inputToolbar} primaryStyle={styles.inputToolbarPrimary} />
            )}

            renderComposer={props => {
              const hasText = props.text && props.text.trim().length > 0;
              return (
                  <View style={styles.composerWrapper}>
                    <TouchableOpacity style={styles.inputActionBtn}><Icons.Feather name="smile" size={24} color="#64748B" /></TouchableOpacity>
                    <Composer {...props} placeholder="Message..." placeholderTextColor="#94A3B8" textInputStyle={[styles.composerInput, {color: '#0F172A'}]} />
                    <View style={styles.composerRightIcons}>
                      <TouchableOpacity style={styles.inputActionBtn}><Icons.Feather name="paperclip" size={22} color="#64748B" /></TouchableOpacity>

                      {!hasText && !uploading && (
                          <TouchableOpacity style={styles.inputActionBtn} onPress={openCamera}>
                            <Icons.Feather name="camera" size={22} color="#64748B" />
                          </TouchableOpacity>
                      )}
                    </View>
                  </View>
              );
            }}

            renderSend={props => {
              const hasText = props.text && props.text.trim().length > 0;
              return (
                  <View style={styles.sendComponentWrapper}>
                    {hasText ? (
                        <Send {...props} containerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                          <View style={styles.sendButton}>
                            {uploading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Icons.Feather name="send" size={16} color="#FFFFFF" style={{marginLeft: -2}} />}
                          </View>
                        </Send>
                    ) : (
                        <TouchableOpacity
                            onPressIn={startRecording}
                            onPressOut={stopRecording}
                            activeOpacity={0.7}
                            style={[styles.sendButton, recording && { backgroundColor: '#EF4444' }]}
                        >
                          <Icons.Feather name="mic" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}
                  </View>
              );
            }}

            renderBubble={props => {
              const isSelected = selectedMessage && selectedMessage._id === props.currentMessage._id;
              const isHovered = Platform.OS === 'web' && hoveredMessageId === props.currentMessage._id;
              const isMenuOpen = Platform.OS === 'web' && openMenuMessageId === props.currentMessage._id;
              const isMe = props.currentMessage.user._id === String(cleanUserId);

              return (
                  <Pressable
                      onHoverIn={() => Platform.OS === 'web' && setHoveredMessageId(props.currentMessage._id)}
                      onHoverOut={() => Platform.OS === 'web' && setHoveredMessageId(null)}
                      onLongPress={() => handleLongPress(null, props.currentMessage)}
                      onPress={() => handlePress(null, props.currentMessage)}
                      style={{
                        backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                        width: '100%',
                        borderRadius: 8,
                        position: 'relative',
                      }}>
                    <View style={{zIndex: 1}}>
                      <Bubble
                          {...props}
                          wrapperStyle={{
                            left: { backgroundColor: '#FFFFFF', borderRadius: 16, borderBottomLeftRadius: 4, borderBottomRightRadius: 16, padding: 4, marginBottom: 4, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.08, shadowRadius: 2, }, android: {elevation: 1}, }), },
                            right: { backgroundColor: color.defalt, borderRadius: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 4, padding: 4, marginBottom: 4, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 4, }, android: {elevation: 2}, }), },
                          }}
                          textStyle={{
                            left: { color: color.defalt, fontSize: 15.5, lineHeight: 22, textAlign: 'left', },
                            right: { color: '#FFFFFF', fontSize: 15.5, lineHeight: 22, textAlign: 'left', },
                          }}
                          timeTextStyle={{
                            left: {color: color.defalt, fontSize: 11, opacity: 0.7},
                            right: {color: 'rgba(255, 255, 255, 0.75)', fontSize: 11},
                          }}
                      />
                    </View>

                    {Platform.OS === 'web' && (isHovered || isMenuOpen) && (
                        <TouchableOpacity
                            style={[styles.webChevronArrow, isMe ? {right: 8} : {left: 8}]}
                            onPress={e => { e.stopPropagation(); e.preventDefault(); setOpenMenuMessageId(isMenuOpen ? null : props.currentMessage._id); }}>
                          <Icons.Feather name="chevron-down" size={20} color={isMe ? '#FFFFFF' : '#64748B'} />
                        </TouchableOpacity>
                    )}

                    {Platform.OS === 'web' && isMenuOpen && (
                        <View style={[styles.webDropdownMenu, isMe ? {right: 20} : {left: 20}]}>
                          {[
                            {label: 'Reply', icon: 'corner-up-left'},
                            {label: 'Copy', icon: 'copy'},
                            {label: 'React', icon: 'smile'},
                            {label: 'Forward', icon: 'corner-up-right'},
                            {label: 'Pin', icon: 'map-pin'},
                            {label: 'Star', icon: 'star'},
                            {label: 'Report', icon: 'thumbs-down'},
                            {label: 'Delete', icon: 'trash'},
                          ].map(item => (
                              <TouchableOpacity
                                  key={item.label}
                                  style={styles.webDropdownItem}
                                  onPress={e => {
                                    e.stopPropagation();
                                    if (item.label === 'Copy') handleCopyAction(props.currentMessage.text);
                                    else if (item.label === 'Delete') deleteMessageLocally(props.currentMessage._id);
                                    else if (item.label === 'Forward') handleForwardAction(props.currentMessage.text);
                                    else setOpenMenuMessageId(null);
                                  }}>
                                <Icons.Feather name={item.icon} size={18} color="#64748B" />
                                <Text style={styles.webDropdownText}>{item.label}</Text>
                              </TouchableOpacity>
                          ))}
                        </View>
                    )}
                  </Pressable>
              );
            }}
        />
      </View>
  );
};

const IndividualChat = () => {
  const route = useRoute();

  const currentprovider = route.params?.currentuser || route.params?.userData;

  const peerId = String(
      route.params?.receiver_id ||
      route.params?.userId ||
      currentprovider?.id ||
      currentprovider?.provider_id ||
      currentprovider?.user_id ||
      '',
  ).trim();

  const [resolvedUserId, setResolvedUserId] = useState(null);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    onOk: () => setAlertConfig(prev => ({...prev, visible: false})),
  });

  const showAlert = (title, message, onOk) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      onOk: () => {
        setAlertConfig(prev => ({...prev, visible: false}));
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
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.chatViewContainer}>
          {resolvedUserId && peerId ? (
              <NewMessage
                  userId={resolvedUserId}
                  providerId={peerId}
                  peerData={currentprovider}
                  showAlert={showAlert}
              />
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

export default IndividualChat;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5', },
  chatWrapper: { flex: 1, backgroundColor: '#F0F2F5', },
  chatViewContainer: { flex: 1, backgroundColor: '#F0F2F5', },
  contextualHeader: { height: 60, backgroundColor: color.defalt, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 10, elevation: 4, },
  contextHeaderLeft: { flexDirection: 'row', alignItems: 'center', },
  contextHeaderText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginLeft: 20, },
  contextHeaderRight: { flexDirection: 'row', alignItems: 'center', },
  searchHeader: { height: 60, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, zIndex: 10, elevation: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, },
  searchHeaderInput: {
    flex: 1,
    height: 40,
    marginLeft: 12,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 0,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  iconBtn: { marginLeft: 16, padding: 4, },
  kebabMenu: { position: 'absolute', top: 55, right: 16, backgroundColor: '#FFFFFF', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, paddingVertical: 4, zIndex: 1000, },
  kebabMenuItem: { paddingHorizontal: 20, paddingVertical: 12, },
  kebabMenuText: { fontSize: 15, color: '#0F172A', fontWeight: '500', },
  chatMsgImage: { width: 240, height: 180, borderRadius: 12, margin: 4, },
  inputToolbar: { backgroundColor: '#F0F2F5', borderTopWidth: 0, paddingHorizontal: 12, paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 24 : 12, },
  inputToolbarPrimary: { alignItems: 'flex-end', justifyContent: 'space-between', },
  composerWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, paddingLeft: 8, paddingRight: 6, marginRight: 10, minHeight: 46, borderWidth: 1, borderColor: '#E2E8F0', },
  inputActionBtn: { padding: 8, },
  composerRightIcons: { flexDirection: 'row', alignItems: 'center', },
  composerInput: { color: '#0F172A', fontSize: 15, lineHeight: 20, paddingTop: Platform.OS === 'ios' ? 12 : 10, paddingBottom: Platform.OS === 'ios' ? 12 : 10, flex: 1, ...(Platform.OS === 'web' && {outlineWidth: 0}), },
  sendComponentWrapper: { justifyContent: 'center', alignItems: 'center', marginBottom: 2, },
  sendButton: { backgroundColor: color.defalt, borderRadius: 22, width: 44, height: 44, justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: color.defalt, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 4, }, android: {elevation: 2}, web: {boxShadow: '0 2px 6px rgba(186, 104, 56, 0.25)'}, }), },
  modalContainer: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.95)', justifyContent: 'center', alignItems: 'center', },
  fullImage: { width: Dimensions.get('window').width, height: Dimensions.get('window').height, },
  missingUserBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, },
  missingUserText: { textAlign: 'center', color: '#64748B', fontSize: 15, fontWeight: '600', marginTop: 12, },
  webChevronArrow: { position: 'absolute', top: 4, zIndex: 10, padding: 2, backgroundColor: 'transparent', },
  webDropdownMenu: { position: 'absolute', top: 30, backgroundColor: '#FFFFFF', borderRadius: 8, paddingVertical: 8, minWidth: 160, zIndex: 9999, ...Platform.select({ web: {boxShadow: '0 4px 12px rgba(0,0,0,0.15)'}, }), },
  webDropdownItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, },
  webDropdownText: { fontSize: 15, color: '#0F172A', marginLeft: 12, fontWeight: '400', },
});