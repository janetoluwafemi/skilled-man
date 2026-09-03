import React, { useState, useEffect, useCallback } from 'react';
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
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';
import color from '../../Assets/colors/colors';
import ProflHader from '../../Components/ProfileHeader';
import ProflCrd from '../../Components/ProfileCard';
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

const getResponsiveSpacing = (small, medium, large) => {
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

  const getAllChats = useCallback(async (isRefresh = false) => {
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
        console.log('ChatScreen: No valid ownId found for fetch');
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
        console.log('Failed to parse JSON:', text);
        return;
      }
      if (result?.chat) {
        setALlChat(Array.isArray(result.chat) ? result.chat : []);
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
              <TouchableOpacity onPress={() => setSearchTerm('')} activeOpacity={0.7}>
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
                <Icons.Feather name="message-square" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Conversations Yet</Text>
              <Text style={styles.emptySubtitle}>
                Your chats and messages with artisans will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.chatCardWrap}>
              <ProflCrd
                showProfile={() =>
                  navigation.navigate('IndividualChat', {
                    currentuser: item,
                    receiver_id: item?.id || item?.provider_id || item?.user_id,
                  })
                }
                profile={item.image}
                cardTitle={item.name}
                time={item.created_at}
                msgTitle={item.message}
                noOfMsg={Number(item.unread_count)}
              />
            </View>
          )}
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
    paddingTop: 6,
    paddingBottom: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }
      : {
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      }),
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
    paddingTop: 6,
  },
  chatCardWrap: {
    marginBottom: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)' }
      : {
        elevation: 1,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      }),
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EEF2F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
