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
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import ChatUsrHeader from '../../Components/ChatUserHeader';
import { BASIC_URL } from '../Signin/Signin';

const NewMessage = ({ userId, providerId }) => {
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const chatId = [userId, providerId].sort().join('_');
  const peerId = providerId;

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (!snapshot || snapshot.empty) {
          setMessages([]);
          return;
        }

        const allMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: data._id || doc.id,
            text: data.text || '',
            createdAt: data.createdAt?.toDate?.() || new Date(),
            user: data.user || { _id: data.senderId },
            image: data.image || '',
          };
        });

        setMessages(allMessages);
      });

    return () => unsubscribe();
  }, [chatId]);

  const triggerParallelAPIs = async (textMessage) => {
    try {
      const chatForm = new FormData();
      chatForm.append('own_id', userId);
      chatForm.append('chat_user_id', providerId);

      const notifyMessage = textMessage?.trim() ? textMessage : '📷 Sent an image';
      const notifyForm = new FormData();
      notifyForm.append('sender_id', userId);
      notifyForm.append('receiver_id', providerId);
      notifyForm.append('message', notifyMessage);

      await Promise.all([
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
      console.log('Error hitting chat notification APIs:', error);
    }
  };

  const onSend = async (messagesList = []) => {
    try {
      const msg = messagesList[0];
      if (!msg?.text?.trim() && !msg?.image) return;

      const newMessage = {
        _id: msg._id,
        text: msg.text || '',
        createdAt: new Date(),
        senderId: userId.toString(),
        receiverId: peerId.toString(),
        user: { _id: userId.toString() },
        image: msg.image || '',
      };

      const chatRef = firestore().collection('chats').doc(chatId);
      await chatRef.set({ participants: [userId, peerId] }, { merge: true });
      await chatRef.collection('messages').doc(newMessage._id).set(newMessage);

      await triggerParallelAPIs(msg.text);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setUploading(true);
        await uploadImage(result.assets[0]);
      }
    } catch {
      setUploading(false);
    }
  };

  const uploadImage = async asset => {
    try {
      const filename = `chat_images/${Date.now()}_${asset.fileName || 'image.jpg'}`;
      const reference = storage().ref(filename);
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      await reference.put(blob);
      const url = await reference.getDownloadURL();
      setUploading(false);
      await sendImageMessage(url);
    } catch {
      setUploading(false);
    }
  };

  const sendImageMessage = async url => {
    try {
      const messageId = firestore().collection('chats').doc().id;
      const imageMessage = {
        _id: messageId,
        text: '',
        createdAt: new Date(),
        senderId: userId.toString(),
        receiverId: peerId.toString(),
        user: { _id: userId.toString() },
        image: url,
      };

      const chatRef = firestore().collection('chats').doc(chatId);
      await chatRef.set({ participants: [userId, peerId] }, { merge: true });
      await chatRef.collection('messages').doc(messageId).set(imageMessage);

      await triggerParallelAPIs('');
    } catch (error) {
      console.log('Error sending image message:', error);
    }
  };

  const openImageModal = image => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalVisible(false);
  };

  return (
    <View style={styles.chatWrapper}>
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImageModal}>
        <Pressable style={styles.modalContainer} onPress={closeImageModal}>
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
        user={{ _id: userId }}
        alwaysShowSend
        renderMessageImage={props => {
          const { currentMessage } = props;
          if (!currentMessage?.image) return null;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => openImageModal(currentMessage.image)}>
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
                onPress={openCamera}>
                <Icons.AntDesign name="camera" size={26} color={color.defalt} />
              </TouchableOpacity>
            )}

            {uploading ? (
              <ActivityIndicator size="small" color={color.defalt} />
            ) : (
              <Send {...props}>
                <View style={styles.sendButton}>
                  <Icons.FontAwesome name="send" size={18} color={color.wite} />
                </View>
              </Send>
            )}
          </View>
        )}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={styles.inputToolbar}
          />
        )}
        renderComposer={props => (
          <Composer
            {...props}
            placeholder="Type a message..."
            textInputStyle={styles.composerInput}
          />
        )}
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: { backgroundColor: '#F1F5F9' },
              right: { backgroundColor: color.defalt },
            }}
          />
        )}
      />
    </View>
  );
};

const IndvidualCht = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentprovider = route.params?.currentuser;

  const userId = global.id?.toString();
  const peerId = currentprovider?.id?.toString();

  const [providerDetails, setProviderDetails] = useState([]);
  const focus = useIsFocused();

  const getData = useCallback(async () => {
    if (!currentprovider?.id) return;
    try {
      const formdata = new FormData();
      formdata.append('provider_id', currentprovider.id);
      const response = await fetch(`${BASIC_URL}user/get_providers_detail.php`, {
        method: 'POST',
        body: formdata,
      });
      const result = await response.json();
      if (result?.add_skills) {
        setProviderDetails(result.add_skills);
      }
    } catch (error) {
      console.log('Error fetching provider details:', error);
    }
  }, [currentprovider?.id]);

  useEffect(() => {
    if (focus) {
      getData();
    }
  }, [focus, getData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ChatUsrHeader
        recieverdata={currentprovider}
        onPress={() => navigation.goBack()}
        titleText={currentprovider?.name || 'Chat'}
        backIcon="arrow-left"
        dollarIcon="file-invoice-dollar"
        phoneIcon="phone"
        searchIcon="ellipsis-v"
        navigation={navigation}
        onProfilePress={() => {
          if (global.role === '1' && providerDetails[0]) {
            navigation.navigate('ExpertDetail', { item: providerDetails[0] });
          }
        }}
      />
      <View style={styles.chatViewContainer}>
        {userId && peerId ? (
          <NewMessage userId={userId} providerId={peerId} />
        ) : (
          <View style={styles.missingUserBox}>
            <Text style={styles.missingUserText}>
              Missing user information. Please log in again.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default IndvidualCht;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  chatWrapper: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  chatViewContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  chatMsgImage: {
    width: 150,
    height: 100,
    borderRadius: 12,
    margin: 5,
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  cameraIconBtn: {
    marginHorizontal: 8,
  },
  sendButton: {
    marginRight: 10,
    backgroundColor: color.defalt,
    borderRadius: 8,
    padding: 10,
  },
  inputToolbar: {
    marginHorizontal: 8,
    marginBottom: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderTopWidth: 0,
  },
  composerInput: {
    color: '#0F172A',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
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
  },
  missingUserText: {
    textAlign: 'center',
    color: color.defalt,
    fontSize: 15,
  },
});