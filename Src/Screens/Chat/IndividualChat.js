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
    StatusBar,
    Clipboard // Fallback for copy if expo-clipboard isn't installed
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Bubble,
    Composer,
    GiftedChat,
    InputToolbar,
    Send,
} from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../../Assets/colors/colors';
import { Icons } from '../../Components/Icons';
import ChatUsrHeader from '../../Components/ChatUserHeader';
import { BASIC_URL } from '../Signin/Signin';

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

const NewMessage = ({ userId, providerId, peerData }) => {
    const [messages, setMessages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Contextual Action Bar States
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [kebabVisible, setKebabVisible] = useState(false);

    const cleanUserId = String(userId ?? '').trim();
    const cleanProviderId = String(providerId ?? '').trim();
    const peerId = cleanProviderId;

    const chatStorageKey = `chat_history_${cleanUserId}_${peerId}`;

    const myAvatar = global.profile
        ? `${BASIC_URL}uploads/${global.profile.replace(/^\/+/, '')}`
        : `${BASIC_URL}uploads/dumy.png`;

    useEffect(() => {
        const loadLocalHistory = async () => {
            try {
                const storedHistory = await AsyncStorage.getItem(chatStorageKey);
                if (storedHistory) {
                    setMessages(JSON.parse(storedHistory));
                }
            } catch (error) {
                console.log("Error loading local chat history", error);
            }
        };
        loadLocalHistory();
    }, [chatStorageKey]);

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
                (c) => String(c.chat_id) === peerId || c.name === peerData?.name
            );

            if (specificChat) {
                let parsedDate = new Date();
                if (specificChat.created_at) {
                    const d = new Date(specificChat.created_at);
                    if (!isNaN(d.getTime())) parsedDate = d;
                }

                const stableId = String(specificChat.id || `${specificChat.created_at}_${specificChat.message}`);

                setMessages((previousMessages) => {
                    const alreadySentByMe = previousMessages.some(
                        (m) => m.text.trim() === (specificChat.message || '').trim() && String(m.user?._id) === String(cleanUserId)
                    );

                    if (alreadySentByMe) {
                        return previousMessages;
                    }

                    const rawSenderId = String(specificChat.sender_id || '');
                    const isActuallyMe = rawSenderId === cleanUserId;

                    const newIncomingMessage = {
                        _id: stableId,
                        text: specificChat.message || '',
                        createdAt: parsedDate,
                        user: {
                            _id: isActuallyMe ? cleanUserId : peerId,
                            name: isActuallyMe ? 'Me' : specificChat.name || peerData?.name || 'User',
                            avatar: isActuallyMe ? myAvatar : (specificChat.image ? `${BASIC_URL}uploads/${specificChat.image}` : `${BASIC_URL}uploads/dumy.png`),
                        },
                    };

                    const existingIds = new Set(previousMessages.map((m) => String(m._id)));
                    if (!existingIds.has(newIncomingMessage._id)) {
                        const updatedMessages = GiftedChat.append(previousMessages, [newIncomingMessage]);
                        AsyncStorage.setItem(chatStorageKey, JSON.stringify(updatedMessages)).catch((e) => console.log(e));
                        return updatedMessages;
                    }

                    return previousMessages;
                });
            }
        } catch (error) {
            console.log('Error fetching chat messages:', error);
        }
    }, [cleanUserId, peerId, peerData, chatStorageKey, myAvatar]);

    useEffect(() => {
        fetchApiMessages();
        const interval = setInterval(() => {
            fetchApiMessages();
        }, 4000);
        return () => clearInterval(interval);
    }, [fetchApiMessages]);


    /* ==========================================
       CONTEXTUAL ACTION BAR LOGIC (LONG PRESS)
       ========================================== */

    const handleLongPress = (context, message) => {
        setSelectedMessage(message);
        setKebabVisible(false); // Reset menu if open
    };

    const deleteMessageLocally = async (messageId) => {
        setMessages((prevMessages) => {
            const updatedMessages = prevMessages.filter((m) => String(m._id) !== String(messageId));
            AsyncStorage.setItem(chatStorageKey, JSON.stringify(updatedMessages)).catch(e => console.log(e));
            return updatedMessages;
        });
        setSelectedMessage(null);
    };

    const deleteMessageForEveryone = async (messageId) => {
        deleteMessageLocally(messageId);
        showToast('Message deleted for everyone');
    };

    const handleDeleteAction = () => {
        const isMyMessage = String(selectedMessage.user._id) === String(cleanUserId);

        const options = isMyMessage
            ? [
                { text: 'Delete for me', onPress: () => deleteMessageLocally(selectedMessage._id) },
                { text: 'Delete for everyone', onPress: () => deleteMessageForEveryone(selectedMessage._id), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' }
            ]
            : [
                { text: 'Delete for me', onPress: () => deleteMessageLocally(selectedMessage._id) },
                { text: 'Cancel', style: 'cancel' }
            ];

        Alert.alert('Delete Message', 'Are you sure you want to delete this message?', options);
    };

    const handleCopyAction = () => {
        if (selectedMessage?.text) {
            try {
                Clipboard.setString(selectedMessage.text);
            } catch (e) {}
            showToast('Message copied');
        }
        setKebabVisible(false);
        setSelectedMessage(null);
    };

    const handlePinAction = () => {
        showToast('Message Pinned');
        setKebabVisible(false);
        setSelectedMessage(null);
    };

    const handleForwardAction = () => {
        showToast('Forwarding coming soon!');
        setSelectedMessage(null);
    };

    /* ========================================== */

    const onSend = async (messagesList = []) => {
        try {
            const msg = messagesList[0];
            if (!msg?.text?.trim() && !msg?.image) return;

            const currentSyncId = await getSynchronizedUserId() || cleanUserId;
            const textContent = msg.text ? msg.text.trim() : '';

            const formattedMsg = {
                _id: String(Date.now()),
                text: textContent,
                createdAt: new Date(),
                user: {
                    _id: currentSyncId,
                    name: 'Me',
                    avatar: myAvatar,
                },
                image: msg.image || '',
            };

            setMessages((previousMessages) => {
                const updatedMessages = GiftedChat.append(previousMessages, [formattedMsg]);
                AsyncStorage.setItem(chatStorageKey, JSON.stringify(updatedMessages)).catch(e => console.log(e));
                return updatedMessages;
            });

            const chatForm = new FormData();
            chatForm.append('own_id', currentSyncId);
            chatForm.append('chat_user_id', peerId);
            chatForm.append('message', textContent);

            const notifyForm = new FormData();
            notifyForm.append('sender_id', currentSyncId);
            notifyForm.append('receiver_id', peerId);
            notifyForm.append('message', textContent || '📷 Sent an image');

            await Promise.allSettled([
                fetch(`${BASIC_URL}firebase/chat.php`, { method: 'POST', body: chatForm }),
                fetch(`${BASIC_URL}firebase/send_notification.php`, { method: 'POST', body: notifyForm }),
            ]);

        } catch (error) {
            console.error('Send error:', error);
            Alert.alert('Send failed', 'Could not send message. Please check your connection.');
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
                const currentSyncId = await getSynchronizedUserId() || cleanUserId;
                setUploading(true);
                const asset = result.assets[0];
                setUploading(false);

                const imgMessage = {
                    _id: String(Date.now()),
                    text: '',
                    createdAt: new Date(),
                    user: {
                        _id: currentSyncId,
                        name: 'Me',
                        avatar: myAvatar,
                    },
                    image: asset.uri,
                };

                setMessages((previousMessages) => {
                    const updatedMessages = GiftedChat.append(previousMessages, [imgMessage]);
                    AsyncStorage.setItem(chatStorageKey, JSON.stringify(updatedMessages)).catch(e => console.log(e));
                    return updatedMessages;
                });

                const chatForm = new FormData();
                chatForm.append('own_id', currentSyncId);
                chatForm.append('chat_user_id', peerId);
                chatForm.append('message', '📷 Sent an image');

                const notifyForm = new FormData();
                notifyForm.append('sender_id', currentSyncId);
                notifyForm.append('receiver_id', peerId);
                notifyForm.append('message', '📷 Sent an image');

                await Promise.allSettled([
                    fetch(`${BASIC_URL}firebase/chat.php`, { method: 'POST', body: chatForm }),
                    fetch(`${BASIC_URL}firebase/send_notification.php`, { method: 'POST', body: notifyForm }),
                ]);
            }
        } catch (err) {
            console.error('Camera upload error:', err);
            setUploading(false);
            Alert.alert('Upload failed', 'Could not upload image.');
        }
    };

    if (!cleanUserId || !cleanProviderId || cleanUserId === 'undefined' || cleanProviderId === 'undefined') {
        return (
            <View style={styles.missingUserBox}>
                <Icons.Feather name="alert-circle" size={40} color="#CBD5E1" />
                <Text style={styles.missingUserText}>Loading chat session...</Text>
            </View>
        );
    }

    return (
        <View style={styles.chatWrapper}>
            {/* DYNAMIC HEADER: Replaces normal header when a message is selected */}
            {selectedMessage ? (
                <View style={styles.contextualHeader}>
                    <View style={styles.contextHeaderLeft}>
                        <TouchableOpacity onPress={() => { setSelectedMessage(null); setKebabVisible(false); }}>
                            <Icons.Feather name="arrow-left" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.contextHeaderText}>1</Text>
                    </View>

                    <View style={styles.contextHeaderRight}>
                        <TouchableOpacity onPress={handleForwardAction} style={styles.iconBtn}>
                            <Icons.Ionicons name="arrow-redo" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeleteAction} style={styles.iconBtn}>
                            <Icons.Ionicons name="trash" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setKebabVisible(!kebabVisible)} style={styles.iconBtn}>
                            <Icons.Feather name="more-vertical" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Kebab Dropdown Menu */}
                    {kebabVisible && (
                        <View style={styles.kebabMenu}>
                            <TouchableOpacity onPress={handleCopyAction} style={styles.kebabMenuItem}>
                                <Text style={styles.kebabMenuText}>Copy Text</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePinAction} style={styles.kebabMenuItem}>
                                <Text style={styles.kebabMenuText}>Pin Message</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : (
                <ChatUsrHeader
                    userName={peerData?.name || 'Chat'}
                    userImage={peerData?.image ? `${BASIC_URL}uploads/${peerData.image.replace(/^\/+/, '')}` : null}
                    onlineStatus={false}
                />
            )}

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
                    _id: String(cleanUserId),
                    name: 'Me',
                    avatar: myAvatar,
                }}
                showUserAvatar={false} // REMOVED the clutter avatar from the right side!
                onLongPress={handleLongPress}
                inverted={true}
                scrollToBottom
                alwaysShowSend
                listViewProps={{
                    contentContainerStyle: { flexGrow: 1, justifyContent: 'flex-end' },
                    style: { flex: 1 }
                }}
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
                                resizeMode="cover"
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
                renderBubble={props => {
                    const isSelected = selectedMessage && selectedMessage._id === props.currentMessage._id;

                    return (
                        <View style={{ backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.1)' : 'transparent', width: '100%' }}>
                            <Bubble
                                {...props}
                                wrapperStyle={{
                                    left: {
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 18,
                                        borderBottomLeftRadius: 4, // Native chat tail effect
                                        marginBottom: 4,
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
                                        borderBottomRightRadius: 4, // Native chat tail effect
                                        marginBottom: 4,
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
                        </View>
                    );
                }}
            />
        </View>
    );
};

const IndividualChat = () => {
    const route = useRoute();
    const currentprovider = route.params?.currentuser;

    const peerId = String(
        route.params?.receiver_id ||
        currentprovider?.id ||
        currentprovider?.provider_id ||
        currentprovider?.user_id ||
        ''
    ).trim();

    const [resolvedUserId, setResolvedUserId] = useState(null);

    useEffect(() => {
        const syncUser = async () => {
            const userId = await getSynchronizedUserId();
            if (userId) {
                setResolvedUserId(userId);
            } else if (global.id) {
                setResolvedUserId(String(global.id));
            }
        };

        if (!resolvedUserId) {
            syncUser();
        }
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
                    />
                ) : (
                    <View style={styles.missingUserBox}>
                        <ActivityIndicator size="large" color={color.defalt} />
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
    contextualHeader: {
        height: 60,
        backgroundColor: color.defalt,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        zIndex: 10,
        elevation: 4,
    },
    contextHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contextHeaderText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    contextHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        marginLeft: 20,
        padding: 4,
    },
    kebabMenu: {
        position: 'absolute',
        top: 55,
        right: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        paddingVertical: 4,
        zIndex: 1000,
    },
    kebabMenuItem: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    kebabMenuText: {
        fontSize: 15,
        color: '#0F172A',
        fontWeight: '500',
    },
    chatMsgImage: {
        width: 220,
        height: 160,
        borderRadius: 14, // Fits beautifully inside the native bubble
        margin: 3,
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