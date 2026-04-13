// const usersCollection = firestore().collection('chat');
// // Get user document with an ID
// const userDocument = firestore().collection('chat').doc('rNhaUfLwpukpesn3Kg5R');

// class FirebaseApp extends Component {
//     constructor(props) {
//         super(props);
//         state = {
//           // user: {
//           //   name: '',
//           // },
//           users: [],
//         };
//     // this.getUser();
//     // this.getfilteruser();
//     this.subcriber = firestore()
//       .collection('chat')
//       //.doc('rNhaUfLwpukpesn3Kg5R')
//       .onSnapshot(docs => {
//         let users = [];
//         docs.forEach(doc => {
//           users.push(doc.data());
//         });
//         this.setState({users});
//         console.log(users);
//         // this.setState({
//         //   user: {
//         //     name: doc.data().receiver_id,
//         //   },
//         // });
//       });
//     // firestore()
//     //   .collection('chat')
//     //   .get()
//     //   .then(querySnapshot => {
//     //     console.log('Total users: ', querySnapshot.size);

//     //     querySnapshot.forEach(documentSnapshot => {
//     //       console.log(
//     //         'User ID: ',
//     //         documentSnapshot.id,
//     //         documentSnapshot.data(),
//     //       );
//     //     });
//     //   });
//   }
//   getUser = async () => {
//     const userDocument = await firestore()
//       .collection('chat')
//       .doc('rNhaUfLwpukpesn3Kg5R')
//       .get();
//     console.log(userDocument);
//   };
//   //filteruser
//   //   getfilteruser=async()=>{
//   //     const userDocument = await firestore()
//   //     .collection('chat')
//   //     .where('age','<',25)
//   //     .get();
//   //   console.log(userDocument);

//   //   }
//   addRandomUser=async()=>{
//     let name =Math.random().toString(36).substring(7)
//               firestore().collection('users').add({
//                 receiver_id,
//                 created_at:20-2-2024

//               })
//   }
//   render() {
//     return(
//     <View>
//         <Button title='Add' onPress={this.addRandomUser}/>
//       {this.state.users.map((user, index) => (
//         <View key={index}>
//           <Text>{user.receiver_id}</Text>
//         </View>
//       ))}
//     </View>
//     );
//     //  <View>Name :{this.state.user.receiver_id}</View>;
//   }
// }
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
// const ConversationScreen = () => {
//    const userId = 1;
//   const providerid =2;
//   const route = useRoute();
//   const currentprovider = route.params?.currentuser;
//   const [messages, setMessages] = useState([]);
//   const conversationId = [userId,providerid ].sort().join('_'); // Create a unique conversation ID

//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection('chat')
//       .doc(conversationId)
//       .collection('message')
//       .orderBy('timestamp', 'desc')
//       .onSnapshot(querySnapshot => {
//         const messages = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setMessages(messages);
//       });

//     return () => unsubscribe();
//   }, [conversationId]);

//   const sendMessage = async (text) => {
//     await firestore()
//       .collection('chat')
//       .doc(conversationId)
//       .collection('message')
//       .add({
//         userId,
//         providerid,
//         text,
//         timestamp: firestore.FieldValue.serverTimestamp(),
//       });
//   };

//   const updateLastMessage = async (text) => {
//     await firestore()
//       .collection('chat')
//       .doc(conversationId)
//       .update({
//         lastMessage: text,
//         lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
//       });
//   };

//   const handleSendMessage = async () => {
//     const messageText = 'Your here mnmnmnm'; // Replace with actual message
//     await sendMessage(messageText);
//     await updateLastMessage(messageText);
//   };

//   return (
//     <View>

//       {messages.map(message => (
//         <View
//         style={{backgroundColor:'black',height:22}}
//         key={message.id}>
//           <Text
//           style={{color:'red'}}
//           >{message.text}</Text>
//           {/* Display other message details */}
//         </View>
//       ))}
//       <Button title="Send Message" onPress={handleSendMessage} />
//     </View>
//   );
// };
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {GiftedChat} from 'react-native-gifted-chat';
import DocumentPicker from 'react-native-document-picker';
import color from '../Assets/colors/colors';
import {Icons} from '../Components/Icons';

// const ConversationScreen = () => {
//   const userId = global.id;
//   const providerId = global.providerid;
//   const route = useRoute();
//   const currentprovider = route.params?.currentuser;
//   global.providerid= currentprovider.id;
//   console.log(  global.providerid,'globalproviderid')
//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState('');
//   const conversationId = [userId, providerId].sort().join('_'); // Unique conversation ID

