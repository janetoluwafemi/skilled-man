import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity ,
  Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icons } from './Icons';
import color from '../Assets/colors/colors';

const ChatUserHeader = ({ userName, userImage, onlineStatus }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icons.Ionicons name="arrow-back" size={24} color="#0F172A" />
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        <Image
          source={
            userImage
              ? { uri: userImage }
              : require('../Assets/Images/user.jpg')
          }
          style={styles.avatar}
        />
        {onlineStatus ? <View style={styles.onlineBadge} /> : null}
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {userName || 'User'}
        </Text>
        <Text style={styles.statusText}>
          {onlineStatus ? 'Online' : 'Offline'}
        </Text>
      </View>
    </View>
  );
};

export default ChatUserHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backBtn: {
    paddingRight: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CBD5E1',
  },
  onlineBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
});