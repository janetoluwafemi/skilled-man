import React, { useState, useEffect, useCallback } from 'react';
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
    Clipboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Bubble,
    Composer,
    GiftedChat,
    InputToolbar,
    Send,
    Avatar
} from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../../Assets/colors/colors';
import CustomAlert from '../../Components/CustomAlert';
import ChatUsrHeader from '../../Components/ChatUserHeader';
import { Icons } from '../../Components/Icons';
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

const NewMessage = ({ userId, providerId, peerData, showAlert }) => {
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

    const peerAvatar = peerData?.image
        ? `${BASIC_URL}uploads/${peerData.image.replace(/^\/+/, '')}`
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

                    // IF YOUR MESSAGES SHOW ON THE WRONG SIDE, YOUR BACKEND IS LIKELY RETURNING THE WRONG SENDER ID HERE.
                    const isActuallyMe = rawSenderId === cleanUserId;

                    const newIncomingMessage = {
                        _id: stableId,
                        text: specificChat.message || '',
                        createdAt: parsedDate,
                        user: {
                            _id: isActuallyMe ? cleanUserId : peerId,
                            name: isActuallyMe ? 'Me' : specificChat.name || peerData?.name || 'User',
                            avatar: isActuallyMe ? myAvatar : peerAvatar,
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
    }, [cleanUserId, peerId, peerData, chatStorageKey, myAvatar, peerAvatar]);

    useEffect(() => {
        fetchApiMessages();
        const interval = setInterval(() => {
            fetchApiMessages();
        }, 4000);
        return () => clearInterval(interval);
    }, [fetchApiMessages]);

    const handleLongPress = (context, message) => {
        setSelectedMessage(message);
        setKebabVisible(false);
    };

    const deleteMessageLocally = async (messageId) => {
        setMessages((prevMessages) => {
            const updatedMessages = prevMessages.filter((m) => String(m._id) !== String(messageId));
            AsyncStorage.setItem(chatStorageKey, JSON.stringify(updatedMessages)).catch(e => console.log(e));
            return updatedMessages;
        });
        setSelectedMessage(null);
    };

    const handleDeleteAction = () => {
        showAlert('Delete Message', 'Are you sure you want to delete this message?', () => {
            deleteMessageLocally(selectedMessage._id);
        });
    };

    const handleCopyAction = () => {
        if (selectedMessage?.text) {
            try {
                Clipboard.setString(selectedMessage.text);
            } catch (e) {}
        }
        setKebabVisible(false);
        setSelectedMessage(null);
    };

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
            showAlert('Send failed', 'Could not send message. Please check your connection.');
        }
    };

    const openCamera = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                showAlert('Permission Required', 'Camera access is needed.');
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

                await Promise.allSettled([
                    fetch(`${BASIC_URL}firebase/chat.php`, { method: 'POST', body: chatForm }),
                ]);
            }
        } catch (err) {
            console.error('Camera upload error:', err);
            setUploading(false);
            showAlert('Upload failed', 'Could not upload image.');
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
            {selectedMessage ? (
                <View style={styles.contextualHeader}>
                    <View style={styles.contextHeaderLeft}>
                        <TouchableOpacity onPress={() => { setSelectedMessage(null); setKebabVisible(false); }}>
                            <Icons.Feather name="arrow-left" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.contextHeaderText}>1 Selected</Text>
                    </View>

                    <View style={styles.contextHeaderRight}>
                        <TouchableOpacity onPress={handleDeleteAction} style={styles.iconBtn}>
                            <Icons.Ionicons name="trash" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setKebabVisible(!kebabVisible)} style={styles.iconBtn}>
                            <Icons.Feather name="more-vertical" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {kebabVisible && (
                        <View style={styles.kebabMenu}>
                            <TouchableOpacity onPress={handleCopyAction} style={styles.kebabMenuItem}>
                                <Text style={styles.kebabMenuText}>Copy Text</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : (
                <ChatUsrHeader
                    userName={peerData?.name || 'Chat'}
                    userImage={peerAvatar}
                    onlineStatus={true}
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
                }}
                showUserAvatar={true}
                renderAvatarOnTop={true}
                onLongPress={handleLongPress}
                inverted={true}
                scrollToBottom
                alwaysShowSend
                messagesContainerStyle={{ backgroundColor: '#F0F2F5', paddingBottom: 10 }}
                listViewProps={{
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
                renderInputToolbar={props => (
                    <InputToolbar
                        {...props}
                        containerStyle={styles.inputToolbar}
                        primaryStyle={styles.inputToolbarPrimary}
                    />
                )}
                renderComposer={props => (
                    <View style={styles.composerWrapper}>
                        <Composer
                            {...props}
                            placeholder="Message..."
                            placeholderTextColor="#94A3B8"
                            textInputStyle={styles.composerInput}
                        />
                        {!uploading && (
                            <TouchableOpacity
                                style={styles.cameraIconBtn}
                                onPress={openCamera}
                                activeOpacity={0.7}>
                                <Icons.Feather name="camera" size={22} color="#64748B" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                renderSend={props => (
                    <Send {...props} containerStyle={styles.sendComponentWrapper}>
                        <View style={styles.sendButton}>
                            {uploading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Icons.Feather name="send" size={16} color="#FFFFFF" style={{ marginLeft: -2 }} />
                            )}
                        </View>
                    </Send>
                )}
                renderBubble={props => {
                    const isSelected = selectedMessage && selectedMessage._id === props.currentMessage._id;
                    return (
                        <View style={{ backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.1)' : 'transparent', width: '100%', borderRadius: 8 }}>
                            <Bubble
                                {...props}
                                wrapperStyle={{
                                    left: {
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 16,
                                        borderBottomLeftRadius: 4, // Sharp tail for incoming
                                        padding: 4,
                                        marginBottom: 4,
                                        ...Platform.select({
                                            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2 },
                                            android: { elevation: 1 },
                                        }),
                                    },
                                    right: {
                                        backgroundColor: color.defalt,
                                        borderRadius: 16,
                                        borderBottomRightRadius: 4, // Sharp tail for outgoing
                                        padding: 4,
                                        marginBottom: 4,
                                        ...Platform.select({
                                            ios: { shadowColor: color.defalt, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
                                            android: { elevation: 2 },
                                        }),
                                    },
                                }}
                                textStyle={{
                                    left: { color: '#0F172A', fontSize: 15.5, lineHeight: 22 },
                                    right: { color: '#FFFFFF', fontSize: 15.5, lineHeight: 22 },
                                }}
                                timeTextStyle={{
                                    left: { color: '#94A3B8', fontSize: 11 },
                                    right: { color: 'rgba(255, 255, 255, 0.75)', fontSize: 11 },
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

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        onOk: () => setAlertConfig(prev => ({ ...prev, visible: false })),
    });

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
                        showAlert={showAlert}
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
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                onOk={alertConfig.onOk}
            />
        </SafeAreaView>
    );
};

export default IndividualChat;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0F2F5', // Soft WhatsApp-like background
    },
    chatWrapper: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    chatViewContainer: {
        flex: 1,
        backgroundColor: '#F0F2F5',
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
        width: 240,
        height: 180,
        borderRadius: 12,
        margin: 4,
    },
    inputToolbar: {
        backgroundColor: '#F0F2F5', // Matches screen background
        borderTopWidth: 0,
        paddingHorizontal: 12,
        paddingVertical: 8,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    },
    inputToolbarPrimary: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    composerWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingLeft: 16,
        paddingRight: 6,
        marginRight: 10,
        minHeight: 46,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    composerInput: {
        color: '#0F172A',
        fontSize: 15,
        lineHeight: 20,
        paddingTop: Platform.OS === 'ios' ? 12 : 10,
        paddingBottom: Platform.OS === 'ios' ? 12 : 10,
        flex: 1,
        ...(Platform.OS === 'web' && { outlineWidth: 0 }),
    },
    cameraIconBtn: {
        padding: 8,
    },
    sendComponentWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    sendButton: {
        backgroundColor: color.defalt,
        borderRadius: 22,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: color.defalt, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
            android: { elevation: 2 },
            web: { boxShadow: '0 2px 6px rgba(186, 104, 56, 0.25)' },
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