//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection('chat')
//       .doc(conversationId)
//       .collection('message')
//       .orderBy('timestamp', 'asc') // Order messages by timestamp
//       .onSnapshot(querySnapshot => {
//         const messages = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setMessages(messages);
//       });

//     return () => unsubscribe();
//   }, [conversationId]);

//   const sendMessage = async () => {
//     if (messageText.trim() === '') return; // Prevent sending empty messages
//     await firestore()
//       .collection('chat')
//       .doc(conversationId)
//       .collection('message')
//       .add({
//         userId,
//         providerId,
//         text: messageText.trim(),
//         timestamp: firestore.FieldValue.serverTimestamp(),
//       });

//     setMessageText(''); // Clear the message input after sending
//   };

//   return (
//     // <ScrollView style={{flex: 1}}>
//     //   {messages.map(message => (
//     //     <View
//     //       style={{
//     //         backgroundColor: message.userId === userId ? 'lightblue' : 'lightgrey',
//     //         marginVertical: 5,
//     //         padding: 10,
//     //         borderRadius: 10,
//     //         alignSelf: message.userId === userId ? 'flex-end' : 'flex-start',
//     //       }}
//     //       key={message.id}>
//     //       <Text style={{color: message.userId === userId ? 'black' : 'black'}}>
//     //         {message.text}
//     //       </Text>
//     //       <Text style={{fontSize: 12, color: 'grey'}}>
//     //         {message.timestamp && new Date(message.timestamp.toDate()).toLocaleString()}
//     //       </Text>
//     //     </View>
//     //   ))}
//     //   <View
//     //     style={{
//     //       flexDirection: 'row',
//     //       alignItems: 'center',
//     //       paddingHorizontal: 10,
//     //     }}>
//     //     <TextInput
//     //       style={{
//     //         flex: 1,
//     //         height: 40,
//     //         borderColor: 'gray',
//     //         borderWidth: 1,
//     //         borderRadius: 5,
//     //         marginRight: 10,
//     //         marginBottom: 100,
//     //       }}
//     //       placeholder="Type your message..."
//     //       value={messageText}
//     //       onChangeText={text => setMessageText(text)}
//     //     />
//     //     <Button title="Send" onPress={sendMessage} />
//     //   </View>
//     // </ScrollView>
//     <ScrollView style={{ flex: 1 }}>
//     {messages.map(message => (
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'flex-start',
//           justifyContent: message.userId === userId ? 'flex-end' : 'flex-start',
//           marginVertical: 5,
//           paddingHorizontal: 10,
//         }}
//         key={message.id}>
//         {message.userId !== userId && (
//           <Image
//             source={{
//               uri: `https://fisdemoprojects.com/skilledman/api/uploads//${currentprovider.image}`,
//             }}
//             style={{ width: 30, height: 30, borderRadius: 15, marginRight: 5 }}
//           />
//         )}
//         <View
//           style={{
//             backgroundColor: message.userId === userId ? 'lightblue' : 'lightgrey',
//             borderRadius: 10,
//             padding: 10,
//           }}>
//           <Text style={{ color: 'black' }}>{message.text}</Text>
//           <Text style={{ fontSize: 12, color: 'grey', marginTop: 5 }}>
//             {message.timestamp && new Date(message.timestamp.toDate()).toLocaleString()}
//           </Text>
//         </View>
//         {message.userId === userId && (
//           <Image
//             source={{
//               uri: `https://fisdemoprojects.com/skilledman/api/uploads//${global.profile}`,
//             }}
//             style={{ width: 30, height: 30, borderRadius: 15, marginLeft: 5 }}
//           />
//         )}
//       </View>
//     ))}
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 10,
//       }}>
//       <TextInput
//         style={{
//           flex: 1,
//           height: 40,
//           borderColor: 'gray',
//           borderWidth: 1,
//           borderRadius: 5,
//           marginRight: 10,
//           marginBottom: 100,
//         }}
//         placeholder="Type your message..."
//         value={messageText}
//         onChangeText={text => setMessageText(text)}
//       />
//       <Button title="Send" onPress={sendMessage} />
//     </View>
//   </ScrollView>
//   );
// };

