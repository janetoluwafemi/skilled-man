import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import color from '../../Assets/colors/colors';
import ProflHader from '../../Components/ProfileHeader';
import ProflCrd from '../../Components/ProfileCard';
import { Icons } from '../../Components/Icons';
import { BASIC_URL } from '../Signin/Signin';

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
      const formdata = new FormData();
      const ownId = String(global.id || '256');
      formdata.append('own_id', ownId);

      const response = await fetch(`${BASIC_URL}get_all_chats.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.chat) {
        const chatData = Array.isArray(result.chat) ? result.chat : [];
        // Customer: Show chats they initiated/sent (user_id or id matches ownId)
        const filtered = chatData.filter(item => 
          String(item.user_id) === String(ownId) || String(item.id) === String(ownId)
        );
        setAllChat(filtered);
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
            <Icons.Feather name="search" size={17} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
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

      {loading && getChat.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.defalt} />
          <Text style={styles.loadingText}>Loading conversations...</Text>
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
                <Icons.Feather name="message-square" size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Conversations Yet</Text>
              <Text style={styles.emptySubtitle}>
                Your chats with providers will appear here once started.
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
                noOfMsg={Number(item.unread_count || 0)}
              />
            </View>
          )}
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
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#0F172A',
    fontWeight: '500',
    height: '100%',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  chatCardWrap: {
    marginBottom: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F6',
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

