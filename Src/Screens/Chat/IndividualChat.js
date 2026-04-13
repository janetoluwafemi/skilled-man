import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import color from '../../Assets/colors/colors';
import {Icons} from '../../Components/Icons';
import ChatUsrHeader from '../../Components/ChatUserHeader';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import {launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {BASIC_URL} from '../Signin/Signin';

// -------------------------------------------------------------

const NewMessage = ({userId, providerId, onChatUpdate}) => {
  const [messages, setMessages] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // 🔹 Image modal states (ADDED)
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
            user: data.user || {_id: data.senderId},
            image: data.image || '',
          };
        });

        setMessages(allMessages);
      });

    return () => unsubscribe();
  }, [chatId]);

  const clearImagePreview = () => {
    setImageUrl('');
    setShowPreview(false);
    setImageData(null);
  };

  const onSend = async (messages = []) => {
    try {
      const msg = messages[0];
      if (!msg?.text?.trim() && !msg?.image) return;

      const imageToSend = showPreview ? imageUrl : msg.image || '';

      const newMessage = {
        _id: msg._id,
        text: msg.text || '',
        createdAt: new Date(),
        senderId: userId.toString(),
        receiverId: peerId.toString(),
        user: {_id: userId.toString()},
        image: imageToSend,
      };

      const chatRef = firestore().collection('chats').doc(chatId);
      await chatRef.set({participants: [userId, peerId]}, {merge: true});
      await chatRef.collection('messages').doc(newMessage._id).set(newMessage);

      clearImagePreview();
      // ********************** Sending Notification ******************
      //   const formdata = new FormData();
      //   formdata.append('own_id', userId);
      //   formdata.append('chat_user_id', providerId);

      //   await fetch('https://theskilledman.com/api/firebase/chat.php', {
      //     method: 'POST',
      //     body: formdata,
      //   });
      //   console.log(
      //     'Ids of user and provider sent for notification:',
      //     userId,
      //     providerId,
      //   );
      // } catch (error) {
      //   Alert.alert('Error', 'Failed to send message');
      // }
      // ********************** Sending Notification (2 APIs Parallel) ******************

      console.log('🚀 Starting Parallel API Calls...');

      // ---------- CHAT.PHP FORM DATA ----------
      const chatForm = new FormData();
      chatForm.append('own_id', userId);
      chatForm.append('chat_user_id', providerId);

      console.log('📤 Data Sent to chat.php:');
      console.log({
        own_id: userId,
        chat_user_id: providerId,
      });

      // ---------- NOTIFICATION FORM DATA ----------
      const notifyMessage = msg.text?.trim() ? msg.text : '📷 Sent an image';

      const notifyForm = new FormData();
      notifyForm.append('sender_id', userId);
      notifyForm.append('receiver_id', providerId);
      notifyForm.append('message', notifyMessage);

      console.log('📤 Data Sent to send_notification.php:');
      console.log({
        sender_id: userId,
        receiver_id: providerId,
        message: notifyMessage,
      });

      // ---------- HIT BOTH APIS TOGETHER ----------
      try {
        const [chatRes, notifyRes] = await Promise.all([
          fetch('https://theskilledman.com/api/firebase/chat.php', {
            method: 'POST',
            body: chatForm,
          }),

          fetch(
            'https://theskilledman.com/api/firebase/send_notification.php',
            {
              method: 'POST',
              body: notifyForm,
            },
          ),
        ]);

        console.log('✅ Both API Requests Completed!');

        // ---------- CHAT.PHP RESPONSE ----------
        console.log('📥 chat.php Response Status:', chatRes.status);

        const chatText = await chatRes.text();
        console.log('📥 chat.php Raw Response Text:', chatText);

        let chatJson = null;
        try {
          chatJson = JSON.parse(chatText);
          console.log('📥 chat.php Parsed JSON Response:', chatJson);
        } catch {
          console.log('⚠️ chat.php Response is NOT JSON');
        }

        // ---------- SEND_NOTIFICATION.PHP RESPONSE ----------
        console.log(
          '📥 send_notification.php Response Status:',
          notifyRes.status,
        );

        const notifyText = await notifyRes.text();
        console.log('📥 send_notification.php Raw Response Text:', notifyText);

        let notifyJson = null;
        try {
          notifyJson = JSON.parse(notifyText);
          console.log(
            '📥 send_notification.php Parsed JSON Response:',
            notifyJson,
          );
        } catch {
          console.log('⚠️ send_notification.php Response is NOT JSON');
        }

        // ---------- FINAL SUCCESS LOG ----------
        console.log('🎉 Parallel APIs Hit Successfully!');
        console.log('➡️ Sender:', userId);
        console.log('➡️ Receiver:', providerId);
        console.log('➡️ Message Sent:', notifyMessage);
      } catch (error) {
        console.log('❌ Error While Calling Parallel APIs:', error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };
  const openCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      });

      if (!result.didCancel && result.assets?.length > 0) {
        setImageData(result.assets[0]);
        setShowPreview(true);
        setUploading(true);
        setImageUrl(result.assets[0].uri);
        await uploadImage(result.assets[0]);
      }
    } catch {
      setUploading(false);
    }
  };

  const uploadImage = async asset => {
    try {
      const filename = `chat_images/${Date.now()}_${
        asset.fileName || 'image.jpg'
      }`;
      const reference = storage().ref(filename);
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      await reference.put(blob);
      const url = await reference.getDownloadURL();
      setImageUrl(url);
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
        user: {_id: userId.toString()},
        image: url,
      };

      const chatRef = firestore().collection('chats').doc(chatId);
      await chatRef.set({participants: [userId, peerId]}, {merge: true});
      await chatRef.collection('messages').doc(messageId).set(imageMessage);

      clearImagePreview();

      const formdata = new FormData();
      formdata.append('own_id', userId);
      await fetch('https://theskilledman.com/api/firebase/chat.php', {
        method: 'POST',
        body: formdata,
      });
    } catch {}
  };

  // 🔹 Image modal handlers (ADDED)
  const openImageModal = image => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalVisible(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* 🔹 Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImageModal}>
        <Pressable style={styles.modalContainer} onPress={closeImageModal}>
          <Image
            source={{uri: selectedImage}}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{_id: userId}}
        alwaysShowSend
        // 🔹 IMAGE CLICK FIX (KEY PART)
        renderMessageImage={props => {
          const {currentMessage} = props;
          if (!currentMessage?.image) return null;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => openImageModal(currentMessage.image)}>
              <Image
                source={{uri: currentMessage.image}}
                style={{
                  width: 150,
                  height: 100,
                  borderRadius: 12,
                  margin: 5,
                }}
              />
            </TouchableOpacity>
          );
        }}
        renderSend={props => (
          <View style={styles.sendContainer}>
            {!uploading && (
              <TouchableOpacity
                style={{marginHorizontal: 10}}
                onPress={openCamera}>
                <Icons.AntDesign name="camera" size={28} color={color.defalt} />
              </TouchableOpacity>
            )}

            {uploading ? (
              <ActivityIndicator size="small" color={color.defalt} />
            ) : (
              <Send {...props}>
                <View style={styles.sendButton}>
                  <Icons.FontAwesome name="send" size={22} color={color.wite} />
                </View>
              </Send>
            )}
          </View>
        )}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={{
              marginHorizontal: 5,
              marginBottom: 5,
              backgroundColor: '#e4e4e4',
              borderTopWidth: 0,
            }}
          />
        )}
        renderComposer={props => (
          <Composer
            {...props}
            placeholder="Type a message..."
            textInputStyle={{color: 'black', fontSize: 16}}
          />
        )}
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {backgroundColor: '#f1f1f1'},
              right: {backgroundColor: color.defalt},
            }}
          />
        )}
      />
    </View>
  );
};