const ConversationScreen = () => {
  const userId = global.id;
  const providerId = global.providerid;
  const route = useRoute();
  const currentprovider = route.params?.currentuser;
  global.providerid = currentprovider.id;
  console.log(global.providerid, 'globalproviderid');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [attachment, setAttachment] = useState(null); // State to store selected attachment
  const conversationId = [userId, providerId].sort().join('_'); // Unique conversation ID

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chat')
      .doc(conversationId)
      .collection('message')
      .orderBy('timestamp', 'asc') // Order messages by timestamp
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);
      });

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = async () => {
    if (messageText.trim() === '' && !attachment) return; // Prevent sending empty messages and attachments
    const messageData = {
      userId,
      providerId,
      text: messageText.trim(),
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    if (attachment) {
      // If an attachment is selected, upload it to Firebase storage
      const response = await fetch(attachment.uri);
      const blob = await response.blob();
      const filename = attachment.name || 'attachment';
      const storageRef = storage().ref(`attachments/${filename}`);
      await storageRef.put(blob);
      const downloadUrl = await storageRef.getDownloadURL();
      messageData.attachment = {
        type: attachment.type,
        uri: downloadUrl,
        name: filename,
      };
      setAttachment(null); // Clear the attachment state after sending
    }

    await firestore()
      .collection('chat')
      .doc(conversationId)
      .collection('message')
      .add(messageData);

    setMessageText(''); // Clear the message input after sending
  };

  const pickAttachment = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setAttachment(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Error while picking file:', err);
      }
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      {messages.map(message => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '100%',
            justifyContent:
              message.userId === userId ? 'flex-end' : 'flex-start',
            marginVertical: 5,
            paddingHorizontal: 10,
          }}
          key={message.id}>
          {message.userId !== userId && (
            <Image
              source={{
                uri: `https://fisdemoprojects.com/skilledman/api/uploads//${currentprovider.image}`,
              }}
              style={{height: 55, width: 55, borderRadius: 8, marginRight: 6}}
            />
          )}
          <View
            style={{
              backgroundColor:
                message.userId === userId ? '#965c00' : '#e4e4e4',
              borderRadius: 14,
              padding: 10,
              width:'60%',
            }}>
            {message.attachment &&
            message.attachment.type.startsWith('image') ? (
              <TouchableOpacity
                onPress={() => {
                  /* Handle image preview */
                }}>
                <Image
                  source={{uri: message.attachment.uri}}
                  style={{width: 200, height: 200, borderRadius: 10}}
                />
              </TouchableOpacity>
            ) : (
              <Text style={{color: 'black'}}>{message.text}</Text>
            )}
            {message.attachment && (
              <Text style={{fontSize: 12, color: 'grey', marginTop: 5}}>
                {message.attachment.name}
              </Text>
            )}
            <Text
              style={{
                fontSize: 12,
                marginTop: 2,
                color: color.litGry,
                alignSelf: 'flex-start',
                marginBottom: 5,
                marginRight: '1%',
              }}>
              {message.timestamp &&
                new Date(message.timestamp.toDate()).toLocaleString()}
            </Text>
          </View>
       
          {message.userId === userId && (
            <Image
              source={{
                uri: `https://fisdemoprojects.com/skilledman/api/uploads//${global.profile}`,
              }}
              style={{height: 55, width: 55, borderRadius: 8, marginRight: 6}}
            />
          )}
          
        </View>
        
      ))}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#e4e4e4',
          padding: 4,
          borderRadius: 12,
          marginTop: 8,
          elevation: 0,
        }}>
        <TextInput
          style={{
            color: 'black',
            flex: 1,
            paddingHorizontal: 16,
          }}
          placeholder="Send Message"
          placeholderTextColor={color.litGry}
          value={messageText}
          onChangeText={text => setMessageText(text)}
        />

        <View
          style={{marginLeft: 8, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={pickAttachment}>
            <Icons.AntDesign
              name="paperclip"
              size={25}
              color={color.litGry}
            />
            <Text
              style={{
                fontSize: 1,
                color: color.blak,
                fontWeight: '600',
              }}>
              {attachment ? attachment.name : ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sendMessage}>
            <Icons.FontAwesome
              name="send"
              size={20}
              color={color.litGry}
              style={{
                marginLeft: 7,
                backgroundColor: color.defalt,
                color: color.wite,
                paddingVertical: 8,
                paddingHorizontal: 8,
                borderRadius: 6,
              }}
            />
          </TouchableOpacity>
          {/* <Button title="Send" onPress={sendMessage} /> */}
        </View>
      </View>
    </ScrollView>
  );
};

//upper attach code
// const ConversationScreen = () => {
//   const userId = global.id;
//   const providerId = global.providerid;
//   const route = useRoute();
//   const currentprovider = route.params?.currentuser;
//   global.providerid = currentprovider.id;
//   console.log(global.providerid, 'globalproviderid');
//   const [messages, setMessages] = useState([]);
//   const [attachment, setAttachment] = useState(null); // State to store selected attachment
//   const conversationId = [userId, providerId].sort().join('_'); // Unique conversation ID

