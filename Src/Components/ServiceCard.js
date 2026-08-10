import React from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '../Assets/colors/colors';

const SrvicCrd = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.showProfile}
      style={[styles.textContainer, props.cardStyle]}>
      <Image
        style={styles.logoImg}
        resizeMode="contain"
        source={
          props.iconUrl
            ? { uri: props.iconUrl }
            : require('../Assets/Images/logo.png')
        }
      />
      <Text style={styles.TextStyle}>{props.serviceTitle}</Text>
    </TouchableOpacity>
  );
};

export default SrvicCrd;

const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 13,
    paddingVertical: 15,
    backgroundColor: colors.wite,
    borderRadius: 10,
    elevation: 0,
    width: '31%',
    marginBottom: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  TextStyle: {
    fontSize: 15,
    color: colors.defalt,
    fontWeight: '400',
    marginTop: 10,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  logoImg: {
    width: 60,
    height: 60,
  },
});