// -------------------------------------------------------------

const IndvidualCht = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentprovider = route.params?.currentuser;
  //  const route = useRoute();
  const {chatId} = route.params || {};

  useEffect(() => {
    if (chatId) {
      console.log('Opening chat:', chatId);
      // fetch messages of this chatId
    }
  }, [chatId]);

  const userId = global.id?.toString();
  const peerId = currentprovider?.id?.toString();

  const [P_Data, setP_Data] = useState([]);
  const focus = useIsFocused();

  const getData = async () => {
    const formdata = new FormData();
    formdata.append('provider_id', currentprovider?.id);
    const response = await fetch(`${BASIC_URL}user/get_providers_detail.php`, {
      method: 'POST',
      body: formdata,
    });
    const result = await response.json();
    console.log('✅ Provider details result:', result.add_skills);
    if (result?.add_skills) setP_Data(result.add_skills);
  };

  useEffect(() => {
    getData();
  }, [focus]);
  const handlechat = async () => {
    const formdata = new FormData();
    formdata.append('own_id', global.id);
    try {
      const response = await fetch(
        'https://theskilledman.com/api/firebase/chat.php',
        {
          method: 'POST',
          body: formdata,
        },
      );
      const result = await response.json();
      console.log('✅ chat.php result:', JSON.stringify(result, null, 2));
      if (result?.chat?.chat?.length > 0) {
        const lastChat = result.chat.chat[0];
        console.log(`💬 Last Chat from ${lastChat.name}: ${lastChat.message}`);
      } else {
        console.log('ℹ️ No chat messages found.');
      }
    } catch (error) {
      console.error('❌ Error fetching chat:', error);
    }
  };
  console.log('Chat screen Data visualization', P_Data);
  return (
    <>
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
          if (global.role === '1') {
            navigation.navigate('ExpertDetail', {item: P_Data[0]});
          }
        }}
      />
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {userId && peerId ? (
          <NewMessage
            userId={userId}
            providerId={peerId}
            onChatUpdate={handlechat}
          />
        ) : (
          <Text
            style={{textAlign: 'center', marginTop: 30, color: color.defalt}}>
            Missing user information. Please log in again.
          </Text>
        )}
      </View>
    </>
  );
};

// -------------------------------------------------------------

const styles = StyleSheet.create({
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  sendButton: {
    marginRight: 15,
    backgroundColor: color.defalt,
    borderRadius: 8,
    padding: 10,
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
});

export default IndvidualCht;