//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection('chat')
//       .doc(conversationId)
//       .collection('message')
//       .orderBy('timestamp', 'asc')
//       .onSnapshot(querySnapshot => {
//         const messages = querySnapshot.docs.map(doc => {
//           if (!doc.exists) {
//             return null; // Handle the case where the document doesn't exist
//           }

//           const data = doc.data();
//           return {
//             _id: doc.id,
//             text: data.text,
//             createdAt: data.timestamp ? data.timestamp.toDate() : null,
//             user: {
//               _id: data.userId === userId ? 1 : 2,
//               name: data.userId === userId ? 'You' : currentprovider.name,
//               avatar: data.userId === userId ? `https://fisdemoprojects.com/skilledman/api/uploads//${global.profile}` : `https://fisdemoprojects.com/skilledman/api/uploads//${currentprovider.image}`,
//             },
//             image: data.attachment && data.attachment.type.startsWith('image') ? data.attachment.uri : null,
//             file: data.attachment && !data.attachment.type.startsWith('image') ? data.attachment.uri : null,
//           };
//         }).filter(message => message !== null); // Remove null values from messages array
//         setMessages(messages);
//       });

//     return () => unsubscribe();
//   }, [conversationId]);
//   const onSend = async newMessages => {
//     const message = newMessages[0];
//     const messageData = {
//       userId,
//       providerId,
//       text: message.text,
//       timestamp: firestore.FieldValue.serverTimestamp(),
//     };

//     if (message.image || message.file) {
//       const response = await fetch(message.image || message.file);
//       const blob = await response.blob();
//       const filename = message.image ? 'image.jpg' : 'file.pdf'; // Change file name as needed
//       const storageRef = storage().ref(`attachments/${filename}`);
//       await storageRef.put(blob);
//       const downloadUrl = await storageRef.getDownloadURL();
//       messageData.attachment = {
//         type: message.image ? 'image/jpeg' : 'application/pdf', // Adjust mime type based on file type
//         uri: downloadUrl,
//         name: filename,
//       };
//     }

//     await firestore()
//       .collection('chat')
//       .doc(conversationId)
//       .collection('message')
//       .add(messageData);
//   };

//   const pickAttachment = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//       });
//       setAttachment(res);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log('User cancelled the picker');
//       } else {
//         console.log('Error while picking file:', err);
//       }
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <GiftedChat
//         messages={messages}
//         onSend={newMessages => onSend(newMessages)}
//         user={{
//           _id: 1, // Assuming your user ID is 1
//         }}
//         renderActions={() => (
//           <TouchableOpacity onPress={pickAttachment}>
//             <Text style={{ color: 'blue', marginRight: 10 }}>Attach</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };




const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 1,
    color: color.blak,
    fontWeight: '600',
  },
  container: {
    flex: 0.98,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f0f0f0',
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e4e4e4',
    paddingVertical: 17,
    borderRadius: 8,
    marginBottom: 4,
    paddingHorizontal: 10,
    width: '80%',
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: color.defalt,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 4,
    width: '78%',
    paddingHorizontal: 10,
  },
  messageText: {
    color: color.litGry, // For sender messages
    fontSize: 16,
    flexWrap: 'wrap',
  },
  receiverText: {
    color: color.wite, // For sender messages
    fontSize: 16,
    flexWrap: 'wrap',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
    color: color.litGry,
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginRight: '21%',
  },
  timeStyle: {
    fontSize: 12,
    marginTop: 2,
    color: color.litGry,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: '21%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
    padding: 4,
    borderRadius: 12,
    marginTop: 8,
    elevation: 0,
  },
  input: {
    color: 'black',
    flex: 1,
    paddingHorizontal: 16,
  },
  sendButton: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  sendStyle: {
    marginLeft: 7,
    backgroundColor: color.defalt,
    color: color.wite,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  imageStyle: {
    height: 55,
    width: 55,
    borderRadius: 8,
    marginRight: 6,
  },
  imgContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  recImg: {
    marginLeft: 6,
  },
  imagemodal: {
    height: '80%',
    width: '80%',
    borderRadius: 8,
    marginRight: 6,
  },
  modalContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginLeft: 0,
    marginRight: 0,
  },
  modalBody: {
    flexDirection: 'column',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  modalView: {
    borderRadius: 12,
    width: '70%',
    height: 320,
    alignSelf: 'center',
    backgroundColor: color.wite,
  },
  btnContainer: {
    width: '60%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  successmodalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalStyle: {},
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '90%',
  },
});
export default ConversationScreen;
