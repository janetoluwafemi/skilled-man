import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React from 'react';
import Icon, {Icons} from './Icons';
import color from '../Assets/colors/colors';
const CstmHeaderIcon = props => {
  console.log(props);
  return (
    <>
      <TouchableOpacity style={styles.headerStyle} onPress={props.onPress}>
        <Icons.FontAwesome5
          name="arrow-left"
          size={30}
          style={props.headerIcon}
          color={color.defalt}
        />
      </TouchableOpacity>
    </>
  );
};

export default CstmHeaderIcon;

const styles = StyleSheet.create({
  linearGradientStyle: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 65,
    elevation: 0,
    paddingHorizontal: 12,
    zIndex: 60,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 15,
  },
});
