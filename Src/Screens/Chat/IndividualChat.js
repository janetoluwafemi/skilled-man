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
    InteractionManager,
    Alert,
    KeyboardAvoidingView,
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

import {
    useNavigation,
    useRoute,
} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../../Assets/colors/colors';
import CustomAlert from '../../Components/CustomAlert';
import ChatUsrHeader from '../../Components/ChatUserHeader';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

// expo-av is optional at runtime. Keeping it behind a guarded require prevents
// an outdated Expo Go/dev-client binary from crashing while this chat screen
// is being loaded.
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
        console.warn(
            'Voice notes are unavailable because this app build does not include expo-av.'
        );
    }

    return cachedAudioModule;
};

// ============================================================
// GET SYNCHRONIZED USER ID
// ============================================================

const getSynchronizedUserId = async () => {
    try {
        const rawUser = await AsyncStorage.getItem('user');

        if (rawUser) {
            const parsed = JSON.parse(rawUser);

            const permanentId =
                parsed?.id ||
                parsed?.user_id ||
                parsed?.userId;

            if (
                permanentId &&
                String(permanentId).trim() !== '' &&
                !['251', '255', '256'].includes(
                    String(permanentId)
                )
            ) {
                const cleanId = String(permanentId).trim();

                global.id = cleanId;

                return cleanId;
            }
        }
    } catch (e) {
        console.log(
            'Error reading AsyncStorage in getSynchronizedUserId:',
            e
        );
    }

    if (
        global.id &&
        String(global.id).trim() !== '' &&
        !['251', '255', '256'].includes(
            String(global.id)
        )
    ) {
        return String(global.id).trim();
    }

    return null;
};

// ============================================================
// AUDIO MESSAGE
// ============================================================

const AudioMessage = ({
                          audioUri,
                          isMe,
                      }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const textColor = isMe
        ? '#FFFFFF'
        : color.defalt;

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const playAudio = async () => {
        const Audio = getAudioModule();

        if (!Audio) {
            return;
        }

        try {
            // Fix: Ensure audio plays even if the iOS hardware switch is on silent
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
                const {
                    sound: newSound,
                } = await Audio.Sound.createAsync({
                    uri: audioUri,
                });

                setSound(newSound);
                setIsPlaying(true);

                await newSound.playAsync();

                newSound.setOnPlaybackStatusUpdate(
                    status => {
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                        }
                    }
                );
            }
        } catch (error) {
            console.log(
                'Error playing audio',
                error
            );
        }
    };

    return (
        <View
            style={{
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                minWidth: 150,
            }}
        >
            <TouchableOpacity
                onPress={playAudio}
                style={{ marginRight: 10 }}
            >
                <Icons.Feather
                    name={
                        isPlaying
                            ? 'pause-circle'
                            : 'play-circle'
                    }
                    size={28}
                    color={textColor}
                />
            </TouchableOpacity>

            <Icons.Feather
                name="bar-chart-2"
                size={24}
                color={textColor}
                style={{ opacity: 0.7 }}
            />

            <Icons.Feather
                name="bar-chart-2"
                size={24}
                color={textColor}
                style={{
                    opacity: 0.4,
                    marginLeft: -8,
                }}
            />

            <Text
                style={{
                    marginLeft: 10,
                    color: textColor,
                    fontSize: 12,
                }}
            >
                Voice Note
            </Text>
        </View>
    );
};

// ============================================================
// NEW MESSAGE
// ============================================================

