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
      <ProflHader
        rightIcon="search"
        screenTitle="Chat"
        onPress={() => navigation.openDrawer()}
        onPressnotification={() => setIsToggled(!isToggled)}
      />

      {isToggled ? (
        <View style={styles.searchContainer}>
          <Icons.FontAwesome
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
            placeholder="Search for Chats"
            placeholderTextColor={color.defalt}
            onChangeText={setSearchTerm}
          />
        </View>
      ) : null}

      <FlatList
        data={sortedData}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
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
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    height: getResponsiveSize(45, 48, 50),
    alignItems: 'center',
    paddingHorizontal: getResponsiveSpacing(8, 10, 12),
    borderRadius: 10,
    backgroundColor: color.wite,
    marginHorizontal: getResponsiveSpacing(10, 12, 15),
    marginTop: getResponsiveSpacing(8, 10, 12),
    marginBottom: getResponsiveSpacing(4, 6, 8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    color: color.defalt,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: getResponsiveSize(14, 16, 18),
    color: color.gry,
    fontWeight: '500',
  },
});