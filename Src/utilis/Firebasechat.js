import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useRoute } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import color from '../Assets/colors/colors';
import { Icons } from '../Components/Icons';
import { BASIC_URL } from '../Screens/Signin/Signin';

const ConversationScreen = () => {
  const userId = global.id;
  const route = useRoute();
  const currentprovider = route.params?.currentuser;

  if (currentprovider?.id) {
    global.providerid = currentprovider.id;
  }
  const providerId = global.providerid;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [attachment, setAttachment] = useState(null);

  const conversationId = [userId, providerId].sort().join('_');

  useEffect(() => {
    if (Platform.OS === 'web' || !conversationId) return;

    let unsubscribe = () => {};

    try {
      unsubscribe = firestore()
        .collection('chat')
        .doc(conversationId)
        .collection('message')
        .orderBy('timestamp', 'asc')
        .onSnapshot(querySnapshot => {
          if (querySnapshot) {
            const fetchedMessages = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMessages(fetchedMessages);
          }
        });
    } catch (error) {
      console.log('Firestore listener error:', error);
    }

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = async () => {
    if (messageText.trim() === '' && !attachment) return;

    if (Platform.OS === 'web') {
      console.log('Firebase storage/chat is native-only in this setup.');
      setMessageText('');
      setAttachment(null);
      return;
    }

    const messageData = {
      userId,
      providerId,
      text: messageText.trim(),
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    if (attachment) {
      try {
        const response = await fetch(attachment.uri);
        const blob = await response.blob();
        const filename = attachment.name || `file_${Date.now()}`;
        const storageRef = storage().ref(`attachments/${filename}`);
        await storageRef.put(blob);
        const downloadUrl = await storageRef.getDownloadURL();

        messageData.attachment = {
          type: attachment.mimeType || attachment.type,
          uri: downloadUrl,
          name: filename,
        };
      } catch (err) {
        console.log('Error uploading attachment:', err);
      }
      setAttachment(null);
    }

    try {
      await firestore()
        .collection('chat')
        .doc(conversationId)
        .collection('message')
        .add(messageData);
    } catch (err) {
      console.log('Error sending message:', err);
    }

    setMessageText('');
  };

  const pickAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAttachment(result.assets[0]);
      }
    } catch (err) {
      console.log('Error picking file:', err);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <ScrollView style={styles.scrollContainer}>
        {messages.map(message => {
          const isSender = message.userId === userId;
          return (
            <View
              key={message.id}
              style={[
                styles.msgRow,
                { justifyContent: isSender ? 'flex-end' : 'flex-start' },
              ]}>
              {!isSender && (
                <Image
                  source={
                    currentprovider?.image
                      ? { uri: `${BASIC_URL}uploads/${currentprovider.image}` }
                      : require('../Assets/Images/user.jpg')
                  }
                  style={styles.avatarImg}
                />
              )}

              <View
                style={[
                  styles.msgBubble,
                  { backgroundColor: isSender ? '#965c00' : '#e4e4e4' },
                ]}>
                {message.attachment &&
                message.attachment.type?.startsWith('image') ? (
                  <TouchableOpacity activeOpacity={0.8}>
                    <Image
                      source={{ uri: message.attachment.uri }}
                      style={styles.attachmentImage}
                    />
                  </TouchableOpacity>
                ) : (
                  <Text style={{ color: isSender ? color.wite : color.blak }}>
                    {message.text}
                  </Text>
                )}

                {message.attachment && (
                  <Text style={styles.attachmentName}>
                    {message.attachment.name}
                  </Text>
                )}

                <Text
                  style={[
                    styles.timestampText,
                    { color: isSender ? '#ddd' : color.litGry },
                  ]}>
                  {message.timestamp?.toDate
                    ? new Date(message.timestamp.toDate()).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    : ''}
                </Text>
              </View>

              {isSender && (
                <Image
                  source={
                    global.profile
                      ? { uri: `${BASIC_URL}uploads/${global.profile}` }
                      : require('../Assets/Images/user.jpg')
                  }
                  style={styles.avatarImg}
                />
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Send Message"
          placeholderTextColor={color.litGry}
          value={messageText}
          onChangeText={setMessageText}
        />

        <View style={styles.actionIcons}>
          <TouchableOpacity onPress={pickAttachment}>
            <Icons.AntDesign name="paperclip" size={24} color={color.litGry} />
          </TouchableOpacity>

          <TouchableOpacity onPress={sendMessage}>
            <Icons.FontAwesome name="send" size={18} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {attachment ? (
        <Text style={styles.attachmentPreview} numberOfLines={1}>
          Attached: {attachment.name}
        </Text>
      ) : null}
    </View>
  );
};

export default ConversationScreen;

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginVertical: 6,
  },
  avatarImg: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  msgBubble: {
    borderRadius: 12,
    padding: 10,
    maxWidth: '70%',
  },
  attachmentImage: {
    width: 180,
    height: 180,
    borderRadius: 8,
  },
  attachmentName: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  textInput: {
    color: color.blak,
    flex: 1,
    paddingHorizontal: 12,
    height: 42,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendIcon: {
    marginLeft: 10,
    backgroundColor: color.defalt,
    color: color.wite,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  attachmentPreview: {
    fontSize: 12,
    color: color.defalt,
    marginTop: 4,
    paddingLeft: 12,
  },
});