const NewMessage = ({
                        userId,
                        providerId,
                        peerData,
                        showAlert,
                    }) => {
    const insets = useSafeAreaInsets();

    const navigation = useNavigation();
    const route = useRoute();

    // ----------------------------------------------------------
    // STATE
    // ----------------------------------------------------------

    const [messages, setMessages] = useState([]);

    const [uploading, setUploading] =
        useState(false);

    const [imageModalVisible, setImageModalVisible] =
        useState(false);

    const [selectedImage, setSelectedImage] =
        useState(null);

    const [recording, setRecording] =
        useState();

    const [isBlocked, setIsBlocked] =
        useState(false);

    const [selectedMessage, setSelectedMessage] =
        useState(null);

    const [kebabVisible, setKebabVisible] =
        useState(false);

    const [hoveredMessageId, setHoveredMessageId] =
        useState(null);

    const [openMenuMessageId, setOpenMenuMessageId] =
        useState(null);

    const [isSearchActive, setIsSearchActive] =
        useState(
            route.params?.startSearch || false
        );

    const [searchQuery, setSearchQuery] =
        useState('');

    const composerRef = useRef(null);

    // Refs added to prevent the quick-tap recording bug
    const recordingRef = useRef(null);
    const isStartingRef = useRef(false);

    // ----------------------------------------------------------
    // ROLE
    // ----------------------------------------------------------

    const currentDashboardRole =
        String(global.role) === '1'
            ? 'provider'
            : 'customer';

    // ----------------------------------------------------------
    // USER IDS
    // ----------------------------------------------------------

    const cleanUserId =
        String(userId ?? '').trim();

    let peerId =
        String(providerId ?? '').trim();

    if (peerId === cleanUserId) {
        const possibleIds = [
            peerData?.user_id,
            peerData?.provider_id,
            peerData?.id,
        ].map(id =>
            String(id || '').trim()
        );

        const actualPeer =
            possibleIds.find(
                id =>
                    id &&
                    id !== cleanUserId
            );

        peerId =
            actualPeer ||
            'incoming-peer-fallback';
    }

    // ----------------------------------------------------------
    // CHAT STORAGE
    // ----------------------------------------------------------

    const chatStorageKey =
        `chat_history_${cleanUserId}_${peerId}`;

    // ----------------------------------------------------------
    // AVATARS
    // ----------------------------------------------------------

    const myAvatar = global.profile
        ? `${BASIC_URL}uploads/${global.profile.replace(
            /^\/+/,
            ''
        )}`
        : `${BASIC_URL}uploads/dumy.png`;

    const peerAvatar = peerData?.image
        ? `${BASIC_URL}uploads/${peerData.image.replace(
            /^\/+/,
            ''
        )}`
        : `${BASIC_URL}uploads/dumy.png`;

    // ----------------------------------------------------------
    // CHECK BLOCKED STATUS
    // ----------------------------------------------------------

    useEffect(() => {
        const checkBlockedStatus = async () => {
            const blockedState =
                await AsyncStorage.getItem(
                    `user_blocked_${peerId}`
                );

            if (blockedState === 'true') {
                setIsBlocked(true);
            } else {
                setIsBlocked(false);
            }
        };

        checkBlockedStatus();

        const unsubscribe =
            navigation.addListener(
                'focus',
                checkBlockedStatus
            );

        return unsubscribe;
    }, [
        navigation,
        peerId,
    ]);

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------

    useEffect(() => {
        if (route.params?.startSearch) {
            setIsSearchActive(true);
        }
    }, [
        route.params?.startSearch,
    ]);

    // ----------------------------------------------------------
    // LOAD LOCAL CHAT HISTORY
    // ----------------------------------------------------------

    useEffect(() => {
        const loadLocalHistory = async () => {
            try {
                const storedHistory =
                    await AsyncStorage.getItem(
                        chatStorageKey
                    );

                if (storedHistory) {
                    const parsedHistory =
                        JSON.parse(storedHistory);

                    const alignedHistory =
                        parsedHistory
                            .filter(
                                msg => msg.senderRole
                            )
                            .map(msg => {
                                msg.user._id =
                                    msg.senderRole ===
                                    currentDashboardRole
                                        ? cleanUserId
                                        : peerId;

                                return msg;
                            });

                    setMessages(alignedHistory);
                }
            } catch (error) {
                console.log(
                    'Error loading local chat history',
                    error
                );
            }
        };

        loadLocalHistory();
    }, [
        chatStorageKey,
        currentDashboardRole,
        cleanUserId,
        peerId,
    ]);

    // ==========================================================
    // FETCH API MESSAGES
    // ==========================================================

    const fetchApiMessages =
        useCallback(async () => {
            try {
                const formdata =
                    new FormData();

                formdata.append(
                    'own_id',
                    cleanUserId
                );

                const response =
                    await fetch(
                        `${BASIC_URL}get_all_chats.php`,
                        {
                            method: 'POST',
                            body: formdata,
                        }
                    );

                const textRes =
                    await response.text();

                let result;

                try {
                    result =
                        JSON.parse(textRes);
                } catch (parseErr) {
                    return;
                }

                const allChats =
                    result?.chat || [];

                const specificChat =
                    allChats.find(
                        c =>
                            String(c.chat_id) === peerId ||
                            String(c.user_id) === peerId ||
                            String(c.provider_id) === peerId ||
                            c.name === peerData?.name
                    );

                if (specificChat) {
                    let parsedDate =
                        new Date();

                    if (
                        specificChat.created_at
                    ) {
                        const d =
                            new Date(
                                specificChat.created_at
                            );

                        if (
                            !isNaN(d.getTime())
                        ) {
                            parsedDate = d;
                        }
                    }

                    const stableId =
                        String(
                            specificChat.id ||
                            `${specificChat.created_at}_${specificChat.message}`
                        );

                    setMessages(
                        previousMessages => {
                            const alreadySentByMe =
                                previousMessages.some(
                                    m =>
                                        m.text?.trim() ===
                                        (
                                            specificChat.message ||
                                            ''
                                        ).trim() &&
                                        String(
                                            m.user?._id
                                        ) ===
                                        String(
                                            cleanUserId
                                        )
                                );

                            if (
                                alreadySentByMe
                            ) {
                                return previousMessages;
                            }

                            const rawSenderId =
                                String(
                                    specificChat.sender_id ||
                                    ''
                                );

                            const isActuallyMe =
                                rawSenderId ===
                                cleanUserId;

                            const oppositeRole =
                                currentDashboardRole ===
                                'provider'
                                    ? 'customer'
                                    : 'provider';

                            const msgSenderRole =
                                specificChat.senderRole ||
                                (
                                    isActuallyMe
                                        ? currentDashboardRole
                                        : oppositeRole
                                );

                            const newIncomingMessage = {
                                _id: stableId,

                                text:
                                    specificChat.message ||
                                    '',

                                createdAt:
                                parsedDate,

                                senderRole:
                                msgSenderRole,

                                user: {
                                    _id:
                                        msgSenderRole ===
                                        currentDashboardRole
                                            ? cleanUserId
                                            : peerId,

                                    name:
                                        isActuallyMe
                                            ? 'Me'
                                            : specificChat.name ||
                                            peerData?.name ||
                                            'User',

                                    avatar:
                                        isActuallyMe
                                            ? myAvatar
                                            : peerAvatar,
                                },
                            };

                            const existingIds =
                                new Set(
                                    previousMessages.map(
                                        m =>
                                            String(
                                                m._id
                                            )
                                    )
                                );

                            if (
                                !existingIds.has(
                                    newIncomingMessage._id
                                )
                            ) {
                                const updatedMessages =
                                    GiftedChat.append(
                                        previousMessages,
                                        [
                                            newIncomingMessage,
                                        ]
                                    );

                                AsyncStorage.setItem(
                                    chatStorageKey,
                                    JSON.stringify(
                                        updatedMessages
                                    )
                                ).catch(e =>
                                    console.log(e)
                                );

                                return updatedMessages;
                            }

                            return previousMessages;
                        }
                    );
                }
            } catch (error) {
                console.log(
                    'Error fetching chat messages:',
                    error
                );
            }
        }, [
            cleanUserId,
            peerId,
            peerData,
            chatStorageKey,
            myAvatar,
            peerAvatar,
            currentDashboardRole,
        ]);

    // ----------------------------------------------------------
    // POLLING
    // ----------------------------------------------------------

    useEffect(() => {
        fetchApiMessages();

        const interval =
            setInterval(() => {
                fetchApiMessages();
            }, 4000);

        return () =>
            clearInterval(interval);
    }, [
        fetchApiMessages,
    ]);

    // ==========================================================
    // RECORDING
    // ==========================================================

    const startRecording = async () => {
        if (isBlocked || recordingRef.current || isStartingRef.current) return;

        const Audio = getAudioModule();

        if (!Audio) {
            showAlert(
                'Voice Notes Unavailable',
                'Update the app to a build that includes voice note support.'
            );
            return;
        }

        try {
            isStartingRef.current = true;
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status !== 'granted') {
                showAlert(
                    'Permission Required',
                    'Microphone access is needed.'
                );
                isStartingRef.current = false;
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            // Prevent recording from being stuck open if user quickly released tap
            if (!isStartingRef.current) {
                await newRecording.stopAndUnloadAsync();
                return;
            }

            recordingRef.current = newRecording;
            setRecording(newRecording);
        } catch (err) {
            console.error('Failed to start recording', err);
        } finally {
            isStartingRef.current = false;
        }
    };

    const stopRecording = async () => {
        isStartingRef.current = false;
        const activeRecording = recordingRef.current || recording;

        if (!activeRecording) return;

        recordingRef.current = null;
        setRecording(undefined);

        try {
            await activeRecording.stopAndUnloadAsync();

            const uri = activeRecording.getURI();

            if (uri) {
                onSend([{ text: '', audio: uri }]);
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
            showAlert(
                'Voice Note Failed',
                'The recording could not be saved. Please try again.'
            );
        } finally {
            const Audio = getAudioModule();
            if (Audio) {
                try {
                    await Audio.setAudioModeAsync({
                        allowsRecordingIOS: false,
                    });
                } catch (error) {
                    console.warn('Failed to reset audio mode', error);
                }
            }
        }
    };

    // ==========================================================
    // MESSAGE LONG PRESS
    // ==========================================================

    const handleLongPress = (
        context,
        message
    ) => {
        if (Platform.OS !== 'web') {
            setSelectedMessage(message);
            setKebabVisible(false);
        }
    };

    const handlePress = (
        context,
        message
    ) => {
        if (
            Platform.OS !== 'web' &&
            selectedMessage
        ) {
            setSelectedMessage(null);
            setKebabVisible(false);
        }
    };

    // ==========================================================
    // DELETE MESSAGE
    // ==========================================================

    const deleteMessageLocally =
        async messageId => {
            setMessages(
                prevMessages => {
                    const updatedMessages =
                        prevMessages.filter(
                            m =>
                                String(m._id) !==
                                String(messageId)
                        );

                    AsyncStorage.setItem(
                        chatStorageKey,
                        JSON.stringify(
                            updatedMessages
                        )
                    ).catch(e =>
                        console.log(e)
                    );

                    return updatedMessages;
                }
            );

            setSelectedMessage(null);
            setOpenMenuMessageId(null);
        };

    // ==========================================================
    // COPY
    // ==========================================================

    const handleCopyAction = text => {
        if (text) {
            try {
                Clipboard.setString(text);
            } catch (e) {}
        }

        setKebabVisible(false);
        setSelectedMessage(null);
        setOpenMenuMessageId(null);
    };

    // ==========================================================
    // FORWARD
    // ==========================================================

    const handleForwardAction =
        text => {
            showAlert(
                'Forward Message',
                `Forwarding: "${
                    text || 'Image message'
                }"`
            );

            setKebabVisible(false);
            setSelectedMessage(null);
            setOpenMenuMessageId(null);
        };

    // ==========================================================
    // CLEAR CHAT
    // ==========================================================

    const handleClearChatAction =
        () => {
            setMessages([]);

            AsyncStorage.removeItem(
                chatStorageKey
            ).catch(e =>
                console.log(e)
            );

            setSelectedMessage(null);
            setKebabVisible(false);
        };

    // ==========================================================
    // SEND MESSAGE
    // ==========================================================

    const onSend = async (
        messagesList = []
    ) => {
        if (isBlocked) return;

        // GiftedChat handles clearing the text input automatically upon sending.

        try {
            const msg =
                messagesList[0];

            if (
                !msg?.text?.trim() &&
                !msg?.image &&
                !msg?.audio
            ) {
                return;
            }

            const currentSyncId =
                (await getSynchronizedUserId()) ||
                cleanUserId;

            const textContent =
                msg.text
                    ? msg.text.trim()
                    : msg.audio
                        ? '🎤 Voice Note'
                        : '';

            const formattedMsg = {
                _id: String(
                    Date.now()
                ),

                text: textContent,

                createdAt:
                    new Date(),

                senderRole:
                currentDashboardRole,

                user: {
                    _id: cleanUserId,
                    name: 'Me',
                    avatar: myAvatar,
                },

                image:
                    msg.image || '',

                audio:
                    msg.audio || '',
            };

            setMessages(
                previousMessages => {
                    const updatedMessages =
                        GiftedChat.append(
                            previousMessages,
                            [formattedMsg]
                        );

                    AsyncStorage.setItem(
                        chatStorageKey,
                        JSON.stringify(
                            updatedMessages
                        )
                    ).catch(e =>
                        console.log(e)
                    );

                    return updatedMessages;
                }
            );

            const chatForm =
                new FormData();

            chatForm.append(
                'own_id',
                currentSyncId
            );

            chatForm.append(
                'chat_user_id',
                peerId
            );

            chatForm.append(
                'message',
                textContent
            );

            chatForm.append(
                'senderRole',
                currentDashboardRole
            );

            const notifyForm =
                new FormData();

            notifyForm.append(
                'sender_id',
                currentSyncId
            );

            notifyForm.append(
                'receiver_id',
                peerId
            );

            notifyForm.append(
                'message',
                textContent ||
                '📷 Sent an image'
            );

            await Promise.allSettled([
                fetch(
                    `${BASIC_URL}firebase/chat.php`,
                    {
                        method: 'POST',
                        body: chatForm,
                    }
                ),

                fetch(
                    `${BASIC_URL}firebase/send_notification.php`,
                    {
                        method: 'POST',
                        body: notifyForm,
                    }
                ),
            ]);
        } catch (error) {
            console.error(
                'Send error:',
                error
            );

            showAlert(
                'Send failed',
                'Could not send message.'
            );
        }
    };

    // ==========================================================
    // CAMERA
    // ==========================================================

    const openCamera = async () => {
        if (isBlocked) return;

        try {
            const {
                status,
            } =
                await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                showAlert(
                    'Permission Required',
                    'Camera access is needed.'
                );

                return;
            }

            const result =
                await ImagePicker.launchCameraAsync(
                    {
                        mediaTypes: ['images'],
                        quality: 0.8,
                    }
                );

            if (
                !result.canceled &&
                result.assets?.length > 0
            ) {
                setUploading(true);

                const asset =
                    result.assets[0];

                setUploading(false);

                onSend([
                    {
                        text: '',
                        image: asset.uri,
                    },
                ]);
            }
        } catch (err) {
            setUploading(false);

            showAlert(
                'Upload failed',
                'Could not upload image.'
            );
        }
    };

    // ==========================================================
    // UNBLOCK USER
    // ==========================================================

    const unblockUser = async () => {
        await AsyncStorage.removeItem(
            `user_blocked_${peerId}`
        );

        setIsBlocked(false);

        Alert.alert(
            'Unblocked',
            `You can now message ${
                peerData?.name || 'this user'
            }.`
        );
    };

    // ==========================================================
    // INVALID SESSION
    // ==========================================================

    if (
        !cleanUserId ||
        !peerId ||
        cleanUserId === 'undefined' ||
        peerId === 'undefined'
    ) {
        return (
            <View
                style={
                    styles.missingUserBox
                }
            >
                <Icons.Feather
                    name="alert-circle"
                    size={40}
                    color="#CBD5E1"
                />

                <Text
                    style={
                        styles.missingUserText
                    }
                >
                    Loading chat session...
                </Text>
            </View>
        );
    }

    // ==========================================================
    // SEARCH FILTER
    // ==========================================================

    const displayedMessages =
        searchQuery.trim()
            ? messages.filter(
                m =>
                    m.text &&
                    m.text
                        .toLowerCase()
                        .includes(
                            searchQuery
                                .toLowerCase()
                        )
            )
            : messages;

    // ==========================================================
    // UI
    // ==========================================================

    return (
        <View
            style={
                styles.chatWrapper
            }
        >

            {/* =====================================================
          CONTEXT HEADER
      ====================================================== */}

            {selectedMessage ? (
                <View
                    style={
                        styles.contextualHeader
                    }
                >
                    <View
                        style={
                            styles.contextHeaderLeft
                        }
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedMessage(
                                    null
                                );

                                setKebabVisible(
                                    false
                                );
                            }}
                        >
                            <Icons.Feather
                                name="arrow-left"
                                size={24}
                                color="#FFF"
                            />
                        </TouchableOpacity>

                        <Text
                            style={
                                styles.contextHeaderText
                            }
                        >
                            1
                        </Text>
                    </View>

                    <View
                        style={
                            styles.contextHeaderRight
                        }
                    >
                        <TouchableOpacity
                            style={
                                styles.iconBtn
                            }
                        >
                            <Icons.Feather
                                name="corner-up-left"
                                size={22}
                                color="#FFF"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.iconBtn
                            }
                        >
                            <Icons.Feather
                                name="star"
                                size={22}
                                color="#FFF"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                deleteMessageLocally(
                                    selectedMessage._id
                                )
                            }
                            style={
                                styles.iconBtn
                            }
                        >
                            <Icons.Ionicons
                                name="trash"
                                size={22}
                                color="#FFF"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                handleForwardAction(
                                    selectedMessage.text
                                )
                            }
                            style={
                                styles.iconBtn
                            }
                        >
                            <Icons.Feather
                                name="corner-up-right"
                                size={22}
                                color="#FFF"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                setKebabVisible(
                                    !kebabVisible
                                )
                            }
                            style={
                                styles.iconBtn
                            }
                        >
                            <Icons.Feather
                                name="more-vertical"
                                size={24}
                                color="#FFF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : isSearchActive ? (

                /* ===================================================
                    SEARCH HEADER
                ==================================================== */

                <View
                    style={
                        styles.searchHeader
                    }
                >
                    <TouchableOpacity
                        onPress={() => {
                            setIsSearchActive(
                                false
                            );

                            setSearchQuery('');

                            navigation.setParams({
                                startSearch: false,
                            });
                        }}
                    >
                        <Icons.Feather
                            name="arrow-left"
                            size={24}
                            color="#0F172A"
                        />
                    </TouchableOpacity>

                    <TextInput
                        style={
                            styles.searchHeaderInput
                        }
                        placeholder="Search..."
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={
                            setSearchQuery
                        }
                        autoFocus={true}
                    />

                    {searchQuery.length >
                        0 && (
                            <TouchableOpacity
                                onPress={() =>
                                    setSearchQuery('')
                                }
                                style={{
                                    marginRight: 12,
                                }}
                            >
                                <Icons.Feather
                                    name="x"
                                    size={20}
                                    color="#64748B"
                                />
                            </TouchableOpacity>
                        )}

                    <TouchableOpacity
                        style={
                            styles.iconBtn
                        }
                    >
                        <Icons.Feather
                            name="calendar"
                            size={22}
                            color="#0F172A"
                        />
                    </TouchableOpacity>
                </View>

            ) : (

                /* ===================================================
                    NORMAL CHAT HEADER
                ==================================================== */

                <ChatUsrHeader
                    userName={
                        peerData?.name ||
                        'Chat'
                    }

                    userImage={
                        peerAvatar
                    }

                    onlineStatus={
                        !isBlocked
                    }

                    onProfilePress={() => {
                        navigation.navigate(
                            'UserProfile',
                            {
                                userId: peerId,
                                userData:
                                peerData,
                            }
                        );
                    }}
                />
            )}

            {/* =====================================================
          GIFTED CHAT & KEYBOARD AVOIDING VIEW
      ====================================================== */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
            >
                <GiftedChat
                    messages={
                        displayedMessages
                    }

                    textInputRef={composerRef}

                    extraData={{
                        selectedMessage,
                        hoveredMessageId,
                        openMenuMessageId,
                        searchQuery,
                        isBlocked,
                        recording, // Added so UI updates when mic is held down
                    }}

                    bottomOffset={
                        Platform.OS === 'ios'
                            ? insets.bottom
                            : 0
                    }

                    onSend={messagesList =>
                        onSend(messagesList)
                    }

                    user={{
                        _id: String(
                            cleanUserId
                        ),
                    }}

                    isUserAvatarVisible={true}

                    alignTop={false}

                    scrollToBottom={true}

                    isAvatarOnTop={true}

                    isInverted={true}

                    isSendButtonAlwaysVisible

                    onLongPressMessage={handleLongPress}

                    onPressMessage={handlePress}

                    messagesContainerStyle={{
                        backgroundColor:
                            '#F0F2F5',
                        paddingBottom: 10,
                    }}

                    listViewProps={{
                        style: {
                            flex: 1,
                        },
                        keyboardShouldPersistTaps: 'always',
                        keyboardDismissMode:
                            Platform.OS === 'ios'
                                ? 'interactive'
                                : 'on-drag',
                    }}

                    // ====================================================
                    // AUDIO MESSAGE
                    // ====================================================

                    renderMessageAudio={props => {
                        const {
                            currentMessage,
                            position,
                        } = props;

                        return (
                            <AudioMessage
                                audioUri={
                                    currentMessage.audio
                                }
                                isMe={
                                    position === 'right'
                                }
                            />
                        );
                    }}

                    // ====================================================
                    // IMAGE MESSAGE
                    // ====================================================

                    renderMessageImage={
                        props => {
                            const {
                                currentMessage,
                            } = props;

                            if (
                                !currentMessage?.image
                            ) {
                                return null;
                            }

                            return (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        setSelectedImage(
                                            currentMessage.image
                                        );

                                        setImageModalVisible(
                                            true
                                        );
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri:
                                            currentMessage.image,
                                        }}
                                        style={
                                            styles.chatMsgImage
                                        }
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            );
                        }
                    }

                    // ====================================================
                    // MESSAGE TEXT
                    // ====================================================

                    renderMessageText={
                        props => {
                            const {
                                currentMessage,
                            } = props;

                            if (
                                currentMessage?.audio
                            ) {
                                return null;
                            }

                            return (
                                <MessageText
                                    {...props}
                                    textStyle={{
                                        left: {
                                            color:
                                            color.defalt,
                                            fontSize: 15.5,
                                            lineHeight: 22,
                                        },

                                        right: {
                                            color:
                                                '#FFFFFF',
                                            fontSize: 15.5,
                                            lineHeight: 22,
                                        },
                                    }}
                                />
                            );
                        }
                    }

                    // ====================================================
                    // INPUT TOOLBAR
                    // ====================================================

                    renderInputToolbar={
                        props => {
                            if (isBlocked) {
                                return (
                                    <TouchableOpacity
                                        style={
                                            styles.blockedBannerContainer
                                        }
                                        onPress={
                                            unblockUser
                                        }
                                        activeOpacity={0.8}
                                    >
                                        <Text
                                            style={
                                                styles.blockedBannerTextBold
                                            }
                                        >
                                            You blocked this
                                            contact. Tap to
                                            unblock.
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }

                            return (
                                <InputToolbar
                                    {...props}
                                    containerStyle={
                                        styles.inputToolbar
                                    }
                                    primaryStyle={
                                        styles.inputToolbarPrimary
                                    }
                                />
                            );
                        }
                    }

                    // ====================================================
                    // WHATSAPP STYLE COMPOSER
                    // ====================================================

                    renderComposer={
                        props => {
                            if (isBlocked) {
                                return null;
                            }

                            const hasText =
                                props.text &&
                                props.text.trim()
                                    .length > 0;

                            return (
                                <View
                                    style={
                                        styles.composerWrapper
                                    }
                                >

                                    {/* ----------------------------------------
                    EMOJI BUTTON
                ----------------------------------------- */}

                                    <TouchableOpacity
                                        style={
                                            styles.inputActionBtn
                                        }
                                        onPress={() => {
                                            // Simply focus the input so the native keyboard appears
                                            composerRef.current?.focus();
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Icons.Feather
                                            name="smile"
                                            size={24}
                                            color="#64748B"
                                        />
                                    </TouchableOpacity>

                                    {/* ----------------------------------------
                    MESSAGE INPUT
                ----------------------------------------- */}

                                    <Composer
                                        {...props}
                                        placeholder="Message"
                                        placeholderTextColor="#94A3B8"
                                        textInputStyle={[
                                            styles.composerInput,
                                            {
                                                color:
                                                    '#0F172A',
                                            },
                                        ]}
                                    />

                                    {/* ----------------------------------------
                    RIGHT ICONS
                ----------------------------------------- */}

                                    <View
                                        style={
                                            styles.composerRightIcons
                                        }
                                    >

                                        {/* ATTACHMENT */}

                                        <TouchableOpacity
                                            style={
                                                styles.inputActionBtn
                                            }
                                            activeOpacity={0.7}
                                        >
                                            <Icons.Feather
                                                name="paperclip"
                                                size={22}
                                                color="#64748B"
                                            />
                                        </TouchableOpacity>

                                        {/* CAMERA */}

                                        {!hasText &&
                                            !uploading && (
                                                <TouchableOpacity
                                                    style={
                                                        styles.inputActionBtn
                                                    }
                                                    onPress={
                                                        openCamera
                                                    }
                                                    activeOpacity={
                                                        0.7
                                                    }
                                                >
                                                    <Icons.Feather
                                                        name="camera"
                                                        size={22}
                                                        color="#64748B"
                                                    />
                                                </TouchableOpacity>
                                            )}
                                    </View>
                                </View>
                            );
                        }
                    }

                    // ====================================================
                    // SEND BUTTON / MIC BUTTON
                    // ====================================================

                    renderSend={
                        props => {
                            if (isBlocked) {
                                return null;
                            }

                            const hasText =
                                props.text &&
                                props.text.trim()
                                    .length > 0;

                            return (
                                <View
                                    style={
                                        styles.sendComponentWrapper
                                    }
                                >

                                    {/* SEND */}

                                    {hasText ? (
                                        <Send
                                            {...props}
                                            containerStyle={{
                                                justifyContent:
                                                    'center',
                                                alignItems:
                                                    'center',
                                            }}
                                        >
                                            <View
                                                style={
                                                    styles.sendButton
                                                }
                                            >
                                                {uploading ? (
                                                    <ActivityIndicator
                                                        size="small"
                                                        color="#FFFFFF"
                                                    />
                                                ) : (
                                                    <Icons.Feather
                                                        name="send"
                                                        size={16}
                                                        color="#FFFFFF"
                                                        style={{
                                                            marginLeft:
                                                                -2,
                                                        }}
                                                    />
                                                )}
                                            </View>
                                        </Send>
                                    ) : (

                                        /* MICROPHONE */

                                        <TouchableOpacity
                                            onPressIn={
                                                startRecording
                                            }
                                            onPressOut={
                                                stopRecording
                                            }
                                            activeOpacity={0.7}
                                            style={[
                                                styles.sendButton,

                                                recording && {
                                                    backgroundColor:
                                                        '#EF4444',
                                                },
                                            ]}
                                        >
                                            <Icons.Feather
                                                name="mic"
                                                size={18}
                                                color="#FFFFFF"
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        }
                    }

                    // ====================================================
                    // BUBBLE
                    // ====================================================

                    renderBubble={
                        props => (
                            <Bubble
                                {...props}

                                wrapperStyle={{
                                    left: {
                                        backgroundColor:
                                            '#FFFFFF',

                                        borderRadius: 16,

                                        borderBottomLeftRadius:
                                            4,

                                        borderBottomRightRadius:
                                            16,

                                        padding: 4,

                                        marginBottom: 4,
                                    },

                                    right: {
                                        backgroundColor:
                                        color.defalt,

                                        borderRadius: 16,

                                        borderBottomLeftRadius:
                                            16,

                                        borderBottomRightRadius:
                                            4,

                                        padding: 4,

                                        marginBottom: 4,
                                    },
                                }}

                                textStyle={{
                                    left: {
                                        color:
                                        color.defalt,

                                        fontSize: 15.5,

                                        lineHeight: 22,
                                    },

                                    right: {
                                        color:
                                            '#FFFFFF',

                                        fontSize: 15.5,

                                        lineHeight: 22,
                                    },
                                }}
                            />
                        )
                    }
                />
            </KeyboardAvoidingView>

            {/* =====================================================
          FULL SCREEN IMAGE MODAL
      ====================================================== */}

            <Modal
                visible={
                    imageModalVisible
                }
                transparent={true}
                animationType="fade"
                onRequestClose={() =>
                    setImageModalVisible(
                        false
                    )
                }
            >
                <Pressable
                    style={
                        styles.modalContainer
                    }
                    onPress={() =>
                        setImageModalVisible(
                            false
                        )
                    }
                >
                    {selectedImage && (
                        <Image
                            source={{
                                uri: selectedImage,
                            }}
                            style={
                                styles.fullImage
                            }
                            resizeMode="contain"
                        />
                    )}
                </Pressable>
            </Modal>

            {/* =====================================================
          KEBAB MENU
      ====================================================== */}

            {selectedMessage &&
                kebabVisible && (
                    <View
                        style={
                            styles.kebabMenu
                        }
                    >
                        <TouchableOpacity
                            style={
                                styles.kebabMenuItem
                            }
                            onPress={() =>
                                handleCopyAction(
                                    selectedMessage.text
                                )
                            }
                        >
                            <Text
                                style={
                                    styles.kebabMenuText
                                }
                            >
                                Copy
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.kebabMenuItem
                            }
                            onPress={() =>
                                handleForwardAction(
                                    selectedMessage.text
                                )
                            }
                        >
                            <Text
                                style={
                                    styles.kebabMenuText
                                }
                            >
                                Forward
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.kebabMenuItem
                            }
                            onPress={
                                handleClearChatAction
                            }
                        >
                            <Text
                                style={[
                                    styles.kebabMenuText,
                                    {
                                        color:
                                            '#EF4444',
                                    },
                                ]}
                            >
                                Clear chat
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
        </View>
    );
};

// ============================================================
// ENCRYPTION INFO SCREEN
// ============================================================

const EncryptionInfoScreen = () => {
    const navigation =
        useNavigation();

    const route =
        useRoute();

    const {
        userName,
    } =
    route.params || {
        userName: 'User',
    };

    return (
        <SafeAreaView
            style={
                styles.safeArea
            }
            edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['top']}
        >
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FFFFFF"
            />

            <View
                style={
                    styles.headerBar
                }
            >
                <TouchableOpacity
                    onPress={() =>
                        navigation.goBack()
                    }
                    style={
                        styles.iconBtn
                    }
                >
                    <Icons.Ionicons
                        name="arrow-back"
                        size={24}
                        color="#0F172A"
                    />
                </TouchableOpacity>

                <Text
                    style={
                        styles.fullScreenModalTitle
                    }
                >
                    Encryption
                </Text>

                <View
                    style={{
                        flex: 1,
                    }}
                />
            </View>

            <ScrollView
                contentContainerStyle={
                    styles.encryptionBody
                }
            >
                <View
                    style={
                        styles.lockBadgeBox
                    }
                >
                    <Icons.Feather
                        name="lock"
                        size={48}
                        color={color.defalt}
                    />
                </View>

                <Text
                    style={
                        styles.encryptionMainTitle
                    }
                >
                    End-to-end encryption
                </Text>

                <Text
                    style={
                        styles.encryptionDetailText
                    }
                >
                    Messages and calls you
                    share with {userName} are
                    end-to-end encrypted.
                    This means WhatsApp and
                    third-party services cannot
                    read or listen to them.
                </Text>

                <View
                    style={
                        styles.qrPlaceholder
                    }
                >
                    <Icons.Ionicons
                        name="qr-code-outline"
                        size={140}
                        color="#0F172A"
                    />
                </View>

                <Text
                    style={
                        styles.securityCodeText
                    }
                >
                    27189 45912 61234 88123
                    {'\n'}
                    99120 45719 33412 11094
                    {'\n'}
                    78213 54311 09843 66124
                </Text>

                <Text
                    style={
                        styles.encryptionInfo
                    }
                >
                    Verify this code with{' '}
                    {userName} by scanning
                    their QR code or comparing
                    the numbers above.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

// ============================================================
// INDIVIDUAL CHAT
// ============================================================

const IndividualChat = () => {
    const route =
        useRoute();

    const currentprovider =
        route.params?.currentuser ||
        route.params?.userData ||
        route.params?.provider ||
        route.params?.item ||
        route.params?.user;

    const peerId =
        String(
            route.params?.receiver_id ||
            route.params?.userId ||
            currentprovider?.id ||
            currentprovider?.provider_id ||
            currentprovider?.user_id ||
            currentprovider?.uuid ||
            ''
        ).trim();

    const [
        resolvedUserId,
        setResolvedUserId,
    ] = useState(null);

    const [
        alertConfig,
        setAlertConfig,
    ] = useState({
        visible: false,
        title: '',
        message: '',
        onOk: () =>
            setAlertConfig(
                prev => ({
                    ...prev,
                    visible: false,
                })
            ),
    });

    const showAlert = (
        title,
        message,
        onOk
    ) => {
        setAlertConfig({
            visible: true,

            title,

            message,

            onOk: () => {
                setAlertConfig(
                    prev => ({
                        ...prev,
                        visible: false,
                    })
                );

                if (onOk) {
                    onOk();
                }
            },
        });
    };

    useEffect(() => {
        const syncUser =
            async () => {
                const userId =
                    await getSynchronizedUserId();

                if (userId) {
                    setResolvedUserId(
                        userId
                    );
                } else if (
                    global.id
                ) {
                    setResolvedUserId(
                        String(global.id)
                    );
                }
            };

        if (!resolvedUserId) {
            syncUser();
        }
    }, [
        resolvedUserId,
    ]);

    return (
        <SafeAreaView
            style={
                styles.safeArea
            }
            edges={Platform.OS === 'ios' ? ['top', 'bottom'] : ['top']}
        >
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F8FAFC"
            />

            <View
                style={
                    styles.chatViewContainer
                }
            >
                {resolvedUserId &&
                peerId ? (
                    <NewMessage
                        userId={
                            resolvedUserId
                        }
                        providerId={
                            peerId
                        }
                        peerData={
                            currentprovider
                        }
                        showAlert={
                            showAlert
                        }
                    />
                ) : (
                    <View
                        style={
                            styles.missingUserBox
                        }
                    >
                        <ActivityIndicator
                            size="large"
                            color={
                                color.defalt
                            }
                        />

                        <Text
                            style={
                                styles.missingUserText
                            }
                        >
                            Connecting to
                            conversation...
                        </Text>
                    </View>
                )}
            </View>

            <CustomAlert
                visible={
                    alertConfig.visible
                }
                title={
                    alertConfig.title
                }
                message={
                    alertConfig.message
                }
                onOk={
                    alertConfig.onOk
                }
            />
        </SafeAreaView>
    );
};

export {
    EncryptionInfoScreen,
};

export default IndividualChat;

const styles =
    StyleSheet.create({

        safeArea: {
            flex: 1,
            backgroundColor:
                '#FFFFFF',
        },

        chatWrapper: {
            flex: 1,
            backgroundColor:
                '#F0F2F5',
        },
        chatViewContainer: {
            flex: 1,
            backgroundColor:
                '#F0F2F5',
        },
        contextualHeader: {
            height: 60,
            backgroundColor:
            color.defalt,
            flexDirection:
                'row',
            alignItems:
                'center',
            justifyContent:
                'space-between',
            paddingHorizontal: 16,
            zIndex: 10,
            elevation: 4,
        },
        contextHeaderLeft: {
            flexDirection:
                'row',
            alignItems:
                'center',
        },
        contextHeaderText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight:
                'bold',
            marginLeft: 20,
        },
        contextHeaderRight: {
            flexDirection:
                'row',
            alignItems:
                'center',
        },
        searchHeader: {
            height: 60,
            backgroundColor:
                '#FFFFFF',
            flexDirection:
                'row',
            alignItems:
                'center',
            paddingHorizontal: 16,
            zIndex: 10,
            elevation: 4,

            shadowColor:
                '#000',

            shadowOffset: {
                width: 0,
                height: 2,
            },

            shadowOpacity:
                0.1,
        },

        searchHeaderInput: {
            flex: 1,
            height: 40,
            marginLeft: 12,
            fontSize: 16,
            color: '#0F172A',
            borderWidth: 0,

            ...(Platform.OS ===
                'web' && {
                    outlineStyle:
                        'none',
                }),
        },
        iconBtn: {
            marginLeft: 16,
            padding: 4,
        },
        kebabMenu: {
            position:
                'absolute',

            top: 55,

            right: 16,

            backgroundColor:
                '#FFFFFF',

            borderRadius: 8,

            elevation: 5,

            shadowColor:
                '#000',

            shadowOffset: {
                width: 0,
                height: 2,
            },

            shadowOpacity:
                0.2,

            paddingVertical: 4,

            zIndex: 1000,
        },

        kebabMenuItem: {
            paddingHorizontal:
                20,

            paddingVertical:
                12,
        },

        kebabMenuText: {
            fontSize: 15,
            color: '#0F172A',
            fontWeight:
                '500',
        },

        // --------------------------------------------------------
        // CHAT IMAGE
        // --------------------------------------------------------

        chatMsgImage: {
            width: 240,
            height: 180,
            borderRadius: 12,
            margin: 4,
        },

        // --------------------------------------------------------
        // INPUT TOOLBAR
        // --------------------------------------------------------

        inputToolbar: {
            backgroundColor:
                '#F0F2F5',

            borderTopWidth:
                0,

            paddingHorizontal:
                12,

            paddingVertical:
                8,

            paddingBottom:
                Platform.OS === 'ios'
                    ? 24
                    : 12,
        },
        inputToolbarPrimary: {
            alignItems:
                'flex-end',

            justifyContent:
                'space-between',
        },
        composerWrapper: {
            flex: 1,

            flexDirection:
                'row',

            alignItems:
                'center',

            backgroundColor:
                '#FFFFFF',

            borderRadius: 24,

            paddingLeft: 4,

            paddingRight: 4,

            marginRight: 8,

            minHeight: 46,

            maxHeight: 120,

            borderWidth: 1,

            borderColor:
                '#E2E8F0',
        },
        inputActionBtn: {
            width: 40,
            height: 40,

            justifyContent:
                'center',

            alignItems:
                'center',
        },
        composerRightIcons: {
            flexDirection:
                'row',

            alignItems:
                'center',
        },
        composerInput: {
            flex: 1,

            color:
                '#0F172A',

            fontSize: 16,

            lineHeight: 21,

            paddingTop:
                Platform.OS === 'ios'
                    ? 11
                    : 8,

            paddingBottom:
                Platform.OS === 'ios'
                    ? 11
                    : 8,

            paddingHorizontal: 4,

            ...(Platform.OS ===
                'web' && {
                    outlineWidth: 0,
                }),
        },

        // --------------------------------------------------------
        // SEND
        // --------------------------------------------------------

        sendComponentWrapper: {
            justifyContent:
                'center',

            alignItems:
                'center',

            marginBottom: 2,
        },

        sendButton: {
            backgroundColor:
            color.defalt,

            borderRadius: 22,

            width: 44,

            height: 44,

            justifyContent:
                'center',

            alignItems:
                'center',

            ...Platform.select({
                ios: {
                    shadowColor:
                    color.defalt,

                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },

                    shadowOpacity:
                        0.25,

                    shadowRadius: 4,
                },

                android: {
                    elevation: 2,
                },

                web: {
                    boxShadow:
                        '0 2px 6px rgba(186, 104, 56, 0.25)',
                },
            }),
        },

        // --------------------------------------------------------
        // IMAGE MODAL
        // --------------------------------------------------------

        modalContainer: {
            flex: 1,

            backgroundColor:
                'rgba(15, 23, 42, 0.95)',

            justifyContent:
                'center',

            alignItems:
                'center',
        },

        fullImage: {
            width:
            Dimensions.get(
                'window'
            ).width,

            height:
            Dimensions.get(
                'window'
            ).height,
        },

        // --------------------------------------------------------
        // MISSING USER
        // --------------------------------------------------------

        missingUserBox: {
            flex: 1,

            justifyContent:
                'center',

            alignItems:
                'center',

            paddingHorizontal: 20,
        },

        missingUserText: {
            textAlign:
                'center',

            color:
                '#64748B',

            fontSize: 15,

            fontWeight:
                '600',

            marginTop: 12,
        },

        // --------------------------------------------------------
        // BLOCKED
        // --------------------------------------------------------

        blockedBannerContainer: {
            backgroundColor:
                '#F1F5F9',

            paddingVertical:
                14,

            paddingHorizontal:
                20,

            alignItems:
                'center',

            justifyContent:
                'center',

            borderTopWidth: 1,

            borderTopColor:
                '#E2E8F0',
        },

        blockedBannerTextBold: {
            fontSize: 14,

            fontWeight:
                '600',

            color:
                '#EF4444',

            textAlign:
                'center',
        },

        // --------------------------------------------------------
        // WEB
        // --------------------------------------------------------

        webChevronArrow: {
            position:
                'absolute',

            top: 4,

            zIndex: 10,

            padding: 2,

            backgroundColor:
                'transparent',
        },

        webDropdownMenu: {
            position:
                'absolute',

            top: 30,

            backgroundColor:
                '#FFFFFF',

            borderRadius: 8,

            paddingVertical: 8,

            minWidth: 160,

            zIndex: 9999,

            ...Platform.select({
                web: {
                    boxShadow:
                        '0 4px 12px rgba(0,0,0,0.15)',
                },
            }),
        },

        webDropdownItem: {
            flexDirection:
                'row',

            alignItems:
                'center',

            paddingVertical:
                10,

            paddingHorizontal:
                16,
        },

        webDropdownText: {
            fontSize: 15,

            color:
                '#0F172A',

            marginLeft: 12,

            fontWeight:
                '400',
        },

        // --------------------------------------------------------
        // ENCRYPTION
        // --------------------------------------------------------

        fullScreenModal: {
            flex: 1,
            backgroundColor:
                '#FFFFFF',
        },

        fullScreenModalTitle: {
            fontSize: 18,

            fontWeight:
                '600',

            color:
                '#0F172A',

            marginLeft: 16,

            flex: 2,
        },

        headerBar: {
            height: 60,

            flexDirection:
                'row',

            alignItems:
                'center',

            paddingHorizontal: 8,

            backgroundColor:
                '#FFFFFF',

            borderBottomWidth: 1,

            borderBottomColor:
                '#E2E8F0',
        },

        encryptionBody: {
            padding: 24,

            alignItems:
                'center',
        },

        lockBadgeBox: {
            width: 80,

            height: 80,

            borderRadius: 40,

            backgroundColor:
                '#F8FAFC',

            justifyContent:
                'center',

            alignItems:
                'center',

            marginBottom: 20,
        },

        encryptionMainTitle: {
            fontSize: 20,

            fontWeight:
                '700',

            color:
                '#0F172A',

            marginBottom: 12,

            textAlign:
                'center',
        },

        encryptionDetailText: {
            fontSize: 14,

            color: '#64748B',

            textAlign: 'center',

            lineHeight: 22,

            marginBottom: 24,
        },

        qrPlaceholder: {
            marginVertical: 10,

            padding: 15,

            backgroundColor:
                '#F8FAFC',

            borderRadius: 16,
        },
        securityCodeText: {
            fontSize: 16,

            fontWeight:
                '600',

            color:
                '#0F172A',

            textAlign:
                'center',

            letterSpacing: 1.5,

            lineHeight: 26,

            marginVertical: 16,
        },
        encryptionInfo: {
            fontSize: 13,

            color:
                '#64748B',

            textAlign:
                'center',

            lineHeight: 20,

            marginBottom: 20,
        },
        scanBtn: {
            backgroundColor:
            color.defalt,

            paddingVertical: 12,

            paddingHorizontal: 32,

            borderRadius: 24,
        },
    });