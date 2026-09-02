import React from 'react';
import {StyleSheet, View, Text ,
  Platform} from 'react-native';
import color from '../Assets/colors/colors';
import { Icons } from './Icons';

const UploadfilwIcon = props => {
  const displayTitle =
    typeof props.title === 'object' && props.title !== null
      ? props.title.name
      : props.title || props.placeholder;

  return (
    <View style={styles.inputView}>
      <Text style={styles.textStyle} numberOfLines={1}>
        {displayTitle}
      </Text>
      {props.icon ? (
        <Icons.Feather name={props.icon} style={styles.iconStyle} />
      ) : null}
    </View>
  );
};

export default UploadfilwIcon;

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    position: 'relative',
  },
  textStyle: {
    color: color.defalt,
    width: '100%',
    paddingVertical: 13,
    paddingLeft: 16,
    paddingRight: 45,
    borderColor: color.defalt,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  iconStyle: {
    fontSize: 22,
    color: color.defalt,
    position: 'absolute',
    right: 14,
  },
});