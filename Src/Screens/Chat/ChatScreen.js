import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';

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
  const [countUnread, setCountUnread] = useState(0);
  const [isToggled, setIsToggled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getAllChats = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append('own_id', global.id);

      const response = await fetch(`${BASIC_URL}get_all_chats.php`, {
        method: 'POST',
        body: formdata,
      });

      const result = await response.json();
      if (result?.chat) {
        setALlChat(result.chat);
      }
    } catch (error) {
      console.log('Error fetching chat list:', error);
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
    20;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ProflHader
        rightIcon="search"
        screenTitle="Chat"
        onPress={() => navigation.openDrawer()}
        onPressnotification={() => setIsToggled(!isToggled)}
      />

      {isToggled ? (
        <View style={styles.searchContainer}>
          <Icons.Feather
            name="search"
            size={getResponsiveSize(16, 17, 18)}
            color={color.defalt}
          />
          <TextInput
            style={[
              styles.searchInput,
              { fontSize: getResponsiveSize(14, 15, 16) },
            ]}
            value={searchTerm}
            placeholder="Search conversations..."
            placeholderTextColor="#94A3B8"
            onChangeText={setSearchTerm}
          />
        </View>
      ) : null}

      <FlatList
        data={sortedData}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icons.Feather name="message-square" size={40} color="#CBD5E1" />
            <Text style={styles.emptyText}>No chats found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProflCrd
            showProfile={() =>
              navigation.navigate('IndividualChat', { currentuser: item })
            }
            profile={item.image}
            cardTitle={item.name}
            time={item.created_at}
            msgTitle={item.message}
            noOfMsg={Number(item.unread_count)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchContainer: {
    flexDirection: 'row',
    height: getResponsiveSize(46, 48, 50),
    alignItems: 'center',
    paddingHorizontal: getResponsiveSpacing(12, 14, 16),
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    marginHorizontal: getResponsiveSpacing(16, 18, 20),
    marginTop: getResponsiveSpacing(8, 10, 12),
    marginBottom: getResponsiveSpacing(8, 10, 12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#0F172A',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: getResponsiveSize(14, 15, 16),
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 10,
  },
});