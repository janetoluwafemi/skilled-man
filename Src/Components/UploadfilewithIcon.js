import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import color from '../Assets/colors/colors';
import Icon, {Icons} from './Icons';

const UploadfilwIcon = props => {
  const {mode = 'outlined'} = props;
  const [text, setText] = useState('');

  return (
    <View style={styles.inputView}>
      <Text
        style={{
          color: color.defalt,
          width: '100%',
          paddingVertical: 13,
          paddingHorizontal: 20,
          borderColor: color.defalt,
          fontSize: 17,
          borderWidth: 1,
          borderBottomColor: color.defalt,
          backgroundColor: 'transparent',
          borderRadius: 6,
        }}>
        {props.title ? props.title.name : props.placeholder}
      </Text>
      <View>
        <Icons.Feather name={props.icon} style={styles.iconStyle} />
      </View>
    </View>
  );
};

export default UploadfilwIcon;

const styles = StyleSheet.create({
  inputstyle: {
    width: '100%',
    paddingVertical: 10,
    fontSize: 15,
    paddingHorizontal: 20,
    borderColor: color.defalt,
    borderWidth: 1,
    borderBottomColor: color.defalt,
    backgroundColor: 'transparent',
    borderRadius: 6,
  },
  inputView: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
    elevation: 0,
  },
  inputFocused: {
    borderBottomWidth: 1.7,
  },
  iconStyle: {
    fontSize: 25,
    color: color.defalt,
    marginLeft: -45,
    marginRight: 6,
  },
});
