import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../../Assets/colors/colors';
import ProflHader from '../../Components/ProfileHeader';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';
import { getAllChats as fetchAllChats } from '../../utilis/chatApi';

const UserChat = () => {
  const navigation = useNavigation();
  const focus = useIsFocused();

  const [getChat, setAllChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getAllChats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      let ownId = String(global.id || '');
      if (!ownId) {
        const rawUser = await AsyncStorage.getItem('user');
        if (rawUser) {
          const savedUser = JSON.parse(rawUser);
          ownId = String(
            savedUser?.id ||
            savedUser?.user_id ||
            savedUser?.userId ||
            savedUser?.data?.id ||
            savedUser?.data?.user_id ||
            ''
          );
          if (ownId) global.id = ownId;
        }
      }
      if (!ownId) {
        setLoading(false);
        return;
      }
      const result = await fetchAllChats(ownId);
      if (result?.chat) {
        const chatData = Array.isArray(result.chat) ? result.chat : [];
        setAllChat(chatData);
      }
    } catch (error) {
      console.log('Error fetching chat list:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (focus) {
      getAllChats();
      interval = setInterval(() => {
        getAllChats();
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focus, getAllChats]);

  const filteredData = getChat.filter(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to format timestamps gracefully
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return timeString; // Fallback if invalid
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderChatItem = ({ item }) => {
    const unreadCount = Number(item.unread_count || 0);
    const hasUnread = unreadCount > 0;

    // Process image URL safely
    const avatarUri = item.image
        ? (item.image.startsWith('http') ? item.image : `${BASIC_URL}uploads/${item.image.replace(/^\/+/, '')}`)
        : null;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.chatRow}
            onPress={() =>
                navigation.navigate('IndividualChat', {
                  currentuser: item,
                  receiver_id: item?.id || item?.provider_id || item?.user_id,
                })
            }
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
                <Icons.Feather name="search" size={18} color="#64748B" />
                <TextInput
                    style={styles.searchInput}
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

        {loading && getChat.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={color.defalt} />
              <Text style={styles.loadingText}>Syncing messages...</Text>
            </View>
        ) : (
            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => `chat_user_${item.id || index}_${index}`}
                contentContainerStyle={styles.listContainer}
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
                      When you connect with a provider or customer, your chats will appear here.
                    </Text>
                  </View>
                }
                renderItem={renderChatItem}
            />
        )}
      </SafeAreaView>
  );
};

export default UserChat;

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
    backgroundColor: '#F1F5F9', // Softer integrated background
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '500',
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },

  // Custom Modern Chat Row
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
    backgroundColor: color.defalt, // Matches primary theme for unread emphasis
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

  // Loading & Empty States
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
    backgroundColor: '#F7ECE4', // Soft theme color background
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