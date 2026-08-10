import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Badge } from 'react-native-paper';

import colors from '../Assets/colors/colors';
import { BASIC_URL } from '../Screens/Signin/Signin';

const ProflCrd = props => {
  const imageUrl = props.profile
    ? `${BASIC_URL}uploads/${props.profile.replace(/^\/+/, '')}`
    : null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.showProfile}
      style={[styles.textContainer, props.cardStyle]}>
      <Image
        style={styles.logoImg}
        resizeMode="cover"
        source={
          imageUrl
            ? { uri: imageUrl }
            : require('../Assets/Images/user.jpg')
        }
      />
      <View style={styles.profileCont}>
        <View style={styles.titleCont}>
          <Text style={styles.textStyle} numberOfLines={1}>
            {props.cardTitle}
          </Text>
        </View>

        <View style={styles.openingStyle}>
          <Text numberOfLines={2} style={styles.msgTitle}>
            {props.msgTitle}
          </Text>
          {Number(props.noOfMsg) > 0 ? (
            <Badge style={styles.noOfMsg} size={22}>
              {props.noOfMsg}
            </Badge>
          ) : null}
        </View>

        <Text style={styles.dateStyle}>{props.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProflCrd;

const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: colors.wite,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  profileCont: {
    flex: 1,
  },
  titleCont: {
    paddingBottom: 4,
  },
  textStyle: {
    fontSize: 16,
    color: colors.blak,
    fontWeight: '700',
    textAlign: 'left',
  },
  openingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  msgTitle: {
    fontSize: 13,
    color: colors.defalt,
    fontWeight: '400',
    flex: 1,
    marginRight: 8,
  },
  noOfMsg: {
    backgroundColor: colors.defalt,
    color: colors.wite,
    fontSize: 12,
    fontWeight: '700',
  },
  dateStyle: {
    fontSize: 11,
    color: colors.litGry,
    fontWeight: '400',
    textAlign: 'left',
  },
});