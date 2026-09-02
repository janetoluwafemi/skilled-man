import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  Dimensions,
  Platform,
  StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import ChatUsrHeader from '../../Components/ChatUserHeader';
import { BASIC_URL } from '../Signin/Signin';
import { db, storage } from '../../../firebase-config';

const NewMessage = ({ userId, providerId, peerData }) => {
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const cleanUserId = String(userId ?? '').trim();
  const cleanProviderId = String(providerId ?? '').trim();
  const chatId = [cleanUserId, cleanProviderId].sort().join('_');
  const peerId = cleanProviderId;

  const parseTimestamp = value => {
    try {
      if (!value) return new Date();
      if (typeof value?.toDate === 'function') return value.toDate();
      if (value instanceof Date) return value;
      if (typeof value === 'object' && typeof value.seconds === 'number') {
        return new Date(value.seconds * 1000);
      }
      if (typeof value === 'number') {
        return new Date(value > 1e10 ? value : value * 1000);
      }
      if (typeof value === 'string') {
        const d = new Date(value);
        if (!isNaN(d.getTime())) return d;
      }
    } catch (e) {
      console.log('parseTimestamp error:', e);
    }
    return new Date();
  };

  useEffect(() => {
    if (!cleanUserId || !cleanProviderId) return;

    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      snapshot => {
        if (!snapshot || snapshot.empty) return;

        const loadedMessages = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            _id: String(data._id || docSnap.id),
            text: data.text || '',
            createdAt: parseTimestamp(data.createdAt),
            user: {
              _id: String(data.senderId || data.user?._id || cleanUserId),
              name: data.user?.name || (String(data.senderId) === cleanUserId ? 'Me' : peerData?.name || 'User'),
              avatar: String(data.senderId) === cleanUserId ? null : (peerData?.image ? `${BASIC_URL}uploads/${peerData.image.replace(/^\/+/, '')}` : null),
            },
            image: data.image || '',
          };
        });

        setMessages(loadedMessages);
      },
      error => {
        console.error('Firestore listener error:', error);
      }
    );

    return () => unsubscribe();
  }, [chatId, cleanUserId, cleanProviderId]);

  const triggerParallelAPIs = textMessage => {
    try {
      const chatForm = new FormData();
      chatForm.append('own_id', cleanUserId);
      chatForm.append('chat_user_id', peerId);

      const notifyMessage = textMessage?.trim() ? textMessage : '📷 Sent an image';
      const notifyForm = new FormData();
      notifyForm.append('sender_id', cleanUserId);
      notifyForm.append('receiver_id', peerId);
      notifyForm.append('message', notifyMessage);

      Promise.allSettled([
        fetch(`${BASIC_URL}firebase/chat.php`, { method: 'POST', body: chatForm }),
        fetch(`${BASIC_URL}firebase/send_notification.php`, { method: 'POST', body: notifyForm }),
      ]).then(async (results) => {
        results.forEach(async (res, idx) => {
          if (res.status === 'fulfilled') {
            const text = await res.value.text();
            console.log(`API ${idx} response:`, text);
          } else {
            console.log(`API ${idx} failed:`, res.reason);
          }
        });
      }).catch(err => {
        console.log('Push sync error:', err);
      });
    } catch (error) {
      console.log('API trigger error:', error);
    }
  };

  const onSend = async (messagesList = []) => {
    try {
      const msg = messagesList[0];
      if (!msg?.text?.trim() && !msg?.image) return;

      const messageId = msg._id ? String(msg._id) : String(Date.now());

      const formattedMsg = {
        _id: messageId,
        text: msg.text ? msg.text.trim() : '',
        createdAt: new Date(),
        senderId: cleanUserId,
        receiverId: peerId,
        user: {
          _id: cleanUserId,
          name: 'Me',
        },
        image: msg.image || '',
      };

      setMessages(prev => GiftedChat.append(prev, [formattedMsg]));

      // Clear unread count locally for this chat
      global.unreadmessage = Math.max(0, (global.unreadmessage || 0) - 1);

      const chatRef = doc(db, 'chats', chatId);

      await setDoc(
        chatRef,
        {
          participants: [cleanUserId, peerId],
          lastMessage: formattedMsg.text || 'Image',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(doc(chatRef, 'messages', messageId), {
        ...formattedMsg,
        createdAt: serverTimestamp(),
      });

      triggerParallelAPIs(formattedMsg.text);
    } catch (error) {
      console.error('Send error:', error);
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera access is needed.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setUploading(true);
        const asset = result.assets[0];
        const filename = `chat_images/${Date.now()}_${asset.fileName || 'image.jpg'}`;
        const reference = ref(storage, filename);
        const response = await fetch(asset.uri);
        const blob = await response.blob();

        await uploadBytes(reference, blob);
        const url = await getDownloadURL(reference);
        setUploading(false);

        const imgMessageId = String(Date.now());
        const imgMessage = {
          _id: imgMessageId,
          text: '',
          createdAt: new Date(),
          senderId: cleanUserId,
          receiverId: peerId,
          user: {
            _id: cleanUserId,
            name: 'Me',
          },
          image: url,
        };

        setMessages(prev => GiftedChat.append(prev, [imgMessage]));

        const chatRef = doc(db, 'chats', chatId);
        await setDoc(
          chatRef,
          {
            participants: [cleanUserId, peerId],
            lastMessage: '📷 Photo',
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        await setDoc(doc(chatRef, 'messages', imgMessageId), {
          ...imgMessage,
          createdAt: serverTimestamp(),
        });
        triggerParallelAPIs('');
      }
    } catch (err) {
      console.error('Camera upload error:', err);
      setUploading(false);
    }
  };

  return (
    <View style={styles.chatWrapper}>
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}>
        <Pressable
          style={styles.modalContainer}
          onPress={() => setImageModalVisible(false)}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>

      <GiftedChat
        messages={messages}
        onSend={messagesList => onSend(messagesList)}
        user={{
          _id: cleanUserId,
          name: 'Me',
        }}
        alwaysShowSend
        renderMessageImage={props => {
          const { currentMessage } = props;
          if (!currentMessage?.image) return null;
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setSelectedImage(currentMessage.image);
                setImageModalVisible(true);
              }}>
              <Image
                source={{ uri: currentMessage.image }}
                style={styles.chatMsgImage}
              />
            </TouchableOpacity>
          );
        }}
        renderSend={props => (
          <View style={styles.sendContainer}>
            {!uploading && (
              <TouchableOpacity
                style={styles.cameraIconBtn}
                onPress={openCamera}
                activeOpacity={0.7}>
                <Icons.Feather name="camera" size={20} color={color.defalt} />
              </TouchableOpacity>
            )}

            {uploading ? (
              <ActivityIndicator
                size="small"
                color={color.defalt}
                style={{ marginRight: 8 }}
              />
            ) : (
              <Send {...props} containerStyle={styles.sendComponentWrapper}>
                <View style={styles.sendButton}>
                  <Icons.Feather name="send" size={16} color="#FFFFFF" />
                </View>
              </Send>
            )}
          </View>
        )}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={styles.inputToolbar}
            primaryStyle={styles.inputToolbarPrimary}
          />
        )}
        renderComposer={props => (
          <Composer
            {...props}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            textInputStyle={styles.composerInput}
          />
        )}
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                padding: 4,
                ...Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                  },
                  android: { elevation: 1 },
                }),
              },
              right: {
                backgroundColor: color.defalt,
                borderRadius: 18,
                padding: 4,
                ...Platform.select({
                  ios: {
                    shadowColor: color.defalt,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                  },
                  android: { elevation: 2 },
                }),
              },
            }}
            textStyle={{
              left: { color: '#0F172A', fontSize: 15, lineHeight: 20 },
              right: { color: '#FFFFFF', fontSize: 15, lineHeight: 20 },
            }}
            timeTextStyle={{
              left: { color: '#64748B', fontSize: 10 },
              right: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 },
            }}
          />
        )}
      />
    </View>
  );
};

