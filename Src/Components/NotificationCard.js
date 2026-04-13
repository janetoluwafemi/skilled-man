import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';

import colors from '../Assets/colors/colors';

const NotiCard = props => {
  return (
    <Pressable
      onPress={props.onPress}
      style={({pressed}) => [
        styles.card,
        pressed && {opacity: 0.85},
        props.styles,
      ]}>
      {/* Avatar */}
      <Image source={props.source} style={styles.avatar} />

      {/* Content */}
      <View style={styles.textContainer}>
        {/* Name / Title */}
        <Text numberOfLines={1} style={styles.title}>
          {props.orderPicked}
        </Text>

        {/* Message */}
        <Text numberOfLines={2} style={styles.message}>
          {props.message}
        </Text>

        {/* Time */}
        <Text style={styles.time}>{props.time}</Text>
      </View>

      {/* Optional Dot */}
      {props.unread && <View style={styles.dot} />}
    </Pressable>
  );
};

export default NotiCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.wite,

    paddingVertical: 12,
    paddingHorizontal: 14,

    marginBottom: 12,
    marginHorizontal: 16,

    borderRadius: 16,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: colors.litgry,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.blak,
    marginBottom: 2,
  },

  message: {
    fontSize: 13,
    color: colors.gry,
    lineHeight: 18,
  },

  time: {
    fontSize: 11,
    marginTop: 6,
    color: colors.gry,
    fontWeight: '400',
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: colors.drkGren,
    marginLeft: 8,
  },
});
