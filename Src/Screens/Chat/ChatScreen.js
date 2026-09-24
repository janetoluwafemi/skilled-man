import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';
import color from '../../Assets/colors/colors';
import ProflHader from '../../Components/ProfileHeader';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

const { height } = Dimensions.get('window');

const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 900;

const getResponsiveSize = (small, medium, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

const ChatScreen = props => {
  const navigation = useNavigation();
  const focus = useIsFocused();
  const insets = useSafeAreaInsets();

  const [getChat, setALlChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countUnread, setCountUnread] = useState(0);
  const [isToggled, setIsToggled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const readMemoryRef = useRef({});

  useEffect(() => {
    const loadMemory = async () => {
      try {
        const storedMemory = await AsyncStorage.getItem('chat_read_timestamps');
        if (storedMemory) {
          readMemoryRef.current = JSON.parse(storedMemory);
        }
      } catch (error) {
        console.log('Error loading read memory:', error);
      } finally {
        setMemoryLoaded(true);
      }
    };
    loadMemory();
  }, []);

  const getAllChats = useCallback(async (isRefresh = false) => {
    if (!memoryLoaded) return;

    if (isRefresh) setRefreshing(true);
    try {
      const formdata = new FormData();
      let ownId = String(global?.id || '');

      if (!ownId || ['251', '255', '256'].includes(ownId)) {
        const rawUser = await AsyncStorage.getItem('user');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          const possibleId = parsed?.id ?? parsed?.user_id ?? parsed?.userId ?? parsed?.data?.id ?? parsed?.data?.user_id;
          if (possibleId && String(possibleId).trim() !== '' && !['251', '255', '256'].includes(String(possibleId))) {
            ownId = String(possibleId).trim();
            global.id = ownId;
          }
        }
      }

      if (!ownId || ['251', '255', '256'].includes(ownId)) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      formdata.append('own_id', ownId);

      const response = await fetch(`${BASIC_URL}get_all_chats.php`, {
        method: 'POST',
        body: formdata,
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        return;
      }

      if (result?.chat) {
        const chatData = Array.isArray(result.chat) ? result.chat : [];

        const filtered = chatData
          .filter(item =>
            String(item.provider_id) === String(ownId) || String(item.id) === String(ownId)
          )
          .map(item => {
            const chatId = String(item.id || item.provider_id || item.user_id);

            if (String(item.sender_id) === String(ownId)) {
              return { ...item, unread_count: 0 };
            }

            if (readMemoryRef.current[chatId] === item.created_at) {
              return { ...item, unread_count: 0 };
            }

            return item;
          });

        setALlChat(filtered);
      }
    } catch (error) {
      console.log('Error fetching chat list:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [memoryLoaded]);

  useEffect(() => {
    let interval = null;
    if (focus) {
      getAllChats();
      interval = setInterval(() => {
        getAllChats();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focus, getAllChats]);

  useEffect(() => {
    if (getChat.length > 0) {
      const unread = getChat.reduce(
        (total, item) => total + Number(item.unread_count || 0),
        0
      );
      setCountUnread(unread);
      global.unreadmessage = unread;
    } else {
      setCountUnread(0);
      global.unreadmessage = 0;
    }
  }, [getChat]);

  const parseDate = dateString => {
    if (!dateString) return new Date(0);
    const [date, time] = dateString.split(' ');
    if (!date || !time) return new Date(0);
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    return new Date(year, month - 1, day, hour, minute);
  };

  const filteredData = getChat.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = filteredData.sort(
    (a, b) => parseDate(b.created_at) - parseDate(a.created_at)
  );

  const bottomPadding =
    height * 0.085 +
    Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0) +
    28;

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return timeString;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderChatItem = ({ item }) => {
    const unreadCount = Number(item.unread_count || 0);
    const hasUnread = unreadCount > 0;

    const avatarUri = item.image
      ? (item.image.startsWith('http') ? item.image : `${BASIC_URL}uploads/${item.image.replace(/^\/+/, '')}`)
      : null;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.chatRow}
        onPress={() => {
          const chatId = String(item.id || item.provider_id || item.user_id);

          readMemoryRef.current[chatId] = item.created_at;
          AsyncStorage.setItem('chat_read_timestamps', JSON.stringify(readMemoryRef.current)).catch(e => console.log(e));

          setALlChat(prevChats =>
            prevChats.map(chat =>
              String(chat.id || chat.provider_id || chat.user_id) === chatId
                ? { ...chat, unread_count: 0 }
                : chat
            )
          );

          navigation.navigate('IndividualChat', {
            currentuser: item,
            receiver_id: item?.id || item?.provider_id || item?.user_id,
          });
        }}
      >
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icons.Feather name="user" size={24} color="#94A3B8" />
            </View>
          )}
          {hasUnread && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, hasUnread && styles.chatNameUnread]} numberOfLines={1}>
              {item.name || 'Unknown User'}
            </Text>
            <Text style={[styles.chatTime, hasUnread && styles.chatTimeUnread]}>
              {formatTime(item.created_at)}
            </Text>
          </View>

          <View style={styles.chatFooter}>
            <Text style={[styles.chatMessage, hasUnread && styles.chatMessageUnread]} numberOfLines={2}>
              {item.message || 'Started a conversation'}
            </Text>
            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ProflHader
        rightIcon="search"
        screenTitle="Messages"
        onPress={() => navigation.openDrawer()}
        onPressnotification={() => setIsToggled(!isToggled)}
      />

      {isToggled && (
        <Animatable.View animation="fadeInDown" duration={250} style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Icons.Feather
              name="search"
              size={getResponsiveSize(16, 17, 18)}
              color="#94A3B8"
            />
            <TextInput
              style={StyleSheet.flatten([
                styles.searchInput,
                { fontSize: getResponsiveSize(14, 14.5, 15) },
              ])}
              value={searchTerm}
              placeholder="Search conversations..."
              placeholderTextColor="#94A3B8"
              onChangeText={setSearchTerm}
              autoFocus={true}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm('')} activeOpacity={0.7} style={styles.clearBtn}>
                <Icons.Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </Animatable.View>
      )}

      {getChat.length > 0 && (
        <View style={styles.topInfoBar}>
          <Text style={styles.conversationsHeading}>Recent Conversations</Text>
          {countUnread > 0 && (
            <View style={styles.unreadPill}>
              <Text style={styles.unreadPillText}>{countUnread} New</Text>
            </View>
          )}
        </View>
      )}

      {loading && getChat.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.defalt} />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedData}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={StyleSheet.flatten([
            styles.listContainer,
            { paddingBottom: bottomPadding },
          ])}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getAllChats(true)}
              colors={[color.defalt]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Icons.Feather name="message-square" size={32} color={color.defalt} />
              </View>
              <Text style={styles.emptyTitle}>No Conversations</Text>
              <Text style={styles.emptySubtitle}>
                Your chats and messages with artisans will appear here.
              </Text>
            </View>
          }
          renderItem={renderChatItem}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    height: 46,
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#0F172A',
    fontWeight: '500',
    height: '100%',
    paddingVertical: 0,
    ...(Platform.OS === 'web' && {
      outlineWidth: 0,
      outlineColor: 'transparent',
      outlineStyle: 'none',
      borderStyle: 'none',
    }),
  },
  clearBtn: {
    padding: 4,
  },
  topInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 6,
  },
  conversationsHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: -0.2,
    textTransform: 'uppercase',
  },
  unreadPill: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  unreadPillText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }
      : {
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      }),
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatarImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: color.defalt,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
    paddingRight: 8,
  },
  chatNameUnread: {
    fontWeight: '800',
    color: '#0F172A',
  },
  chatTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  chatTimeUnread: {
    color: color.defalt,
    fontWeight: '600',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chatMessage: {
    fontSize: 13.5,
    color: '#64748B',
    flex: 1,
    paddingRight: 12,
    lineHeight: 18,
  },
  chatMessageUnread: {
    color: '#334155',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: color.defalt,
    paddingHorizontal: 7,
    height: 20,
    minWidth: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F7ECE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
});