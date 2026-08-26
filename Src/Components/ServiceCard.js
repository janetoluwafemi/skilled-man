import React from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '../Assets/colors/colors';

const ServiceCard = props => {
  const combinedCardStyle = StyleSheet.flatten([
    styles.textContainer,
    props.cardStyle,
  ]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.showProfile}
      style={combinedCardStyle}>
      <Image
        style={styles.logoImg}
        resizeMode="contain"
        source={
          props.iconUrl
            ? { uri: props.iconUrl }
            : require('../Assets/Images/logo.png')
        }
      />
      <Text numberOfLines={1} style={styles.TextStyle}>
        {props.serviceTitle}
      </Text>
    </TouchableOpacity>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.wite,
    borderRadius: 10,
    elevation: 0,
    width: '100%',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  TextStyle: {
    fontSize: 14,
    color: colors.defalt,
    fontWeight: '600',
    marginLeft: 10,
    marginTop: 0,
    flex: 1,
    textAlign: 'left',
  },
  logoImg: {
    width: 42,
    height: 42,
  },
});