const IndividualChat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentprovider = route.params?.currentuser;

  const peerId = String(
    route.params?.receiver_id ||
    currentprovider?.id ||
    currentprovider?.provider_id ||
    currentprovider?.user_id ||
    ''
  ).trim();

  const [resolvedUserId, setResolvedUserId] = useState(
    String(global?.id ?? '').trim()
  );

  useEffect(() => {
    const resolveUser = async () => {
      try {
        if (global.id) {
          setResolvedUserId(String(global.id).trim());
          return;
        }
        const rawUser = await AsyncStorage.getItem('user');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          const possibleId =
            parsed?.id ?? parsed?.userId ?? parsed?.user_id ?? parsed?.data?.id ?? parsed?.data?.user_id;
          if (possibleId) {
            setResolvedUserId(String(possibleId).trim());
            return;
          }
        }
      } catch (e) {
        console.log('Error resolving user:', e);
      }
    };

    resolveUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ChatUsrHeader
        userName={currentprovider?.name || 'Chat'}
        userImage={currentprovider?.image ? `${BASIC_URL}uploads/${currentprovider.image.replace(/^\/+/, '')}` : null}
        onlineStatus={false}
      />
      <View style={styles.chatViewContainer}>
        {resolvedUserId && peerId ? (
          <NewMessage
            userId={resolvedUserId}
            providerId={peerId}
            peerData={currentprovider}
          />
        ) : (
          <View style={styles.missingUserBox}>
            <Icons.Feather name="user-x" size={40} color="#CBD5E1" />
            <Text style={styles.missingUserText}>
              Connecting to conversation...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default IndividualChat;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatViewContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatMsgImage: {
    width: 180,
    height: 120,
    borderRadius: 14,
    margin: 4,
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  cameraIconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    marginRight: 6,
  },
  sendComponentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  sendButton: {
    backgroundColor: color.defalt,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: color.defalt,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 6px rgba(186, 104, 56, 0.25)' },
    }),
  },
  inputToolbar: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderTopWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)' },
    }),
  },
  inputToolbarPrimary: {
    alignItems: 'center',
  },
  composerInput: {
    color: '#0F172A',
    fontSize: 14,
    lineHeight: 20,
    paddingTop: 8,
    ...(Platform.OS === 'web' && {
      outlineWidth: 0,
      outlineColor: 'transparent',
      outlineStyle: 'none',
      borderWidth: 0,
    }),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  missingUserBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  missingUserText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
  },
});

